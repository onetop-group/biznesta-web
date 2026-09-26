/* =====================================================================
   biznesta/adapter.js — BIZNESTA STORE Adapter (PAYMENT CORE 계약 구현)
   ---------------------------------------------------------------------
   CORE 와 BIZNESTA 사이의 유일한 연결 지점입니다.

     CORE      주문번호 · 금액 불변식 · 승인 · 멱등 · 원장 · 환불 · tenant 격리
     ADAPTER   어떤 상품인가 · 실제 가격 · 표시명 · 결제 후 권한 · 환불 후 회수

   의존 방향
     biznesta/adapter.js  →  core/*            (이 방향만)
     core/*               →  biznesta/*        ★ 없습니다. CORE 는 biz_ 를 모릅니다.

   비회원 구매에서 '누구' 는 이렇게 표현됩니다
     BIZNESTA :  biz_buyers 행 (이메일 보관)
     CORE     :  pay_orders.user_ref = 그 행의 uuid 문자열
   CORE 는 그 uuid 가 사람인지 회사인지도 모릅니다. 이메일은 넘기지 않습니다.
   ===================================================================== */
'use strict';

const storePort = require('./store-port');
const tokenLib = require('./token');
const { isUuid } = require('./sql-store');

const TENANT = 'biznesta';
const ORDER_PREFIX = 'BN';

/* 디지털 콘텐츠 환불 안내.
   ★ [미확인] 법무 확정 전 문안입니다. 실제 판매 개시 전에 반드시 검토해야 합니다.
     전자상거래법상 '가분적 디지털콘텐츠' 는 제공이 시작된 부분만 철회가 제한됩니다. */
const REFUND_POLICY =
  '디지털 콘텐츠 상품입니다. 결제 후 열람 링크가 발급되기 전에는 전액 환불됩니다. '
  + '열람이 시작된 뒤에는 관련 법령이 정한 범위에서 청약철회가 제한될 수 있습니다. '
  + '환불 문의는 고객센터로 접수해 주시면 확인 후 처리해 드립니다.';

function err(code, detail) {
  const e = new Error(code + (detail ? ':' + detail : ''));
  e.code = code;
  return e;
}

/**
 * createBiznestaAdapter({ store, coreDb, baseUrl, deliverAccess })
 *
 *   store         store-port 계약 구현체 (biznesta/sql-store.js)
 *   coreDb        core/db/port.js 계약 구현체 — onPaid 가 '무엇이 팔렸는지' 를
 *                 주문에서 다시 읽기 위해 필요합니다. CORE 이벤트 payload 에는
 *                 일부러 상품·구매자가 들어 있지 않습니다(도메인 값 유출 방지).
 *   baseUrl       완료 페이지 주소의 앞부분
 *   deliverAccess (선택) 새로 발급된 토큰을 받을 자리. 없으면 토큰은 버려집니다.
 *                 ★ 이번 단계에는 이메일 발송이 없으므로 기본값은 '버림' 입니다.
 *                   해시만 남으므로 버려진 토큰은 누구도 복구할 수 없습니다.
 */
function createBiznestaAdapter(deps) {
  const d = deps || {};
  storePort.assertStore(d.store);
  if (!d.coreDb || typeof d.coreDb.getOrder !== 'function') throw err('BIZ_CORE_DB_REQUIRED');

  const store = d.store;
  const coreDb = d.coreDb;
  const baseUrl = String(d.baseUrl || 'https://www.biznesta.com').replace(new RegExp('/+$'), '');
  const deliver = typeof d.deliverAccess === 'function' ? d.deliverAccess : null;

  const adapter = {
    tenant: TENANT,
    orderPrefix: ORDER_PREFIX,

    /* ── 서버 정본 가격 ────────────────────────────────────────
       ★ 인자에 금액이 없습니다. 클라이언트 값을 되돌려줄 방법 자체가 없습니다.
         없는 상품은 null → CORE 가 PAY_PRODUCT_NOT_FOUND 로 막습니다.
         판매중지는 active:false → CORE 가 PAY_PRODUCT_NOT_AVAILABLE 로 막습니다. */
    resolveProduct: async function (productRef) {
      const p = await store.getProduct(productRef);
      if (!p) return null;
      return {
        productRef: p.productRef,
        amount: p.amount,
        currency: p.currency,
        name: p.name,
        active: p.active
      };
    },

    /* ── 사업별 입력 검증 → adapter_meta ──────────────────────
       비회원 구매에 필요한 것은 '이 주문이 등록된 구매자의 것인가' 하나뿐입니다.
       ★ 이메일은 여기로 오지 않습니다. 이미 buyerId 로 바뀐 뒤입니다.
         (biznesta/index.js 의 beginGuestPurchase 가 그 변환을 책임집니다.) */
    validateInput: async function (input) {
      const i = input || {};
      if (!i.buyerId) return { ok: false, code: 'BIZ_BUYER_REQUIRED', field: 'buyerId' };
      if (!isUuid(i.buyerId)) return { ok: false, code: 'BIZ_BUYER_REF_INVALID', field: 'buyerId' };

      /* 아무 문자열이나 user_ref 로 밀어넣지 못하게 실제 존재를 확인합니다 */
      const exists = await store.buyerExists(i.buyerId);
      if (!exists) return { ok: false, code: 'BIZ_BUYER_NOT_FOUND', field: 'buyerId' };

      /* ★ adapter_meta 에 개인정보를 넣지 않습니다. CORE 가 보관하게 되기 때문입니다. */
      return { ok: true, meta: { channel: 'web', kind: 'digital' } };
    },

    orderName: function (a) {
      return (a && a.product && a.product.name) || null;
    },

    completeUrl: function (a) {
      return baseUrl + '/store/complete/' + ((a && a.order && a.order.orderNo) || '');
    },

    refundPolicyText: function () { return REFUND_POLICY; },

    /* ── 결제 확정 후 : 권한 발급 ──────────────────────────────
       CORE 는 이미 PAID 를 확정한 뒤에만 여기를 부릅니다.
       여기서 실패해도 CORE 는 결제를 되돌리지 않고 재처리 대상으로 적습니다. */
    onPaid: async function (e) {
      const ev = e || {};
      const order = await coreDb.getOrder(ev.tenant, ev.orderId);
      if (!order) throw err('BIZ_ORDER_NOT_FOUND');
      if (String(order.tenant) !== TENANT) throw err('BIZ_TENANT_MISMATCH');
      if (!order.product_ref) throw err('BIZ_PRODUCT_REF_MISSING');

      const fresh = tokenLib.createAccessToken();
      const r = await store.grantEntitlement({
        orderId: order.id,
        productRef: order.product_ref,
        buyerId: order.user_ref,
        tokenHash: fresh.tokenHash
      });

      /* 새로 만들어진 경우에만 원문을 넘깁니다.
         이미 있던 권한이면 해시밖에 없으므로 보낼 원문이 없습니다 —
         재발급은 별도 절차(토큰 재발행)로만 가능합니다. */
      if (r.created && deliver) {
        await deliver({
          orderId: order.id,
          orderNo: order.order_no,
          buyerId: order.user_ref,
          productRef: order.product_ref,
          token: fresh.token
        });
      }
      /* ★ 반환값은 CORE 의 판단에 쓰이지 않습니다. 토큰을 돌려주지 않습니다. */
    },

    /* ── 환불 확정 후 : 권한 회수 ───────────────────────────── */
    onRefunded: async function (e) {
      const ev = e || {};
      if (String(ev.tenant) !== TENANT) throw err('BIZ_TENANT_MISMATCH');
      await store.revokeEntitlements(ev.orderId, 'refunded');
    }
  };

  return adapter;
}

module.exports = { createBiznestaAdapter, TENANT, ORDER_PREFIX, REFUND_POLICY };
