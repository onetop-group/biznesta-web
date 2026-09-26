/* =====================================================================
   core/order/number.js — 주문번호 채번 (STEP 3 · P-8)
   ---------------------------------------------------------------------
   역할 분담
     ADAPTER → orderPrefix 만 제공          ('BB', 'PS', …)
     CORE    → 실제 채번 · 충돌 방지 · 형식 검증 · 재시도

   서비스마다 주문번호 알고리즘을 다시 짜지 않도록, 생성은 여기 한 곳에만 있습니다.

   형식 : <PREFIX>-<YYMMDD>-<RAND6>
     PREFIX  대문자/숫자 2~8자 (ADAPTER)
     YYMMDD  UTC 날짜 (운영 지역이 달라도 같은 값)
     RAND6   Crockford Base32 6자 — I·L·O·U 제외(사람이 읽고 불러줄 수 있게)
             32^6 ≈ 10.7억. 같은 날 같은 prefix 안에서만 충돌하면 되므로 충분하고,
             그래도 충돌하면 DB unique 제약이 잡고 CORE 가 재시도합니다.
   ===================================================================== */
'use strict';

const crypto = require('crypto');

/* Crockford Base32 — I, L, O, U 없음 */
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const RAND_LEN = 6;
const PREFIX_RE = new RegExp('^[A-Z][A-Z0-9]{1,7}$');
const FORMAT_RE = new RegExp('^[A-Z][A-Z0-9]{1,7}-[0-9]{6}-[0-9A-HJKMNP-TV-Z]{6}$');
const DEFAULT_ATTEMPTS = 5;

function err(code, detail) {
  const e = new Error(code + (detail ? ':' + detail : ''));
  e.code = code;
  return e;
}

function assertPrefix(prefix) {
  const p = String(prefix || '').trim().toUpperCase();
  if (!PREFIX_RE.test(p)) throw err('PAY_ORDER_PREFIX_MALFORMED', p || 'empty');
  return p;
}

function datePart(now) {
  const d = now instanceof Date ? now : new Date(now == null ? Date.now() : now);
  if (!Number.isFinite(d.getTime())) throw err('PAY_ORDER_NO_BAD_DATE');
  const yy = String(d.getUTCFullYear() % 100).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return yy + mm + dd;
}

/* 편향 없는 난수 문자열. rng 를 주입하면 테스트에서 재현 가능합니다. */
function randomPart(rng) {
  const bytes = typeof rng === 'function' ? rng(RAND_LEN) : crypto.randomBytes(RAND_LEN);
  let out = '';
  for (let i = 0; i < RAND_LEN; i++) {
    /* 256 = 32 × 8 → 나머지 연산에 편향이 없습니다 */
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

/* 후보 1개 생성 */
function make(options) {
  const o = options || {};
  const prefix = assertPrefix(o.prefix);
  const no = prefix + '-' + datePart(o.now) + '-' + randomPart(o.rng);
  if (!FORMAT_RE.test(no)) throw err('PAY_ORDER_NO_MALFORMED', no);
  return no;
}

function isValid(no) { return typeof no === 'string' && FORMAT_RE.test(no); }

/* 주문번호를 다시 쪼갭니다 (로그·조회용) */
function parse(no) {
  if (!isValid(no)) return null;
  const parts = String(no).split('-');
  return { prefix: parts[0], date: parts[1], random: parts[2] };
}

/* ---------------------------------------------------------------------
   충돌 방지 + 재시도.
   insert 는 호출자가 주입합니다 — CORE 는 DB 종류를 모릅니다.
     insert(orderNo) → Promise<any>            성공하면 그 결과를 그대로 반환
     isConflict(err)  → boolean                 unique 위반인지 판별 (기본: 23505)
   unique 제약이 '진짜' 게이트이고, 여기서는 그 충돌을 흡수합니다.
   --------------------------------------------------------------------- */
async function createWithRetry(options) {
  const o = options || {};
  if (typeof o.insert !== 'function') throw err('PAY_ORDER_INSERT_REQUIRED');
  const attempts = Number(o.attempts) > 0 ? Number(o.attempts) : DEFAULT_ATTEMPTS;
  const isConflict = typeof o.isConflict === 'function'
    ? o.isConflict
    : function (e) { return !!e && (e.code === '23505' || new RegExp('duplicate key|unique', 'i').test(String(e.message || ''))); };

  const tried = [];
  for (let i = 0; i < attempts; i++) {
    const no = make(o);
    tried.push(no);
    try {
      const result = await o.insert(no);
      return { ok: true, orderNo: no, result: result, attempts: i + 1, tried: tried };
    } catch (e) {
      if (!isConflict(e)) throw e;          /* 충돌이 아니면 그대로 올립니다 */
    }
  }
  throw err('PAY_ORDER_NO_COLLISION', String(attempts) + ' attempts');
}

module.exports = { make, isValid, parse, assertPrefix, createWithRetry, ALPHABET, FORMAT_RE, PREFIX_RE, RAND_LEN, DEFAULT_ATTEMPTS };
