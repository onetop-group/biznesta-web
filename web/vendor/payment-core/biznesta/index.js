/* =====================================================================
   biznesta/index.js — BIZNESTA STORE 조립
   ---------------------------------------------------------------------
   여기가 '가게' 입니다. CORE 를 부르는 쪽이고, CORE 는 이쪽을 모릅니다.

   beginGuestPurchase 가 하는 일 (이 순서가 중요합니다)
     1) 이메일 → biz_buyers 행  (개인정보는 여기서 멈춥니다)
     2) 그 행의 uuid 를 userRef 로 삼아 CORE 에 주문 생성 요청
     3) 같은 uuid 를 input.buyerId 로도 넘겨, Adapter 가 '실재하는 구매자인지'
        다시 확인하게 합니다.
   ★ 2)와 3)이 어긋나면 결제 후 권한 발급이 BIZ_BUYER_MISMATCH 로 막힙니다.
     그래서 둘을 따로 받지 않고 이 함수가 한 값에서 만들어 냅니다.
   ===================================================================== */
'use strict';

const { createSqlStore } = require('./sql-store');
const { createBiznestaAdapter, TENANT, ORDER_PREFIX } = require('./adapter');
const storePort = require('./store-port');
const token = require('./token');
const schema = require('./schema');

/**
 * createBiznestaStore({ query, coreDb, baseUrl, deliverAccess })
 *   query  (sql, params) → { rows }   실제 Supabase pool 이든 pglite 든 상관없습니다
 */
function createBiznestaStore(deps) {
  const d = deps || {};
  const store = d.store || createSqlStore(d.query);
  storePort.assertStore(store);

  const adapter = createBiznestaAdapter({
    store: store,
    coreDb: d.coreDb,
    baseUrl: d.baseUrl,
    deliverAccess: d.deliverAccess
  });

  return { tenant: TENANT, orderPrefix: ORDER_PREFIX, store: store, adapter: adapter };
}

/**
 * 비회원 구매 시작. flow 는 createFlow({ adapter }) 로 만든 CORE flow 입니다.
 * 반환은 CORE 의 createOrder 결과 그대로 + buyerId.
 */
async function beginGuestPurchase(flow, store, args) {
  const a = args || {};
  if (!a.productRef) return { ok: false, code: 'BIZ_PRODUCT_REF_REQUIRED' };
  if (!a.email) return { ok: false, code: 'BIZ_EMAIL_REQUIRED' };

  let buyerId;
  try {
    buyerId = await store.upsertBuyer(a.email);
  } catch (e) {
    return { ok: false, code: (e && e.code) || 'BIZ_BUYER_UPSERT_FAILED' };
  }

  const r = await flow.createOrder({
    productRef: a.productRef,
    userRef: buyerId,                 /* CORE 가 보는 '누구' — uuid 뿐입니다 */
    input: { buyerId: buyerId },      /* Adapter 가 실재 확인 */
    amount: a.amount === undefined ? undefined : a.amount,  /* 있으면 CORE 가 대조만 합니다 */
    requestId: a.requestId || null,
    locale: a.locale || null
  });

  if (!r.ok) return r;
  r.buyerId = buyerId;
  return r;
}

/* 토큰 원문으로 권한을 확인합니다. 해시는 여기서 계산해 DB 로 넘깁니다. */
async function checkAccess(store, accessToken) {
  if (typeof accessToken !== 'string' || !accessToken) return null;
  let hash;
  try { hash = token.hashToken(accessToken); } catch (e) { return null; }
  return store.findByTokenHash(hash);
}

module.exports = {
  createBiznestaStore, beginGuestPurchase, checkAccess,
  createSqlStore, createBiznestaAdapter, storePort, token, schema,
  TENANT, ORDER_PREFIX
};
