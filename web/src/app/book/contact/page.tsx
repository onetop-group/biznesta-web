import type { Metadata } from 'next';
import Link from 'next/link';
import BusinessInfo from '@/components/site/BusinessInfo';
import Breadcrumb from '@/components/book/Breadcrumb';
import { CONSULT_EMAIL, CONSULT_PHONE } from '@/data/business';
import { assetsFor } from '@/lib/book/assets';
import { getBook } from '@/lib/book/catalog';
import { BOOK_INQUIRY_TYPES } from '@/lib/book/inquiry';
import { submitBookInquiry } from './actions';
import styles from './contact.module.css';

/**
 * BIZNESTA BOOK 전용 문의.
 *
 * 홈페이지 제작 상담(`/contact`)과 갈라 둔다 — 전자책 구매·열람·환불 문의가
 * 제작 문의와 섞이면 둘 다 놓친다.
 *
 * 어떤 책인지는 주소에서 온다 (`?product=<product_ref>`). 특정 책에
 * 하드코딩하지 않는다 — 책이 늘어도 상세페이지가 자기 product_ref 를
 * 붙여 보내면 여기서 그대로 받아 이름을 찾아 보여준다.
 */

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

export const metadata: Metadata = {
  title: 'BIZNESTA BOOK 문의',
  description: '비즈네스타 전자책 상품·구매·열람·환불 문의를 받습니다.',
  alternates: { canonical: '/book/contact' },
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

const ERR: Record<string, string> = {
  name: '이름을 입력해 주세요.',
  contact: '연락처를 다시 확인해 주세요.',
  email: '이메일 주소를 다시 확인해 주세요. 답변을 이 주소로 보내 드립니다.',
  type: '문의 유형을 골라 주세요.',
  message: '문의 내용을 조금 더 적어 주세요.',
  privacy: '개인정보 수집 및 이용에 동의해 주셔야 접수할 수 있습니다.',
  product: '문의 상품을 확인하지 못했습니다. 다시 시도해 주세요.',
  rate: '잠시 후 다시 시도해 주세요. 짧은 시간에 너무 많이 보내셨습니다.',
  unavailable: '지금은 문의를 접수할 수 없습니다. 아래 연락처로 보내 주세요.',
  save: '접수하지 못했습니다. 잠시 후 다시 시도하시거나 아래 연락처로 보내 주세요.',
};

export default async function Page({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const productRef = one(sp.product).slice(0, 64);
  const err = one(sp.err);
  const sent = one(sp.sent) === '1';

  /* 상품 이름은 서버에서 찾는다 — 주소에 적힌 이름을 믿지 않는다. */
  const book = productRef ? await getBook(productRef) : null;
  const assets = book ? assetsFor(book.productRef) : null;

  return (
    <>
      <Breadcrumb trail={[
        { label: 'HOME', href: '/' },
        { label: 'BIZNESTA BOOK', href: '/book' },
        ...(book ? [{ label: book.name, href: `/book/${book.productRef}` }] : []),
        { label: '문의' },
      ]} />

      <main className={styles.wrap}>
        <p className={styles.eyebrow}>BIZNESTA BOOK</p>
        <h1 className={styles.title}>전자책 문의</h1>
        <p className={styles.lead}>
          상품 내용, 구매·결제, 열람 링크, 환불·취소까지 전자책에 관한 문의를 남겨 주세요.
          홈페이지 제작 상담은 <Link href="/contact">제작 상담</Link>으로 보내 주시면 더 빠릅니다.
        </p>

        {sent && (
          <div className={styles.done} role="status">
            <p className={styles.doneTitle}>문의를 접수했습니다</p>
            <p className={styles.doneBody}>
              남겨 주신 이메일로 답변드리겠습니다. 급하신 경우 {CONSULT_PHONE} 으로 연락 주세요.
            </p>
          </div>
        )}

        {err && <p className={styles.warn} role="alert">{ERR[err] ?? '입력을 다시 확인해 주세요.'}</p>}

        {/* 어떤 책에 대한 문의인지 — 다시 적지 않아도 된다 */}
        {book ? (
          <section className={styles.product} aria-label="문의 상품">
            {assets && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img className={styles.productCover} src={assets.cover}
                   width={assets.coverSize.width} height={assets.coverSize.height} alt="" />
            )}
            <div>
              <p className={styles.productLabel}>문의 상품</p>
              <p className={styles.productName}>{book.name}</p>
              <Link href="/book/contact" className={styles.productChange}>다른 문의로 바꾸기</Link>
            </div>
          </section>
        ) : (
          <p className={styles.productNone}>
            특정 책에 대한 문의라면 그 책의 상세페이지에서 <b>문의하기</b>를 눌러 주세요.
            어떤 책인지 자동으로 함께 전달됩니다.
          </p>
        )}

        <form action={submitBookInquiry}>
          {/* 어떤 책인지는 숨은 칸으로 함께 간다 */}
          <input type="hidden" name="product" value={book ? book.productRef : ''} />
          <div className={styles.hp} aria-hidden="true">
            <label htmlFor="website">이 칸은 비워 두세요</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="type">문의 유형 <span className={styles.req}>*</span></label>
            <select id="type" name="type" className={styles.select} defaultValue="product" required>
              {BOOK_INQUIRY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">이름 <span className={styles.req}>*</span></label>
            <input id="name" name="name" className={styles.input} maxLength={100}
                   autoComplete="name" required />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">이메일 <span className={styles.req}>*</span></label>
            <input id="email" name="email" type="email" className={styles.input} maxLength={200}
                   inputMode="email" autoComplete="email" placeholder="name@example.com" required />
            <span className={styles.hint}>답변을 이 주소로 보내 드립니다.</span>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact">연락처 <span className={styles.req}>*</span></label>
            <input id="contact" name="contact" type="tel" className={styles.input} maxLength={50}
                   inputMode="tel" autoComplete="tel" placeholder="010-0000-0000" required />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="message">문의 내용 <span className={styles.req}>*</span></label>
            <textarea id="message" name="message" className={styles.textarea} maxLength={2000} required />
          </div>

          <label className={styles.agree}>
            <input type="checkbox" name="privacy" required />
            <span>
              문의 답변을 위한 개인정보(이름·이메일·연락처) 수집 및 이용에 동의합니다.
              자세한 내용은 <Link href="/privacy">개인정보처리방침</Link>을 확인해 주세요.
            </span>
          </label>

          <button type="submit" className={styles.cta}>문의하기</button>
        </form>

        <div className={styles.direct}>
          <p>바로 연락하고 싶으신가요?</p>
          <p>
            전화 <a href={`tel:${CONSULT_PHONE.replace(/-/g, '')}`}>{CONSULT_PHONE}</a>
            {' · '}이메일 <a href={`mailto:${CONSULT_EMAIL}`}>{CONSULT_EMAIL}</a>
          </p>
        </div>

        <Link href={book ? `/book/${book.productRef}` : '/book'} className={styles.back}>
          ← {book ? '책 설명으로 돌아가기' : 'BIZNESTA BOOK 목록'}
        </Link>
      </main>

      <BusinessInfo />
    </>
  );
}
