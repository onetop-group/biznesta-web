/* =====================================================================
   core/env/report.js — 관리자 표시용 설정 상태 (STEP 2)
   ---------------------------------------------------------------------
   · 「지금 이 배포가 test 인가 live 인가, 위젯인가 결제창인가」를 사람이 확인할 수 있게 합니다.
   · 키 원문은 절대 나가지 않습니다. 나가는 것은 접두사 분류 + *** 뿐입니다.
   · toReport() 결과는 그대로 관리자 화면/응답에 실어도 안전해야 합니다.
   ===================================================================== */
'use strict';

const S = require('./schema');

/* inspect() 결과 → 외부 노출 가능한 객체 */
function toReport(inspection) {
  const r = inspection || {};
  return {
    env: r.env || null,
    method: r.method || null,
    provider: r.provider || null,
    ok: !!r.ok,
    secret: {
      configured: !!(r.secret && r.secret.present),
      recognized: !!(r.secret && r.secret.recognized),
      mode: (r.secret && r.secret.mode) || null,
      keyImpliesMethod: (r.secret && r.secret.keyImpliesMethod) || null,
      masked: (r.secret && r.secret.masked) || null
    },
    client: {
      configured: !!(r.client && r.client.present),
      recognized: !!(r.client && r.client.recognized),
      mode: (r.client && r.client.mode) || null,
      keyImpliesMethod: (r.client && r.client.keyImpliesMethod) || null,
      masked: (r.client && r.client.masked) || null
    },
    issues: (r.issues || []).map(function (i) {
      return { code: i.code, message: i.message, detail: i.detail || null };
    })
  };
}

/* 브라우저로 내려보내도 되는 최소 공개 설정.
   client key 는 원래 공개값이므로 원문을 내보냅니다 — 단 검증을 통과한 경우에만. */
function toPublicConfig(inspection) {
  const r = inspection || {};
  if (!r.ok) return { ok: false, method: null, clientKey: null, env: null };
  return { ok: true, env: r.env, method: r.method, provider: r.provider, clientKey: r._clientKey || null };
}

/* 사람이 읽는 한 줄 */
function summaryLine(inspection) {
  const rep = toReport(inspection);
  const head = rep.ok ? 'OK' : 'BLOCKED';
  return head + ' · env=' + (rep.env || '-') + ' · method=' + (rep.method || '-') +
    ' · provider=' + (rep.provider || '-') +
    ' · secret=' + (rep.secret.masked || '-') + ' · client=' + (rep.client.masked || '-') +
    (rep.issues.length ? ' · issues=' + rep.issues.map(i => i.code).join(',') : '');
}

/* 필요한 ENV 목록 (문서/.env.example 생성용 · 값 없음) */
function requiredVars() {
  return S.names().map(function (n) {
    const v = S.VARS[n];
    return { name: n, required: !!v.required, secret: !!v.secret, allowed: v.enum || null, desc: v.desc };
  });
}

module.exports = { toReport, toPublicConfig, summaryLine, requiredVars };
