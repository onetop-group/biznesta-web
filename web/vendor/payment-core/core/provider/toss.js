/* =====================================================================
   core/provider/toss.js — Toss Payments 구현체 (STEP 1)
   ---------------------------------------------------------------------
   PURPLE SAJU `server/pg/toss.js` 에서 검증된 '패턴'을 가져오되 코드는 새로 씁니다.

   가져온 패턴                      | 새로 쓴 부분
   --------------------------------|------------------------------------------
   의존성 0 · fetch · 8s 타임아웃    | 키를 process.env 에서 직접 읽지 않음
   Basic base64(secret + ':')      |   → 생성자 주입 (ENV guard 가 검증 후 전달)
   Idempotency-Key                 | 오류를 표준 코드로 정규화 (거절/미확정 구분)
   throw 하지 않고 {ok,…|code}      | cancelAmount 시그니처 (부분취소 대비)
   비민감 요약만 저장               | contract.shapePayment allowlist 강제
   setClient() 테스트 대역          |   → 별도 fake provider 파일로 승격

   ★ 이 파일은 process.env 를 읽지 않습니다. 키는 반드시 주입받습니다.
     (ENV guard 를 우회해 설정되는 경로를 원천 차단)
   ===================================================================== */
'use strict';

const E = require('../errors');
const C = require('./contract');

const BASE = 'https://api.tosspayments.com/v1';
const TIMEOUT_MS = 8000;
const NAME = 'toss';

/* Toss 가 명시적으로 '거절'한 것과 '미확정'을 가릅니다.
   이 표에 없는 4xx 는 일단 거절로 봅니다 (사업자가 응답을 준 것이므로 상태는 확정). */
const INDETERMINATE_PROVIDER_CODES = ['PROVIDER_ERROR', 'FAILED_INTERNAL_SYSTEM_PROCESSING', 'UNKNOWN_PAYMENT_ERROR'];

function classify(httpStatus, providerCode) {
  const code = String(providerCode || '');
  if (INDETERMINATE_PROVIDER_CODES.indexOf(code) >= 0) return E.PG.UNREACHABLE;
  if (httpStatus >= 500) return E.PG.UNREACHABLE;            /* 사업자 내부 오류 → 상태 미확정 */
  if (httpStatus >= 400 && httpStatus < 500) return E.PG.DECLINED;
  return E.httpCode(httpStatus);
}

function createTossProvider(cfg) {
  const conf = cfg || {};
  const secretKey = conf.secretKey == null ? '' : String(conf.secretKey).trim();
  const clientKey = conf.clientKey == null ? '' : String(conf.clientKey).trim();
  const declaredMethod = conf.method || null;      /* 'widget' | 'window' — ENV guard 가 선언한 값 */
  const mode = conf.mode || null;                  /* 'test' | 'live'   — ENV guard 가 판정한 값   */
  const fetchImpl = typeof conf.fetch === 'function' ? conf.fetch : (typeof fetch === 'function' ? fetch : null);
  const timeoutMs = Number(conf.timeoutMs) > 0 ? Number(conf.timeoutMs) : TIMEOUT_MS;
  const base = conf.baseUrl ? String(conf.baseUrl).replace(/\/+$/, '') : BASE;

  function authHeader() { return 'Basic ' + Buffer.from(secretKey + ':').toString('base64'); }

  async function call(httpMethod, path, body, idempotencyKey) {
    if (!secretKey) return E.fail(E.PG.NOT_CONFIGURED);
    if (!fetchImpl) return E.fail(E.PG.UNREACHABLE);

    const ctl = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = ctl ? setTimeout(function () { ctl.abort(); }, timeoutMs) : null;
    try {
      const headers = { Authorization: authHeader(), 'Content-Type': 'application/json' };
      if (idempotencyKey) headers['Idempotency-Key'] = String(idempotencyKey).slice(0, 300);
      const r = await fetchImpl(base + path, {
        method: httpMethod,
        headers: headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: ctl ? ctl.signal : undefined
      });
      let j = null;
      try { j = await r.json(); } catch (e) { j = null; }

      if (r.status >= 200 && r.status < 300) {
        if (!j || typeof j !== 'object') return E.fail(E.PG.BAD_RESPONSE, { http: r.status });
        return { ok: true, http: r.status, data: j };
      }
      return E.fail(classify(r.status, j && j.code), {
        http: r.status,
        providerCode: j && j.code ? String(j.code).slice(0, 60) : null
        /* ★ 사업자 message 원문은 담지 않습니다 (개인정보·내부정보 유출 경로) */
      });
    } catch (e) {
      const aborted = e && (e.name === 'AbortError' || e.code === 'ABORT_ERR');
      return E.fail(aborted ? E.PG.TIMEOUT : E.PG.UNREACHABLE);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  /* 사업자 응답 → CORE 표준 payment (allowlist 밖은 버립니다) */
  function toPayment(p) {
    if (!p || typeof p !== 'object') return C.shapePayment({ providerName: NAME });
    const card = p.card || {};
    const easy = p.easyPay || {};
    const receipt = p.receipt || {};
    const cancels = Array.isArray(p.cancels) ? p.cancels : [];
    const lastCancel = cancels.length ? cancels[cancels.length - 1] : null;
    const cancelledSum = cancels.reduce(function (s, c) { return s + (c && c.cancelAmount != null ? Number(c.cancelAmount) : 0); }, 0);
    return C.shapePayment({
      providerName: NAME,
      orderId: p.orderId || null,
      paymentKey: p.paymentKey || null,
      status: p.status || null,
      totalAmount: p.totalAmount != null ? p.totalAmount : null,
      balanceAmount: p.balanceAmount != null ? p.balanceAmount : null,
      currency: p.currency || null,
      approvedAt: p.approvedAt || null,
      method: p.method || null,
      issuer: card.issuerCode || null,
      acquirer: card.acquirerCode || null,
      last4: card.number ? String(card.number).replace(new RegExp('[^0-9]', 'g'), '').slice(-4) : null,
      installmentMonths: card.installmentPlanMonths != null ? card.installmentPlanMonths : null,
      easyPayProvider: easy.provider || null,
      receiptUrl: receipt.url || null,
      cancelledAmount: cancels.length ? cancelledSum : null,
      lastCancelTransactionKey: lastCancel && lastCancel.transactionKey ? String(lastCancel.transactionKey) : null
    });
  }

  return {
    name: NAME,

    status: function () {
      return {
        name: NAME,
        configured: !!secretKey,
        mode: mode,
        clientConfigured: !!clientKey,
        clientMode: mode,          /* ENV guard 가 secret/client mode 일치를 이미 강제합니다 */
        method: declaredMethod,    /* ★ 선언값을 그대로 보고합니다. 키에서 추론하지 않습니다 */
        supportsPartialCancel: true
      };
    },

    /* 승인 : POST /payments/confirm */
    confirm: async function (args) {
      const a = args || {};
      if (!a.paymentKey || !a.orderId || !(Number(a.amount) > 0)) return E.fail(E.PG.INVALID_ARGS);
      const r = await call('POST', '/payments/confirm',
        { paymentKey: String(a.paymentKey), orderId: String(a.orderId), amount: Number(a.amount) },
        'confirm:' + a.orderId);
      if (!r.ok) return r;
      return { ok: true, payment: toPayment(r.data) };
    },

    /* 조회 : GET /payments/orders/{orderId} — 응답 유실 후 실제 상태 확인 */
    getByOrderId: async function (orderId) {
      if (!orderId) return E.fail(E.PG.INVALID_ARGS);
      const r = await call('GET', '/payments/orders/' + encodeURIComponent(String(orderId)));
      if (!r.ok) return r;
      return { ok: true, payment: toPayment(r.data) };
    },

    /* 취소 : POST /payments/{paymentKey}/cancel
       cancelAmount 생략 = 전액. 지정하면 부분취소 (사용은 PHASE 2). */
    cancel: async function (args) {
      const a = args || {};
      if (!a.paymentKey) return E.fail(E.PG.INVALID_ARGS);
      const body = { cancelReason: String(a.reason || 'cancel').slice(0, 200) };
      if (a.cancelAmount != null) {
        if (!(Number(a.cancelAmount) > 0)) return E.fail(E.PG.INVALID_ARGS);
        body.cancelAmount = Number(a.cancelAmount);
      }
      /* 멱등키에 금액을 포함 — 전액취소와 부분취소가 같은 키를 쓰지 않도록 */
      const idem = 'cancel:' + a.paymentKey + ':' + (a.cancelAmount != null ? a.cancelAmount : 'full');
      const r = await call('POST', '/payments/' + encodeURIComponent(String(a.paymentKey)) + '/cancel', body, idem);
      if (!r.ok) return r;
      const list = Array.isArray(r.data.cancels) ? r.data.cancels : [];
      const tx = list.length ? list[list.length - 1] : null;
      return {
        ok: true,
        payment: toPayment(r.data),
        transactionKey: tx && tx.transactionKey ? String(tx.transactionKey) : null,
        cancelAmount: tx && tx.cancelAmount != null ? tx.cancelAmount : null
      };
    }
  };
}

module.exports = { createTossProvider, NAME, BASE, TIMEOUT_MS };
