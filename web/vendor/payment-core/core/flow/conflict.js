/* =====================================================================
   core/flow/conflict.js — 사업자 응답과 DB 가 어긋난 경우 (STEP 4 · Q-3)
   ---------------------------------------------------------------------
   여기서 다루는 상황은 전부 "돈이 이미 움직였다" 입니다.

     duplicate_approval  같은 주문에 두 번째 승인이 들어옴
     amount_mismatch     사업자 승인 금액이 DB 금액과 다름

   원칙
     C-1 주문은 두 번 PAID 되지 않는다. 먼저 정상 확정된 승인만 유효하다.
     C-2 중복 승인분은 사업자 취소 대상이다.
     C-3 취소가 '성공했다고 확인된' 경우에만 resolved 로 내린다.
     C-4 ★ 취소가 실패했거나 결과가 미확정이면 절대 failed 로 덮어쓰지 않는다.
         needs_operator + indeterminate 로 남겨 운영자가 반드시 보게 한다.
     C-5 시도는 'failed' 가 아니라 'conflicted' 다.
         failed = 사업자가 거절함(돈 안 움직임) / conflicted = 승인됨(돈 움직임).
         이 둘을 섞으면 사실이 사라집니다.
   ===================================================================== */
'use strict';

const E = require('../errors');

function codeOf(e) {
  const m = new RegExp('(PAY_[A-Z_]+)').exec(String((e && e.message) || ''));
  return m ? m[1] : (e && e.code ? String(e.code) : 'PAY_DB_ERROR');
}

/* 승인분을 사업자에서 되돌리고, 그 결과를 사실대로 예외에 적습니다. */
async function cancelAndRecord(ctx, tenant, exception, paymentKey, reason) {
  let c;
  try {
    c = await ctx.provider.cancel({ paymentKey: paymentKey, reason: reason });
  } catch (e) {
    c = E.fail(E.CONTRACT.THREW);
  }

  /* 취소 성공 + 거래키(증거) 있음 → 해결됨 */
  if (c && c.ok && c.transactionKey) {
    const exc = await ctx.db.withActor('provider', tx =>
      tx.exceptionResolve(tenant, exception.id, c.transactionKey, { cancelledAmount: c.cancelAmount == null ? null : Number(c.cancelAmount) }));
    return { resolved: true, needsOperator: false, indeterminate: false, exception: exc, cancelCode: null };
  }

  /* 취소는 200 이지만 거래키가 없다 → '성공했다' 고 증명할 수 없으므로 사람이 본다 */
  const failCode = (c && c.ok) ? 'PG_CANCEL_NO_TRANSACTION_KEY' : (c && c.code) || 'PG_UNREACHABLE';
  const indeterminate = !!(c && !c.ok && E.isIndeterminate(c.code));

  const exc = await ctx.db.withActor('provider', tx =>
    tx.exceptionNeedsOperator(tenant, exception.id, failCode, indeterminate,
      { moneyMoved: true, note: 'provider cancel not proven' }));

  return { resolved: false, needsOperator: true, indeterminate: indeterminate, exception: exc, cancelCode: failCode };
}

/* ── 중복 승인 ─────────────────────────────────────────────── */
/* 두 가지 모습이 있습니다.
     (a) 이 시도는 아직 confirming 인데 주문이 다른 시도로 PAID 됐다
         → 이 시도를 conflicted 로 내립니다 (돈이 움직였으므로 failed 가 아닙니다).
     (b) 이 시도는 이미 '다른 paymentKey' 로 확정됐다 (동시 승인 경쟁에서 진 쪽)
         → 시도 행은 먼저 확정된 승인의 것입니다. 건드리지 않고,
           남은 승인분을 예외로 따로 붙잡습니다. 시도 상태를 덮어쓰면
           먼저 확정된 정상 결제의 사실이 훼손됩니다. */
async function duplicateApproval(ctx, a) {
  const tenant = a.tenant;

  let row = a.intent;
  try {
    const list = await ctx.db.getIntents(tenant, a.order.id);
    row = list.filter(i => i.id === a.intent.id)[0] || a.intent;
  } catch (e) { /* 조회 실패 시에는 넘겨받은 값을 씁니다 */ }

  const stillOpen = row.status === 'confirming';
  const detail = {
    reason: 'duplicate_approval',
    orderStatusAtConflict: a.order.status,
    winningIntentId: a.winningIntentId || null,
    losingPaymentKey: a.paymentKey
  };

  let exception;
  try {
    if (stillOpen) {
      exception = await ctx.db.withActor('system', tx =>
        tx.intentMarkConflicted(tenant, row.id, a.paymentKey, 'duplicate_approval', detail));
    } else {
      exception = await ctx.db.withActor('system', tx =>
        tx.exceptionOpen(tenant, a.order.id, row.id, 'duplicate_approval', row.provider, a.paymentKey, detail));
    }
  } catch (e) {
    /* 예외 기록조차 실패하면 그 사실을 코드로 올립니다 (조용히 넘어가지 않음) */
    return E.fail('PAY_CONFLICT_RECORD_FAILED', { cause: codeOf(e), moneyMoved: true, needsOperator: true });
  }

  const r = await cancelAndRecord(ctx, tenant, exception, a.paymentKey, 'duplicate approval');

  return {
    ok: false,
    code: 'PAY_DUPLICATE_APPROVAL',
    orderStatus: a.order.status,                       /* 그대로 PAID — 두 번 PAID 하지 않습니다 */
    intentStatus: stillOpen ? 'conflicted' : row.status,
    conflictShape: stillOpen ? 'intent_lost' : 'extra_approval',
    moneyMoved: true,
    duplicateCancelled: r.resolved,
    needsOperator: r.needsOperator,
    indeterminate: r.indeterminate,
    cancelCode: r.cancelCode,
    exceptionId: exception.id
  };
}

/* ── 승인 금액 불일치 ──────────────────────────────────────── */
async function amountMismatch(ctx, a) {
  const tenant = a.tenant;
  let exception;
  try {
    exception = await ctx.db.withActor('system', tx =>
      tx.intentMarkConflicted(tenant, a.intent.id, a.paymentKey, 'amount_mismatch', {
        reason: 'amount_mismatch',
        expected: Number(a.expected),
        approved: a.approved == null ? null : Number(a.approved)
      }));
  } catch (e) {
    return E.fail('PAY_CONFLICT_RECORD_FAILED', { cause: codeOf(e), moneyMoved: true, needsOperator: true });
  }

  const r = await cancelAndRecord(ctx, tenant, exception, a.paymentKey, 'amount mismatch');

  return {
    ok: false,
    code: 'PAY_AMOUNT_MISMATCH',
    orderStatus: a.order.status,
    intentStatus: 'conflicted',
    moneyMoved: true,
    duplicateCancelled: r.resolved,
    needsOperator: r.needsOperator,
    indeterminate: r.indeterminate,
    cancelCode: r.cancelCode,
    exceptionId: exception.id
  };
}

/* ── 사업자는 승인했는데 DB 기록이 실패 ────────────────────── */
/* 여기서는 취소하지 않습니다. 승인 자체는 이 주문의 정당한 결제이고,
   DB 만 못 따라온 것이므로 status() 재조회로 회복하는 편이 안전합니다. */
async function recordFailed(ctx, a) {
  const tenant = a.tenant;
  try {
    const exception = await ctx.db.exceptionOpen(
      tenant, a.order.id, a.intent.id, 'record_failed', a.intent.provider, a.paymentKey,
      { cause: a.cause || null, note: 'provider approved but DB write failed' });
    return {
      ok: false, code: 'PAY_RECORD_FAILED', orderStatus: a.order.status, intentStatus: 'confirming',
      moneyMoved: true, recoverable: true, needsOperator: true, indeterminate: false,
      next: 'status', exceptionId: exception.id
    };
  } catch (e) {
    return E.fail('PAY_RECORD_FAILED', { cause: codeOf(e), moneyMoved: true, needsOperator: true, recoverable: true, next: 'status' });
  }
}

module.exports = { duplicateApproval, amountMismatch, recordFailed, cancelAndRecord, codeOf };
