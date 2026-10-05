/* =====================================================================
   core/index.js — CORE 조립 (STEP 1 + STEP 2)
   ---------------------------------------------------------------------
   createPaymentCore(source) 흐름
     ① ENV guard 로 설정을 검증한다 (문제가 있으면 여기서 throw — fail-fast)
     ② 선언된 PAY_METHOD 를 결제 방식으로 확정한다 (키에서 추론하지 않음)
     ③ 선언된 PAY_PROVIDER 의 구현체를 만든다
     ④ provider 계약을 확인한다 (못 지키면 throw)
   ★ 어느 단계에도 '실패하면 다른 방식으로 대체' 분기가 없습니다.
   ===================================================================== */
'use strict';

const E = require('./errors');
const guard = require('./env/guard');
const report = require('./env/report');
const contract = require('./provider/contract');
const toss = require('./provider/toss');
const fake = require('./provider/fake');

/* 사업자 이름 → 생성자. 여기 없는 이름은 만들 수 없습니다. */
const FACTORIES = {
  toss: function (cfg) { return toss.createTossProvider(cfg); }
};

function createPaymentCore(source, options) {
  const opt = options || {};

  /* ① + ② */
  const inspection = guard.assertEnvIntegrity(source);
  const method = guard.resolveMethod(inspection);

  /* ③ — 테스트에서는 provider 를 통째로 주입할 수 있습니다 (실 Toss 호출 0) */
  let provider;
  if (opt.provider) {
    provider = opt.provider;
  } else {
    const make = FACTORIES[inspection.provider];
    if (!make) {
      throw E.configError(E.ENV.PROVIDER_UNSUPPORTED, 'PG_PROVIDER_UNSUPPORTED — ' + inspection.provider);
    }
    provider = make({
      secretKey: inspection._secretKey,
      clientKey: inspection._clientKey,
      method: method,
      mode: inspection.env,
      fetch: opt.fetch,
      timeoutMs: opt.timeoutMs,
      baseUrl: opt.baseUrl
    });
  }

  /* ④ */
  contract.assertContract(provider, inspection.provider);

  return {
    env: inspection.env,
    method: method,
    providerName: inspection.provider,
    provider: contract.guarded(provider, inspection.provider),
    config: report.toReport(inspection),
    publicConfig: function () { return report.toPublicConfig(inspection); },
    summary: function () { return report.summaryLine(inspection); }
  };
}

module.exports = {
  createPaymentCore,
  errors: E,
  contract: contract,
  guard: guard,
  report: report,
  providers: { toss: toss, fake: fake },
  log: require('./log')
};
