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
const TENANT = 'biznesta';

export async function startCheckout(formData: FormData) {
  const slug = String(formData.get('slug') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().slice(0, 254);
  /* 두 가지를 따로 받는다.
       confirm  청약철회 제한 등 '고지를 확인했다' — 법률상 동의가 아니다
       privacy  개인정보 수집·이용 '동의'  — 법률상 동의가 필요한 사항
     한 칸으로 묶으면 확인과 동의가 구분되지 않는다. */
  const confirmed = formData.get('confirm') === 'on';
  const privacyAgreed = formData.get('privacy') === 'on';
  const back = `/book/${encodeURIComponent(slug)}/checkout`;

  const product = await getBook(slug);
  if (!product) redirect('/book');

  if (!EMAIL_RE.test(email)) redirect(`${back}?err=email`);
  if (!confirmed) redirect(`${back}?err=confirm`);
  if (!privacyAgreed) redirect(`${back}?err=privacy`);

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

  /* 주문이 생겼다. 이제 결제 시도를 연다 —
     CORE 가 사업자에게 보낼 주문번호(providerOrderId)를 여기서 만든다.
     ★ 금액은 여기서도 넘기지 않는다. CORE 가 주문에 박힌 값을 그대로 쓴다. */
  const prep = await checkout.flow.prepare({ tenant: TENANT, orderId: r.order.id });
  if (!prep?.ok) {
    console.error('[book/checkout] 결제 시도 실패:', prep?.code ?? 'unknown');
    redirect(`${back}?err=order`);
  }

  /* 결제창으로. 주문 id 는 uuid 라 추측할 수 없고, 이것만으로는 아무것도 못 한다 —
     승인에는 Toss 가 준 paymentKey 가 있어야 하고 금액은 서버가 다시 본다. */
  redirect(`/book/${encodeURIComponent(slug)}/pay?o=${encodeURIComponent(r.order.id)}`);
}
