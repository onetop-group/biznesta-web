/* =====================================================================
   core/events.js — CORE 가 밖으로 내보내는 사실 (STEP 5 · R-4)
   ---------------------------------------------------------------------
   CORE 는 결제·주문 상태까지만 책임집니다.
   "환불됐으니 결과지 접근을 막아라 / 전자책 다운로드를 끊어라 / 알림을 보내라"
   같은 일은 서비스마다 다릅니다. CORE 는 그 일을 하지 않고, 사실만 알립니다.

   규칙
     E-1 CORE 는 기본 구독자를 갖지 않는다 (내장 서비스 로직 0)
     E-2 payload 에는 결제 사실만 담는다. 서비스 도메인 값(상품·회원·컨텐츠)은 담지 않는다
     E-3 구독자가 던져도 CORE 의 DB 상태는 바뀌지 않는다 (이미 커밋된 뒤에 부른다)
     E-4 구독자 오류는 삼키지 않고 결과에 실어 올린다
   ===================================================================== */
'use strict';

const NAMES = [
  'payment.paid',
  'payment.failed',
  'payment.refunded',
  'payment.exception_opened',
  'payment.exception_closed'
];

function isKnown(name) { return NAMES.indexOf(name) >= 0; }

function createEmitter() {
  const handlers = new Map();

  function on(name, fn) {
    if (!isKnown(name)) {
      const e = new Error('PAY_EVENT_UNKNOWN:' + name);
      e.code = 'PAY_EVENT_UNKNOWN';
      throw e;
    }
    if (typeof fn !== 'function') {
      const e = new Error('PAY_EVENT_HANDLER_REQUIRED');
      e.code = 'PAY_EVENT_HANDLER_REQUIRED';
      throw e;
    }
    if (!handlers.has(name)) handlers.set(name, []);
    handlers.get(name).push(fn);
    return function off() {
      const list = handlers.get(name) || [];
      const i = list.indexOf(fn);
      if (i >= 0) list.splice(i, 1);
    };
  }

  /* 이미 커밋된 사실을 알립니다. 구독자가 실패해도 상태를 되돌리지 않습니다. */
  async function emit(name, payload) {
    if (!isKnown(name)) return { ok: false, code: 'PAY_EVENT_UNKNOWN', delivered: 0 };
    const list = handlers.get(name) || [];
    const errors = [];
    for (const fn of list) {
      try { await fn(payload); }
      catch (e) { errors.push({ code: (e && e.code) || 'HANDLER_ERROR', message: String((e && e.message) || e).slice(0, 200) }); }
    }
    return { ok: errors.length === 0, delivered: list.length - errors.length, errors: errors };
  }

  function count(name) { return (handlers.get(name) || []).length; }
  function clear() { handlers.clear(); }

  return { on, emit, count, clear, NAMES };
}

module.exports = { NAMES, isKnown, createEmitter };
