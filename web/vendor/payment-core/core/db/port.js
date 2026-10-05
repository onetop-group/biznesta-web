/* =====================================================================
   core/db/port.js — DB 포트 계약 (STEP 4)
   ---------------------------------------------------------------------
   flow 는 SQL 도 DB 드라이버도 모릅니다. 아래 함수들만 압니다.
   구현체는 호출자가 주입합니다 (테스트는 pglite 구현체를 넘깁니다).
   덕분에 STEP 5 에서 Supabase REST 로 바꿔도 flow 는 그대로입니다.

   규칙
     P-1 모든 함수는 tenant 를 첫 인자로 받는다 (교차 오염 차단)
     P-2 금액은 절대 인자로 받아서 '결정' 하지 않는다. DB 값이 기준이다
     P-3 실패는 예외로 던진다 (flow 가 잡아서 표준 코드로 바꾼다)
     P-4 withActor(actor, fn) 안에서 실행된 쓰기는 그 actor 로 이력에 남는다
   ===================================================================== */
'use strict';

const REQUIRED = [
  'withActor',            /* (actor, fn) → fn 을 한 트랜잭션 안에서 실행        */
  'getOrder',             /* (tenant, orderId) → order | null                  */
  'getOpenIntent',        /* (tenant, orderId) → intent | null (requested/confirming) */
  'getIntents',           /* (tenant, orderId) → intent[]                      */
  'getExceptions',        /* (tenant, orderId) → exception[]                   */
  'intentCreate',         /* (tenant, orderId, provider, providerOrderId)      */
  'intentBeginConfirm',   /* (tenant, intentId)                                */
  'intentMarkConfirmed',  /* (tenant, intentId, paymentKey, providerAmount) → order */
  'intentMarkFailed',     /* (tenant, intentId, code)                          */
  'intentMarkConflicted', /* (tenant, intentId, paymentKey, detail) → exception */
  'exceptionOpen',        /* (tenant, orderId, intentId, kind, provider, paymentKey, detail) */
  'exceptionResolve',     /* (tenant, exceptionId, transactionKey, detail)     */
  'exceptionNeedsOperator',/* (tenant, exceptionId, code, indeterminate, detail) */
  /* ── STEP 5 ── */
  'getPaymentRecord',      /* (tenant, orderId) → 결제 원장 (provider·paymentKey·금액의 근거) */
  'getRefundAttempts',     /* (tenant, orderId) → 환불 시도[]                    */
  'getExceptionAudit',     /* (tenant, exceptionId) → 감사 이력[]                */
  'getOperations',         /* (tenant, olderThan) → 운영 조회 (읽기 전용)         */
  'orderCancel',           /* (tenant, orderId, reason)                          */
  'refundAttemptBegin',    /* (tenant, orderId, provider, paymentKey, amount, reason, actorRef) */
  'refundAttemptSucceeded',/* (tenant, attemptId, transactionKey)                */
  'refundAttemptOutcome',  /* (tenant, attemptId, status, code)                  */
  'orderMarkRefunded',     /* (tenant, orderId, provider, paymentKey, txKey, amount, attemptId, reason) */
  'exceptionClose',        /* (tenant, exceptionId, actorRef, reason, providerChecked, providerStatus, providerTx) */
  /* ── STEP 6 ── */
  'orderCreate',           /* (tenant, userRef, orderNo, amount, currency, productRef, adapterMeta, requestId) */
  'getHookDeliveries',     /* (tenant, orderId) → hook 전달 기록[]                */
  'hookStart',             /* (tenant, orderId, hook, eventName, payload)         */
  'hookDelivered',         /* (tenant, deliveryId)                                */
  'hookFailed'             /* (tenant, deliveryId, code)                          */
];

const ACTORS = ['system', 'admin', 'provider'];

function validate(port) {
  const missing = REQUIRED.filter(n => !port || typeof port[n] !== 'function');
  return { ok: missing.length === 0, missing: missing };
}

function assertPort(port) {
  const v = validate(port);
  if (!v.ok) {
    const e = new Error('PAY_DB_PORT_INCOMPLETE:' + v.missing.join(','));
    e.code = 'PAY_DB_PORT_INCOMPLETE';
    throw e;
  }
  return true;
}

function assertActor(actor) {
  if (ACTORS.indexOf(actor) < 0) {
    const e = new Error('PAY_ACTOR_INVALID:' + String(actor));
    e.code = 'PAY_ACTOR_INVALID';
    throw e;
  }
  return actor;
}

module.exports = { REQUIRED, ACTORS, validate, assertPort, assertActor };
