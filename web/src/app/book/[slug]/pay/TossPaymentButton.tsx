'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './pay.module.css';

/**
 * Toss 결제창을 여는 버튼.
 *
 * ★ 이 컴포넌트는 금액을 정하지 않는다. 서버가 상품표에서 읽어 주문에 박아 둔
 *   값을 그대로 받아 Toss 에 넘길 뿐이다. 설령 브라우저에서 이 값을 바꿔도
 *   승인 단계에서 서버가 주문 금액과 다시 대조해 막는다(PAY_AMOUNT_MISMATCH).
 *
 * ★ 여기 오는 clientKey 는 **공개키**다. Toss 가 브라우저에 쓰라고 주는 값이고
 *   비밀키(secret)는 서버에만 있다.
 *
 * 버튼은 처음부터 눌릴 수 있다. 모듈은 화면이 뜨는 동안 미리 받아 두지만,
 * 아직 안 왔으면 누른 뒤 기다린다 — '준비 중' 이라 눌리지 않는 버튼을 두면
 * 구매자는 고장으로 읽는다.
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

type TossPaymentsSdk = (clientKey: string) => {
  payment: (opts: { customerKey: string }) => {
    requestPayment: (args: Record<string, unknown>) => Promise<void>;
  };
};

declare global {
  interface Window { TossPayments?: TossPaymentsSdk; ANONYMOUS?: string }
}

const SDK = 'https://js.tosspayments.com/v2/standard';

/** 결제 모듈을 한 번만 받아 온다. 두 번 불러도 script 는 하나다. */
function loadSdk(): Promise<TossPaymentsSdk> {
  if (window.TossPayments) return Promise.resolve(window.TossPayments);
  return new Promise((resolve, reject) => {
    const found = document.querySelector<HTMLScriptElement>(`script[data-toss="1"]`);
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

export default function TossPaymentButton(p: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sdk = useRef<Promise<TossPaymentsSdk> | null>(null);

  /* 화면이 뜨는 동안 미리 받아 둔다. 실패하면 누를 때 다시 알려 준다. */
  useEffect(() => {
    const pending = loadSdk();
    pending.catch(() => {});
    sdk.current = pending;
  }, []);

  async function pay() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const TossPayments = await (sdk.current ??= loadSdk());
      /* 비회원 구매라 고객 식별자를 만들지 않는다 */
      const payment = TossPayments(p.clientKey).payment({
        customerKey: window.ANONYMOUS ?? 'ANONYMOUS',
      });
      await payment.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: p.amount },
        orderId: p.providerOrderId,
        orderName: p.orderName,
        successUrl: p.successUrl,
        failUrl: p.failUrl,
        ...(p.customerEmail ? { customerEmail: p.customerEmail } : {}),
        card: { useEscrow: false, flowMode: 'DEFAULT', useCardPoint: false, useAppCardOnly: false },
      });
      /* 여기까지 오면 결제창이 열렸고, 끝나면 Toss 가 successUrl / failUrl 로 보낸다 */
    } catch (e) {
      const code = (e as { code?: string })?.code ?? '';
      const msg = (e as { message?: string })?.message ?? '';
      if (String(msg).startsWith('sdk-')) {
        setError('결제 모듈을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
        sdk.current = null;                       /* 다음 클릭에서 다시 받아 본다 */
      } else if (code === 'USER_CANCEL') {
        setError(null);                           /* 창을 닫은 것은 실패가 아니다 */
      } else {
        setError('결제를 진행하지 못했습니다. 다시 시도해 주세요.');
      }
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" className={styles.cta} onClick={pay} disabled={busy}>
        {busy ? '결제창을 여는 중…' : `${p.amount.toLocaleString('ko-KR')}원 결제하기`}
      </button>
      {error && <p className={styles.warn} role="alert">{error}</p>}
    </>
  );
}
