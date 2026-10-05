import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import BusinessInfo from '@/components/site/BusinessInfo';
import Breadcrumb from '@/components/book/Breadcrumb';
import { CONSULT_EMAIL, CONSULT_PHONE } from '@/data/business';
import { RETURN_BASE } from '@/lib/site';
import { assetsFor } from '@/lib/book/assets';
import { AUTHOR, KIND_LABEL, formatPrice, getBook } from '@/lib/book/catalog';
import { getCheckout } from '@/lib/book/payment';
import { bookStoreMode, canShowBuy } from '@/lib/book/store-state';
import TossPaymentButton from './TossPaymentButton';
import styles from './pay.module.css';

/**
 * 결제창 단계.
 *
 * 주문과 결제 시도는 이미 서버에서 만들어졌다. 이 화면이 하는 일은
 * **그 값을 그대로 Toss 에 넘기는 것**뿐이다. 금액을 다시 계산하지 않는다.
 *
 * 주소에 오는 것은 주문 id(uuid) 하나다. 그것만으로는 아무것도 할 수 없다 —
 * 승인에는 Toss 가 발급한 paymentKey 가 필요하고, 금액은 승인 때 서버가
 * 주문에 박힌 값과 다시 대조한다.
 */

type Params = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = { title: '결제', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TENANT = 'biznesta';

export default async function Page({ params, searchParams }: Params) {
  const { slug } = await params;
  const orderId = one((await searchParams).o);

  if (!canShowBuy(bookStoreMode())) redirect('/book');
  const b = await getBook(slug);
  if (!b) notFound();
  if (!UUID.test(orderId)) redirect(`/book/${b.productRef}/checkout`);

  const checkout = getCheckout();
  if (!checkout.ready) redirect(`/book/${b.productRef}/checkout?err=not_ready`);

  /* 주문과 열린 결제 시도를 서버에서 다시 읽는다. 화면이 보낸 값을 믿지 않는다. */
  const order = await checkout.db.getOrder(TENANT, orderId);
  if (!order) redirect(`/book/${b.productRef}/checkout`);
  if (order.status !== 'PENDING') {
    /* 이미 결제된 주문이면 완료 화면으로 */
    redirect(order.status === 'PAID' ? `/book/${b.productRef}/complete` : `/book/${b.productRef}`);
  }
  if (order.product_ref !== b.productRef) redirect(`/book/${b.productRef}`);

  const intent = await checkout.db.getOpenIntent(TENANT, orderId);
  if (!intent) redirect(`/book/${b.productRef}/checkout`);

  const a = assetsFor(b.productRef);
  const amount = Number(order.amount);
  /* ★ 결제 후 돌아올 곳은 '지금 이 배포' 다 (lib/site.ts 의 RETURN_BASE 주석 참고) */
  const base = RETURN_BASE;

  return (
    <>
      <Breadcrumb trail={[
        { label: 'HOME', href: '/' },
        { label: 'BIZNESTA BOOK', href: '/book' },
        { label: b.name, href: `/book/${b.productRef}` },
        { label: '결제' },
      ]} />

      <main className={styles.wrap}>
        <p className={styles.eyebrow}>BIZNESTA BOOK</p>
        <h1 className={styles.title}>결제</h1>

        <section className={styles.summary} aria-label="결제 내역">
          {a && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img className={styles.cover} src={a.cover}
                 width={a.coverSize.width} height={a.coverSize.height} alt={`${b.name} 표지`} />
          )}
          <div className={styles.body}>
            <p className={styles.name}>{b.name}</p>
            <p className={styles.meta}>저자 {AUTHOR} · {KIND_LABEL[b.kind] ?? '디지털 상품'}</p>
            <p className={styles.orderNo}>주문번호 {order.order_no}</p>
            <div className={styles.row}>
              <span className={styles.rowLabel}>결제 금액</span>
              <span className={styles.price}>{formatPrice(amount, order.currency)}</span>
            </div>
          </div>
        </section>

        <TossPaymentButton
          clientKey={checkout.publicClientKey}
          providerOrderId={intent.provider_order_id}
          orderName={b.name}
          amount={amount}
          customerEmail={null}
          successUrl={`${base}/book/${b.productRef}/pay/success?o=${orderId}`}
          failUrl={`${base}/book/${b.productRef}/pay/fail?o=${orderId}`}
        />

        <div className={styles.policy}>
          <p>· 결제가 끝나면 구매 완료 화면에서 전자책을 내려받으실 수 있습니다.</p>
          <p>
            · <Link href="/book/terms">이용약관</Link> ·{' '}
            <Link href="/book/refund">환불·취소·청약철회 정책</Link> ·{' '}
            <Link href="/privacy">개인정보처리방침</Link>
          </p>
          <p>· 결제에 문제가 있으면 {CONSULT_PHONE} 또는 {CONSULT_EMAIL} 로 연락해 주세요.</p>
        </div>

        <Link href={`/book/${b.productRef}/checkout`} className={styles.back}>← 주문 화면으로</Link>
      </main>

      <BusinessInfo />
    </>
  );
}
