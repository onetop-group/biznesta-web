/* core/state/intent.js — 결제 시도 상태 (STEP 3) */
'use strict';

const REQUESTED  = 'requested';    /* 생성됨 · 사업자 호출 전                    */
const CONFIRMING = 'confirming';   /* 사업자 승인 호출 중 — ★ 미확정. 실패 아님   */
const CONFIRMED  = 'confirmed';    /* 승인 성공 (payment_key 필수)               */
const FAILED     = 'failed';       /* 사업자가 명시적으로 거절 (확정 실패)        */
const ABORTED    = 'aborted';      /* 사용자가 떠남 / 시도 폐기                   */
const CANCELLED  = 'cancelled';    /* 승인 후 취소됨                             */
/* ★ 사업자는 승인했으나 이 주문은 이미 다른 승인으로 PAID (STEP 4 · Q-3).
   'failed' 로 적으면 안 됩니다 — 돈이 실제로 움직였기 때문입니다. */
const CONFLICTED = 'conflicted';

const ALL = [REQUESTED, CONFIRMING, CONFIRMED, FAILED, ABORTED, CANCELLED, CONFLICTED];
const OPEN = [REQUESTED, CONFIRMING];
const TERMINAL = [CONFIRMED, FAILED, ABORTED, CANCELLED, CONFLICTED];
/* 돈이 움직인 적이 있는 상태 — 운영자가 반드시 확인해야 합니다 */
const MONEY_MOVED = [CONFIRMED, CANCELLED, CONFLICTED];

/* ★ 미확정 : 이 상태를 '실패' 로 적으면 실제 승인된 결제를 잃습니다.
   조회(getByOrderId)로 실제 상태를 확인해야 합니다. */
function isIndeterminate(s) { return s === CONFIRMING; }
function isOpen(s) { return OPEN.indexOf(s) >= 0; }
function isValid(s) { return ALL.indexOf(s) >= 0; }
function moneyMoved(s) { return MONEY_MOVED.indexOf(s) >= 0; }

module.exports = { REQUESTED, CONFIRMING, CONFIRMED, FAILED, ABORTED, CANCELLED, CONFLICTED, ALL, OPEN, TERMINAL, MONEY_MOVED, isIndeterminate, isOpen, isValid, moneyMoved };
