/* =====================================================================
   core/flow/order.js — 주문 생성 (STEP 6)
   ---------------------------------------------------------------------
   여기가 ADAPTER 와 CORE 가 만나는 자리입니다.

     클라이언트 → 상품 식별자(productRef) + 사업별 입력(input)
     ADAPTER    → 그 상품이 무엇이고 얼마인지 '서버에서' 판정
     CORE       → 그 금액을 주문 금액으로 고정. 이후 클라이언트 금액은 믿지 않음

   ★ 클라이언트가 보낸 금액은 ADAPTER 에게 전달되지 않습니다.
     resolveProduct 의 시그니처에 금액을 받을 자리가 없으므로,
     "클라이언트 가격을 그대로 돌려주는" 구현이 실수로도 불가능합니다.
   ★ CORE 는 adapter_meta 의 의미를 해석하지 않습니다. 받아서 저장할 뿐입니다.
   ===================================================================== */
'use strict';

const E = require('../errors');
const money = require('../money');
const port = require('../db/port');
const orderNoGen = require('../order/number');
const AC = require('../adapter/contract');

function codeOf(e) {
  const m = new RegExp('(PAY_[A-Z_]+)').exec(String((e && e.message) || ''));
  return m ? m[1] : (e && e.code ? String(e.code) : 'PAY_DB_ERROR');
}

async function createOrder(ctx, args) {
  const db = ctx.db;
  const a = args || {};
  port.assertPort(db);

  const adapter = ctx.adapter;
  if (!adapter) return E.fail('PAY_ADAPTER_REQUIRED');
  if (!a.userRef) return E.fail('PAY_USER_REF_REQUIRED');

  /* tenant 는 Adapter 가 가진 값이 기준입니다. 호출자가 다른 값을 주면 거부합니다. */
  const tenant = adapter.tenant;
  if (a.tenant && a.tenant !== tenant) return E.fail('PAY_TENANT_MISMATCH', { expected: tenant });

  /* ① 사업별 입력 검증 → adapter_meta */
  const v = await AC.validateInput(adapter, a.input, { productRef: a.productRef });
  if (!v.ok) return E.fail(v.code, { field: v.field || null, detail: v.detail || null });

  /* ② 서버 권위 가격 — 클라이언트 금액은 여기 오지 않습니다 */
  const p = await AC.resolveProduct(adapter, a.productRef, { locale: a.locale });
  if (!p.ok) return E.fail(p.code, { productRef: a.productRef || null, detail: p.detail || null, expected: p.expected, got: p.got });

  const product = p.product;

  /* ③ 클라이언트가 금액을 보냈다면 '대조' 만 합니다. 기준은 Adapter 의 값입니다. */
  if (a.amount !== undefined && a.amount !== null) {
    let same = false;
    try { money.assertSameAmount(product.amount, a.amount, product.currency); same = true; }
    catch (e) { same = false; }
    if (!same) {
      return E.fail('PAY_AMOUNT_MISMATCH', {
        authoritative: product.amount, claimed: a.amount, currency: product.currency, stage: 'client_vs_adapter'
      });
    }
  }

  /* ④ 주문번호는 CORE 가 채번합니다. Adapter 는 prefix 만 줍니다. */
  let created;
  try {
    const r = await orderNoGen.createWithRetry({
      prefix: adapter.orderPrefix,
      insert: function (orderNo) {
        return db.withActor('system', tx =>
          tx.orderCreate(tenant, a.userRef, orderNo, product.amount, product.currency,
            product.productRef, v.meta, a.requestId || null));
      },
      isConflict: function (e) {
        const s = String((e && e.message) || '');
        return s.indexOf('23505') >= 0 || new RegExp('duplicate key|unique', 'i').test(s);
      }
    });
    created = r;
  } catch (e) {
    return E.fail(codeOf(e), { stage: 'order_create' });
  }

  const row = created.result;
  if (!row || !row.id) return E.fail('PAY_ORDER_NOT_FOUND', { stage: 'after_create' });

  /* ⑤ 표시용 값 — 전부 Adapter 몫 (없으면 기본값) */
  const name = await AC.orderName(adapter, { order: { id: row.id, orderNo: row.order_no }, product: product, input: a.input });
  const complete = await AC.completeUrl(adapter, { order: { id: row.id, orderNo: row.order_no }, product: product });
  const policy = await AC.refundPolicyText(adapter);

  return {
    ok: true,
    order: {
      id: row.id, orderNo: row.order_no, status: row.status,
      amount: Number(row.amount), currency: row.currency,
      productRef: row.product_ref, userRef: row.user_ref
    },
    orderName: name,
    completeUrl: complete,
    refundPolicyText: policy,
    priceSource: 'adapter',           /* 금액의 출처를 분명히 합니다 */
    attempts: created.attempts
  };
}

module.exports = { createOrder };
