/* =====================================================================
   biznesta/sql-store.js — store-port 계약의 SQL 구현
   ---------------------------------------------------------------------
   query(sql, params) 하나만 주입받습니다. 그래서 같은 코드가
     · 실제 Supabase (pg Pool)
     · 격리 검증용 pglite
   둘 다에서 그대로 돕니다. 구현을 두 벌 만들면 둘이 어긋납니다.

   ★ 이 파일은 pay_* 를 직접 쓰지 않습니다. 결제 상태 확인은 DB 함수
     biz_entitlement_grant 안에서 일어납니다 (서버가 건너뛸 수 없게).
   ===================================================================== */
'use strict';

const token = require('./token');

/* DB 오류 → BIZ_* 코드. 메시지 안의 BIZ_* 를 그대로 살립니다. */
function codeOf(e) {
  const msg = String((e && e.message) || '');
  const m = new RegExp('(BIZ_[A-Z_]+)').exec(msg);
  if (m) return m[1];
  const sqlstate = e && e.code ? String(e.code) : '';
  if (sqlstate === '23505') return 'BIZ_DB_UNIQUE_VIOLATION';
  if (sqlstate === '23503') return 'BIZ_DB_FOREIGN_KEY';
  if (sqlstate === '23514') return 'BIZ_DB_CHECK_VIOLATION';
  if (sqlstate === '42501') return 'BIZ_DB_FORBIDDEN';
  return 'BIZ_DB_ERROR';
}

function wrap(e, where) {
  const code = codeOf(e);
  /* 원본 메시지에 접속 문자열이나 토큰이 섞이지 않게 잘라 씁니다 */
  const err = new Error(code + ':' + where);
  err.code = code;
  err.where = where;
  return err;
}

function rowsOf(r) {
  if (!r) return [];
  return Array.isArray(r) ? r : (r.rows || []);
}
function one(r) {
  const rows = rowsOf(r);
  return rows.length ? rows[0] : null;
}

function createSqlStore(query) {
  if (typeof query !== 'function') throw new Error('BIZ_STORE_QUERY_REQUIRED');
  const q = (sql, params) => Promise.resolve(query(sql, params || []));

  const store = {
    /* ── 상품 정본 ─────────────────────────────────────────────
       ★ 인자에 금액이 없습니다. 값은 언제나 이 표에서만 나옵니다. */
    getProduct: async function (productRef) {
      if (typeof productRef !== 'string' || !productRef) return null;
      let r;
      try {
        r = await q('select product_ref, name, amount, currency, active from biz_products where product_ref = $1', [productRef]);
      } catch (e) { throw wrap(e, 'getProduct'); }
      const row = one(r);
      if (!row) return null;
      return {
        productRef: row.product_ref,
        amount: Number(row.amount),
        currency: String(row.currency).trim().toUpperCase(),
        name: row.name,
        active: row.active === true
      };
    },

    listProducts: async function (opts) {
      const activeOnly = !(opts && opts.activeOnly === false);
      let r;
      try {
        r = await q('select product_ref, name, amount, currency, active from biz_products'
          + (activeOnly ? ' where active = true' : '') + ' order by product_ref', []);
      } catch (e) { throw wrap(e, 'listProducts'); }
      return rowsOf(r).map(row => ({
        productRef: row.product_ref, amount: Number(row.amount),
        currency: String(row.currency).trim().toUpperCase(), name: row.name, active: row.active === true
      }));
    },

    /* ── 구매자 ────────────────────────────────────────────────
       이메일은 여기까지만 옵니다. 반환값(uuid)만 CORE 로 갑니다. */
    upsertBuyer: async function (email) {
      let r;
      try { r = await q('select biz_buyer_upsert($1) as id', [email]); }
      catch (e) { throw wrap(e, 'upsertBuyer'); }
      const row = one(r);
      if (!row || !row.id) throw wrap(new Error('BIZ_BUYER_UPSERT_FAILED'), 'upsertBuyer');
      return row.id;
    },

    buyerExists: async function (buyerId) {
      if (!isUuid(buyerId)) return false;
      let r;
      try { r = await q('select 1 as ok from biz_buyers where id = $1', [buyerId]); }
      catch (e) { throw wrap(e, 'buyerExists'); }
      return rowsOf(r).length > 0;
    },

    /* ── 권한 발급 ─────────────────────────────────────────────
       ★ tokenHash 만 넘깁니다. 토큰 원문은 DB 연결을 타지 않습니다. */
    grantEntitlement: async function (a) {
      const args = a || {};
      if (!token.isHash(args.tokenHash)) {
        const e = new Error('BIZ_TOKEN_HASH_INVALID:grantEntitlement');
        e.code = 'BIZ_TOKEN_HASH_INVALID';
        throw e;
      }
      let before = null;
      try {
        before = one(await q('select id from biz_entitlements where order_id = $1 and product_ref = $2',
          [args.orderId, args.productRef]));
      } catch (e) { throw wrap(e, 'grantEntitlement.probe'); }

      let r;
      try {
        r = await q('select * from biz_entitlement_grant($1,$2,$3,$4)',
          [args.orderId, args.productRef, args.buyerId, args.tokenHash]);
      } catch (e) { throw wrap(e, 'grantEntitlement'); }

      const row = one(r);
      if (!row || !row.id) throw wrap(new Error('BIZ_ENTITLEMENT_NOT_CREATED'), 'grantEntitlement');
      /* created=false 면 이미 있던 권한입니다 — 새 토큰은 버려야 합니다 */
      return { row: row, created: !before };
    },

    revokeEntitlements: async function (orderId, reason) {
      let r;
      try { r = await q('select biz_entitlement_revoke($1,$2) as n', [orderId, reason || null]); }
      catch (e) { throw wrap(e, 'revokeEntitlements'); }
      const row = one(r);
      return row ? Number(row.n) : 0;
    },

    /* ★ 인자는 해시입니다. 원문을 받는 함수는 이 계약에 없습니다. */
    findByTokenHash: async function (tokenHash) {
      if (!token.isHash(tokenHash)) return null;
      let r;
      try { r = await q('select * from biz_entitlement_by_token($1)', [tokenHash]); }
      catch (e) { throw wrap(e, 'findByTokenHash'); }
      return one(r);
    },

    getEntitlements: async function (orderId) {
      let r;
      try {
        r = await q('select id, tenant, order_id, product_ref, buyer_id, granted_at, revoked_at, revoked_reason'
          + ' from biz_entitlements where order_id = $1 order by granted_at', [orderId]);
      } catch (e) { throw wrap(e, 'getEntitlements'); }
      return rowsOf(r);
    }
  };

  return store;
}

function isUuid(v) {
  return typeof v === 'string' && new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', 'i').test(v);
}

module.exports = { createSqlStore, codeOf, isUuid };
