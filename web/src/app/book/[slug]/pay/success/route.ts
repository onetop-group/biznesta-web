import { cookies } from 'next/headers';
import { ACCESS_COOKIE, accessCookieOptions } from '@/lib/book/access-cookie';
import { getCheckout } from '@/lib/book/payment';

/**
 * Toss 결제 성공 콜백.
 *
 * Toss 는 우리가 준 successUrl 로 돌아오면서 paymentKey · orderId · amount 를 붙인다.
 * **그 값을 그대로 믿지 않는다.** 서버가 다시 전부 대조한다.
 *
 *   ① 우리 주문 id 는 우리가 만든 successUrl 에 들어 있다 (?o=) — Toss 가 준 게 아니다
 *   ② Toss 가 돌려준 orderId 가 그 주문의 '열린 시도' 와 같은가
 *   ③ Toss 가 돌려준 금액이 주문 금액과 같은가  ← CORE 가 한 번 더 본다
 *   ④ 그제서야 CORE 가 사업자에게 승인을 요청하고 PAID 로 적는다
 *
 * 승인이 끝나면 CORE 의 hook 이 구매 권한(entitlement)을 만들고, 그때 발급된
 * 접근 토큰을 httpOnly 쿠키에 담아 구매 완료 화면으로 보낸다.
 */

export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TENANT = 'biznesta';

function to(slug: string, path: string, q = '') {
  return new Response(null, {
    status: 303,
    headers: { Location: `/book/${encodeURIComponent(slug)}${path}${q}`, 'Cache-Control': 'no-store' },
  });
}

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const url = new URL(req.url);

  const orderId = url.searchParams.get('o') ?? '';          /* ① 우리가 넣은 값 */
  const paymentKey = url.searchParams.get('paymentKey') ?? '';
  const providerOrderId = url.searchParams.get('orderId') ?? '';
  const amountRaw = url.searchParams.get('amount') ?? '';

  if (!UUID.test(orderId) || !paymentKey || !providerOrderId) return to(slug, '/pay/fail', '?r=args');

  const checkout = getCheckout();
  if (!checkout.ready) return to(slug, '/checkout', '?err=not_ready');

  /* ② 이 주문의 열린 시도가 Toss 가 말하는 그 주문인가 */
  const intent = await checkout.db.getOpenIntent(TENANT, orderId);
  if (!intent || intent.provider_order_id !== providerOrderId) {
    console.error('[book/pay] 주문번호 불일치');
    return to(slug, '/pay/fail', '?r=mismatch');
  }

  /* ③ 금액. 여기서도 숫자만 받고, 진짜 대조는 CORE 가 주문 금액으로 한다. */
  const amount = Number(amountRaw);
  if (!Number.isFinite(amount) || amount <= 0) return to(slug, '/pay/fail', '?r=amount');

  /* ④ 승인 — 사업자 호출 · 원장 기록 · PAID 전이 · hook 까지 CORE 가 한다 */
  const r = await checkout.flow.confirm({ tenant: TENANT, orderId, paymentKey, amount });

  if (!r?.ok) {
    console.error('[book/pay] 승인 실패:', r?.code ?? 'unknown');
    return to(slug, '/pay/fail', `?r=${encodeURIComponent(String(r?.code ?? 'confirm'))}`);
  }

  /* 승인되면 hook 이 구매 권한을 만들고 접근 토큰을 넘겨 준다.
     그 토큰을 브라우저가 들고 다닐 수 있게 httpOnly 쿠키에 담는다 —
     주소창에 실으면 기록·Referer 로 샌다. */
  const token = checkout.takeAccessToken(orderId);
  if (token) {
    const jar = await cookies();
    jar.set(ACCESS_COOKIE, token, accessCookieOptions);
  }

  return to(slug, '/complete');
}
