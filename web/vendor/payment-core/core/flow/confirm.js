/* =====================================================================
   core/flow/confirm.js — 결제 승인 (STEP 4)
   ---------------------------------------------------------------------
   결제 시스템에서 가장 위험한 구간입니다. 사업자 응답과 DB 사이에서
   사실이 어긋나면 돈과 기록이 달라집니다. 그래서 순서를 고정합니다.

     ① 금액 3중 검증  (요청값 ↔ 주문 ↔ 시도)   — 어긋나면 사업자 호출 0
     ② 멱등 확인      (같은 paymentKey 로 이미 승인됨) — 사업자 호출 0
     ③ requested → confirming   (호출 '전' 에 흔적을 남깁니다)
     ④ 사업자 승인 호출          — 금액은 반드시 DB 값
     ⑤ 응답 판정
          거절        → failed (주문은 PENDING 유지)
          미확정      → ★ 아무것도 단정하지 않음. confirming 유지 · status 로 회복
          승인 + 금액 불일치 → conflict.amountMismatch (취소 시도)
          승인 + 이미 PAID   → conflict.duplicateApproval (취소 시도)
          승인 정상   → DB 기록 (원자적) → 주문 PAID
     ⑥ DB 기록 실패 → ★ failed 로 적지 않음. record_failed 예외 + confirming 유지
   ===================================================================== */
'use strict';

const E = require('../errors');
const ORDER = require('../state/order');
const INTENT = require('../state/intent');
const money = require('../money');
const port = require('../db/port');
const conflict = require('./conflict');
const hooks = require('./hooks');

function codeOf(e) { return conflict.codeOf(e); }

async function confirm(ctx, args) {
  const db = ctx.db;
  const a = args || {};
  port.assertPort(db);

  const tenant = a.tenant;
  if (!tenant || !a.orderId || !a.paymentKey) return E.fail('PAY_INVALID_ARGS');

  const order = await db.getOrder(tenant, a.orderId);
  if (!order) return E.fail('PAY_ORDER_NOT_FOUND');

  const intents = await db.getIntents(tenant, a.orderId);
  const confirmed = intents.filter(i => i.status === INTENT.CONFIRMED)[0] || null;

  /* ② 멱등 — 같은 paymentKey 로 이미 승인됨. 사업자를 다시 부르지 않습니다. */
  if (order.status === ORDER.PAID && confirmed && confirmed.payment_key === a.paymentKey) {
    return {
      ok: true, idempotent: true, orderStatus: ORDER.PAID, intentStatus: INTENT.CONFIRMED,
      orderId: order.id, intentId: confirmed.id, amount: Number(order.amount), currency: order.currency
    };
  }

  const open = intents.filter(i => INTENT.isOpen(i.status))[0] || null;

  /* ① 금액 3중 검증 — 여기서 걸리면 사업자를 호출하지 않습니다 */
  if (a.amount !== undefined && a.amount !== null) {
    try {
      money.assertSameAmount(Number(order.amount), a.amount, order.currency);
    } catch (e) {
      return E.fail('PAY_AMOUNT_MISMATCH', { expected: Number(order.amount), got: a.amount, stage: 'request_vs_order' });
    }
  }
  if (open && Number(open.amount) !== Number(order.amount)) {
    return E.fail('PAY_AMOUNT_MISMATCH', { expected: Number(order.amount), got: Number(open.amount), stage: 'order_vs_intent' });
  }

  /* 이미 결제된 주문에 '다른' paymentKey 로 승인 요청 → 사업자를 부르지 않습니다.
     부르면 중복 승인을 우리 손으로 만드는 셈입니다. */
  if (order.status === ORDER.PAID) {
    return E.fail('PAY_ORDER_ALREADY_PAID', { orderStatus: ORDER.PAID });
  }
  if (order.status !== ORDER.PENDING) {
    return E.fail('PAY_ORDER_NOT_PENDING', { orderStatus: order.status });
  }
  if (!open) return E.fail('PAY_NO_OPEN_INTENT');

  /* ③ 호출 전에 흔적 — 응답이 유실돼도 confirming 이 남아 status 로 회복됩니다 */
  if (open.status === INTENT.REQUESTED) {
    try {
      await db.withActor('system', tx => tx.intentBeginConfirm(tenant, open.id));
    } catch (e) {
      return E.fail(codeOf(e), { stage: 'begin_confirm' });
    }
  }

  /* ④ 사업자 승인 — 금액은 DB 값만 (호출자가 준 값이 아님) */
  let r;
  try {
    r = await ctx.provider.confirm({
      paymentKey: a.paymentKey,
      orderId: open.provider_order_id,
      amount: Number(open.amount)
    });
  } catch (e) {
    r = E.fail(E.CONTRACT.THREW);
  }

  /* ⑤-a 미확정 : 성공도 실패도 아닙니다 */
  if (!r.ok && E.isIndeterminate(r.code)) {
    return {
      ok: false, code: r.code, indeterminate: true, recoverable: true, next: 'status',
      orderStatus: ORDER.PENDING, intentStatus: INTENT.CONFIRMING, intentId: open.id,
      note: 'provider 응답 미확정 — 실패로 확정하지 않았습니다'
    };
  }

  /* ⑤-b 사업자가 명시적으로 거절 */
  if (!r.ok) {
    try {
      await db.withActor('provider', tx => tx.intentMarkFailed(tenant, open.id, r.code));
    } catch (e) {
      return E.fail('PAY_RECORD_FAILED', { cause: codeOf(e), providerCode: r.code, moneyMoved: false });
    }
    return {
      ok: false, code: r.code, indeterminate: false, moneyMoved: false,
      orderStatus: ORDER.PENDING, intentStatus: INTENT.FAILED, intentId: open.id
    };
  }

  /* ⑤-c 승인됨 — 사업자가 알려온 금액 재검증 (3중 검증의 마지막) */
  const approved = r.payment && r.payment.totalAmount != null ? Number(r.payment.totalAmount) : null;
  if (approved !== null && approved !== Number(open.amount)) {
    return conflict.amountMismatch(ctx, {
      tenant: tenant, order: order, intent: open, paymentKey: a.paymentKey,
      expected: Number(open.amount), approved: approved
    });
  }

  /* ⑤-d 그 사이에 다른 시도가 주문을 PAID 로 만들었는가 */
  const fresh = await db.getOrder(tenant, a.orderId);
  if (fresh && fresh.status === ORDER.PAID) {
    const winner = (await db.getIntents(tenant, a.orderId)).filter(i => i.status === INTENT.CONFIRMED)[0];
    return conflict.duplicateApproval(ctx, {
      tenant: tenant, order: fresh, intent: open, paymentKey: a.paymentKey,
      payment: r.payment, winningIntentId: winner ? winner.id : null
    });
  }

  /* ⑤-e 정상 기록 (DB 안에서 원자적) */
  try {
    const paid = await db.withActor('system', tx =>
      tx.intentMarkConfirmed(tenant, open.id, a.paymentKey, Number(open.amount)));

    /* ★ 돈의 상태가 확정된 '뒤' 에 사업별 hook 을 부릅니다.
       hook 이 실패해도 PAID 를 되돌리지 않습니다 (H-2). */
    const hook = await hooks.afterPaid(ctx, {
      tenant: tenant, order: paid, provider: ctx.providerName, paymentKey: a.paymentKey
    });

    return {
      ok: true, idempotent: false, orderStatus: paid.status, intentStatus: INTENT.CONFIRMED,
      orderId: order.id, intentId: open.id, paidAt: paid.paid_at,
      amount: Number(order.amount), currency: order.currency,
      hook: hook
    };
  } catch (e) {
    const code = codeOf(e);

    /* 경쟁에서 진 경우 — DB 가 알려줍니다 */
    if (code === 'PAY_ORDER_ALREADY_PAID' || code === 'PAY_INTENT_ALREADY_CONFIRMED') {
      const now = await db.getOrder(tenant, a.orderId);
      const winner = (await db.getIntents(tenant, a.orderId)).filter(i => i.status === INTENT.CONFIRMED)[0];
      return conflict.duplicateApproval(ctx, {
        tenant: tenant, order: now || order, intent: open, paymentKey: a.paymentKey,
        payment: r.payment, winningIntentId: winner ? winner.id : null
      });
    }

    /* ⑥ 사업자는 승인했는데 DB 기록이 실패 — 절대 failed 로 적지 않습니다 */
    return conflict.recordFailed(ctx, {
      tenant: tenant, order: order, intent: open, paymentKey: a.paymentKey, cause: code
    });
  }
}

module.exports = { confirm };
