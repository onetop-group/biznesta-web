/* =====================================================================
   core/log.js — 안전 로깅 (STEP 1)
   ---------------------------------------------------------------------
   원칙 : 「마스킹을 잊지 않는다」가 아니라 「마스킹을 거치지 않으면 못 나간다」.
   · 로그로 나가는 모든 값은 safe() 를 통과합니다.
   · 3중 방어
       ① 값 기반 — register() 로 등록된 secret 문자열은 어디에 있어도 치환
       ② 패턴 기반 — PG 키/카드/이메일/전화/JWT 형태는 등록 없이도 치환
       ③ 이름 기반 — secret · key · token · password · authorization · card · email … 키 이름이면 값 통째로 치환
   · 원문을 '앞 n자만' 남기는 식의 부분 노출도 하지 않습니다. 남기는 것은 분류(mode/kind)뿐입니다.
   ===================================================================== */
'use strict';

const MASK = '***';
const SECRETS = new Set();   /* 값 기반 치환 대상 (원문은 여기에만 있고 출력되지 않음) */

/* ENV guard 가 키를 읽는 즉시 등록합니다. 8자 미만은 오탐이 커서 받지 않습니다. */
function register(value) {
  const v = value == null ? '' : String(value).trim();
  if (v.length >= 8) SECRETS.add(v);
  return v.length >= 8;
}
function clearRegistry() { SECRETS.clear(); }

/* 이름만 봐도 값을 통째로 가려야 하는 필드 */
const SENSITIVE_NAME = /(secret|password|passwd|authorization|auth|token|credential|apikey|api_key|privatekey|cookie|session)/i;
const KEYLIKE_NAME   = /(^|_)(key)$|key$/i;           /* secretKey · clientKey · paymentKey … */
const PII_NAME       = /(email|phone|mobile|tel|ssn|rrn|birth|name|address|card|cvc|cvv|pan)/i;
/* 이름이 key 로 끝나도 가리지 않는 안전 필드 (이미 분류·마스킹된 값) */
const KEY_NAME_ALLOW = /^(idempotencyKey|orderKey|cacheKey|maskedKey|keyMode|keyKind)$/;

/* 값만 봐도 가려야 하는 형태 */
const PAT = [
  /* PG 키 : 분류(test/live + sk|gsk|ck|gck)만 남기고 본문 제거 */
  { re: new RegExp('\\b(test|live)_(gsk|gck|sk|ck)_[A-Za-z0-9+/=_-]{4,}', 'g'), to: (m, a, b) => a + '_' + b + '_' + MASK },
  /* Basic/Bearer 헤더 */
  { re: new RegExp('\\b(Basic|Bearer)\\s+[A-Za-z0-9+/=._-]{8,}', 'g'), to: (m, a) => a + ' ' + MASK },
  /* JWT */
  { re: new RegExp('\\beyJ[A-Za-z0-9_-]{6,}\\.[A-Za-z0-9_-]{6,}\\.[A-Za-z0-9_-]{6,}', 'g'), to: () => 'jwt_' + MASK },
  /* 카드번호(구분자 포함) */
  { re: new RegExp('\\b(?:\\d[ -]?){13,19}\\b', 'g'), to: () => 'card_' + MASK },
  /* 이메일 */
  { re: new RegExp('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b', 'g'), to: () => 'email_' + MASK },
  /* 한국 휴대전화 */
  { re: new RegExp('\\b01[0-9][ -]?\\d{3,4}[ -]?\\d{4}\\b', 'g'), to: () => 'phone_' + MASK }
];

function escapeRe(s) { return String(s).replace(new RegExp('[.*+?^${}()|[\\]\\\\]', 'g'), '\\$&'); }

function redact(input) {
  if (input == null) return input;
  let s = String(input);
  SECRETS.forEach(function (sec) {
    if (s.indexOf(sec) >= 0) s = s.split(sec).join(MASK);
    /* base64(secret + ':') — Basic auth 로 변형된 형태까지 */
    let b64 = '';
    try { b64 = Buffer.from(sec + ':').toString('base64'); } catch (e) {}
    if (b64 && s.indexOf(b64) >= 0) s = s.split(b64).join(MASK);
  });
  PAT.forEach(function (p) { s = s.replace(p.re, p.to); });
  return s;
}

/* 객체 전체를 재귀적으로 안전화. 순환 참조·과대 크기도 여기서 끊습니다. */
function safe(value, _depth, _seen) {
  const depth = _depth || 0;
  const seen = _seen || new Set();
  if (depth > 6) return '[depth]';
  if (value == null) return value;
  const t = typeof value;
  if (t === 'string') return redact(value).slice(0, 500);
  if (t === 'number' || t === 'boolean') return value;
  if (t === 'function') return '[fn]';
  if (t === 'bigint' || t === 'symbol') return String(value);
  if (value instanceof Error) return { name: value.name, code: value.code || null, message: redact(value.message).slice(0, 200) };
  if (seen.has(value)) return '[circular]';
  seen.add(value);
  if (Array.isArray(value)) return value.slice(0, 50).map(v => safe(v, depth + 1, seen));
  const out = {};
  Object.keys(value).slice(0, 60).forEach(function (k) {
    const sensitive = SENSITIVE_NAME.test(k) || PII_NAME.test(k) || (KEYLIKE_NAME.test(k) && !KEY_NAME_ALLOW.test(k));
    out[k] = sensitive ? MASK : safe(value[k], depth + 1, seen);
  });
  return out;
}

/* 로그 sink 는 주입 가능 (테스트에서 가로채 검사합니다) */
const DEFAULT_SINK = function (line) { console.log(line); };
let SINK = DEFAULT_SINK;
/* null 을 주면 기본 sink 로 되돌립니다 (테스트가 가로챈 뒤 복원할 수 있어야 합니다) */
function setSink(fn) { SINK = typeof fn === 'function' ? fn : DEFAULT_SINK; }

function emit(level, event, fields) {
  const rec = { t: new Date().toISOString(), level: level, event: String(event).slice(0, 80), data: safe(fields || {}) };
  let line;
  try { line = JSON.stringify(rec); } catch (e) { line = JSON.stringify({ t: rec.t, level: level, event: rec.event, data: '[unserializable]' }); }
  SINK(redact(line));   /* ★ 직렬화 이후 한 번 더 통과시킵니다 (키 이름을 못 맞춘 경우 대비) */
  return line;
}

module.exports = {
  register, clearRegistry, redact, safe, setSink, MASK,
  info: (e, f) => emit('info', e, f),
  warn: (e, f) => emit('warn', e, f),
  error: (e, f) => emit('error', e, f)
};
