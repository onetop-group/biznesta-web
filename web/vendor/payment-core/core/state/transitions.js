/* =====================================================================
   core/state/transitions.js — 상태기계 (STEP 3)
   ---------------------------------------------------------------------
   아래 표는 sql/core/07_transitions.sql 의 표와 '완전히 같아야' 합니다.
   두 표가 어긋나면 애플리케이션이 허용한 전이를 DB 가 거부하거나(장애),
   DB 가 허용한 전이를 애플리케이션이 막지 못합니다(사고).
   테스트가 매번 두 표를 대조합니다.
   ===================================================================== */
'use strict';

const ORDER = require('./order');
const INTENT = require('./intent');

/* 전이에 필요한 증거 */
const REQUIRES = {
  NONE: 'none',
  CONFIRMED_INTENT: 'confirmed_intent',   /* 사업자 승인이 끝난 시도가 있어야 함  */
  PROVIDER_CANCEL: 'provider_cancel',     /* 사업자 취소 거래키가 있어야 함       */
  PAYMENT_KEY: 'payment_key'              /* 승인 증거가 있어야 함                */
};

const ORDER_TRANSITIONS = [
  { from: ORDER.PENDING, to: ORDER.PAID,      requires: REQUIRES.CONFIRMED_INTENT },
  { from: ORDER.PENDING, to: ORDER.CANCELLED, requires: REQUIRES.NONE },
  { from: ORDER.PAID,    to: ORDER.REFUNDED,  requires: REQUIRES.PROVIDER_CANCEL }
];

const INTENT_TRANSITIONS = [
  { from: INTENT.REQUESTED,  to: INTENT.CONFIRMING, requires: REQUIRES.NONE },
  { from: INTENT.REQUESTED,  to: INTENT.FAILED,     requires: REQUIRES.NONE },
  { from: INTENT.REQUESTED,  to: INTENT.ABORTED,    requires: REQUIRES.NONE },
  { from: INTENT.CONFIRMING, to: INTENT.CONFIRMED,  requires: REQUIRES.PAYMENT_KEY },
  { from: INTENT.CONFIRMING, to: INTENT.FAILED,     requires: REQUIRES.NONE },
  { from: INTENT.CONFIRMED,  to: INTENT.CANCELLED,  requires: REQUIRES.PROVIDER_CANCEL },
  /* 중복 승인 : 사업자는 승인했지만 주문은 이미 PAID (STEP 4 · Q-3) */
  { from: INTENT.CONFIRMING, to: INTENT.CONFLICTED, requires: REQUIRES.PAYMENT_KEY }
];

const TABLES = { order: ORDER_TRANSITIONS, intent: INTENT_TRANSITIONS };
const STATES = { order: ORDER.ALL, intent: INTENT.ALL };

function find(entity, from, to) {
  const t = TABLES[entity];
  if (!t) return null;
  for (let i = 0; i < t.length; i++) if (t[i].from === from && t[i].to === to) return t[i];
  return null;
}

function canTransition(entity, from, to) { return !!find(entity, from, to); }
function requirementOf(entity, from, to) { const r = find(entity, from, to); return r ? r.requires : null; }

/* 금지된 전이 전체 목록 (테스트가 전수로 돌려봅니다) */
function forbidden(entity) {
  const states = STATES[entity] || [];
  const out = [];
  states.forEach(function (from) {
    states.forEach(function (to) {
      if (from !== to && !canTransition(entity, from, to)) out.push({ from: from, to: to });
    });
  });
  return out;
}

/* 증거가 실제로 갖춰졌는지 확인합니다.
   evidence = { confirmedIntent, providerCancel, paymentKey } */
function assertTransition(entity, from, to, evidence) {
  const row = find(entity, from, to);
  if (!row) {
    const e = new Error('PAY_TRANSITION_FORBIDDEN:' + entity + ':' + from + '->' + to);
    e.code = 'PAY_TRANSITION_FORBIDDEN';
    throw e;
  }
  const ev = evidence || {};
  const need = row.requires;
  const missing =
    (need === REQUIRES.CONFIRMED_INTENT && !ev.confirmedIntent) ? 'PAY_NO_CONFIRMED_INTENT' :
    (need === REQUIRES.PROVIDER_CANCEL && !ev.providerCancel) ? 'PAY_NO_PROVIDER_CANCEL' :
    (need === REQUIRES.PAYMENT_KEY && !ev.paymentKey) ? 'PAY_NO_PAYMENT_KEY' : null;
  if (missing) {
    const e = new Error(missing + ':' + entity + ':' + from + '->' + to);
    e.code = missing;
    throw e;
  }
  return true;
}

/* DB 의 표와 대조하기 위한 정규형 : "from>to=requires" 정렬 목록 */
function fingerprint(entity) {
  return (TABLES[entity] || []).map(r => r.from + '>' + r.to + '=' + r.requires).sort();
}

module.exports = { REQUIRES, ORDER_TRANSITIONS, INTENT_TRANSITIONS, TABLES, STATES, canTransition, requirementOf, forbidden, assertTransition, fingerprint };
