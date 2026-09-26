/* =====================================================================
   core/errors.js — BIZNESTA PAYMENT CORE · 오류 코드 표준화 (STEP 1)
   ---------------------------------------------------------------------
   · CORE 는 호출자에게 PG 사업자의 원문 메시지를 그대로 흘리지 않습니다.
     사업자마다 다른 실패를 '코드' 하나로 정규화해서 상위층이 사업자를 모르게 합니다.
   · provider 계층은 절대 throw 하지 않습니다 → { ok:false, code } 로만 돌려줍니다.
     (throw 는 ENV guard 처럼 '부팅을 멈춰야 하는' 곳에서만 씁니다.)
   · 도메인 용어 0. 서비스 이름 0.
   ===================================================================== */
'use strict';

/* ── PG 호출 실패 ─────────────────────────────────────────────── */
const PG = {
  NOT_CONFIGURED: 'PG_NOT_CONFIGURED',   /* 키가 없다 (호출 자체를 하지 않음)        */
  INVALID_ARGS:   'PG_INVALID_ARGS',     /* 인자 누락/형식 오류 (호출 전 차단)       */
  TIMEOUT:        'PG_TIMEOUT',          /* 응답 없음 → 상태 미확정. 실패로 보지 말 것 */
  UNREACHABLE:    'PG_UNREACHABLE',      /* 네트워크 도달 실패 → 상태 미확정          */
  DECLINED:       'PG_DECLINED',         /* 사업자가 명시적으로 거절 (확정 실패)      */
  BAD_RESPONSE:   'PG_BAD_RESPONSE',     /* 200 이지만 계약과 다른 응답              */
  HTTP:           'PG_HTTP_'             /* 그 외 HTTP → PG_HTTP_<status>           */
};

/* ── ENV guard (STEP 2) ───────────────────────────────────────── */
const ENV = {
  ENV_NOT_DECLARED:      'PG_ENV_NOT_DECLARED',       /* PAY_ENV 미선언                   */
  METHOD_NOT_DECLARED:   'PG_METHOD_NOT_DECLARED',    /* PAY_METHOD 미선언 (추론 금지)     */
  INVALID_VALUE:         'PG_ENV_INVALID_VALUE',      /* 허용 목록 밖의 값                 */
  KEY_MISSING:           'PG_KEY_MISSING',            /* 키 누락                          */
  KEY_UNRECOGNIZED:      'PG_KEY_UNRECOGNIZED',       /* 접두사를 해석할 수 없음           */
  KEY_ROLE_MISMATCH:     'PG_KEY_ROLE_MISMATCH',      /* secret 자리에 client 키 (혹은 반대) */
  KEY_MODE_MISMATCH:     'PG_KEY_MODE_MISMATCH',      /* secret 과 client 의 test/live 불일치 */
  TEST_KEY_IN_PRODUCTION:'PG_TEST_KEY_IN_PRODUCTION', /* live 환경에 test 키               */
  LIVE_KEY_IN_DEV:       'PG_LIVE_KEY_IN_DEV',        /* test 환경에 live 키               */
  METHOD_KEY_MISMATCH:   'PG_METHOD_KEY_MISMATCH',    /* 선언한 방식과 키 종류 불일치       */
  SECRET_EXPOSED:        'PG_SECRET_EXPOSED',         /* 공개 접두사 이름에 secret 이 들어있음 */
  PROVIDER_UNSUPPORTED:  'PG_PROVIDER_UNSUPPORTED'
};

/* ── provider 계약 위반 (STEP 1) ──────────────────────────────── */
const CONTRACT = {
  MISSING_METHOD: 'PG_CONTRACT_MISSING_METHOD',
  BAD_SHAPE:      'PG_CONTRACT_BAD_SHAPE',
  THREW:          'PG_CONTRACT_THREW'                /* provider 가 throw 했다 = 계약 위반 */
};

const ALL = Object.freeze(
  []
    .concat(Object.keys(PG).map(k => PG[k]))
    .concat(Object.keys(ENV).map(k => ENV[k]))
    .concat(Object.keys(CONTRACT).map(k => CONTRACT[k]))
);

function httpCode(status) {
  const n = Number(status);
  return PG.HTTP + (Number.isFinite(n) ? n : 'UNKNOWN');
}

/* 코드가 표준 목록에 있는가 (PG_HTTP_nnn 포함) */
function isKnown(code) {
  const c = String(code || '');
  if (/^PG_HTTP_\d{3}$/.test(c)) return true;
  return ALL.indexOf(c) >= 0;
}

/* 상태 미확정(=재조회로 복구해야 하는) 실패인가.
   이 구분이 없으면 타임아웃을 '실패'로 적어버려 실제 승인된 결제를 잃습니다. */
function isIndeterminate(code) {
  return code === PG.TIMEOUT || code === PG.UNREACHABLE;
}

/* fail-fast 용 오류 (ENV guard 전용 · provider 는 사용하지 않음) */
function configError(code, message, detail) {
  const e = new Error(String(message || code));
  e.code = code;
  e.name = 'PaymentConfigError';
  if (detail) e.detail = detail;
  return e;
}

/* provider 표준 실패 결과 */
function fail(code, extra) {
  return Object.assign({ ok: false, code: String(code) }, extra || {});
}

module.exports = { PG, ENV, CONTRACT, ALL, httpCode, isKnown, isIndeterminate, configError, fail };
