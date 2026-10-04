import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import BusinessInfo from '@/components/site/BusinessInfo';
import Breadcrumb from '@/components/book/Breadcrumb';
import { CONSULT_EMAIL, CONSULT_PHONE } from '@/data/business';
import { assetsFor } from '@/lib/book/assets';
import { AUTHOR, KIND_LABEL, formatPrice, getBook } from '@/lib/book/catalog';
import { ACCESS_COOKIE } from '@/lib/book/access-cookie';
import { downloadConfigured, productFileReady } from '@/lib/book/download';
import styles from './complete.module.css';

/**
 * 구매 완료 화면.
 *
 * 여기서 바로 전자책을 받아 가는 것이 확정된 제공 방식이다(이메일 발송이 아니다).
 *
 * 다운로드 버튼을 켜는 조건은 셋이고, 하나라도 없으면 켜지 않는다.
 *   ① 구매 권한 쿠키가 있다        — 이 브라우저가 산 사람인가
 *   ② 그 상품에 파일이 연결돼 있다 — 아직 없으면 「준비 중」
 *   ③ 서버가 서명할 수 있다        — service_role 키가 설정돼 있는가
 * ★ 켜져 있어도 실제 발급은 누를 때 서버가 다시 판정한다. 화면은 판정하지 않는다.
 */

type Params = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = { title: '구매 완료', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

const DL_MSG: Record<string, string> = {
  no_access: '구매 정보를 확인하지 못했습니다. 구매하신 기기와 브라우저에서 다시 시도해 주세요.',
  denied: '다운로드 권한을 확인하지 못했습니다. 환불·취소된 주문이거나 권한이 만료된 경우일 수 있습니다.',
  file_missing: '전자책 파일을 불러오지 못했습니다. 문의해 주시면 바로 확인해 드리겠습니다.',
  not_ready: '다운로드를 준비하고 있습니다. 잠시 후 다시 시도해 주세요.',
};

export default async function Page({ params, searchParams }: Params) {
  const { slug } = await params;
  const dl = one((await searchParams).dl);

  const b = await getBook(slug);
  if (!b) notFound();

  const a = assetsFor(b.productRef);
  const jar = await cookies();
  const hasAccess = Boolean(jar.get(ACCESS_COOKIE)?.value);
  const fileReady = await productFileReady(b.productRef);
  const canDownload = hasAccess && fileReady && downloadConfigured();

  return (
    <>
      <Breadcrumb trail={[
        { label: 'HOME', href: '/' },
        { label: 'BIZNESTA BOOK', href: '/book' },
        { label: b.name, href: `/book/${b.productRef}` },
        { label: '구매 완료' },
      ]} />

      <main className={styles.wrap}>
        <p className={styles.eyebrow}>BIZNESTA BOOK</p>
        <h1 className={styles.title}>구매 완료</h1>
        <p className={styles.lead}>구매가 완료되었습니다. 아래에서 전자책을 받아 보실 수 있습니다.</p>

        {dl && DL_MSG[dl] && <p className={styles.warn} role="alert">{DL_MSG[dl]}</p>}

        <section className={styles.card} aria-label="구매 내역">
          {a && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img className={styles.cover} src={a.cover}
                 width={a.coverSize.width} height={a.coverSize.height} alt={`${b.name} 표지`} />
          )}
          <div className={styles.body}>
            <p className={styles.name}>{b.name}</p>
            <p className={styles.meta}>저자 {AUTHOR} · {KIND_LABEL[b.kind] ?? '디지털 상품'}</p>
            <div className={styles.row}>
              <span className={styles.rowLabel}>결제 금액</span>
              <span className={styles.price}>{formatPrice(b.amount, b.currency)}</span>
            </div>
          </div>
        </section>

        {canDownload ? (
          <>
            <a href={`/book/${b.productRef}/download`} className={styles.cta}>전자책 다운로드</a>
            <p className={styles.ctaNote}>
              다운로드 주소는 잠시 뒤 만료됩니다. 만료되어도 이 화면에서 다시 받으실 수 있습니다.
            </p>
          </>
        ) : (
          <>
            {/* ★ 못 받는 이유가 셋인데 한 문구로 뭉뚱그리면 안 된다.
                특히 '구매 확인이 안 되는' 사람에게 "잠시 후 받으실 수 있습니다" 라고
                하면 영원히 기다리게 된다. 각자 할 수 있는 일을 말해 준다. */}
            <span className={styles.ctaOff}>
              {fileReady ? '전자책 다운로드' : '전자책 파일 준비 중'}
            </span>
            <div className={styles.notice} role="note">
              {!fileReady ? (
                <>
                  <p className={styles.noticeTitle}>전자책 파일 준비 중입니다</p>
                  <p>전자책 파일은 정식 판매 시작 전에 연결됩니다. 연결되면 이 화면에서 바로 받아 보실 수 있습니다.</p>
                </>
              ) : !hasAccess ? (
                <>
                  <p className={styles.noticeTitle}>이 브라우저에서는 구매 내역을 확인할 수 없습니다</p>
                  <p>
                    결제하신 브라우저에서 이 화면을 열면 바로 받으실 수 있습니다.
                    기기를 바꾸셨거나 브라우저 기록을 지우셨다면{' '}
                    <Link href={`/book/contact?product=${b.productRef}`}>BIZNESTA BOOK 문의</Link>
                    {' '}또는 {CONSULT_PHONE} · {CONSULT_EMAIL} 로 주문번호와 함께 알려 주세요.
                    확인 후 다시 받으실 수 있도록 도와드립니다.
                  </p>
                </>
              ) : (
                <>
                  <p className={styles.noticeTitle}>다운로드를 준비하고 있습니다</p>
                  <p>잠시 후 이 화면에서 바로 받아 보실 수 있습니다.</p>
                </>
              )}
            </div>
          </>
        )}

        <div className={styles.help}>
          <p>· 받으시는 데 문제가 있으면 <Link href={`/book/contact?product=${b.productRef}`}>BIZNESTA BOOK 문의</Link>로 알려 주세요.</p>
          <p>· 전화 <a href={`tel:${CONSULT_PHONE.replace(/-/g, '')}`}>{CONSULT_PHONE}</a> · 이메일 <a href={`mailto:${CONSULT_EMAIL}`}>{CONSULT_EMAIL}</a></p>
          <p className={styles.links}>
            <Link href="/book/terms">이용약관</Link>
            <Link href="/book/refund">환불·취소·청약철회 정책</Link>
            <Link href="/privacy">개인정보처리방침</Link>
          </p>
        </div>

        <Link href="/book" className={styles.back}>← BIZNESTA BOOK 목록</Link>
      </main>

      <BusinessInfo />
    </>
  );
}
