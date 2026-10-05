'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './pay.module.css';

/**
 * Toss 결제위젯.
 *
 * 결제수단 선택과 토스 측 약관 동의는 **토스가 그린 화면**에서 이루어진다.
 * 우리가 카드 UI 를 만들지 않는다 — 결제수단이 늘어도 이 파일은 그대로다.
 *
 * ★ 이 컴포넌트는 금액을 정하지 않는다. 서버가 상품표에서 읽어 주문에 박아 둔
 *   값을 그대로 `setAmount` 에 넘길 뿐이다. 설령 브라우저에서 이 값을 바꿔도
 *   승인 단계에서 서버가 주문 금액과 다시 대조해 막는다(PAY_AMOUNT_MISMATCH).
 *
 * ★ 여기 오는 clientKey 는 **공개키**다. 토스가 브라우저에 쓰라고 주는 값이고
 *   비밀키(secret)는 서버에만 있다.
 *
 * 주의 : 결제위젯은 금액이 정해진 **뒤에** 그려야 한다. 그래서 setAmount →
 *   render 순서를 지키고, 다 그려질 때까지 결제 버튼을 누를 수 없게 둔다.
 */

type Props = {
  clientKey: string;
  /** CORE 가 만든 사업자용 주문번호 */
  providerOrderId: string;
  orderName: string;
  amount: number;
  customerEmail: string | null;
  successUrl: string;
  failUrl: string;
};

type Widgets = {
  setAmount(a: { value: number; currency: string }): Promise<void>;
  renderPaymentMethods(p: { selector: string; variantKey?: string }): Promise<unknown>;
  renderAgreement(p: { selector: string; variantKey?: string }): Promise<unknown>;
  requestPayment(p: Record<string, unknown>): Promise<void>;
};
type TossPaymentsSdk = (clientKey: string) => {
  widgets(p: { customerKey: string }): Widgets;
};

declare global {
  interface Window { TossPayments?: TossPaymentsSdk }
}

const SDK = 'https://js.tosspayments.com/v2/standard';
const METHODS_ID = 'toss-payment-methods';
const AGREEMENT_ID = 'toss-agreement';
/* 비회원 구매라 고객 식별자를 만들지 않는다 */
const ANONYMOUS = 'ANONYMOUS';

/** 결제 모듈을 한 번만 받아 온다. 두 번 불러도 script 는 하나다. */
function loadSdk(): Promise<TossPaymentsSdk> {
  if (window.TossPayments) return Promise.resolve(window.TossPayments);
  return new Promise((resolve, reject) => {
    const found = document.querySelector<HTMLScriptElement>('script[data-toss="1"]');
    const el = found ?? document.createElement('script');
    el.addEventListener('load', () => {
      const sdk = window.TossPayments;
      if (sdk) resolve(sdk);
      else reject(new Error('sdk-missing'));
    }, { once: true });
    el.addEventListener('error', () => reject(new Error('sdk-load')), { once: true });
    if (!found) {
      el.src = SDK;
      el.async = true;
      el.dataset.toss = '1';
      document.head.appendChild(el);
    }
  });
}

/* 토스 측 약관 UI. variantKey 가 상점에 없을 수도 있으니 기본값으로 한 번 더 시도한다.
   약관 화면이 없으면 일부 결제수단이 거부되므로 조용히 건너뛰지 않는다. */
async function renderAgreement(w: Widgets, selector: string) {
  try {
    await w.renderAgreement({ selector, variantKey: 'AGREEMENT' });
  } catch {
    await w.renderAgreement({ selector });
  }
}

/** 지난 번에 그린 iframe 이 남아 있으면 지우고 시작한다 (다시 붙었을 때의 잔해) */
function clear(id: string) {
  const el = document.getElementById(id);
  if (el) el.replaceChildren();
}

const MAX_TRIES = 3;

export default function TossPaymentButton(p: Props) {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const widgets = useRef<Widgets | null>(null);

  useEffect(() => {
    let cancelled = false;
    let tries = 0;

    /**
     * ★ 한 번 실패했다고 포기하지 않는다.
     *   주문 화면에서 이 화면으로 넘어오는 길은 화면 전환(클라이언트 이동)이라,
     *   그리는 도중에 컴포넌트가 다시 붙으면 그리던 위젯이 통째로 날아간다.
     *   그때 손님에게 남는 것은 눌리지 않는 결제 버튼뿐이다 —
     *   그래서 새 인스턴스로 다시 그린다.
     */
    async function init() {
      tries += 1;
      try {
        const TossPayments = await loadSdk();
        if (cancelled) return;

        clear(METHODS_ID);
        clear(AGREEMENT_ID);

        const w = TossPayments(p.clientKey).widgets({ customerKey: ANONYMOUS });

        /* ★ 금액을 먼저 못 박고 그린다. 순서를 바꾸면 위젯이 금액을 모른 채 뜬다. */
        await w.setAmount({ currency: 'KRW', value: p.amount });
        if (cancelled) return;

        /* 두 영역은 서로를 기다릴 이유가 없다. 차례로 그리면 각각의 대기가 그대로
           더해져서(실측 4.8s + 2.2s) 손님은 그동안 눌리지 않는 버튼을 본다. */
        await Promise.all([
          w.renderPaymentMethods({ selector: '#' + METHODS_ID, variantKey: 'DEFAULT' }),
          renderAgreement(w, '#' + AGREEMENT_ID),
        ]);
        if (cancelled) return;

        widgets.current = w;
        setReady(true);
      } catch (e) {
        if (cancelled) return;
        const msg = String((e as { message?: string })?.message ?? '');
        console.error(`[book/pay] 결제위젯 준비 실패(${tries}/${MAX_TRIES}):`, msg.slice(0, 200));
        if (tries < MAX_TRIES) {
          setTimeout(() => { if (!cancelled) init(); }, 600 * tries);
          return;
        }
        setError('결제 화면을 불러오지 못했습니다. 화면을 새로고침해 주세요.');
      }
    }

    init();
    return () => { cancelled = true; };
  }, [p.clientKey, p.amount]);

  async function pay() {
    const w = widgets.current;
    if (busy || !w) return;
    setBusy(true);
    setError(null);
    try {
      /* ★ 금액을 다시 넘기지 않는다. 위젯이 setAmount 로 받은 값을 쓴다. */
      await w.requestPayment({
        orderId: p.providerOrderId,
        orderName: p.orderName,
        successUrl: p.successUrl,
        failUrl: p.failUrl,
        ...(p.customerEmail ? { customerEmail: p.customerEmail } : {}),
      });
      /* 여기까지 오면 결제가 시작됐고, 끝나면 토스가 successUrl / failUrl 로 보낸다 */
    } catch (e) {
      /* 창을 닫은 것은 실패가 아니다 */
      const code = String((e as { code?: string })?.code ?? '');
      setError(code === 'USER_CANCEL' ? null : '결제를 진행하지 못했습니다. 다시 시도해 주세요.');
      setBusy(false);
    }
  }

  return (
    <>
      <div id={METHODS_ID} className={styles.widget} />
      <div id={AGREEMENT_ID} className={styles.widget} />

      {!ready && !error && <p className={styles.loading}>결제 화면을 준비하고 있습니다…</p>}

      <button type="button" className={styles.cta} onClick={pay} disabled={!ready || busy}>
        {busy ? '결제를 진행하는 중…' : `${p.amount.toLocaleString('ko-KR')}원 결제하기`}
      </button>
      {error && <p className={styles.warn} role="alert">{error}</p>}
    </>
  );
}
