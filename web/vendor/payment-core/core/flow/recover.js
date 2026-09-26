/* =====================================================================
   core/flow/recover.js — 환불 복구 (STEP 5 · 불변식 3)
   ---------------------------------------------------------------------
   두 가지를 회복합니다.

     ⓐ 사업자 취소는 성공했는데 DB 기록이 실패한 경우
        → 시도 행에 증거(transaction_key)가 남아 있습니다.
          ★ 사업자를 다시 취소하지 않고 DB 만 다시 씁니다.

     ⓑ 취소 결과가 미확정인 경우 / 사업자에는 이미 취소돼 있는데 DB 는 PAID 인 경우
        → 사업자에게 '다시 물어봅니다'. 추측하지 않습니다.
          취소가 확인되고 증거(거래키)가 있으면 그것으로 DB 를 맞춥니다.
          취소가 안 됐다고 확인되면 시도를 닫아 다시 환불할 수 있게 합니다.
          여전히 모르면 그대로 둡니다.

   ★ 증거 없이 REFUNDED 로 내리는 경로는 없습니다.
   ★ 이 함수는 사업자 취소를 새로 실행하지 않습니다 (중복 취소 금지).
   ===================================================================== */
'use strict';

const E = require('../errors');
const ORDER = require('../state/order');
const port = require('../db/port');
const refundMod = require('./refund');

const CANCELLED_STATES = ['CANCELED', 'CANCELLED', 'PARTIAL_CANCELED'];

function codeOf(e) { return refundMod.codeOf(e); }

async function recover(ctx, args) {
  const db = ctx.db;
  const a = args || {};
  port.assertPort(db);

  if (a.actor !== 'admin') return E.fail('PAY_FORBIDDEN_ADMIN_ONLY', { actor: a.actor == null ? null : String(a.actor) });
  if (!a.tenant || !a.orderId) return E.fail('PAY_INVALID_ARGS');
  if (!a.actorRef) return E.fail('PAY_ACTOR_REF_REQUIRED');

  const order = await db.getOrder(a.tenant, a.orderId);
  if (!order) return E.fail('PAY_ORDER_NOT_FOUND');
  if (order.status === ORDER.REFUNDED) {
    return { ok: true, idempotent: true, action: 'already_refunded', orderStatus: ORDER.REFUNDED, providerCalled: false };
  }
  if (order.status !== ORDER.PAID) return E.fail('PAY_ORDER_NOT_PAID', { orderStatus: order.status });

  const payment = await db.getPaymentRecord(a.tenant, a.orderId);
  if (!payment) return E.fail('PAY_NO_PAYMENT_RECORD');

  const attempts = await db.getRefundAttempts(a.tenant, a.orderId);
  const live = attempts.filter(x => ['requested', 'succeeded', 'indeterminate'].indexOf(x.status) >= 0)[0] || null;

  /* ⓐ 증거가 이미 있다 → 사업자 호출 0 */
  if (live && live.transaction_key) {
    const r = await refundMod.finishWithEvidence(ctx, a, order, payment, live, live.transaction_key, false);
    return Object.assign({}, r, { action: 'recorded_from_evidence', providerCalled: false });
  }

  /* ⓑ 사업자에게 다시 물어봅니다 */
  const intents = await db.getIntents(a.tenant, a.orderId);
  const settled = intents.filter(i => ['confirmed', 'cancelled'].indexOf(i.status) >= 0)[0] || null;
  if (!settled) return E.fail('PAY_NO_CONFIRMED_INTENT');

  let q;
  try {
    q = await ctx.provider.getByOrderId(settled.provider_order_id);
  } catch (e) {
    q = E.fail(E.CONTRACT.THREW);
  }

  if (!q.ok) {
    return {
      ok: false, code: q.code, action: 'unresolved',
      indeterminate: E.isIndeterminate(q.code), recoverable: true,
      orderStatus: ORDER.PAID, attemptId: live ? live.id : null, providerCalled: true,
      note: '사업자 조회 실패 — 아무것도 단정하지 않았습니다'
    };
  }

  const p = q.payment || {};
  const st = String(p.status || '').toUpperCase();
  const fullyCancelled = CANCELLED_STATES.indexOf(st) >= 0 && Number(p.balanceAmount) === 0;
  const evidence = p.lastCancelTransactionKey || null;

  /* 취소가 확인됐고 증거도 있다 → DB 를 맞춥니다 */
  if (fullyCancelled && evidence) {
    let attempt = live;
    if (!attempt) {
      try {
        attempt = await db.withActor('admin', tx =>
          tx.refundAttemptBegin(a.tenant, a.orderId, payment.provider, payment.payment_key,
            Number(payment.amount), a.reason || 'recover from provider state', a.actorRef));
      } catch (e) { return E.fail(codeOf(e), { stage: 'attempt_begin' }); }
    }
    const r = await refundMod.finishWithEvidence(ctx, a, order, payment, attempt, evidence, false);
    return Object.assign({}, r, { action: 'recorded_from_provider_state', providerCalled: true, providerStatus: st });
  }

  /* 취소가 확인됐지만 증거가 없다 → ★ 만들어내지 않습니다 */
  if (fullyCancelled && !evidence) {
    return {
      ok: false, code: 'PAY_CANCEL_EVIDENCE_MISSING', action: 'needs_operator',
      indeterminate: true, needsOperator: true, orderStatus: ORDER.PAID,
      providerCalled: true, providerStatus: st,
      note: '사업자는 취소됐다고 하나 거래키가 없어 증거 없이 REFUNDED 로 내리지 않았습니다'
    };
  }

  /* 취소가 안 됐음이 확인됐다 → 시도를 닫아 다시 환불할 수 있게 합니다 */
  if (st === 'DONE' && Number(p.balanceAmount) === Number(payment.amount)) {
    if (live) {
      try {
        await db.withActor('admin', tx => tx.refundAttemptOutcome(a.tenant, live.id, 'declined', 'PG_NOT_CANCELLED'));
      } catch (e) { /* 실패해도 아래 결과로 보고합니다 */ }
    }
    return {
      ok: false, code: 'PG_NOT_CANCELLED', action: 'not_cancelled',
      indeterminate: false, orderStatus: ORDER.PAID, providerCalled: true, providerStatus: st,
      retryable: true, note: '사업자에 취소가 없습니다 — 환불을 다시 요청할 수 있습니다'
    };
  }

  /* 그 밖에는 여전히 모릅니다 */
  return {
    ok: false, code: 'PAY_REFUND_INDETERMINATE', action: 'unresolved',
    indeterminate: true, needsOperator: true, orderStatus: ORDER.PAID,
    providerCalled: true, providerStatus: st || null, attemptId: live ? live.id : null
  };
}

module.exports = { recover, CANCELLED_STATES };
