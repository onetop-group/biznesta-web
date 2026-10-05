/* =====================================================================
   core/flow/fail.js — 결제 실패 처리 (STEP 4)
   ---------------------------------------------------------------------
   사용자가 결제창에서 취소했거나 사업자가 실패로 되돌려보낸 경우입니다.

   ★ 핵심 : 이미 사업자 승인 호출이 나간 시도(confirming)는 여기서 실패로 적지 않습니다.
     "사용자 쪽에서 실패로 보였다" 와 "사업자에서 실제로 승인되지 않았다" 는 다릅니다.
     승인 호출이 나간 뒤라면 status() 로 사실을 확인해야 합니다.
     이 구분을 빼먹으면 실제로 승인된 결제를 실패로 적어버립니다.
   ===================================================================== */
'use strict';

const E = require('../errors');
const ORDER = require('../state/order');
const INTENT = require('../state/intent');
const port = require('../db/port');
const conflict = require('./conflict');

const MAX_CODE = 60;

function normalizeCode(code) {
  const c = String(code || 'PAY_USER_CANCELLED').trim().slice(0, MAX_CODE);
  return c.length ? c : 'PAY_USER_CANCELLED';
}

async function fail(ctx, args) {
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

  if (order.status === ORDER.PAID) {
    /* 이미 결제된 주문을 실패로 적을 수는 없습니다 */
    return E.fail('PAY_ORDER_ALREADY_PAID', { orderStatus: order.status });
  }
  if (order.status !== ORDER.PENDING) {
    return E.fail('PAY_ORDER_NOT_PENDING', { orderStatus: order.status });
  }

  const intents = await db.getIntents(a.tenant, a.orderId);
  const open = intents.filter(i => INTENT.isOpen(i.status))[0] || null;
  if (!open) return E.fail('PAY_NO_OPEN_INTENT');

  /* ★ 승인 호출이 나간 뒤라면 단정하지 않습니다 */
  if (open.status === INTENT.CONFIRMING) {
    return {
      ok: false, code: 'PAY_INDETERMINATE', indeterminate: true, recoverable: true, next: 'status',
      orderStatus: order.status, intentStatus: INTENT.CONFIRMING, intentId: open.id,
      note: '승인 호출이 이미 나갔습니다 — status() 로 사실을 확인해야 합니다'
    };
  }

  try {
    const row = await db.withActor(actor, tx => tx.intentMarkFailed(a.tenant, open.id, normalizeCode(a.code)));
    return {
      ok: true, orderStatus: order.status, intentStatus: row.status, intentId: open.id,
      code: row.failed_code, actor: actor
    };
  } catch (e) {
    return E.fail(conflict.codeOf(e), { stage: 'mark_failed' });
  }
}

module.exports = { fail, normalizeCode };
