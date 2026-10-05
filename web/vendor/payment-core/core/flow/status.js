/* =====================================================================
   core/flow/status.js — 상태 조회 · 미확정 회복 (STEP 4)
   ---------------------------------------------------------------------
   confirm 이 미확정으로 끝났거나 DB 기록이 실패했을 때, 사실을 알아내는 유일한 길은
   '사업자에게 다시 물어보는 것' 입니다. 추측하지 않습니다.

   회복 규칙
     S-1 사업자가 DONE + 금액 일치 + paymentKey 있음  → 승인 확정 (PAID)
     S-2 사업자가 '그런 결제 없음'(404)               → 실패 확정
     S-3 사업자가 취소/만료 상태를 알려줌              → 실패 확정
     S-4 그 밖의 모든 경우(타임아웃·불명확한 거절·금액 불일치) → ★ 그대로 둡니다
         confirming 을 유지하고 unresolved 로 보고합니다. 단정하지 않습니다.
   ===================================================================== */
'use strict';

const E = require('../errors');
const ORDER = require('../state/order');
const INTENT = require('../state/intent');
const port = require('../db/port');
const conflict = require('./conflict');

const DEAD_PROVIDER_STATES = ['CANCELED', 'CANCELLED', 'ABORTED', 'EXPIRED', 'FAILED'];

function view(order, intents, exceptions) {
  return {
    order: {
      id: order.id, orderNo: order.order_no, status: order.status,
      amount: Number(order.amount), currency: order.currency,
      refundedAmount: Number(order.refunded_amount), paidAt: order.paid_at
    },
    intents: (intents || []).map(i => ({
      id: i.id, attempt: i.attempt, status: i.status, provider: i.provider,
      amount: Number(i.amount), hasPaymentKey: !!i.payment_key,
      failedCode: i.failed_code || null, confirmedAt: i.confirmed_at || null
    })),
    exceptions: (exceptions || []).map(x => ({
      id: x.id, kind: x.kind, status: x.status, indeterminate: x.indeterminate,
      moneyMoved: true, createdAt: x.created_at
    }))
  };
}

async function status(ctx, args) {
  const db = ctx.db;
  const a = args || {};
  port.assertPort(db);

  if (!a.tenant || !a.orderId) return E.fail('PAY_INVALID_ARGS');

  let order = await db.getOrder(a.tenant, a.orderId);
  if (!order) return E.fail('PAY_ORDER_NOT_FOUND');

  let intents = await db.getIntents(a.tenant, a.orderId);
  let resolution = null;

  const pending = intents.filter(i => i.status === INTENT.CONFIRMING)[0] || null;
  const shouldResolve = pending && order.status === ORDER.PENDING && a.resolve !== false && ctx.provider;

  if (shouldResolve) {
    let r;
    try {
      r = await ctx.provider.getByOrderId(pending.provider_order_id);
    } catch (e) {
      r = E.fail(E.CONTRACT.THREW);
    }

    if (r.ok) {
      const p = r.payment || {};
      const st = String(p.status || '').toUpperCase();
      const amountOk = p.totalAmount != null && Number(p.totalAmount) === Number(pending.amount);

      if (st === 'DONE' && amountOk && p.paymentKey) {
        /* S-1 : 실제로는 승인돼 있었다 → 회복 */
        try {
          const paid = await db.withActor('provider', tx =>
            tx.intentMarkConfirmed(a.tenant, pending.id, p.paymentKey, Number(pending.amount)));
          resolution = { action: 'recovered', to: paid.status };
        } catch (e) {
          const code = conflict.codeOf(e);
          const rec = await conflict.recordFailed(ctx, {
            tenant: a.tenant, order: order, intent: pending, paymentKey: p.paymentKey, cause: code
          });
          resolution = { action: 'record_failed', code: code, exceptionId: rec.exceptionId || null };
        }
      } else if (st === 'DONE' && !amountOk) {
        /* 승인은 됐는데 금액이 다르다 — 이 주문의 결제로 인정할 수 없습니다 */
        const mm = await conflict.amountMismatch(ctx, {
          tenant: a.tenant, order: order, intent: pending, paymentKey: p.paymentKey,
          expected: Number(pending.amount), approved: p.totalAmount == null ? null : Number(p.totalAmount)
        });
        resolution = { action: 'amount_mismatch', exceptionId: mm.exceptionId || null, needsOperator: true };
      } else if (DEAD_PROVIDER_STATES.indexOf(st) >= 0) {
        /* S-3 */
        await db.withActor('provider', tx => tx.intentMarkFailed(a.tenant, pending.id, 'PG_' + st));
        resolution = { action: 'failed', code: 'PG_' + st };
      } else {
        /* S-4 */
        resolution = { action: 'unresolved', providerStatus: st || null };
      }
    } else if (r.http === 404 || r.providerCode === 'NOT_FOUND') {
      /* S-2 : 사업자에 그런 결제가 없다 → 돈이 움직이지 않았음이 확인됨 */
      await db.withActor('provider', tx => tx.intentMarkFailed(a.tenant, pending.id, 'PG_NOT_FOUND'));
      resolution = { action: 'failed', code: 'PG_NOT_FOUND' };
    } else {
      /* S-4 : 타임아웃·불명확한 거절 → 단정하지 않습니다 */
      resolution = { action: 'unresolved', code: r.code, indeterminate: E.isIndeterminate(r.code) };
    }

    order = await db.getOrder(a.tenant, a.orderId);
    intents = await db.getIntents(a.tenant, a.orderId);
  }

  const exceptions = await db.getExceptions(a.tenant, a.orderId);
  const openExceptions = exceptions.filter(x => x.status !== 'resolved');

  return Object.assign({ ok: true }, view(order, intents, exceptions), {
    resolution: resolution,
    settled: order.status !== ORDER.PENDING,
    unresolved: intents.some(i => i.status === INTENT.CONFIRMING),
    needsOperator: openExceptions.length > 0,
    moneyMayHaveMoved: intents.some(i => INTENT.moneyMoved(i.status)) || openExceptions.length > 0
  });
}

module.exports = { status, view };
