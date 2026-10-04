import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BusinessInfo from '@/components/site/BusinessInfo';
import Breadcrumb from '@/components/book/Breadcrumb';
import { CONSULT_EMAIL, CONSULT_PHONE } from '@/data/business';
import { getBook } from '@/lib/book/catalog';
import styles from '../pay.module.css';

/**
 * 결제가 끝나지 못했을 때.
 *
 * ★ 결제된 돈은 없다. 승인(confirm)이 끝나야 결제가 완료되고, 여기로 왔다는 것은
 *   승인까지 가지 못했다는 뜻이다. 그 사실을 분명히 적는다 — 가장 불안한 순간이다.
 *
 * 실패 사유를 자세히 적지 않는다. 구매자가 할 수 있는 일(다시 시도·문의)만 말한다.
 */

type Params = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = { title: '결제 실패', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

/** 구매자에게 도움이 되는 말만 고른다 */
function message(reason: string, tossMessage: string) {
  if (reason === 'PAY_AMOUNT_MISMATCH') {
    return '결제 금액이 주문 금액과 달라 승인하지 않았습니다. 처음부터 다시 진행해 주세요.';
  }
  if (reason === 'mismatch' || reason === 'args') {
    return '주문 정보를 확인하지 못했습니다. 상품 페이지에서 다시 시작해 주세요.';
  }
  if (tossMessage) return tossMessage;
  return '결제가 완료되지 않았습니다. 다시 시도해 주세요.';
}

export default async function Page({ params, searchParams }: Params) {
  const { slug } = await params;
  const sp = await searchParams;
  const b = await getBook(slug);
  if (!b) notFound();

  /* Toss 가 실패로 돌려보낼 때 붙이는 값 · 우리가 붙이는 값 둘 다 받는다 */
  const reason = one(sp.r) || one(sp.code);
  const tossMessage = one(sp.message).slice(0, 200);

  return (
    <>
      <Breadcrumb trail={[
        { label: 'HOME', href: '/' },
        { label: 'BIZNESTA BOOK', href: '/book' },
        { label: b.name, href: `/book/${b.productRef}` },
        { label: '결제 실패' },
      ]} />

      <main className={styles.wrap}>
        <p className={styles.eyebrow}>BIZNESTA BOOK</p>
        <h1 className={styles.title}>결제가 완료되지 않았습니다</h1>

        <div className={styles.failBox} role="alert">
          <p className={styles.failTitle}>결제된 금액은 없습니다</p>
          <p className={styles.failBody}>{message(reason, tossMessage)}</p>
        </div>

        <Link href={`/book/${b.productRef}/checkout`} className={styles.cta}>다시 시도하기</Link>

        <div className={styles.policy}>
          <p>· 카드사 승인이 보류된 것처럼 보이더라도, 승인되지 않은 결제는 자동으로 취소됩니다.</p>
          <p>
            · 같은 문제가 반복되면{' '}
            <Link href={`/book/contact?product=${b.productRef}`}>BIZNESTA BOOK 문의</Link>
            {' '}또는 {CONSULT_PHONE} · {CONSULT_EMAIL} 로 알려 주세요.
          </p>
        </div>

        <Link href={`/book/${b.productRef}`} className={styles.back}>← 책 설명으로 돌아가기</Link>
      </main>

      <BusinessInfo />
    </>
  );
}
