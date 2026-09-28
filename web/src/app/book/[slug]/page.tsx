import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import BusinessInfo from '@/components/site/BusinessInfo';
import Breadcrumb from '@/components/book/Breadcrumb';
import { COMPANY_NAME } from '@/data/business';
import { assetsFor } from '@/lib/book/assets';
import { AUTHOR, KIND_LABEL, STATUS_LABEL, formatPrice, getBook } from '@/lib/book/catalog';
import { bookStoreMode, canCheckout, canShowBuy } from '@/lib/book/store-state';
import styles from './detail.module.css';

/**
 * 책 상세.
 *
 *   ① 상단 구매 정보 (표지 | 제목·저자·형태·가격·구매 버튼)
 *   ② 확정된 상세페이지 원본 이미지 — 다시 만들지도, 손보지도 않는다
 *   ③ 상품 정보 (이미지 안의 사실을 글자로 다시 적는다)
 *   ④ 마지막 구매 버튼
 *
 * ②를 next/image 로 재인코딩하면 원본이 아니게 되므로 <img> 로 그대로 내보낸다.
 * width:100% · height:auto 라 PC 와 모바일 어디서도 잘리거나 찌그러지지 않는다.
 * 이미지 안에도 「지금 바로 구매하기」 문구가 있지만 그건 그림이라 눌리지 않는다.
 * 그래서 ①과 ④에 **실제로 동작하는 버튼**을 둔다 — 둘 다 같은 곳으로 간다.
 */

type Params = { params: Promise<{ slug: string }> };

/**
 * 구매 버튼. 상단과 하단이 **같은 버튼**이어야 하므로 한 곳에서만 만든다.
 * (렌더 안에서 컴포넌트를 만들면 리액트가 매번 새 컴포넌트로 보기 때문에 밖에 둔다.)
 */
function BuyButton({ buyable, href, priceText }: { buyable: boolean; href: string; priceText: string }) {
  if (!buyable) return <span className={styles.ctaOff}>출시 준비 중</span>;
  return <Link href={href} className={styles.cta}>지금 바로 구매하기 · {priceText}</Link>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const b = await getBook(slug);
  if (!b) return { title: '전자책', robots: { index: false } };
  const a = assetsFor(b.productRef);
  return {
    title: b.name,
    description: b.description ?? `${b.name} — ${KIND_LABEL[b.kind] ?? '디지털 상품'}`,
    alternates: { canonical: `/book/${b.productRef}` },
    robots: { index: false, follow: false },
    openGraph: {
      title: b.name,
      description: b.description ?? undefined,
      images: a ? [{ url: a.cover, width: a.coverSize.width, height: a.coverSize.height, alt: b.name }] : undefined,
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const mode = bookStoreMode();

  /* OPENING SOON 중에는 상세를 열지 않는다 — 상세페이지 이미지 안에 구매
     문구가 그려져 있어 "살 수 있다" 는 오해를 부른다. 목록으로 돌려보낸다. */
  if (!canShowBuy(mode)) redirect('/book');

  const b = await getBook(slug);
  /* 작성 중·판매중지 책은 RLS 가 걸러 주므로 여기서 404 가 된다. */
  if (!b) notFound();

  const a = assetsFor(b.productRef);
  const buyable = b.active && b.status === 'selling';
  const checkoutHref = `/book/${b.productRef}/checkout`;
  const priceText = formatPrice(b.amount, b.currency);

  return (
    <>
      <Breadcrumb trail={[
        { label: 'HOME', href: '/' },
        { label: 'BIZNESTA BOOK', href: '/book' },
        { label: b.name },
      ]} />

      <main className={styles.wrap}>
        <h1 className={styles.srOnly}>{b.name}</h1>

        {/* ── ① 상단 구매 정보 ───────────────────────────── */}
        <section className={styles.buyBox} aria-label="상품 구매 정보">
          {a && (
            <div className={styles.coverWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.cover} src={a.cover}
                   width={a.coverSize.width} height={a.coverSize.height}
                   alt={`${b.name} 표지`} fetchPriority="high" />
            </div>
          )}

          <div className={styles.info}>
            <p className={styles.brand}>BIZNESTA BOOK</p>
            <p className={styles.title}>{b.name}</p>

            <span className={`${styles.status} ${b.status === 'selling' ? styles.statusSelling : styles.statusComing}`}>
              {STATUS_LABEL[b.status]}
            </span>

            <dl className={styles.facts}>
              <div className={styles.fact}>
                <dt className={styles.factDt}>저자</dt><dd className={styles.factDd}>{AUTHOR}</dd>
              </div>
              <div className={styles.fact}>
                <dt className={styles.factDt}>형태</dt>
                <dd className={styles.factDd}>{KIND_LABEL[b.kind] ?? '디지털 상품'}</dd>
              </div>
              <div className={styles.fact}>
                <dt className={styles.factDt}>판매가</dt>
                <dd className={styles.factDd}>
                  {buyable ? <span className={styles.price}>{priceText}</span>
                           : <span className={styles.priceSoon}>출시 준비 중</span>}
                </dd>
              </div>
            </dl>

            <p className={styles.note}>
              결제 완료 후 구매 완료 화면에서 바로 내려받아 이용하는 디지털 상품입니다. 배송은 없습니다.
            </p>

            <BuyButton buyable={buyable} href={checkoutHref} priceText={priceText} />

            {buyable && (canCheckout(mode)
              ? <p className={styles.ctaNote}>결제가 완료되면 바로 내려받으실 수 있습니다.</p>
              : <p className={styles.ctaWarn}>
                  결제 연결을 준비하고 있습니다. 구매 화면까지는 지금도 확인하실 수 있습니다.
                </p>)}
          </div>
        </section>

        {/* ── ② 확정된 상세페이지 원본 (수정·재생성하지 않는다) ── */}
        {a && (
          <div className={styles.detailBand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.detail} src={a.detail}
                 width={a.detailSize.width} height={a.detailSize.height}
                 alt={`${b.name} 상세 안내`} />
          </div>
        )}

        {/* ── ③ 상품 정보 ────────────────────────────────── */}
        <section className={`${styles.section} ${styles.info2}`} aria-label="상품 정보">
          <h2 className={styles.infoTitle}>전자책 상품 정보</h2>
          <dl className={styles.rows}>
            <div className={styles.row}><dt className={styles.dt}>상품명</dt><dd className={styles.dd}>{b.name}</dd></div>
            <div className={styles.row}><dt className={styles.dt}>저자</dt><dd className={styles.dd}>{AUTHOR}</dd></div>
            <div className={styles.row}><dt className={styles.dt}>브랜드</dt><dd className={styles.dd}>BIZNESTA BOOK</dd></div>
            <div className={styles.row}><dt className={styles.dt}>형태</dt><dd className={styles.dd}>{KIND_LABEL[b.kind] ?? '디지털 상품'}</dd></div>
            <div className={styles.row}><dt className={styles.dt}>판매가</dt><dd className={styles.dd}>{priceText}</dd></div>
            <div className={styles.row}><dt className={styles.dt}>판매자</dt><dd className={styles.dd}>{COMPANY_NAME}</dd></div>
            <div className={styles.row}>
              <dt className={styles.dt}>이용 방법</dt>
              <dd className={styles.dd}>결제 완료 후 구매 완료 화면에서 바로 내려받는 디지털 상품입니다. 배송은 없습니다.</dd>
            </div>
          </dl>

          {/* 정책은 상품정보 바로 아래에서 찾을 수 있어야 한다.
              ★ 확정된 상세페이지 이미지에는 글자를 더하지 않는다 — 이미지 바깥이다. */}
          <p className={styles.links}>
            <Link href="/book/terms" className={styles.link}>BIZNESTA BOOK 이용약관</Link>
            <Link href="/book/refund" className={styles.link}>환불·취소·청약철회 정책</Link>
            <Link href="/privacy" className={styles.link}>개인정보처리방침</Link>
            <Link href={`/book/contact?product=${b.productRef}`} className={styles.link}>이 책 문의하기</Link>
          </p>
        </section>

        {/* ── ④ 마지막 구매 버튼 (상단과 같은 곳으로 간다) ── */}
        <section className={styles.finalCta} aria-label="구매">
          <p className={styles.finalLead}>지금, 당신의 작은 사업에</p>
          <p className={styles.finalName}>{b.name}</p>
          <BuyButton buyable={buyable} href={checkoutHref} priceText={priceText} />
        </section>

        <div className={styles.section}>
          <Link href="/book" className={styles.back}>← BIZNESTA BOOK 목록</Link>
        </div>
      </main>

      <BusinessInfo />
    </>
  );
}
