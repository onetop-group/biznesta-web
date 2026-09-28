import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BusinessInfo from '@/components/site/BusinessInfo';
import { CONSULT_EMAIL, CONSULT_PHONE } from '@/data/business';
import { formatPrice, getBook } from '@/lib/book/catalog';
import { paymentReadiness } from '@/lib/book/payment';
import styles from '../checkout.module.css';

/**
 * 결제창 단계.
 *
 * 주문은 이미 만들어졌고(CORE 가 금액을 고정했다), 남은 것은 PG 결제창을 띄우는
 * 일뿐이다. 그 연결은 Toss 계약과 키가 들어온 뒤(STEP E)에 이 자리에 붙는다.
 *
 * ★ 여기서 금액을 다시 계산하지 않는다. 결제창에 넘길 금액은 주문에 적힌 값이고,
 *   그 값은 CORE 가 상품표에서 읽어 고정한 것이다.
 */

type Params = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export const metadata: Metadata = { title: '결제', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

export default async function Page({ params, searchParams }: Params) {
  const { slug } = await params;
  const orderNo = one((await searchParams).order).slice(0, 40);
  const p = await getBook(slug);
  if (!p) notFound();

  const { ready } = paymentReadiness();

  return (
    <main className={styles.wrap}>
      <p className={styles.eyebrow}>BIZNESTA BOOK</p>
      <h1 className={styles.title}>결제</h1>

      <section className={styles.summary} aria-label="주문 내역">
        <p className={styles.sumName}>{p.name}</p>
        <p className={styles.sumKind}>주문번호 {orderNo || '—'}</p>
        <div className={styles.sumRow}>
          <span className={styles.sumLabel}>결제 금액</span>
          <span className={styles.sumPrice}>{formatPrice(p.amount, p.currency)}</span>
        </div>
      </section>

      <div className={styles.notice} role="note">
        <p className={styles.noticeTitle}>결제창 연결을 준비하고 있습니다</p>
        <p>
          주문은 정상적으로 접수되었습니다{orderNo ? ` (${orderNo})` : ''}.
          카드 결제창 연결이 열리는 대로 안내드리겠습니다. 급하시면
          {' '}<a href={`tel:${CONSULT_PHONE.replace(/-/g, '')}`}>{CONSULT_PHONE}</a> 또는
          {' '}<a href={`mailto:${CONSULT_EMAIL}`}>{CONSULT_EMAIL}</a> 로 연락하시거나
          {' '}<Link href={`/book/contact?product=${p.productRef}`}>문의를 남겨</Link> 주세요.
        </p>
      </div>

      {!ready && (
        <div className={styles.policy}>
          <p>· 결제 연결이 아직 열리지 않아 이 단계에서 멈춥니다. 결제된 금액은 없습니다.</p>
        </div>
      )}

      <Link href={`/book/${p.productRef}`} className={styles.back}>← 상품 설명으로 돌아가기</Link>

      <BusinessInfo />
    </main>
  );
}
