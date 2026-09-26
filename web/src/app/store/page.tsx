import type { Metadata } from 'next';
import Link from 'next/link';
import { listStoreProducts, formatPrice } from '@/lib/store/catalog';
import styles from './store.module.css';

/**
 * BIZNESTA STORE — 골격.
 *
 * 지금은 판매 상품이 없다. 그래서 이 페이지는 **가짜 상품을 만들지 않고**
 * 상품 0건 상태를 그대로 "준비 중" 으로 보여준다.
 *
 * 색인하지 않는다 — 준비 중 페이지가 검색에 잡히면 안 되고,
 * 기존 sitemap(PUBLIC_ROUTES)·robots 설정은 건드리지 않는다.
 */
export const metadata: Metadata = {
  title: 'STORE',
  description: '비즈네스타 디지털 상품 스토어입니다.',
  alternates: { canonical: '/store' },
  robots: { index: false, follow: false },
};

/* 상품표는 언제든 바뀐다. 빌드 시점에 굳히지 않는다. */
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
        <ul className={styles.list}>
          {products.map((p) => (
            <li key={p.productRef} className={styles.item}>
              <span className={styles.itemName}>{p.name}</span>
              <span className={styles.itemPrice}>{formatPrice(p.amount, p.currency)}</span>
            </li>
          ))}
        </ul>
      )}

      <Link href="/contact" className={styles.back}>상담 문의하기</Link>
    </main>
  );
}
