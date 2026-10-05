/* =====================================================================
   core/db/postgres-port.js — core/db/port.js 계약의 실제 PostgreSQL 구현
   ---------------------------------------------------------------------
   목표 : flow 를 한 줄도 고치지 않고 pglite 자리에 실제 DB 를 끼운다.

   ── 설계 결정 ────────────────────────────────────────────────────────
   1) CORE 는 여전히 의존성이 없습니다.
      `pg` 를 이 파일에서 직접 require 하지 않고, 호출자가 **pool 을 주입**하는
      길을 먼저 둡니다. connectionString 만 준 경우에만 지연 require 합니다.
      → Next.js 같은 호스트는 자기 pg 인스턴스를 그대로 넘기면 됩니다.

   2) 쓰기는 전부 `pay_*` RPC 입니다. 이 파일은 SQL 을 조립하지 않습니다.
      테이블에 직접 INSERT/UPDATE 하는 코드가 여기에 없다는 것이 설계의 일부입니다.

   3) 트랜잭션 경계는 `withActor` 하나뿐입니다 (flow 가 쓰기를 전부 여기로 보냅니다).
      전용 client 를 풀에서 꺼내 BEGIN → pay_set_actor → fn → COMMIT/ROLLBACK →
      release 합니다. `pay_set_actor` 는 트랜잭션 지역 설정이라(10_actor.sql)
      풀로 돌아간 연결에 actor 가 남지 않습니다.

   4) 읽기는 트랜잭션 없이 pool 로 나갑니다 (pglite 구현과 같은 모양).

   5) 오류는 **메시지를 보존**합니다. flow 의 codeOf 가 메시지에서 PAY_* 를
      뽑아 쓰기 때문입니다. 거기에 더해 SQLSTATE 를 CORE 코드로 매핑해 `code`
      에 얹습니다. 연결 문자열이 메시지에 섞이면 지웁니다.

   6) 타입 : pglite 와 같은 모양으로 돌려주려고 int8 만 Number 로 바꿉니다
      (pg 는 문자열, pglite 는 숫자). numeric 은 두 쪽 다 문자열이고 flow 가
      Number() 로 감싸므로 건드리지 않습니다. **전역 pg.types 를 바꾸지 않고**
      pool 안에서만 적용합니다 — 같은 프로세스의 다른 앱에 영향이 없어야 합니다.

   ── 쓰지 않는 것 ─────────────────────────────────────────────────────
   · 상품 · 전자책 · 고객 개인정보 — CORE 는 그런 것을 모릅니다 (ADAPTER 몫).
   · 고객 JWT 를 흉내 내지 않습니다. 이 연결은 서버측 신뢰 경계입니다.
   ===================================================================== */
'use strict';

const port = require('./port');

/* ── 오류 매핑 ───────────────────────────────────────────────────────
   RPC 가 raise 한 PAY_* 는 그대로 둡니다. 그 밖의 DB 사정만 코드로 옮깁니다. */
const SQLSTATE = {
  '23505': 'PAY_DB_UNIQUE_VIOLATION',   /* unique_violation      */
  '23503': 'PAY_DB_FK_VIOLATION',       /* foreign_key_violation */
  '23514': 'PAY_DB_CHECK_VIOLATION',    /* check_violation       */
  '40001': 'PAY_DB_SERIALIZATION',      /* serialization_failure */
  '40P01': 'PAY_DB_DEADLOCK',           /* deadlock_detected     */
  '42501': 'PAY_DB_FORBIDDEN',          /* insufficient_privilege*/
  '55P03': 'PAY_DB_LOCK_NOT_AVAILABLE',
  '57014': 'PAY_DB_TIMEOUT',            /* query_canceled        */
  '53300': 'PAY_DB_UNAVAILABLE'         /* too_many_connections  */
};
const CONNECTION_CLASS = /^08/;         /* connection_exception  */

/* 메시지에 연결 문자열이 섞이면 지웁니다 (비밀번호가 들어 있을 수 있습니다) */
function scrub(text) {
  return String(text == null ? '' : text)
    .replace(/postgres(ql)?:\/\/[^\s'"]*/gi, 'postgres://<가림>');
}

function normalizeError(e, where) {
  const raw = (e && e.message) || String(e);
  const msg = scrub(raw);
  /* RPC 가 던진 약속된 코드는 그대로 살립니다 */
  const pay = /(PAY_[A-Z_]+)/.exec(raw);
  let code;
  if (pay) code = pay[1];
  else if (e && e.code && SQLSTATE[e.code]) code = SQLSTATE[e.code];
  else if (e && e.code && CONNECTION_CLASS.test(String(e.code))) code = 'PAY_DB_UNAVAILABLE';
  else if (e && (e.code === 'ETIMEDOUT' || e.code === 'ECONNRESET' || e.code === 'ENOTFOUND')) code = 'PAY_DB_UNAVAILABLE';
  else code = 'PAY_DB_ERROR';

  const out = new Error(msg);
  out.code = code;
  out.sqlstate = e && e.code ? String(e.code) : null;
  out.where = where || null;
  return out;
}

function one(rows) { return rows && rows.length ? rows[0] : null; }

/* int8 을 숫자로 — pglite 와 같은 모양을 만들기 위해서입니다.
   pool 안에서만 쓰이고 전역 pg.types 는 건드리지 않습니다. */
function makeTypes(pg) {
  const base = pg && pg.types;
  if (!base || typeof base.getTypeParser !== 'function') return undefined;
  return {
    getTypeParser: function (oid, format) {
      if (oid === 20) return (v) => (v === null ? null : Number(v));   /* int8 */
      return base.getTypeParser(oid, format);
    }
  };
}

/**
 * @param {object} opts
 *   opts.pool              이미 만든 pg Pool (권장 — 호스트가 수명을 관리)
 *   opts.connectionString  pool 이 없을 때만. 이 경우에만 pg 를 지연 require 합니다.
 *   opts.poolOptions       connectionString 으로 만들 때 넘길 추가 옵션
 *   opts.pg                pg 모듈을 직접 주입하고 싶을 때
 */
function createPostgresPort(opts) {
  const o = opts || {};
  let pool = o.pool || null;
  let ownsPool = false;

  if (!pool) {
    if (!o.connectionString) {
      const e = new Error('PAY_DB_PORT_NO_CONNECTION');
      e.code = 'PAY_DB_PORT_NO_CONNECTION';
      throw e;
    }
    let pg = o.pg;
    if (!pg) {
      try { pg = require('pg'); }
      catch (err) {
        const e = new Error('PAY_DB_DRIVER_MISSING: pg 모듈이 없습니다. pool 을 주입하거나 pg 를 설치하십시오.');
        e.code = 'PAY_DB_DRIVER_MISSING';
        throw e;
      }
    }
    pool = new pg.Pool(Object.assign({
      connectionString: o.connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      statement_timeout: 15000,
      types: makeTypes(pg)
    }, o.poolOptions || {}));
    ownsPool = true;
    /* 풀이 죽은 연결을 버릴 때 프로세스가 내려가지 않게 합니다 */
    pool.on('error', function () { /* 다음 요청에서 정상적으로 다시 잡습니다 */ });
  }

  const q = async (sql, params) => pool.query(sql, params || []);

  /* 트랜잭션 핸들(또는 pool) 위에서 도는 쓰기 모음 — 전부 RPC 입니다 */
  function writers(run, label) {
    const call = async (name, sql, params) => {
      try { return one((await run(sql, params)).rows); }
      catch (e) { throw normalizeError(e, (label || 'pool') + '.' + name); }
    };
    return {
      orderCreate: (tenant, userRef, orderNo, amount, currency, productRef, adapterMeta, requestId) =>
        call('orderCreate', 'select * from pay_order_create($1,$2,$3,$4,$5,$6,$7,$8)',
          [tenant, userRef, orderNo, amount, currency, productRef, adapterMeta == null ? null : JSON.stringify(adapterMeta), requestId]),

      intentCreate: async function (tenant, orderId, provider, providerOrderId) {
        try {
          /* 이미 열린 시도가 있었는지 먼저 봅니다 — RPC 가 그것을 재사용하기 때문에
             '새로 만든 것인지' 를 호출자가 알 수 있어야 합니다 (flow/prepare.js) */
          const before = one((await run(
            "select id from pay_intents where order_id = $1 and tenant = $2 and status in ('requested','confirming') order by attempt desc limit 1",
            [orderId, tenant])).rows);
          const row = one((await run('select * from pay_intent_create($1,$2,$3,$4)',
            [tenant, orderId, provider, providerOrderId])).rows);
          if (row) row.__reused = !!(before && before.id === row.id);
          return row;
        } catch (e) { throw normalizeError(e, (label || 'pool') + '.intentCreate'); }
      },

      intentBeginConfirm: (tenant, intentId) =>
        call('intentBeginConfirm', 'select * from pay_intent_begin_confirm($1,$2)', [tenant, intentId]),
      intentMarkConfirmed: (tenant, intentId, paymentKey, providerAmount) =>
        call('intentMarkConfirmed', 'select * from pay_intent_mark_confirmed($1,$2,$3,$4)', [tenant, intentId, paymentKey, providerAmount]),
      intentMarkFailed: (tenant, intentId, code) =>
        call('intentMarkFailed', 'select * from pay_intent_mark_failed($1,$2,$3)', [tenant, intentId, code]),
      intentMarkConflicted: (tenant, intentId, paymentKey, detail) =>
        call('intentMarkConflicted', 'select * from pay_intent_mark_conflicted($1,$2,$3,$4)',
          [tenant, intentId, paymentKey, detail == null ? null : JSON.stringify(detail)]),

      exceptionOpen: (tenant, orderId, intentId, kind, provider, paymentKey, detail) =>
        call('exceptionOpen', 'select * from pay_exception_open($1,$2,$3,$4,$5,$6,$7)',
          [tenant, orderId, intentId, kind, provider, paymentKey, detail == null ? null : JSON.stringify(detail)]),
      exceptionResolve: (tenant, exceptionId, transactionKey, detail) =>
        call('exceptionResolve', 'select * from pay_exception_resolve($1,$2,$3,$4)',
          [tenant, exceptionId, transactionKey, detail == null ? null : JSON.stringify(detail)]),
      exceptionNeedsOperator: (tenant, exceptionId, code, indeterminate, detail) =>
        call('exceptionNeedsOperator', 'select * from pay_exception_needs_operator($1,$2,$3,$4,$5)',
          [tenant, exceptionId, code, indeterminate, detail == null ? null : JSON.stringify(detail)]),
      exceptionClose: (tenant, exceptionId, actorRef, reason, providerChecked, providerStatus, providerTx) =>
        call('exceptionClose', 'select * from pay_exception_close($1,$2,$3,$4,$5,$6,$7)',
          [tenant, exceptionId, actorRef, reason, providerChecked, providerStatus, providerTx]),

      orderCancel: (tenant, orderId, reason) =>
        call('orderCancel', 'select * from pay_order_cancel($1,$2,$3)', [tenant, orderId, reason]),
      orderMarkRefunded: (tenant, orderId, provider, paymentKey, txKey, amount, attemptId, reason) =>
        call('orderMarkRefunded', 'select * from pay_order_mark_refunded($1,$2,$3,$4,$5,$6,$7,$8)',
          [tenant, orderId, provider, paymentKey, txKey, amount, attemptId, reason]),

      refundAttemptBegin: (tenant, orderId, provider, paymentKey, amount, reason, actorRef) =>
        call('refundAttemptBegin', 'select * from pay_refund_attempt_begin($1,$2,$3,$4,$5,$6,$7)',
          [tenant, orderId, provider, paymentKey, amount, reason, actorRef]),
      refundAttemptSucceeded: (tenant, attemptId, transactionKey) =>
        call('refundAttemptSucceeded', 'select * from pay_refund_attempt_succeeded($1,$2,$3)', [tenant, attemptId, transactionKey]),
      refundAttemptOutcome: (tenant, attemptId, status, code) =>
        call('refundAttemptOutcome', 'select * from pay_refund_attempt_outcome($1,$2,$3,$4)', [tenant, attemptId, status, code]),

      hookStart: (tenant, orderId, hook, eventName, payload) =>
        call('hookStart', 'select * from pay_hook_start($1,$2,$3,$4,$5)',
          [tenant, orderId, hook, eventName, payload == null ? null : JSON.stringify(payload)]),
      hookDelivered: (tenant, deliveryId) =>
        call('hookDelivered', 'select * from pay_hook_delivered($1,$2)', [tenant, deliveryId]),
      hookFailed: (tenant, deliveryId, code) =>
        call('hookFailed', 'select * from pay_hook_failed($1,$2,$3)', [tenant, deliveryId, code])
    };
  }

  const base = writers(q, 'pool');

  const read = async (name, sql, params) => {
    try { return (await q(sql, params)).rows; }
    catch (e) { throw normalizeError(e, 'read.' + name); }
  };

  const api = {
    /* ── 트랜잭션 경계는 여기 하나뿐입니다 ── */
    withActor: async function (actor, fn) {
      port.assertActor(actor);
      const client = await pool.connect().catch((e) => { throw normalizeError(e, 'connect'); });
      let done = false;
      try {
        await client.query('begin');
        await client.query('select pay_set_actor($1)', [actor]);
        const result = await fn(writers((sql, params) => client.query(sql, params || []), 'tx'));
        await client.query('commit');
        done = true;
        return result;
      } catch (e) {
        if (!done) { try { await client.query('rollback'); } catch (ignore) { /* 이미 끊겼을 수 있습니다 */ } }
        throw (e && e.code && /^PAY_/.test(String(e.code))) ? e : normalizeError(e, 'withActor');
      } finally {
        client.release();
      }
    },

    /* ── 읽기 ── */
    getOrder: async (tenant, orderId) =>
      one(await read('getOrder', 'select * from pay_orders where id = $1 and tenant = $2', [orderId, tenant])),
    getOpenIntent: async (tenant, orderId) =>
      one(await read('getOpenIntent',
        "select * from pay_intents where order_id = $1 and tenant = $2 and status in ('requested','confirming') order by attempt desc limit 1",
        [orderId, tenant])),
    getIntents: (tenant, orderId) =>
      read('getIntents', 'select * from pay_intents where order_id = $1 and tenant = $2 order by attempt', [orderId, tenant]),
    getExceptions: (tenant, orderId) =>
      read('getExceptions', 'select * from pay_exceptions where order_id = $1 and tenant = $2 order by created_at', [orderId, tenant]),
    getPaymentRecord: async (tenant, orderId) =>
      one(await read('getPaymentRecord',
        "select * from pay_records where order_id = $1 and tenant = $2 and kind = 'payment' order by created_at limit 1",
        [orderId, tenant])),
    getRefundAttempts: (tenant, orderId) =>
      read('getRefundAttempts', 'select * from pay_refund_attempts where order_id = $1 and tenant = $2 order by created_at', [orderId, tenant]),
    getExceptionAudit: (tenant, exceptionId) =>
      read('getExceptionAudit', 'select * from pay_exception_audit where exception_id = $1 and tenant = $2 order by id', [exceptionId, tenant]),
    getHookDeliveries: (tenant, orderId) =>
      read('getHookDeliveries', 'select * from pay_hook_deliveries where order_id = $1 and tenant = $2 order by created_at', [orderId, tenant]),
    getOperations: async function (tenant, olderThan) {
      if (olderThan) {
        return read('getOperations', 'select * from pay_stale_operations($1, $2::interval) order by since', [tenant, olderThan]);
      }
      return read('getOperations', 'select * from pay_operations where tenant = $1 order by since', [tenant]);
    },

    /* ── 트랜잭션 밖 쓰기 (actor = system · pglite 구현과 같은 모양) ── */
    orderCreate: base.orderCreate,
    intentCreate: base.intentCreate,
    intentBeginConfirm: base.intentBeginConfirm,
    intentMarkConfirmed: base.intentMarkConfirmed,
    intentMarkFailed: base.intentMarkFailed,
    intentMarkConflicted: base.intentMarkConflicted,
    exceptionOpen: base.exceptionOpen,
    exceptionResolve: base.exceptionResolve,
    exceptionNeedsOperator: base.exceptionNeedsOperator,
    exceptionClose: base.exceptionClose,
    orderCancel: base.orderCancel,
    orderMarkRefunded: base.orderMarkRefunded,
    refundAttemptBegin: base.refundAttemptBegin,
    refundAttemptSucceeded: base.refundAttemptSucceeded,
    refundAttemptOutcome: base.refundAttemptOutcome,
    hookStart: base.hookStart,
    hookDelivered: base.hookDelivered,
    hookFailed: base.hookFailed
  };

  /* 계약을 지키는지 스스로 확인합니다 — 빠진 함수가 있으면 여기서 멈춥니다 */
  port.assertPort(api);

  /* 수명 관리 (계약 밖 · 호스트용). 주입받은 pool 은 닫지 않습니다. */
  Object.defineProperty(api, '__pool', { value: pool, enumerable: false });
  Object.defineProperty(api, 'health', {
    enumerable: false,
    value: async function () {
      try {
        const r = await q('select 1 as ok, current_user as who, current_setting(\'server_version\') as version');
        return { ok: true, who: r.rows[0].who, version: r.rows[0].version };
      } catch (e) { const n = normalizeError(e, 'health'); return { ok: false, code: n.code, message: n.message }; }
    }
  });
  Object.defineProperty(api, 'end', {
    enumerable: false,
    value: async function () { if (ownsPool) { try { await pool.end(); } catch (e) { /* 이미 닫혔을 수 있습니다 */ } } }
  });

  return api;
}

module.exports = { createPostgresPort, normalizeError, SQLSTATE };
