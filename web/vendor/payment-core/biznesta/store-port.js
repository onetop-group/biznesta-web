/* =====================================================================
   biznesta/store-port.js — BIZNESTA 도메인 데이터 계약
   ---------------------------------------------------------------------
   Adapter 는 SQL 을 모릅니다. 이 계약만 압니다.
   그래야 Adapter 를 DB 없이도 시험할 수 있고, 나중에 저장소를 바꿔도
   Adapter 가 그대로 돕니다. (CORE 의 core/db/port.js 와 같은 생각입니다.)
   ===================================================================== */
'use strict';

const REQUIRED = [
  'getProduct',          /* (productRef) → {productRef,amount,currency,name,active} | null */
  'upsertBuyer',         /* (email) → buyerId(uuid)                                        */
  'buyerExists',         /* (buyerId) → boolean                                            */
  'grantEntitlement',    /* ({orderId,productRef,buyerId,tokenHash}) → {row, created}       */
  'revokeEntitlements',  /* (orderId, reason) → 회수한 건수                                 */
  'findByTokenHash',     /* (tokenHash) → row | null   ★ 인자는 해시입니다                  */
  'getEntitlements'      /* (orderId) → rows                                               */
];

function validate(store) {
  const s = store || {};
  const missing = REQUIRED.filter(k => typeof s[k] !== 'function');
  return { ok: missing.length === 0, missing: missing };
}

function assertStore(store) {
  const v = validate(store);
  if (!v.ok) {
    const e = new Error('BIZ_STORE_CONTRACT_INVALID:' + v.missing.join(','));
    e.code = 'BIZ_STORE_CONTRACT_INVALID';
    e.missing = v.missing;
    throw e;
  }
  return true;
}

module.exports = { REQUIRED, validate, assertStore };
