/* =====================================================================
   core/flow/refund.js — 환불 (STEP 5)
   ---------------------------------------------------------------------
   순서가 전부입니다. 바꾸면 돈과 기록이 어긋납니다.

     ① 관리자인가                      ← 아니면 DB 를 건드리지도 않습니다
     ② 주문이 REFUNDED 인가             ← 맞으면 사업자 호출 0 (멱등)
     ③ 주문이 PAID 인가 · 결제 원장 확인 (provider · paymentKey · 금액)
     ④ 호출자가 보낸 값은 '대조' 에만 쓴다 — 기준은 DB 원장
     ⑤ 환불 시도를 먼저 기록            ← 사업자 호출 전 흔적
     ⑥ 이미 증거(transaction_key)가 있으면 ★ 사업자를 다시 부르지 않는다
     ⑦ 사업자 취소 호출
     ⑧ 성공 → 증거를 시도 행에 '먼저' 저장 → 그 다음 원장 + REFUNDED
     ⑨ 미확정 → 성공/실패 어느 쪽으로도 단정하지 않고 예외로 남김 (주문 PAID 유지)
     ⑩ DB 기록 실패 → 증거는 이미 저장돼 있으므로 재취소 없이 복구 가능
   ===================================================================== */
'use strict';

const E = require('../errors');
const ORDER = require('../state/order');
const money = require('../money');
const port = require('../db/port');
const adapterContract = require('../adapter/contract');
const hooks = require('./hooks');

function codeOf(e) {
  const m = new RegExp('(PAY_[A-Z_]+)').exec(String((e && e.message) || ''));
  return m ? m[1] : (e && e.code ? String(e.code) : 'PAY_DB_ERROR');
}

/* 원장 + 주문 상태 확정. 증거(transactionKey)는 이미 확보된 상태에서만 부릅니다. */
async function record(ctx, a) {
  const paid = a.payment;
  return ctx.db.withActor('admin', tx =>
    tx.orderMarkRefunded(a.tenant, a.orderId, paid.provider, paid.payment_key,
      a.transactionKey, Number(paid.amount), a.attemptId || null, a.reason || null));
}

async function emitRefunded(ctx, a) {
  if (!ctx.events) return null;
  return ctx.events.emit('payment.refunded', adapterContract.shapeRefundEvent({
    tenant: a.tenant, orderId: a.order.id, orderNo: a.order.order_no,
    provider: a.provider, amount: Number(a.order.amount), currency: a.order.currency,
    refundedAt: a.order.closed_at || null, transactionKey: a.transactionKey, actorRef: a.actorRef || null
  }));
}

async function refund(ctx, args) {
  const db = ctx.db;
  const a = args || {};
  port.assertPort(db);

  /* ① 관리자만 — DB 를 건드리기 전에 막습니다 (R-1) */
  if (a.actor !== 'admin') {
    return E.fail('PAY_FORBIDDEN_ADMIN_ONLY', { actor: a.actor == null ? null : String(a.actor) });
  }
  if (!a.tenant || !a.orderId) return E.fail('PAY_INVALID_ARGS');
  if (!a.actorRef) return E.fail('PAY_ACTOR_REF_REQUIRED');

  const order = await db.getOrder(a.tenant, a.orderId);
  if (!order) return E.fail('PAY_ORDER_NOT_FOUND');

  /* ② 이미 환불됨 → 사업자 호출 0 */
  if (order.status === ORDER.REFUNDED) {
    return {
      ok: true, idempotent: true, orderStatus: ORDER.REFUNDED,
      amount: Number(order.amount), currency: order.currency, providerCalled: false
    };
  }
  if (order.status !== ORDER.PAID) {
    return E.fail('PAY_ORDER_NOT_PAID', { orderStatus: order.status });
  }

  /* ③ 결제 원장이 사업자·결제키·금액의 유일한 근거 (R-3) */
  const payment = await db.getPaymentRecord(a.tenant, a.orderId);
  if (!payment) return E.fail('PAY_NO_PAYMENT_RECORD');

  /* ④ 호출자가 보낸 값은 대조용 */
  if (a.provider && a.provider !== payment.provider) {
    return E.fail('PAY_PROVIDER_MISMATCH', { expected: payment.provider, got: String(a.provider) });
  }
  if (a.paymentKey && a.paymentKey !== payment.payment_key) {
    return E.fail('PAY_PAYMENT_KEY_MISMATCH');
  }
  if (a.amount !== undefined && a.amount !== null) {
    try { money.assertSameAmount(Number(payment.amount), a.amount, payment.currency); }
    catch (e) { return E.fail('PAY_AMOUNT_MISMATCH', { expected: Number(payment.amount), got: a.amount }); }
  }
  if (a.cancelAmount !== undefined && a.cancelAmount !== null && Number(a.cancelAmount) !== Number(payment.amount)) {
    return E.fail('PAY_PARTIAL_REFUND_NOT_SUPPORTED');   /* PHASE 2 */
  }

  /* ⑤ 시도 기록 (사업자 호출 전) */
  let attempt;
  try {
    attempt = await db.withActor('admin', tx =>
      tx.refundAttemptBegin(a.tenant, a.orderId, payment.provider, payment.payment_key,
        Number(payment.amount), a.reason || null, a.actorRef));
  } catch (e) {
    return E.fail(codeOf(e), { stage: 'attempt_begin' });
  }

  /* ⑥ 이미 취소 증거가 있다 → 사업자를 다시 부르지 않고 DB 만 회복 */
  if (attempt.transaction_key) {
    return finishWithEvidence(ctx, a, order, payment, attempt, attempt.transaction_key, false);
  }
  /* 결과를 모르는 시도가 남아 있다 → 재취소 금지. 조회로 확인해야 합니다 */
  if (attempt.status === 'indeterminate') {
    return {
      ok: false, code: 'PAY_REFUND_INDETERMINATE', indeterminate: true, recoverable: true, next: 'recover',
      orderStatus: ORDER.PAID, attemptId: attempt.id, providerCalled: false,
      note: '이전 취소 결과가 미확정입니다 — 사업자 재조회로 확인해야 합니다'
    };
  }

  /* ⑦ 사업자 취소 (전액 — cancelAmount 를 보내지 않습니다) */
  let c;
  try {
    c = await ctx.provider.cancel({ paymentKey: payment.payment_key, reason: a.reason || 'refund' });
  } catch (e) {
    c = E.fail(E.CONTRACT.THREW);
  }

  /* ⑧ 성공 + 증거 */
  if (c && c.ok && c.transactionKey) {
    return finishWithEvidence(ctx, a, order, payment, attempt, c.transactionKey, true);
  }

  /* 200 이지만 증거가 없다 → 성공했다고 증명할 수 없습니다 = 미확정 */
  const proven = !!(c && c.ok);
  const indeterminate = proven || !!(c && !c.ok && E.isIndeterminate(c.code));
  const failCode = proven ? 'PG_CANCEL_NO_TRANSACTION_KEY' : ((c && c.code) || 'PG_UNREACHABLE');

  if (indeterminate) {
    /* ⑨ 단정하지 않습니다 : 주문 PAID 유지 · 증거(paymentKey) 보존 */
    return recordIndeterminate(ctx, a, order, payment, attempt, failCode);
  }

  /* 사업자가 명시적으로 거절 — 돈은 움직이지 않았습니다 */
  try {
    await db.withActor('admin', tx => tx.refundAttemptOutcome(a.tenant, attempt.id, 'declined', failCode));
  } catch (e) {
    return E.fail(codeOf(e), { stage: 'attempt_outcome', providerCode: failCode });
  }
  return {
    ok: false, code: failCode, indeterminate: false, moneyMoved: false,
    orderStatus: ORDER.PAID, attemptId: attempt.id, providerCalled: true
  };
}

/* 취소 증거를 확보한 뒤의 마무리 — 증거 저장이 원장 기록보다 먼저입니다 */
async function finishWithEvidence(ctx, a, order, payment, attempt, transactionKey, providerCalled) {
  const db = ctx.db;

  if (!attempt.transaction_key) {
    try {
      await db.withActor('admin', tx => tx.refundAttemptSucceeded(a.tenant, attempt.id, transactionKey));
    } catch (e) {
      /* 증거조차 저장 못 했다 → 재취소하지 않도록 사실을 올립니다 */
      return E.fail('PAY_REFUND_EVIDENCE_NOT_STORED', {
        cause: codeOf(e), transactionKeyKnown: true, moneyMoved: true, needsOperator: true, providerCalled: providerCalled
      });
    }
  }

  let refunded;
  try {
    refunded = await db.withActor('admin', tx =>
      tx.orderMarkRefunded(a.tenant, a.orderId, payment.provider, payment.payment_key,
        transactionKey, Number(payment.amount), attempt.id, a.reason || null));
  } catch (e) {
    /* ⑩ 사업자 취소는 성공했는데 DB 기록이 실패.
       ★ 시도 행에 증거가 남아 있으므로 재취소 없이 복구합니다. */
    const cause = codeOf(e);
    let exception = null;
    try {
      exception = await db.exceptionOpen(a.tenant, order.id, attempt.intent_id, 'refund_record_failed',
        payment.provider, payment.payment_key,
        { cause: cause, transactionKey: transactionKey, attemptId: attempt.id, note: 'provider cancel succeeded but DB write failed' });
    } catch (e2) { /* 예외 기록까지 실패해도 코드로 올립니다 */ }

    return {
      ok: false, code: 'PAY_REFUND_RECORD_FAILED', cause: cause,
      indeterminate: false, moneyMoved: true, recoverable: true, next: 'recover',
      orderStatus: ORDER.PAID, attemptId: attempt.id, transactionKeyStored: true,
      needsOperator: true, exceptionId: exception ? exception.id : null, providerCalled: providerCalled
    };
  }

  /* ★ REFUNDED 확정 '뒤' 에 hook. 실패해도 PAID 로 되돌리지 않습니다 (H-2). */
  const hook = await hooks.afterRefunded(ctx, {
    tenant: a.tenant, order: refunded, provider: payment.provider,
    transactionKey: transactionKey, actorRef: a.actorRef
  });
  const ev = hook;

  return {
    ok: true, idempotent: false, orderStatus: refunded.status,
    amount: Number(refunded.amount), currency: refunded.currency,
    refundedAmount: Number(refunded.refunded_amount),
    provider: payment.provider, transactionKey: transactionKey,
    attemptId: attempt.id, providerCalled: providerCalled,
    hook: hook,
    event: ev ? { delivered: ev.delivered ? 1 : 0, errors: ev.code ? [{ code: ev.code }] : [] } : null
  };
}

async function recordIndeterminate(ctx, a, order, payment, attempt, failCode) {
  const db = ctx.db;
  try {
    await db.withActor('admin', tx => tx.refundAttemptOutcome(a.tenant, attempt.id, 'indeterminate', failCode));
  } catch (e) { /* 시도 갱신이 실패해도 아래 예외는 남깁니다 */ }

  let exception = null;
  try {
    exception = await db.exceptionOpen(a.tenant, order.id, attempt.intent_id, 'refund_indeterminate',
      payment.provider, payment.payment_key,
      { failCode: failCode, attemptId: attempt.id, note: 'provider cancel result unknown' });
    if (exception) {
      exception = await db.exceptionNeedsOperator(a.tenant, exception.id, failCode, true,
        { moneyMoved: 'unknown', note: 'do not assume success or failure' });
    }
  } catch (e) { /* 예외 기록 실패도 결과 코드로 드러납니다 */ }

  return {
    ok: false, code: 'PAY_REFUND_INDETERMINATE', providerCode: failCode,
    indeterminate: true, recoverable: true, next: 'recover', needsOperator: true,
    orderStatus: ORDER.PAID,              /* ★ 절대 REFUNDED 로 내리지 않습니다 */
    attemptId: attempt.id, exceptionId: exception ? exception.id : null, providerCalled: true
  };
}

module.exports = { refund, finishWithEvidence, codeOf, record };
