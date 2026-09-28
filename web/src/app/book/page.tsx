import type { Metadata } from 'next';
import Link from 'next/link';
import BusinessInfo from '@/components/site/BusinessInfo';
import Breadcrumb from '@/components/book/Breadcrumb';
import { assetsFor } from '@/lib/book/assets';
import { AUTHOR, KIND_LABEL, STATUS_LABEL, formatPrice, listBooks } from '@/lib/book/catalog';
import { bookStoreMode, canShowBuy } from '@/lib/book/store-state';
import styles from './book.module.css';

/**
 * BIZNESTA BOOK — 전자책 스토어 목록.
 *
 * 한 권짜리 화면이 아니다. 상품표(biz_products)에 책이 늘면 여기에 그대로 늘어난다.
 * 새 책을 위해 페이지를 만들 필요가 없다.
 *
 * 보이는 책은 DB 가 정한다 — RLS 가 `status in ('selling','coming')` 만 연다.
 * 작성 중(draft)·판매중지(stopped)는 여기까지 오지도 않는다.
 *
 * 색인하지 않는다 — 정식 오픈 전이고, 기존 sitemap·robots 설정은 건드리지 않는다.
 */
export const metadata: Metadata = {
  title: 'BIZNESTA BOOK',
  description: '비즈네스타가 만든 전자책을 판매하는 공식 스토어입니다.',
  alternates: { canonical: '/book' },
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const mode = bookStoreMode();
  const result = await listBooks();
  const books = result.ok ? result.books : [];
  const showBuy = canShowBuy(mode);

  return (
    <>
      <Breadcrumb trail={[{ label: 'HOME', href: '/' }, { label: 'BIZNESTA BOOK' }]} />

      <main className={styles.wrap}>
        <header className={styles.head}>
          <p className={styles.brand}>BIZNESTA BOOK</p>
          <h1 className={styles.title}>비즈네스타 전자책</h1>
          <p className={styles.lead}>
            작은 사업이 스스로 고객을 만들어 가는 방법을, 실제로 해 본 경험으로 정리했습니다.
          </p>
        </header>

        {/* 결제 연결 전 — 손님에게는 구매로 이어지는 길을 내보내지 않는다 */}
        {mode === 'soon' && (
          <section className={styles.soon} aria-label="준비 중">
            <p className={styles.soonMark}>OPENING SOON</p>
            <h2 className={styles.soonTitle}>전자책 스토어를 준비하고 있습니다</h2>
            <p className={styles.soonBody}>
              비즈네스타가 만든 전자책을 곧 이곳에서 만나실 수 있습니다.
              준비가 끝나면 이 페이지에서 바로 안내드리겠습니다.
            </p>
            <Link href="/book/contact" className={styles.soonLink}>문의 남기기</Link>
          </section>
        )}

        {mode === 'preview' && (
          <p className={styles.previewBar} role="note">
            <b>준비 중인 화면입니다.</b> 결제 연결 전이라 실제 결제는 되지 않지만,
            구매 흐름을 끝까지 눌러 보며 확인하실 수 있습니다.
          </p>
        )}

        {books.length === 0 ? (
          <p className={styles.empty}>
            아직 공개된 책이 없습니다. 첫 책이 준비되면 이곳에 올라옵니다.
          </p>
        ) : (
          <ul className={styles.grid}>
            {books.map((b) => {
              const a = assetsFor(b.productRef);
              const href = `/book/${b.productRef}`;
              /* OPENING SOON 일 때는 상세로 가는 길도 내지 않는다 —
                 상세페이지 이미지 안에 구매 문구가 그려져 있어 오해를 부른다. */
              const linkable = showBuy;
              return (
                <li key={b.productRef} className={styles.card}>
                  {a && (linkable ? (
                    <Link href={href} className={styles.coverLink}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className={`${styles.cover} ${b.status === 'coming' ? styles.coverSoon : ''}`}
                           src={a.cover} width={a.coverSize.width} height={a.coverSize.height}
                           alt={`${b.name} 표지`} />
                    </Link>
                  ) : (
                    <span className={styles.coverLink}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className={`${styles.cover} ${styles.coverSoon}`} src={a.cover}
                           width={a.coverSize.width} height={a.coverSize.height} alt={`${b.name} 표지`} />
                    </span>
                  ))}

                  <div className={styles.body}>
                    <span className={`${styles.badge} ${b.status === 'selling' ? styles.badgeSelling : styles.badgeComing}`}>
                      {showBuy ? STATUS_LABEL[b.status] : '출시 준비 중'}
                    </span>

                    <h2 className={styles.name}>
                      {linkable ? <Link href={href}>{b.name}</Link> : b.name}
                    </h2>

                    {b.description && <p className={styles.desc}>{b.description}</p>}
                    <p className={styles.meta}>저자 {AUTHOR} · {KIND_LABEL[b.kind] ?? '디지털 상품'}</p>

                    {showBuy && b.status === 'selling' ? (
                      <p className={styles.price}>{formatPrice(b.amount, b.currency)}</p>
                    ) : (
                      <p className={styles.priceSoon}>출시 준비 중</p>
                    )}

                    {linkable ? (
                      <Link href={href} className={styles.more}>상세보기</Link>
                    ) : (
                      <span className={`${styles.more} ${styles.moreOff}`}>준비 중</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <p className={styles.foot}>
          전자책 관련 문의는 <Link href="/book/contact" className={styles.footLink}>BIZNESTA BOOK 문의</Link>로 보내 주세요.
        </p>
      </main>

      <BusinessInfo />
    </>
  );
}
