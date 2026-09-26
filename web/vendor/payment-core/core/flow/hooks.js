/* =====================================================================
   core/flow/hooks.js — 사업별 hook 전달 (STEP 6)
   ---------------------------------------------------------------------
   원칙
     H-1 hook 은 돈의 상태가 확정된 '뒤' 에만 부릅니다.
     H-2 hook 이 실패해도 ★ 결제/환불 상태를 되돌리지 않습니다.
     H-3 실패는 따로 적힙니다 — 재처리 가능 · 운영자 식별 가능.
     H-4 이미 전달된 hook 은 다시 부르지 않습니다 (멱등).
     H-5 hook 의 반환값은 CORE 의 판단에 영향을 주지 않습니다.
   ===================================================================== */
'use strict';

const E = require('../errors');
const port = require('../db/port');
const adapterContract = require('../adapter/contract');

function codeOf(e) {
  if (e && e.code) return String(e.code).slice(0, 120);
  const m = new RegExp('(PAY_[A-Z_]+)').exec(String((e && e.message) || ''));
  return m ? m[1] : String((e && e.message) || 'HOOK_ERROR').slice(0, 120);
}

/* hook 하나를 전달합니다. 절대 throw 하지 않습니다. */
async function deliver(ctx, a) {
  const db = ctx.db;
  const adapter = ctx.adapter;
  const hook = a.hook;
  const eventName = adapterContract.HOOKS[hook];

  /* Adapter 가 그 hook 을 구현하지 않았다면 기록할 것도 없습니다 */
  if (!adapter || typeof adapter[hook] !== 'function') {
    return { hook: hook, skipped: 'not_implemented', delivered: false };
  }

  let row;
  try {
    row = await db.withActor('system', tx => tx.hookStart(a.tenant, a.orderId, hook, eventName, a.payload));
  } catch (e) {
    /* 기록 자체가 실패해도 돈의 상태는 건드리지 않습니다 */
    return { hook: hook, delivered: false, recordFailed: true, code: codeOf(e) };
  }

  if (row.status === 'delivered') {
    return { hook: hook, delivered: true, idempotent: true, deliveryId: row.id, attempts: row.attempts };
  }

  try {
    await adapter[hook](a.payload);           /* ★ 반환값을 쓰지 않습니다 (H-5) */
  } catch (e) {
    const code = codeOf(e);
    try { await db.withActor('system', tx => tx.hookFailed(a.tenant, row.id, code)); } catch (e2) {}
    if (ctx.events) { try { await ctx.events.emit(eventName, a.payload); } catch (e3) {} }
    return { hook: hook, delivered: false, code: code, deliveryId: row.id, attempts: row.attempts, retryable: true };
  }

  try { await db.withActor('system', tx => tx.hookDelivered(a.tenant, row.id)); } catch (e) {}
  if (ctx.events) { try { await ctx.events.emit(eventName, a.payload); } catch (e2) {} }
  return { hook: hook, delivered: true, idempotent: false, deliveryId: row.id, attempts: row.attempts };
}

/* 결제 확정 후 */
async function afterPaid(ctx, a) {
  const payload = adapterContract.shapePaidEvent({
    tenant: a.tenant, orderId: a.order.id, orderNo: a.order.order_no,
    provider: a.provider, amount: Number(a.order.amount), currency: a.order.currency,
    paidAt: a.order.paid_at || null, paymentKey: a.paymentKey || null
  });
  return deliver(ctx, { tenant: a.tenant, orderId: a.order.id, hook: 'onPaid', payload: payload });
}

/* 환불 확정 후 */
async function afterRefunded(ctx, a) {
  const payload = adapterContract.shapeRefundEvent({
    tenant: a.tenant, orderId: a.order.id, orderNo: a.order.order_no,
    provider: a.provider, amount: Number(a.order.amount), currency: a.order.currency,
    refundedAt: a.order.closed_at || null, transactionKey: a.transactionKey || null, actorRef: a.actorRef || null
  });
  return deliver(ctx, { tenant: a.tenant, orderId: a.order.id, hook: 'onRefunded', payload: payload });
}

/* ── 재처리 (운영자) ───────────────────────────────────────── */
async function retry(ctx, args) {
  const a = args || {};
  port.assertPort(ctx.db);

  if (a.actor !== 'admin') return E.fail('PAY_FORBIDDEN_ADMIN_ONLY', { actor: a.actor == null ? null : String(a.actor) });
  if (!a.tenant || !a.orderId) return E.fail('PAY_INVALID_ARGS');

  const rows = await ctx.db.getHookDeliveries(a.tenant, a.orderId);
  const pending = rows.filter(r => r.status !== 'delivered' && (!a.hook || r.hook === a.hook));
  if (!pending.length) {
    return { ok: true, retried: 0, delivered: 0, note: '재처리할 hook 이 없습니다' };
  }

  const results = [];
  for (const row of pending) {
    results.push(await deliver(ctx, { tenant: a.tenant, orderId: a.orderId, hook: row.hook, payload: row.payload }));
  }
  const delivered = results.filter(r => r.delivered).length;
  return { ok: delivered === results.length, retried: results.length, delivered: delivered, results: results };
}

/* 읽기 전용 상태 조회 */
async function statusOf(ctx, args) {
  const a = args || {};
  port.assertPort(ctx.db);
  if (!a.tenant || !a.orderId) return E.fail('PAY_INVALID_ARGS');
  const rows = await ctx.db.getHookDeliveries(a.tenant, a.orderId);
  return {
    ok: true,
    hooks: rows.map(r => ({
      hook: r.hook, status: r.status, attempts: r.attempts,
      lastCode: r.last_code || null, deliveredAt: r.delivered_at || null
    })),
    allDelivered: rows.length > 0 && rows.every(r => r.status === 'delivered'),
    failed: rows.filter(r => r.status !== 'delivered').length
  };
}

module.exports = { deliver, afterPaid, afterRefunded, retry, statusOf, codeOf };
