'use server';

import { redirect } from 'next/navigation';
import { getBook } from '@/lib/book/catalog';
import { getCheckout } from '@/lib/book/payment';

/**
 * 비회원 구매 시작.
 *
 * 순서가 중요하다.
 *   ① 상품을 **서버에서** 다시 읽는다 — 화면이 보낸 금액은 쓰지 않는다.
 *      (애초에 이 함수는 금액을 받지도 않는다.)
 *   ② 이메일 → biz_buyers 행. 개인정보는 여기서 멈춘다.
 *   ③ CORE 가 주문을 만든다. 금액은 CORE 가 Adapter 를 통해 상품표에서 직접 읽는다.
 *
 * 결제 준비가 안 됐으면 주문을 만들지 않는다 — 결제할 수 없는 주문을 쌓지 않는다.
 */

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function startCheckout(formData: FormData) {
  const slug = String(formData.get('slug') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().slice(0, 254);
  const agreed = formData.get('agree') === 'on';
  const back = `/book/${encodeURIComponent(slug)}/checkout`;

  const product = await getBook(slug);
  if (!product) redirect('/book');

  if (!EMAIL_RE.test(email)) redirect(`${back}?err=email`);
  if (!agreed) redirect(`${back}?err=agree`);

  const checkout = getCheckout();
  if (!checkout.ready) redirect(`${back}?err=not_ready`);

  /* eslint-disable @typescript-eslint/no-require-imports */
  const { beginGuestPurchase } = require('@payment/biznesta/index');
  /* eslint-enable @typescript-eslint/no-require-imports */

  const r = await beginGuestPurchase(checkout.flow, checkout.store, {
    email,
    productRef: product.productRef,
    /* ★ amount 를 넘기지 않는다. 넘기면 CORE 는 '대조' 만 하지만,
       아예 안 넘기면 클라이언트 금액이 개입할 자리 자체가 없다. */
  });

  if (!r?.ok) {
    console.error('[book/checkout] 주문 생성 실패:', r?.code ?? 'unknown');
    redirect(`${back}?err=order`);
  }

  /* 주문이 생겼다. 다음은 결제창이다 — 결제 연결(STEP E)에서 이어진다. */
  redirect(`/book/${encodeURIComponent(slug)}/checkout/pay?order=${encodeURIComponent(r.order.orderNo)}`);
}
