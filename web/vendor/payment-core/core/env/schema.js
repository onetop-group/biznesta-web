/* =====================================================================
   core/env/schema.js — 환경변수 계약 · 키 분류 (STEP 2)
   ---------------------------------------------------------------------
   ★ 이 파일의 키 분류는 오직 '검증'에만 씁니다.
     결제 방식을 '결정'하는 것은 PAY_METHOD 선언뿐입니다 (guard.resolveMethod).
     분류 결과와 선언이 다르면 조용히 따라가지 않고 PG_METHOD_KEY_MISMATCH 로 멈춥니다.

   PAY_ENV      test | live    이 배포가 어떤 환경인지 '선언'
   PAY_METHOD   widget | window 결제 방식 '선언' (추론 금지)
   PAY_PROVIDER toss            (기본 toss)
   PAY_SECRET_KEY         서버 전용
   PAY_PUBLIC_CLIENT_KEY  브라우저 공개
   ===================================================================== */
'use strict';

const ENVS = ['test', 'live'];
const METHODS = ['widget', 'window'];
const PROVIDERS = ['toss'];

const VARS = {
  PAY_ENV:               { required: true,  secret: false, enum: ENVS,      desc: '배포 환경 선언' },
  PAY_METHOD:            { required: true,  secret: false, enum: METHODS,   desc: '결제 방식 선언' },
  PAY_PROVIDER:          { required: false, secret: false, enum: PROVIDERS, default: 'toss', desc: 'PG 사업자' },
  PAY_SECRET_KEY:        { required: true,  secret: true,  role: 'secret',  desc: '서버 전용 비밀키' },
  PAY_PUBLIC_CLIENT_KEY: { required: true,  secret: false, role: 'client',  desc: '브라우저 공개키' }
};

/* 공개 번들에 실릴 수 있는 이름 접두사 — 여기에 secret 이 들어오면 즉시 차단합니다.
   (PURPLE SAJU server/env.js 의 leakedServiceKeyNames 패턴을 결제용으로 새로 씀) */
const PUBLIC_PREFIXES = ['PUBLIC_', 'NEXT_PUBLIC_', 'VITE_', 'REACT_APP_', 'EXPO_PUBLIC_'];

/* ── 키 접두사 분류표 ──────────────────────────────────────────
   sk  = 서버 비밀 · API 개별연동(window)
   gsk = 서버 비밀 · 결제위젯(widget)
   ck  = 공개 · API 개별연동(window)
   gck = 공개 · 결제위젯(widget)
   ------------------------------------------------------------- */
const PREFIX_TABLE = [
  { re: new RegExp('^(test|live)_gsk_'), role: 'secret', method: 'widget' },
  { re: new RegExp('^(test|live)_gck_'), role: 'client', method: 'widget' },
  { re: new RegExp('^(test|live)_sk_'),  role: 'secret', method: 'window' },
  { re: new RegExp('^(test|live)_ck_'),  role: 'client', method: 'window' }
];

/* 키 문자열 → { recognized, mode, role, method, prefix }
   ★ 돌려주는 값에 키 본문은 없습니다. 분류 결과만 있습니다. */
function classifyKey(value) {
  const v = value == null ? '' : String(value).trim();
  if (!v) return { recognized: false, mode: null, role: null, method: null, prefix: null, present: false };
  const mode = new RegExp('^live_').test(v) ? 'live' : (new RegExp('^test_').test(v) ? 'test' : null);
  for (let i = 0; i < PREFIX_TABLE.length; i++) {
    const row = PREFIX_TABLE[i];
    if (row.re.test(v)) {
      const m = v.split('_');
      return { recognized: true, mode: mode, role: row.role, method: row.method, prefix: m[0] + '_' + m[1] + '_', present: true };
    }
  }
  return { recognized: false, mode: mode, role: null, method: null, prefix: null, present: true };
}

/* 로그·보고서용 표시값. 키 본문은 절대 나가지 않습니다. */
function maskKey(value) {
  const c = classifyKey(value);
  if (!c.present) return null;
  if (!c.recognized) return (c.mode ? c.mode + '_' : '') + 'unrecognized_***';
  return c.prefix + '***';
}

function names() { return Object.keys(VARS); }
function secretNames() { return names().filter(n => VARS[n].secret); }

module.exports = { ENVS, METHODS, PROVIDERS, VARS, PUBLIC_PREFIXES, PREFIX_TABLE, classifyKey, maskKey, names, secretNames };
