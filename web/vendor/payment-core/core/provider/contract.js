/* =====================================================================
   core/provider/contract.js — PG 사업자 인터페이스 (STEP 1)
   ---------------------------------------------------------------------
   CORE 의 윗층(flow · api)은 이 계약만 압니다. Toss 도 어떤 사업자도 모릅니다.
   사업자를 바꾸는 일 = 이 계약을 만족하는 파일 1개를 새로 쓰는 일.

   계약 4가지 (전부 async · getByOrderId 만 문자열 인자)
     status()                                     → 동기. 설정 상태 요약(비밀 없음)
     confirm({ paymentKey, orderId, amount })     → 승인
     getByOrderId(orderId)                        → 조회 (응답 유실 후 실제 상태 확인)
     cancel({ paymentKey, reason, cancelAmount }) → 취소/환불
                                                    cancelAmount 는 전액이면 생략.
                                                    ★ 부분환불 '사용'은 PHASE 2 이지만
                                                      시그니처는 지금 고정해 둡니다.

   불변 규칙
     R-1 절대 throw 하지 않는다. 성공 { ok:true, … } · 실패 { ok:false, code }.
     R-2 code 는 core/errors.js 의 표준 코드다. 사업자 원문 코드를 그대로 쓰지 않는다.
     R-3 성공 응답의 payment 는 아래 PAYMENT_FIELDS 키 집합만 가진다 (사업자 응답 전체 저장 금지).
     R-4 민감정보를 돌려주지 않는다 (카드번호 전체·비밀키·인증헤더).
     R-5 타임아웃/네트워크 실패는 '실패'가 아니라 '미확정'이다 (errors.isIndeterminate).
   ===================================================================== */
'use strict';

const E = require('../errors');

const METHODS = ['status', 'confirm', 'getByOrderId', 'cancel'];
const ASYNC_METHODS = ['confirm', 'getByOrderId', 'cancel'];

/* 성공 응답의 payment 가 가질 수 있는 유일한 키 집합 (allowlist) */
const PAYMENT_FIELDS = [
  'providerName',    /* 'toss' · 'fake' …                                   */
  'orderId',         /* 사업자에 넘긴 주문 식별자 (CORE 가 만든 값)           */
  'paymentKey',      /* 사업자 결제 식별자 — 저장은 하되 로그에는 마스킹      */
  'status',          /* 사업자 상태 문자열(정규화 전 원문 상태값)             */
  'totalAmount',
  'balanceAmount',   /* 남은 금액 (부분환불 대비 · PHASE 2 에서 사용)         */
  'currency',
  'approvedAt',
  'method',          /* 'CARD' · 'TRANSFER' …                               */
  'issuer',          /* 카드사/은행 코드                                     */
  'acquirer',
  'last4',           /* 마스킹된 끝 4자리만                                  */
  'installmentMonths',
  'easyPayProvider',
  'receiptUrl',
  /* 취소 증거 — 조회만으로 '이미 취소됐는가' 를 확인할 수 있어야 복구가 가능합니다 (STEP 5) */
  'cancelledAmount',
  'lastCancelTransactionKey'
];

/* status() 가 가질 수 있는 키 집합 — 비밀 없음 */
const STATUS_FIELDS = ['name', 'configured', 'mode', 'clientConfigured', 'clientMode', 'method', 'supportsPartialCancel'];

function isPlainObject(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }

/* provider 객체가 계약을 만족하는가 (구조 검사) */
function validate(provider) {
  const missing = [];
  const problems = [];
  if (!isPlainObject(provider) && typeof provider !== 'object') {
    return { ok: false, missing: METHODS.slice(), problems: ['provider is not an object'] };
  }
  METHODS.forEach(function (m) {
    if (typeof provider[m] !== 'function') missing.push(m);
  });
  ASYNC_METHODS.forEach(function (m) {
    if (typeof provider[m] === 'function' && provider[m].constructor.name !== 'AsyncFunction') {
      /* Promise 를 돌려주기만 하면 되므로 경고만 남깁니다 (테스트에서 실제 호출로 확인) */
      problems.push(m + ' is not declared async (must still return a Promise)');
    }
  });
  return { ok: missing.length === 0, missing: missing, problems: problems };
}

/* 부팅 시 즉시 실패 — 계약을 못 지키는 provider 를 붙인 채 운영에 올리지 않습니다. */
function assertContract(provider, label) {
  const v = validate(provider);
  if (!v.ok) {
    throw E.configError(E.CONTRACT.MISSING_METHOD,
      'PG_CONTRACT_MISSING_METHOD — provider(' + (label || 'unknown') + ') 에 다음 구현이 없습니다 : ' + v.missing.join(', '),
      { missing: v.missing });
  }
  return true;
}

/* 결과 모양 검사 — 두 provider 가 '같은 계약'인지 증명하는 데 씁니다. */
function checkResult(method, res) {
  const bad = [];
  if (!isPlainObject(res)) return { ok: false, bad: ['result is not an object'] };
  if (typeof res.ok !== 'boolean') bad.push('missing boolean ok');

  if (res.ok === false) {
    if (typeof res.code !== 'string' || !res.code) bad.push('missing code');
    else if (!E.isKnown(res.code)) bad.push('non-standard code : ' + res.code);
    if (Object.prototype.hasOwnProperty.call(res, 'payment')) bad.push('failure must not carry payment');
    return { ok: bad.length === 0, bad: bad };
  }

  /* 성공 */
  if (!isPlainObject(res.payment)) { bad.push('missing payment object'); return { ok: false, bad: bad }; }
  Object.keys(res.payment).forEach(function (k) {
    if (PAYMENT_FIELDS.indexOf(k) < 0) bad.push('payment has non-allowlisted field : ' + k);
  });
  if (method === 'cancel') {
    if (!Object.prototype.hasOwnProperty.call(res, 'cancelAmount')) bad.push('cancel must report cancelAmount');
    if (!Object.prototype.hasOwnProperty.call(res, 'transactionKey')) bad.push('cancel must report transactionKey');
  }
  return { ok: bad.length === 0, bad: bad };
}

function checkStatus(res) {
  const bad = [];
  if (!isPlainObject(res)) return { ok: false, bad: ['status() must return an object'] };
  Object.keys(res).forEach(function (k) {
    if (STATUS_FIELDS.indexOf(k) < 0) bad.push('status has non-allowlisted field : ' + k);
  });
  if (typeof res.name !== 'string') bad.push('status.name must be a string');
  if (typeof res.configured !== 'boolean') bad.push('status.configured must be boolean');
  return { ok: bad.length === 0, bad: bad };
}

/* payment 객체를 allowlist 로 깎아냅니다. 각 provider 가 마지막에 반드시 통과시킵니다. */
function shapePayment(src) {
  const out = {};
  if (!isPlainObject(src)) return out;
  PAYMENT_FIELDS.forEach(function (k) {
    if (src[k] !== undefined && src[k] !== null) out[k] = src[k];
  });
  return out;
}

/* provider 가 throw 하더라도 계약(R-1)을 유지시키는 방어막.
   throw 자체는 계약 위반이므로 코드로 드러내되, 상위층이 깨지지는 않게 합니다. */
function guarded(provider, label) {
  const wrapped = { __provider: label || (provider && provider.name) || 'provider' };
  wrapped.status = function () {
    try { return provider.status(); }
    catch (e) { return { name: String(label || 'provider'), configured: false }; }
  };
  ASYNC_METHODS.forEach(function (m) {
    wrapped[m] = async function () {
      try { return await provider[m].apply(provider, arguments); }
      catch (e) { return E.fail(E.CONTRACT.THREW, { method: m }); }
    };
  });
  return wrapped;
}

module.exports = { METHODS, ASYNC_METHODS, PAYMENT_FIELDS, STATUS_FIELDS, validate, assertContract, checkResult, checkStatus, shapePayment, guarded };
