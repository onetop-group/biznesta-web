/* =====================================================================
   core/adapter/contract.js — ADAPTER 계약 (STEP 6)
   ---------------------------------------------------------------------
   목표 : CORE 를 한 줄도 고치지 않고 Adapter 만 바꿔 다른 사업에 연결한다.

   ── 요청하신 최소 계약에 대한 검토 (S-1) ─────────────────────────────
   1) resolvePrice → **resolveProduct 로 바꿉니다**
      이유 ① 가격·통화·표시명·판매중 여부는 같은 서버 레코드에서 나와야 합니다.
             가격과 이름을 따로 조회하면 두 조회가 서로 다른 상품을 볼 수 있습니다.
           ② 시그니처가 **클라이언트 금액을 아예 받지 않습니다**.
             "클라이언트 가격을 그대로 돌려주는 구현" 이 실수로도 불가능해집니다.
             (금지 규칙을 문서로 두는 대신 인터페이스로 막습니다.)
   2) orderName → **유지하되 선택 사항**. 기본값은 resolveProduct 의 name.
      이유 : 표시명은 '포맷' 이고, 없는 Adapter 가 더 많습니다. 필수로 두면
             모든 Adapter 가 같은 문장을 되풀이합니다.
   3) validateOrderInput → **validateInput 으로 줄이고, 반환값이 adapter_meta 가 됩니다**
      이유 : 검증과 '사업별 값 만들기' 는 같은 자리에서 일어납니다. 둘을 나누면
             검증을 통과한 값과 저장되는 값이 어긋날 수 있습니다.
   4) completeUrl · refundPolicyText → 이름 그대로 유지 (선택).
   5) 결제 완료 hook → onPaid · 환불 완료 hook → onRefunded (선택).

   ── 경계 ────────────────────────────────────────────────────────────
     CORE       주문/결제 상태 · 금액 불변식 · provider 호출 · 승인 · 실패/미확정
                멱등 · 결제원장 · 환불원장 · 예외 · 감사이력 · actor · tenant 격리
     ADAPTER    어떤 상품인지 · 실제 판매가격 · 표시명 · 사업별 입력 검증
                결제/환불 완료 후 서비스 처리 · 완료 페이지 · 환불 안내문

   ★ CORE 는 adapter_meta 안의 의미를 해석하지 않습니다. 저장하고 되돌려줄 뿐입니다.
   ★ hook 은 결제 상태기계와 분리돼 있습니다. hook 이 실패해도 돈의 상태는 그대로입니다.
   ===================================================================== */
'use strict';

const events = require('../events');
const money = require('../money');
const tenantReg = require('../tenant');

/* ADAPTER 훅 이름 → CORE 이벤트 이름 */
const HOOKS = {
  onPaid: 'payment.paid',
  onRefunded: 'payment.refunded',
  onFailed: 'payment.failed',
  onExceptionOpened: 'payment.exception_opened',
  onExceptionClosed: 'payment.exception_closed'
};

/* 돈의 상태와 연결되는 훅 — 실패하면 재처리 대상으로 기록합니다 */
const TRACKED_HOOKS = ['onPaid', 'onRefunded'];

const REQUIRED = ['tenant', 'orderPrefix', 'resolveProduct', 'validateInput'];
const OPTIONAL_FN = ['orderName', 'completeUrl', 'refundPolicyText'].concat(Object.keys(HOOKS));

/* resolveProduct 가 돌려줄 수 있는 유일한 키 집합 */
const PRODUCT_FIELDS = ['productRef', 'amount', 'currency', 'name', 'active'];

/* 이벤트 payload 가 가질 수 있는 유일한 키 집합 — 사업 도메인 값은 없습니다 */
const PAID_EVENT_FIELDS = ['event', 'tenant', 'orderId', 'orderNo', 'provider', 'amount', 'currency', 'paidAt', 'paymentKey'];
const REFUND_EVENT_FIELDS = ['event', 'tenant', 'orderId', 'orderNo', 'provider', 'amount', 'currency', 'refundedAt', 'transactionKey', 'actorRef'];

function err(code, detail) {
  const e = new Error(code + (detail ? ':' + detail : ''));
  e.code = code;
  return e;
}

function shape(fields, src, eventName) {
  const out = {};
  fields.forEach(function (k) {
    if (src && src[k] !== undefined && src[k] !== null) out[k] = src[k];
  });
  if (eventName) out.event = eventName;
  return out;
}
function shapePaidEvent(src) { return shape(PAID_EVENT_FIELDS, src, 'payment.paid'); }
function shapeRefundEvent(src) { return shape(REFUND_EVENT_FIELDS, src, 'payment.refunded'); }

/* ── 계약 검사 ─────────────────────────────────────────────── */
function validate(adapter) {
  const a = adapter || {};
  const problems = [];

  if (typeof a.tenant !== 'string' || !tenantReg.isWellFormed(a.tenant)) problems.push('tenant must be a well-formed slug');
  if (typeof a.orderPrefix !== 'string' || !new RegExp('^[A-Z][A-Z0-9]{1,7}$').test(a.orderPrefix)) problems.push('orderPrefix must be 2~8 upper alnum');
  if (typeof a.resolveProduct !== 'function') problems.push('resolveProduct is required');
  if (typeof a.validateInput !== 'function') problems.push('validateInput is required');

  /* ★ resolveProduct 는 클라이언트 금액을 받을 자리가 없어야 합니다.
     (productRef, ctx) 두 개까지만 허용합니다. */
  if (typeof a.resolveProduct === 'function' && a.resolveProduct.length > 2) {
    problems.push('resolveProduct must take at most (productRef, ctx) — no client amount');
  }

  OPTIONAL_FN.forEach(function (k) {
    if (a[k] !== undefined && typeof a[k] !== 'function') problems.push(k + ' must be a function when present');
  });

  return { ok: problems.length === 0, problems: problems };
}

function assertAdapter(adapter) {
  const v = validate(adapter);
  if (!v.ok) throw err('PAY_ADAPTER_CONTRACT_INVALID', v.problems.join(' · '));
  return true;
}

/* ── 서버 권위 가격 (S-3) ───────────────────────────────────
   ctx 에는 금액이 없습니다. Adapter 는 클라이언트 금액을 볼 수 없습니다. */
async function resolveProduct(adapter, productRef, ctx) {
  if (!productRef || typeof productRef !== 'string') return { ok: false, code: 'PAY_PRODUCT_REF_REQUIRED' };

  let spec;
  try {
    spec = await adapter.resolveProduct(String(productRef), {
      tenant: adapter.tenant,
      locale: (ctx && ctx.locale) || null
      /* ★ amount 없음 — 클라이언트 금액은 여기까지 오지 않습니다 */
    });
  } catch (e) {
    return { ok: false, code: 'PAY_ADAPTER_RESOLVE_FAILED', detail: String((e && e.message) || e).slice(0, 200) };
  }

  if (!spec || typeof spec !== 'object') return { ok: false, code: 'PAY_PRODUCT_NOT_FOUND', productRef: productRef };
  if (spec.active === false) return { ok: false, code: 'PAY_PRODUCT_NOT_AVAILABLE', productRef: productRef };
  if (spec.productRef !== undefined && String(spec.productRef) !== String(productRef)) {
    return { ok: false, code: 'PAY_PRODUCT_REF_MISMATCH', expected: productRef, got: String(spec.productRef) };
  }

  const extra = Object.keys(spec).filter(k => PRODUCT_FIELDS.indexOf(k) < 0);
  if (extra.length) return { ok: false, code: 'PAY_PRODUCT_SPEC_INVALID', detail: 'unexpected fields: ' + extra.join(',') };

  try {
    money.assertAmount(spec.amount, spec.currency);
  } catch (e) {
    return { ok: false, code: 'PAY_ADAPTER_PRICE_INVALID', detail: e.code || String(e.message) };
  }
  if (typeof spec.name !== 'string' || !spec.name.trim()) {
    return { ok: false, code: 'PAY_PRODUCT_SPEC_INVALID', detail: 'name required' };
  }

  return {
    ok: true,
    product: {
      productRef: String(productRef),
      amount: Number(spec.amount),
      currency: String(spec.currency).toUpperCase(),
      name: String(spec.name).slice(0, 200)
    }
  };
}

/* ── 사업별 입력 검증 → adapter_meta ───────────────────────── */
async function validateInput(adapter, input, ctx) {
  let r;
  try {
    r = await adapter.validateInput(input === undefined ? null : input, { tenant: adapter.tenant, productRef: (ctx && ctx.productRef) || null });
  } catch (e) {
    return { ok: false, code: 'PAY_ADAPTER_VALIDATE_FAILED', detail: String((e && e.message) || e).slice(0, 200) };
  }
  if (!r || typeof r !== 'object') return { ok: false, code: 'PAY_INPUT_INVALID' };
  if (r.ok === false) return { ok: false, code: r.code || 'PAY_INPUT_INVALID', field: r.field || null };

  const meta = r.meta === undefined || r.meta === null ? {} : r.meta;
  if (typeof meta !== 'object' || Array.isArray(meta)) return { ok: false, code: 'PAY_ADAPTER_META_INVALID' };
  return { ok: true, meta: meta };
}

/* ── 표시용 값 (전부 선택 · 없으면 CORE 가 기본값을 씁니다) ── */
async function orderName(adapter, args) {
  if (typeof adapter.orderName !== 'function') return (args && args.product && args.product.name) || null;
  try { const v = await adapter.orderName(args); return typeof v === 'string' && v.trim() ? v.slice(0, 200) : ((args.product && args.product.name) || null); }
  catch (e) { return (args && args.product && args.product.name) || null; }
}
async function completeUrl(adapter, args) {
  if (typeof adapter.completeUrl !== 'function') return null;
  try { const v = await adapter.completeUrl(args); return typeof v === 'string' ? v.slice(0, 500) : null; }
  catch (e) { return null; }
}
async function refundPolicyText(adapter) {
  if (typeof adapter.refundPolicyText !== 'function') return null;
  try { const v = await adapter.refundPolicyText(); return typeof v === 'string' ? v.slice(0, 4000) : null; }
  catch (e) { return null; }
}

/* ── 이벤트 연결 ───────────────────────────────────────────── */
function attach(emitter, adapter) {
  const a = adapter || {};
  const attached = [];
  Object.keys(HOOKS).forEach(function (hook) {
    if (typeof a[hook] === 'function') {
      emitter.on(HOOKS[hook], function (payload) { return a[hook](payload); });
      attached.push(hook);
    }
  });
  return { attached: attached };
}

function describe() {
  return {
    coreResponsibility: ['order/payment state', 'amount invariants', 'provider call', 'approval',
      'failure/indeterminate', 'idempotency', 'payment ledger', 'refund ledger', 'exception', 'audit', 'actor', 'tenant isolation'],
    adapterResponsibility: ['which product', 'authoritative price', 'display name', 'business input validation',
      'post-payment processing', 'post-refund processing', 'complete destination', 'refund policy text'],
    required: REQUIRED.slice(),
    optional: OPTIONAL_FN.slice(),
    trackedHooks: TRACKED_HOOKS.slice(),
    eventNames: events.NAMES.slice(),
    productFields: PRODUCT_FIELDS.slice(),
    paidEventFields: PAID_EVENT_FIELDS.slice(),
    refundEventFields: REFUND_EVENT_FIELDS.slice(),
    coreReadsAdapterMeta: false,
    hookFailureAffectsMoneyState: false,
    returnValueAffectsCore: false
  };
}

module.exports = {
  HOOKS, TRACKED_HOOKS, REQUIRED, OPTIONAL_FN, PRODUCT_FIELDS, PAID_EVENT_FIELDS, REFUND_EVENT_FIELDS,
  validate, assertAdapter, resolveProduct, validateInput, orderName, completeUrl, refundPolicyText,
  shapePaidEvent, shapeRefundEvent, attach, describe
};
