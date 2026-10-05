/* =====================================================================
   core/provider/fake.js — 테스트 대역 (STEP 1)
   ---------------------------------------------------------------------
   목적 : 실제 Toss 호출 0 으로 CORE 전 경로를 검증합니다.
   · toss.js 와 '같은 계약'을 만족합니다 (contract.checkResult 로 증명).
   · 상태를 가집니다 — 승인한 결제를 기억하므로 조회·취소·멱등이 실제처럼 동작합니다.
     (PURPLE SAJU 의 setClient(fake) 는 상태가 없어 멱등 검증이 어려웠습니다. 여기서 보강)
   · calls[] 에 호출을 기록 → 「금액 불일치면 provider 를 아예 호출하지 않는다」 같은
     '호출되지 않았음'을 증명하는 테스트에 씁니다.

   scenario
     'ok'          정상
     'declined'    사업자 거절 (확정 실패)
     'timeout'     응답 없음 (미확정)
     'unreachable' 네트워크 실패 (미확정)
     'bad'         200 이지만 계약과 다른 응답
     'throw'       throw — 계약(R-1) 위반 탐지용
   ===================================================================== */
'use strict';

const E = require('../errors');
const C = require('./contract');

const NAME = 'fake';
/* 대역 인스턴스마다 취소 거래키가 겹치지 않게 합니다 (사업자는 전역 고유 키를 줍니다) */
let INSTANCE = 0;

function createFakeProvider(cfg) {
  const conf = cfg || {};
  const instanceId = ++INSTANCE;
  const state = {
    scenario: conf.scenario || 'ok',
    mode: conf.mode || 'test',
    method: conf.method || 'widget',
    configured: conf.configured !== false,
    calls: [],
    payments: new Map()   /* paymentKey → payment */
  };

  function record(method, args) { state.calls.push({ method: method, args: args, at: state.calls.length }); }

  function scripted(scenario) {
    if (scenario === 'timeout') return E.fail(E.PG.TIMEOUT);
    if (scenario === 'unreachable') return E.fail(E.PG.UNREACHABLE);
    if (scenario === 'declined') return E.fail(E.PG.DECLINED, { http: 400, providerCode: 'FAKE_DECLINED' });
    if (scenario === 'bad') return E.fail(E.PG.BAD_RESPONSE, { http: 200 });
    if (scenario === 'notconfigured') return E.fail(E.PG.NOT_CONFIGURED);
    return null;
  }

  const api = {
    name: NAME,

    /* ── 테스트 제어 (계약 밖 · 이름 앞에 __ 를 붙여 구분) ── */
    __calls: state.calls,
    __setScenario: function (s) { state.scenario = s; },
    __setMethod: function (m) { state.method = m; },
    __reset: function () { state.calls.length = 0; state.payments.clear(); state.scenario = 'ok'; },
    __callCount: function (m) { return state.calls.filter(c => !m || c.method === m).length; },
    __seed: function (payment) { if (payment && payment.paymentKey) state.payments.set(payment.paymentKey, C.shapePayment(payment)); },

    status: function () {
      return {
        name: NAME,
        configured: state.configured,
        mode: state.mode,
        clientConfigured: state.configured,
        clientMode: state.mode,
        method: state.method,
        supportsPartialCancel: true
      };
    },

    confirm: async function (args) {
      const a = args || {};
      record('confirm', { paymentKey: a.paymentKey, orderId: a.orderId, amount: a.amount });
      if (state.scenario === 'throw') throw new Error('fake scenario: throw');
      if (!a.paymentKey || !a.orderId || !(Number(a.amount) > 0)) return E.fail(E.PG.INVALID_ARGS);
      const s = scripted(state.scenario);
      if (s) return s;

      /* 멱등 : 같은 paymentKey 를 다시 승인해도 같은 결과 */
      const existing = state.payments.get(String(a.paymentKey));
      if (existing) return { ok: true, payment: existing };

      const payment = C.shapePayment({
        providerName: NAME,
        orderId: String(a.orderId),
        paymentKey: String(a.paymentKey),
        status: 'DONE',
        totalAmount: Number(a.amount),
        balanceAmount: Number(a.amount),
        currency: 'KRW',
        approvedAt: new Date(0).toISOString(),   /* 고정값 — 테스트 재현성 */
        method: 'CARD',
        issuer: 'FAKE',
        last4: '4242',
        installmentMonths: 0
      });
      state.payments.set(String(a.paymentKey), payment);
      return { ok: true, payment: payment };
    },

    getByOrderId: async function (orderId) {
      record('getByOrderId', { orderId: orderId });
      if (state.scenario === 'throw') throw new Error('fake scenario: throw');
      if (!orderId) return E.fail(E.PG.INVALID_ARGS);
      const s = scripted(state.scenario);
      if (s) return s;
      let found = null;
      state.payments.forEach(function (p) { if (p.orderId === String(orderId)) found = p; });
      if (!found) return E.fail(E.PG.DECLINED, { http: 404, providerCode: 'NOT_FOUND' });
      return { ok: true, payment: found };
    },

    cancel: async function (args) {
      const a = args || {};
      record('cancel', { paymentKey: a.paymentKey, cancelAmount: a.cancelAmount, reason: a.reason });
      if (state.scenario === 'throw') throw new Error('fake scenario: throw');
      if (!a.paymentKey) return E.fail(E.PG.INVALID_ARGS);
      if (a.cancelAmount != null && !(Number(a.cancelAmount) > 0)) return E.fail(E.PG.INVALID_ARGS);
      const s = scripted(state.scenario);
      if (s) return s;

      const p = state.payments.get(String(a.paymentKey));
      if (!p) return E.fail(E.PG.DECLINED, { http: 404, providerCode: 'NOT_FOUND' });

      const balance = p.balanceAmount != null ? p.balanceAmount : p.totalAmount;
      const amount = a.cancelAmount != null ? Number(a.cancelAmount) : balance;
      if (amount > balance) return E.fail(E.PG.DECLINED, { http: 400, providerCode: 'EXCEED_CANCEL_AMOUNT' });

      const txKey = 'fake-tx-' + instanceId + '-' + state.calls.length;
      const next = C.shapePayment(Object.assign({}, p, {
        balanceAmount: balance - amount,
        status: (balance - amount) === 0 ? 'CANCELED' : 'PARTIAL_CANCELED',
        cancelledAmount: (p.cancelledAmount || 0) + amount,
        lastCancelTransactionKey: txKey
      }));
      state.payments.set(String(a.paymentKey), next);
      return { ok: true, payment: next, transactionKey: txKey, cancelAmount: amount };
    }
  };

  return api;
}

module.exports = { createFakeProvider, NAME };
