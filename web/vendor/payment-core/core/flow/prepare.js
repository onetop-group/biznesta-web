/* =====================================================================
   core/flow/prepare.js — 결제 준비 (STEP 4)
   ---------------------------------------------------------------------
   사업자를 호출하기 '전' 단계입니다. 여기서 하는 일은 셋뿐입니다.
     ① 주문이 이 tenant 의 것이고 결제 가능한 상태인가
     ② 호출자가 말한 금액이 DB 금액과 같은가   ← 다르면 여기서 끝. 사업자 호출 0
     ③ 결제 시도(intent)를 만든다 (이미 열려 있으면 그것을 재사용 = 멱등)

   ★ 사업자에게 넘길 금액은 호출자가 준 값이 아니라 DB 의 값입니다.
   ===================================================================== */
'use strict';

const E = require('../errors');
const ORDER = require('../state/order');
const money = require('../money');
const port = require('../db/port');
const AC = require('../adapter/contract');

const PROVIDER_ORDER_PREFIX = 'PO';

/* 사업자에게 넘길 주문 식별자. 우리 주문번호를 그대로 노출하지 않습니다. */
function providerOrderId(orderNo, attemptSalt) {
  const compact = String(orderNo).replace(new RegExp('[^A-Z0-9]', 'g'), '');
  return (PROVIDER_ORDER_PREFIX + compact + String(attemptSalt || '')).slice(0, 64);
}

async function prepare(ctx, args) {
  const db = ctx.db;
  const a = args || {};
  port.assertPort(db);

  const tenant = a.tenant;
  const orderId = a.orderId;
  if (!tenant || !orderId) return E.fail('PAY_INVALID_ARGS');

  const order = await db.getOrder(tenant, orderId);
  if (!order) return E.fail('PAY_ORDER_NOT_FOUND');          /* 타인의 주문도 여기로 (존재 비노출) */

  if (order.status !== ORDER.PENDING) {
    return E.fail('PAY_ORDER_NOT_PENDING', { status: order.status });
  }

  /* ② 금액 대조 — 사업자 호출 전에 차단 */
  if (a.amount !== undefined && a.amount !== null) {
    try {
      money.assertSameAmount(Number(order.amount), a.amount, order.currency);
    } catch (e) {
      return E.fail(e.code === 'PAY_AMOUNT_MISMATCH' ? 'PAY_AMOUNT_MISMATCH' : e.code,
        { expected: Number(order.amount), currency: order.currency });
    }
  }

  const providerName = a.provider || ctx.providerName;
  if (!providerName) return E.fail('PAY_PROVIDER_REQUIRED');

  /* ③ 시도 생성 (열린 시도가 있으면 DB RPC 가 그것을 돌려줍니다) */
  let intent;
  try {
    intent = await db.withActor('system', async function (tx) {
      return tx.intentCreate(tenant, orderId, providerName, providerOrderId(order.order_no, a.salt));
    });
  } catch (e) {
    return E.fail(codeOf(e));
  }

  const reused = intent.status !== 'requested' || intent.attempt > 1 || !!intent.__reused;

  /* 표시용 값은 ADAPTER 몫입니다. 주문 금액은 이미 DB 에 고정돼 있으므로
     여기서 상품을 다시 조회해도 결제 금액은 바뀌지 않습니다. */
  let displayName = null, complete = null, priceChanged = null;
  if (ctx.adapter && order.product_ref) {
    const pr = await AC.resolveProduct(ctx.adapter, order.product_ref, {});
    if (pr.ok) {
      displayName = await AC.orderName(ctx.adapter, { order: { id: order.id, orderNo: order.order_no }, product: pr.product });
      complete = await AC.completeUrl(ctx.adapter, { order: { id: order.id, orderNo: order.order_no }, product: pr.product });
      priceChanged = Number(pr.product.amount) !== Number(order.amount);
    }
  }

  return {
    ok: true,
    reused: !!intent.__reused,
    orderName: displayName,
    completeUrl: complete,
    priceChanged: priceChanged,
    order: { id: order.id, orderNo: order.order_no, status: order.status, amount: Number(order.amount), currency: order.currency },
    intent: {
      id: intent.id, attempt: intent.attempt, status: intent.status,
      providerOrderId: intent.provider_order_id,
      amount: Number(intent.amount), currency: intent.currency, provider: intent.provider
    }
  };
}

function codeOf(e) {
  const m = new RegExp('(PAY_[A-Z_]+)').exec(String((e && e.message) || ''));
  return m ? m[1] : (e && e.code ? String(e.code) : 'PAY_DB_ERROR');
}

module.exports = { prepare, providerOrderId, codeOf };
