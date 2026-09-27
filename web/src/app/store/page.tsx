import type { Metadata } from 'next';
import Link from 'next/link';
import BusinessInfo from '@/components/site/BusinessInfo';
import { assetsFor } from '@/lib/store/assets';
import { KIND_LABEL, formatPrice, listStoreProducts } from '@/lib/store/catalog';
import styles from './store.module.css';

/**
 * BIZNESTA STORE 목록.
 *
 * 판매 중인 상품만 보인다(초안·판매중지는 DB 의 RLS 가 걸러 준다).
 * 한 건도 없으면 **가짜 상품을 만들지 않고** 그대로 "준비 중" 을 보여준다.
 *
 * 색인하지 않는다 — 기존 sitemap(PUBLIC_ROUTES)·robots 설정은 건드리지 않는다.
 */
export const metadata: Metadata = {
  title: 'STORE',
  description: '비즈네스타가 만든 디지털 상품을 판매합니다.',
  alternates: { canonical: '/store' },
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const result = await listStoreProducts();
  const products = result.ok ? result.products : [];

  return (
    <main className={styles.wrap}>
      <p className={styles.brand}>BIZNESTA</p>
      <h1 className={styles.title}>STORE</h1>
      <p className={styles.lead}>비즈네스타가 만든 디지털 상품을 이곳에서 판매합니다.</p>

      {products.length === 0 ? (
        <section className={styles.notice} role="note">
          <h2 className={styles.noticeTitle}>준비 중입니다</h2>
          <p className={styles.noticeBody}>
            아직 판매 중인 상품이 없습니다. 상품이 준비되면 이 페이지에서 바로 안내드리겠습니다.
            제작 문의는 상담 페이지로 보내 주세요.
          </p>
        </section>
      ) : (
        <ul className={styles.cards}>
          {products.map((p) => {
            const a = assetsFor(p.productRef);
            return (
              <li key={p.productRef} className={styles.card}>
                <Link href={`/store/${p.productRef}`} className={styles.cardLink}>
                  {a && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img className={styles.cover} src={a.cover}
                         width={a.coverSize.width} height={a.coverSize.height} alt="" />
                  )}
                  <span className={styles.cardBody}>
                    <span className={styles.cardKind}>{KIND_LABEL[p.kind] ?? '디지털 상품'}</span>
                    <span className={styles.cardName}>{p.name}</span>
                    {p.description && <span className={styles.cardDesc}>{p.description}</span>}
                    <span className={styles.cardPrice}>{formatPrice(p.amount, p.currency)}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <Link href="/contact" className={styles.back}>상담 문의하기</Link>

      <BusinessInfo />
    </main>
  );
}
