/* =====================================================================
   core/flow/cancel.js — 결제 전 주문 취소 (STEP 5)
   ---------------------------------------------------------------------
   PENDING → CANCELLED. 돈이 움직인 적이 없으므로 사업자를 호출하지 않습니다.
   결제된 주문은 '취소' 가 아니라 '환불' 입니다 → PAY_ORDER_NOT_PENDING.
   ===================================================================== */
'use strict';

const E = require('../errors');
const ORDER = require('../state/order');
const INTENT = require('../state/intent');
const port = require('../db/port');

function codeOf(e) {
  const m = new RegExp('(PAY_[A-Z_]+)').exec(String((e && e.message) || ''));
  return m ? m[1] : (e && e.code ? String(e.code) : 'PAY_DB_ERROR');
}

async function cancel(ctx, args) {
  const db = ctx.db;
  const a = args || {};
  port.assertPort(db);

  if (!a.tenant || !a.orderId) return E.fail('PAY_INVALID_ARGS');

  let actor = 'system';
  if (a.actor) {
    try { actor = port.assertActor(a.actor); }
    catch (e) { return E.fail('PAY_ACTOR_INVALID', { actor: String(a.actor) }); }
  }

  const order = await db.getOrder(a.tenant, a.orderId);
  if (!order) return E.fail('PAY_ORDER_NOT_FOUND');

  if (order.status === ORDER.CANCELLED) {
    return { ok: true, idempotent: true, orderStatus: ORDER.CANCELLED, providerCalled: false };
  }
  if (order.status === ORDER.PAID) {
    return E.fail('PAY_ORDER_ALREADY_PAID', { orderStatus: order.status, hint: 'refund' });
  }
  if (order.status !== ORDER.PENDING) {
    return E.fail('PAY_ORDER_NOT_PENDING', { orderStatus: order.status });
  }

  /* 승인 호출이 나간 시도가 남아 있으면 취소하지 않습니다 — 미확정이기 때문입니다 */
  const intents = await db.getIntents(a.tenant, a.orderId);
  if (intents.some(i => i.status === INTENT.CONFIRMING)) {
    return {
      ok: false, code: 'PAY_INDETERMINATE', indeterminate: true, recoverable: true, next: 'status',
      orderStatus: order.status, providerCalled: false,
      note: '승인 호출이 나간 시도가 있습니다 — status() 로 확인해야 합니다'
    };
  }

  try {
    const row = await db.withActor(actor, tx => tx.orderCancel(a.tenant, a.orderId, a.reason || null));
    return { ok: true, idempotent: false, orderStatus: row.status, actor: actor, providerCalled: false };
  } catch (e) {
    return E.fail(codeOf(e), { stage: 'order_cancel' });
  }
}

module.exports = { cancel };
