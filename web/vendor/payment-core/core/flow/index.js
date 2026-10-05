/* =====================================================================
   core/flow/index.js — flow 조립 (STEP 4)
   ---------------------------------------------------------------------
   createFlow({ provider, db, providerName })
     provider : STEP 1 의 계약을 만족하는 구현체 (toss / fake)
     db       : core/db/port.js 계약을 만족하는 구현체
   flow 는 SQL 도 사업자 이름도 모릅니다. 계약 두 개만 압니다.
   ===================================================================== */
'use strict';

const contract = require('../provider/contract');
const port = require('../db/port');
const events = require('../events');
const adapterContract = require('../adapter/contract');
const prepareMod = require('./prepare');
const confirmMod = require('./confirm');
const failMod = require('./fail');
const statusMod = require('./status');
const cancelMod = require('./cancel');
const refundMod = require('./refund');
const recoverMod = require('./recover');
const operatorMod = require('./operator');
const orderMod = require('./order');
const hooksMod = require('./hooks');

function createFlow(deps) {
  const d = deps || {};
  contract.assertContract(d.provider, d.providerName || 'provider');
  port.assertPort(d.db);

  /* ★ CORE 는 기본 구독자를 갖지 않습니다. 서비스 처리는 ADAPTER 몫입니다 (R-4). */
  const emitter = d.events || events.createEmitter();
  if (d.adapter) adapterContract.assertAdapter(d.adapter);
  const attached = d.adapter ? { attached: Object.keys(adapterContract.HOOKS).filter(h => typeof d.adapter[h] === 'function') } : { attached: [] };
  /* 이벤트 구독은 선택 — hook 전달은 core/flow/hooks.js 가 '기록과 함께' 수행합니다 */
  if (d.adapter && d.subscribeEvents) adapterContract.attach(emitter, d.adapter);

  const ctx = {
    provider: contract.guarded(d.provider, d.providerName || 'provider'),
    db: d.db,
    events: emitter,
    adapter: d.adapter || null,
    providerName: d.providerName || d.provider.name || 'provider'
  };

  return {
    providerName: ctx.providerName,
    tenant: d.adapter ? d.adapter.tenant : null,
    events: emitter,
    adapter: ctx.adapter,
    adapterHooks: attached.attached,
    describeAdapterContract: () => adapterContract.describe(),
    createOrder: args => orderMod.createOrder(ctx, args),
    retryHooks: args => hooksMod.retry(ctx, args),
    hookStatus: args => hooksMod.statusOf(ctx, args),
    prepare: args => prepareMod.prepare(ctx, args),
    confirm: args => confirmMod.confirm(ctx, args),
    fail: args => failMod.fail(ctx, args),
    status: args => statusMod.status(ctx, args),
    cancel: args => cancelMod.cancel(ctx, args),
    refund: args => refundMod.refund(ctx, args),
    recover: args => recoverMod.recover(ctx, args),
    operations: args => operatorMod.operations(ctx, args),
    closeException: args => operatorMod.closeException(ctx, args),
    exceptionHistory: args => operatorMod.exceptionHistory(ctx, args),
    ops: ['createOrder', 'prepare', 'confirm', 'fail', 'status', 'cancel', 'refund', 'recover', 'operations', 'closeException', 'retryHooks']
  };
}

module.exports = { createFlow };
