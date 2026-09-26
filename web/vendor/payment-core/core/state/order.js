/* core/state/order.js — 주문 상태 (STEP 3) */
'use strict';

const PENDING   = 'PENDING';     /* 생성됨 · 아직 결제 안 됨 */
const PAID      = 'PAID';        /* 사업자 승인 완료         */
const CANCELLED = 'CANCELLED';   /* 결제 전 취소 (종료)      */
const REFUNDED  = 'REFUNDED';    /* 결제 후 환불 (종료)      */

const ALL = [PENDING, PAID, CANCELLED, REFUNDED];
const TERMINAL = [CANCELLED, REFUNDED];
const SETTLED = [PAID, REFUNDED];   /* 돈이 실제로 움직인 적이 있는 상태 */

function isTerminal(s) { return TERMINAL.indexOf(s) >= 0; }
function isValid(s) { return ALL.indexOf(s) >= 0; }

module.exports = { PENDING, PAID, CANCELLED, REFUNDED, ALL, TERMINAL, SETTLED, isTerminal, isValid };
