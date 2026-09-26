/* =====================================================================
   core/env/guard.js — 환경 가드 · fail-fast (STEP 2)
   ---------------------------------------------------------------------
   해결하는 문제 (PURPLE SAJU 역분석에서 확인된 실제 위험)
     · Production 에 test 키가 올라가도 아무도 막지 않았다
     · 키 접두사(ck/gck)가 결제 방식을 '자동 선택'했다 → 키를 바꾸면 결제창이 조용히 바뀐다
     · 잘못된 조합이면 legacy 경로로 슬쩍 넘어갔다

   CORE 규칙
     G-1 PAY_METHOD 가 결제 방식을 '선언'한다. 키는 '일치 검증'만 한다.
     G-2 선언과 키가 다르면 → 멈춘다. 절대 키를 따라가지 않는다.
     G-3 legacy 자동 fallback 경로를 코드에 두지 않는다.
         (이 파일 어디에도 '실패 시 다른 방식으로 대체' 하는 분기가 없습니다)
     G-4 잘못된 설정은 부팅에서 throw 한다. 결제 시점까지 미루지 않는다.
     G-5 키 원문은 반환값·오류메시지·로그 어디에도 넣지 않는다.
   ===================================================================== */
'use strict';

const E = require('../errors');
const S = require('./schema');
const log = require('../log');

function read(src, name) {
  const v = src ? src[name] : undefined;
  return (v === undefined || v === null || String(v).trim() === '') ? null : String(v).trim();
}

function issue(code, message, detail) {
  return { code: code, message: message, detail: detail || null };
}

/* 공개 접두사 이름으로 비밀키가 설정돼 있는지 (이름 + 값 대조) */
function exposedSecretNames(src, secretValue) {
  const out = [];
  Object.keys(src || {}).forEach(function (k) {
    if (!S.PUBLIC_PREFIXES.some(p => k.indexOf(p) === 0)) return;
    if (new RegExp('SECRET|PRIVATE', 'i').test(k)) { out.push(k); return; }
    const v = src[k];
    if (secretValue && v && String(v).trim() === secretValue) { out.push(k); return; }
    const c = S.classifyKey(v);
    if (c.recognized && c.role === 'secret') out.push(k);
  });
  return out;
}

/* ─────────────────────────────────────────────────────────────
   inspect() — throw 하지 않고 전체 진단 결과를 돌려줍니다.
   { ok, env, method, provider, secret, client, issues[] }
   ───────────────────────────────────────────────────────────── */
function inspect(source) {
  const src = source || process.env;
  const issues = [];

  /* 1) 환경 선언 */
  const envRaw = read(src, 'PAY_ENV');
  if (!envRaw) issues.push(issue(E.ENV.ENV_NOT_DECLARED, 'PAY_ENV 가 선언되지 않았습니다 (test | live)'));
  else if (S.ENVS.indexOf(envRaw) < 0) issues.push(issue(E.ENV.INVALID_VALUE, 'PAY_ENV 값이 올바르지 않습니다', { name: 'PAY_ENV', allowed: S.ENVS }));
  const payEnv = S.ENVS.indexOf(envRaw) >= 0 ? envRaw : null;

  /* 2) 결제 방식 선언 — ★ 추론 없음 */
  const methodRaw = read(src, 'PAY_METHOD');
  if (!methodRaw) issues.push(issue(E.ENV.METHOD_NOT_DECLARED, 'PAY_METHOD 가 선언되지 않았습니다 (widget | window). 키에서 추론하지 않습니다'));
  else if (S.METHODS.indexOf(methodRaw) < 0) issues.push(issue(E.ENV.INVALID_VALUE, 'PAY_METHOD 값이 올바르지 않습니다', { name: 'PAY_METHOD', allowed: S.METHODS }));
  const payMethod = S.METHODS.indexOf(methodRaw) >= 0 ? methodRaw : null;

  /* 3) 사업자 */
  const providerRaw = read(src, 'PAY_PROVIDER') || S.VARS.PAY_PROVIDER.default;
  if (S.PROVIDERS.indexOf(providerRaw) < 0) issues.push(issue(E.ENV.PROVIDER_UNSUPPORTED, 'PAY_PROVIDER 를 지원하지 않습니다', { name: 'PAY_PROVIDER', allowed: S.PROVIDERS }));
  const provider = S.PROVIDERS.indexOf(providerRaw) >= 0 ? providerRaw : null;

  /* 4) 키 존재 */
  const secretRaw = read(src, 'PAY_SECRET_KEY');
  const clientRaw = read(src, 'PAY_PUBLIC_CLIENT_KEY');
  if (!secretRaw) issues.push(issue(E.ENV.KEY_MISSING, 'PAY_SECRET_KEY 가 없습니다', { name: 'PAY_SECRET_KEY' }));
  if (!clientRaw) issues.push(issue(E.ENV.KEY_MISSING, 'PAY_PUBLIC_CLIENT_KEY 가 없습니다', { name: 'PAY_PUBLIC_CLIENT_KEY' }));

  /* 키를 읽은 즉시 로그 치환 대상으로 등록 (이후 어떤 경로로도 원문이 못 나갑니다) */
  if (secretRaw) log.register(secretRaw);

  const secret = S.classifyKey(secretRaw);
  const client = S.classifyKey(clientRaw);

  /* 5) 접두사 해석 가능 여부 */
  if (secretRaw && !secret.recognized) issues.push(issue(E.ENV.KEY_UNRECOGNIZED, 'PAY_SECRET_KEY 의 접두사를 해석할 수 없습니다', { name: 'PAY_SECRET_KEY' }));
  if (clientRaw && !client.recognized) issues.push(issue(E.ENV.KEY_UNRECOGNIZED, 'PAY_PUBLIC_CLIENT_KEY 의 접두사를 해석할 수 없습니다', { name: 'PAY_PUBLIC_CLIENT_KEY' }));

  /* 6) 역할 자리 바뀜 — 공개 자리에 비밀키가 들어간 경우가 가장 위험 */
  if (secret.recognized && secret.role !== 'secret') issues.push(issue(E.ENV.KEY_ROLE_MISMATCH, 'PAY_SECRET_KEY 자리에 공개키가 들어 있습니다', { name: 'PAY_SECRET_KEY' }));
  if (client.recognized && client.role !== 'client') issues.push(issue(E.ENV.KEY_ROLE_MISMATCH, 'PAY_PUBLIC_CLIENT_KEY 자리에 비밀키가 들어 있습니다', { name: 'PAY_PUBLIC_CLIENT_KEY' }));

  /* 7) test / live 혼용 */
  if (secret.mode && client.mode && secret.mode !== client.mode) {
    issues.push(issue(E.ENV.KEY_MODE_MISMATCH, 'secret 과 client 의 test/live 가 다릅니다', { secretMode: secret.mode, clientMode: client.mode }));
  }

  /* 8) 환경 ↔ 키 모드 */
  const keyMode = secret.mode || client.mode || null;
  if (payEnv === 'live' && keyMode === 'test') {
    issues.push(issue(E.ENV.TEST_KEY_IN_PRODUCTION, 'PAY_ENV=live 인데 test 키가 설정돼 있습니다'));
  }
  if (payEnv === 'test' && keyMode === 'live') {
    issues.push(issue(E.ENV.LIVE_KEY_IN_DEV, 'PAY_ENV=test 인데 live 키가 설정돼 있습니다'));
  }

  /* 9) ★ 선언한 방식 ↔ 키 종류 — 불일치는 '차단'이지 '전환'이 아닙니다 */
  if (payMethod && secret.recognized && secret.method !== payMethod) {
    issues.push(issue(E.ENV.METHOD_KEY_MISMATCH,
      'PAY_METHOD=' + payMethod + ' 로 선언했지만 PAY_SECRET_KEY 는 ' + secret.method + ' 용 키입니다',
      { declared: payMethod, keyImplies: secret.method, name: 'PAY_SECRET_KEY' }));
  }
  if (payMethod && client.recognized && client.method !== payMethod) {
    issues.push(issue(E.ENV.METHOD_KEY_MISMATCH,
      'PAY_METHOD=' + payMethod + ' 로 선언했지만 PAY_PUBLIC_CLIENT_KEY 는 ' + client.method + ' 용 키입니다',
      { declared: payMethod, keyImplies: client.method, name: 'PAY_PUBLIC_CLIENT_KEY' }));
  }

  /* 10) 비밀키가 공개 이름으로 새어 있는지 */
  const exposed = exposedSecretNames(src, secretRaw);
  if (exposed.length) {
    issues.push(issue(E.ENV.SECRET_EXPOSED, '비밀키가 공개 접두사 이름으로 설정돼 있습니다 — 즉시 제거하고 키를 회전하십시오', { names: exposed }));
  }

  return {
    ok: issues.length === 0,
    env: payEnv,
    method: payMethod,        /* 선언값 그대로. 키에서 온 값이 아닙니다 */
    provider: provider,
    secret: { present: secret.present, recognized: secret.recognized, mode: secret.mode, role: secret.role, keyImpliesMethod: secret.method, masked: S.maskKey(secretRaw) },
    client: { present: client.present, recognized: client.recognized, mode: client.mode, role: client.role, keyImpliesMethod: client.method, masked: S.maskKey(clientRaw) },
    issues: issues,
    /* ★ 원문 키는 여기에만 있고 toReport()/로그로는 나가지 않습니다 */
    _secretKey: secretRaw,
    _clientKey: clientRaw
  };
}

/* ─────────────────────────────────────────────────────────────
   assertEnvIntegrity() — 부팅 fail-fast. 문제가 있으면 throw.
   ───────────────────────────────────────────────────────────── */
function assertEnvIntegrity(source) {
  const r = inspect(source);
  if (!r.ok) {
    const first = r.issues[0];
    const all = r.issues.map(i => i.code).join(', ');
    throw E.configError(first.code,
      first.code + ' — ' + first.message + (r.issues.length > 1 ? ' (그 외 : ' + all + ')' : ''),
      { issues: r.issues.map(i => ({ code: i.code, message: i.message, detail: i.detail })) });
  }
  return r;
}

/* ─────────────────────────────────────────────────────────────
   resolveMethod() — 결제 방식을 정하는 유일한 함수.
   ★ 인자로 키를 받지 않습니다. 받을 수도 없습니다.
     즉 '키를 보고 방식을 정하는' 코드는 구조적으로 존재할 수 없습니다.
   ───────────────────────────────────────────────────────────── */
function resolveMethod(inspection) {
  const r = inspection;
  if (!r || !r.ok) {
    throw E.configError(E.ENV.METHOD_NOT_DECLARED,
      'PG_METHOD_NOT_DECLARED — 검증되지 않은 설정에서는 결제 방식을 결정하지 않습니다 (자동 fallback 없음)');
  }
  return r.method;
}

module.exports = { inspect, assertEnvIntegrity, resolveMethod, exposedSecretNames };
