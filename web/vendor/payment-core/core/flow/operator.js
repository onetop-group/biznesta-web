/* =====================================================================
   core/flow/operator.js — 운영자 조회 · 예외 해소 (STEP 5 · R-2 · R-5)
   ---------------------------------------------------------------------
   · operations()      읽기 전용. 상태를 바꾸지 않습니다.
   · closeException()  관리자만. 누가·언제·왜·이전/이후·사업자 확인 여부가 남습니다.
                       예외 원본은 지우지 않고 감사 이력을 덧붙입니다.
   ★ 자동 배치 · webhook · reconcile 은 만들지 않습니다 (PHASE 2).
     여기 어디에도 상태를 스스로 바꾸는 경로가 없습니다.
   ===================================================================== */
'use strict';

const E = require('../errors');
const port = require('../db/port');

function codeOf(e) {
  const m = new RegExp('(PAY_[A-Z_]+)').exec(String((e && e.message) || ''));
  return m ? m[1] : (e && e.code ? String(e.code) : 'PAY_DB_ERROR');
}

/* 운영자가 봐야 할 것 전부 (읽기 전용) */
async function operations(ctx, args) {
  const a = args || {};
  port.assertPort(ctx.db);
  if (!a.tenant) return E.fail('PAY_INVALID_ARGS');

  const rows = await ctx.db.getOperations(a.tenant, a.olderThan || null);
  const byConcern = {};
  rows.forEach(function (r) { byConcern[r.concern] = (byConcern[r.concern] || 0) + 1; });

  return {
    ok: true,
    total: rows.length,
    indeterminate: rows.filter(r => r.indeterminate).length,
    byConcern: byConcern,
    items: rows.map(r => ({
      concern: r.concern, indeterminate: r.indeterminate,
      orderId: r.order_id, orderNo: r.order_no, orderStatus: r.order_status,
      exceptionId: r.exception_id, intentId: r.intent_id,
      provider: r.provider, amount: Number(r.amount), currency: r.currency,
      since: r.since, detail: r.detail
    }))
  };
}

/* 예외 닫기 — 관리자만 · 증거와 사유가 남습니다 */
async function closeException(ctx, args) {
  const a = args || {};
  port.assertPort(ctx.db);

  if (a.actor !== 'admin') {
    return E.fail('PAY_FORBIDDEN_ADMIN_ONLY', { actor: a.actor == null ? null : String(a.actor) });
  }
  if (!a.tenant || !a.exceptionId) return E.fail('PAY_INVALID_ARGS');
  if (!a.actorRef) return E.fail('PAY_ACTOR_REF_REQUIRED');
  if (!a.reason || String(a.reason).trim().length < 4) return E.fail('PAY_REASON_REQUIRED');
  if (typeof a.providerChecked !== 'boolean') return E.fail('PAY_PROVIDER_CHECK_REQUIRED');

  let providerStatus = a.providerStatus || null;
  let providerTx = a.providerTransactionKey || null;

  /* 사업자 상태를 실제로 확인하겠다고 했다면, 여기서 정말 확인합니다.
     '확인했다' 는 체크만 하고 넘어가지 못하게 합니다. */
  if (a.providerChecked && a.verifyWithProvider !== false && ctx.provider && a.providerOrderId) {
    let q;
    try { q = await ctx.provider.getByOrderId(a.providerOrderId); }
    catch (e) { q = E.fail(E.CONTRACT.THREW); }
    if (!q.ok) {
      return E.fail('PAY_PROVIDER_CHECK_FAILED', { providerCode: q.code, indeterminate: E.isIndeterminate(q.code) });
    }
    providerStatus = String((q.payment && q.payment.status) || '') || null;
    providerTx = (q.payment && q.payment.lastCancelTransactionKey) || providerTx;
  }

  let closed;
  try {
    closed = await ctx.db.withActor('admin', tx =>
      tx.exceptionClose(a.tenant, a.exceptionId, a.actorRef, String(a.reason), a.providerChecked, providerStatus, providerTx));
  } catch (e) {
    return E.fail(codeOf(e), { stage: 'exception_close' });
  }

  if (ctx.events) {
    await ctx.events.emit('payment.exception_closed', {
      event: 'payment.exception_closed', tenant: a.tenant,
      exceptionId: closed.id, orderId: closed.order_id, kind: closed.kind, actorRef: a.actorRef
    });
  }

  return {
    ok: true, exceptionId: closed.id, status: closed.status,
    providerChecked: !!a.providerChecked, providerStatus: providerStatus, actorRef: a.actorRef
  };
}

/* 감사 이력 조회 (읽기 전용) */
async function exceptionHistory(ctx, args) {
  const a = args || {};
  port.assertPort(ctx.db);
  if (!a.tenant || !a.exceptionId) return E.fail('PAY_INVALID_ARGS');
  const rows = await ctx.db.getExceptionAudit(a.tenant, a.exceptionId);
  return {
    ok: true,
    entries: rows.map(r => ({
      action: r.action, actor: r.actor, actorRef: r.actor_ref, reason: r.reason,
      fromStatus: r.from_status, toStatus: r.to_status,
      fromIndeterminate: r.from_indeterminate, toIndeterminate: r.to_indeterminate,
      providerChecked: r.provider_checked, providerStatus: r.provider_status,
      providerTransactionKey: r.provider_transaction_key,
      orderId: r.order_id, intentId: r.intent_id, paymentKey: r.payment_key ? true : false,
      at: r.at
    }))
  };
}

module.exports = { operations, closeException, exceptionHistory };
