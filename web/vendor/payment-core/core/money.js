/* =====================================================================
   core/money.js — 금액 불변식 (STEP 3 · P-9)
   ---------------------------------------------------------------------
   현재 범위 : KRW 정수. 다중통화 엔진을 만들지 않습니다.
   다만 '원 단위'를 코드에 박지 않고 minor unit 을 데이터로 둡니다
   (KRW=0 → 원). 뒷날 currency + minor unit 으로 넓힐 때 호출부를 고치지
   않아도 되도록, 금액을 다루는 함수는 처음부터 currency 를 함께 받습니다.

   불변식
     M-1 통화는 등록·활성화된 것만            (현재 KRW 하나)
     M-2 0 보다 커야 한다
     M-3 정수여야 한다 (부동소수점 금액 금지)
     M-4 유한하고 안전한 정수 범위여야 한다
     M-5 provider 전달 금액과 DB 기대 금액이 같아야 한다
   ===================================================================== */
'use strict';

const REGISTRY = { KRW: { minorUnit: 0, enabled: true } };
const MAX_MINOR = 9000000000000000;   /* Number.MAX_SAFE_INTEGER 아래 */

function err(code, detail) {
  const e = new Error(code + (detail ? ':' + detail : ''));
  e.code = code;
  return e;
}

function currencyInfo(code) {
  const c = String(code || '').toUpperCase();
  const row = Object.prototype.hasOwnProperty.call(REGISTRY, c) ? REGISTRY[c] : null;
  if (!row) throw err('PAY_CURRENCY_UNKNOWN', c || 'null');
  if (!row.enabled) throw err('PAY_CURRENCY_DISABLED', c);
  return { code: c, minorUnit: row.minorUnit };
}

/* 금액을 minor unit 정수로 확정합니다. 통과하지 못하면 throw. */
function assertAmount(value, currency) {
  const info = currencyInfo(currency);
  if (typeof value !== 'number') throw err('PAY_AMOUNT_NOT_NUMBER', typeof value);
  if (!Number.isFinite(value)) throw err('PAY_AMOUNT_NOT_FINITE', String(value));

  const scaled = value * Math.pow(10, info.minorUnit);
  if (!Number.isInteger(scaled)) throw err('PAY_AMOUNT_FRACTIONAL', String(value));
  if (scaled <= 0) throw err('PAY_AMOUNT_NOT_POSITIVE', String(value));
  if (scaled > MAX_MINOR || !Number.isSafeInteger(scaled)) throw err('PAY_AMOUNT_TOO_LARGE', String(value));
  return scaled;
}

/* 검사만 하고 결과를 돌려줍니다 (throw 하지 않는 형태가 필요한 곳용) */
function checkAmount(value, currency) {
  try { return { ok: true, minor: assertAmount(value, currency) }; }
  catch (e) { return { ok: false, code: e.code, message: e.message }; }
}

/* M-5 — 사업자가 알려온 금액과 DB 가 기대하는 금액이 같은가 */
function assertSameAmount(expected, actual, currency) {
  const a = assertAmount(expected, currency);
  const b = assertAmount(actual, currency);
  if (a !== b) throw err('PAY_AMOUNT_MISMATCH', a + '<>' + b);
  return a;
}

/* 사람이 읽는 표시 (로그·보고서용) */
function format(minor, currency) {
  const info = currencyInfo(currency);
  const div = Math.pow(10, info.minorUnit);
  const v = minor / div;
  return v.toLocaleString('en-US', { minimumFractionDigits: info.minorUnit, maximumFractionDigits: info.minorUnit }) + ' ' + info.code;
}

function currencies() { return Object.keys(REGISTRY).filter(c => REGISTRY[c].enabled); }

module.exports = { assertAmount, checkAmount, assertSameAmount, currencyInfo, currencies, format, MAX_MINOR };
