import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BusinessInfo from '@/components/site/BusinessInfo';
import { COMPANY_NAME } from '@/data/business';
import { assetsFor } from '@/lib/store/assets';
import { KIND_LABEL, formatPrice, getStoreProduct } from '@/lib/store/catalog';
import { paymentConfigured } from '@/lib/store/payment';
import styles from './detail.module.css';

/**
 * 상품 상세페이지.
 *
 * 본문은 **확정된 상세페이지 이미지 원본 한 장**이다. 다시 만들지도, 손보지도
 * 않는다. next/image 로 재인코딩하면 원본이 아니게 되므로 <img> 로 그대로 내보낸다.
 * width:100% · height:auto 라 PC 와 모바일 어디서도 잘리거나 찌그러지지 않는다.
 *
 * 이미지 안에도 「지금 바로 구매하기」 문구가 있지만 그건 그림이라 눌리지 않는다.
 * 그래서 이미지 아래에 **실제로 동작하는 구매 버튼**을 따로 둔다.
 *
 * 이미지 위·아래의 글자는 새 판매 문구가 아니라, 이미지 안에 이미 있는 사실을
 * 기계가 읽을 수 있게 옮겨 적은 것이다(화면낭독기 · 검색 · 결제 심사).
 */

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = await getStoreProduct(slug);
  if (!p) return { title: '상품', robots: { index: false } };
  const a = assetsFor(p.productRef);
  return {
    title: p.name,
    description: p.description ?? `${p.name} — ${KIND_LABEL[p.kind] ?? '디지털 상품'}`,
    alternates: { canonical: `/store/${p.productRef}` },
    openGraph: {
      title: p.name,
      description: p.description ?? undefined,
      images: a ? [{ url: a.cover, width: a.coverSize.width, height: a.coverSize.height, alt: p.name }] : undefined,
    },
  };
}

/* 상품표는 언제든 바뀐다. 빌드 시점에 굳히지 않는다. */
export const dynamic = 'force-dynamic';

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const p = await getStoreProduct(slug);
  /* 판매 중이 아닌 상품은 RLS 가 걸러 준다 → 여기서 404.
     "파는 것처럼 보이는데 못 사는" 상태를 만들지 않는다. */
  if (!p) notFound();

  const a = assetsFor(p.productRef);
  const ready = paymentConfigured();

  return (
    <main className={styles.wrap}>
      <h1 className={styles.srOnly}>{p.name}</h1>

      {a ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          className={styles.detail}
          src={a.detail}
          width={a.detailSize.width}
          height={a.detailSize.height}
          alt={`${p.name} 상세 안내`}
          fetchPriority="high"
        />
      ) : (
        <div className={styles.section}>
          <p>상세 안내를 준비 중입니다.</p>
        </div>
      )}

      {/* ── 실제로 동작하는 구매 버튼 ───────────────────────── */}
      <section className={styles.buy} aria-label="구매">
        <p className={styles.buyName}>{p.name}</p>
        <p className={styles.buyKind}>{KIND_LABEL[p.kind] ?? '디지털 상품'}</p>
        <p className={styles.buyPrice}>{formatPrice(p.amount, p.currency)}</p>

        <Link href={`/store/${p.productRef}/checkout`} className={styles.cta}>
          지금 바로 구매하기 · {formatPrice(p.amount, p.currency)}
        </Link>

        {ready ? (
          <p className={styles.ctaNote}>
            결제 후 이메일로 열람 링크를 보내 드립니다. 배송되는 상품이 아닙니다.
          </p>
        ) : (
          <p className={styles.ctaWarn}>
            현재 결제 연결을 준비하고 있습니다. 결제가 열리면 이 버튼에서 바로 구매하실 수 있습니다.
          </p>
        )}
      </section>

      {/* ── 거래 정보 (이미지 안의 내용을 글자로 다시 적는다) ── */}
      <section className={`${styles.section} ${styles.info}`} aria-label="상품 정보">
        <h2 className={styles.infoTitle}>전자책 상품 정보</h2>
        <dl className={styles.rows}>
          <div className={styles.row}><dt className={styles.dt}>상품명</dt><dd className={styles.dd}>{p.name}</dd></div>
          <div className={styles.row}><dt className={styles.dt}>저자</dt><dd className={styles.dd}>원미희</dd></div>
          <div className={styles.row}><dt className={styles.dt}>브랜드</dt><dd className={styles.dd}>BIZNESTA BOOK</dd></div>
          <div className={styles.row}><dt className={styles.dt}>형태</dt><dd className={styles.dd}>{KIND_LABEL[p.kind] ?? '디지털 상품'}</dd></div>
          <div className={styles.row}><dt className={styles.dt}>판매가</dt><dd className={styles.dd}>{formatPrice(p.amount, p.currency)}</dd></div>
          <div className={styles.row}><dt className={styles.dt}>판매자</dt><dd className={styles.dd}>{COMPANY_NAME}</dd></div>
          <div className={styles.row}>
            <dt className={styles.dt}>이용 방법</dt>
            <dd className={styles.dd}>결제 후 이메일로 보내 드리는 열람 링크로 받아 보시는 디지털 상품입니다. 배송은 없습니다.</dd>
          </div>
        </dl>

        <p className={styles.links}>
          <Link href="/privacy" className={styles.link}>개인정보처리방침</Link>
          <Link href="/contact" className={styles.link}>구매 문의</Link>
        </p>

        <Link href="/store" className={styles.back}>← STORE 목록</Link>
      </section>

      <BusinessInfo />
    </main>
  );
}
