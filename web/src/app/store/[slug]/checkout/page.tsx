import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BusinessInfo from '@/components/site/BusinessInfo';
import { CONSULT_EMAIL, CONSULT_PHONE } from '@/data/business';
import { KIND_LABEL, formatPrice, getStoreProduct } from '@/lib/store/catalog';
import { paymentReadiness } from '@/lib/store/payment';
import { startCheckout } from './actions';
import styles from './checkout.module.css';

/**
 * 주문 화면 (비회원 구매).
 *
 * 받는 것은 이메일 하나뿐이다. 디지털 상품이라 배송지가 없고, 이름·전화번호도
 * 전달에 필요하지 않다. 이메일은 결제한 사람이 나중에 다시 받아 볼 유일한 통로다.
 *
 * 금액은 화면에 '보여줄' 뿐이다. 주문 금액은 서버가 상품표에서 다시 읽는다.
 */

type Params = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export const metadata: Metadata = { title: '주문', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

const ERR: Record<string, string> = {
  email: '이메일 주소를 다시 확인해 주세요. 결제 후 이 주소로 열람 링크를 보내 드립니다.',
  agree: '구매 조건에 동의해 주셔야 결제를 진행할 수 있습니다.',
  not_ready: '지금은 결제를 받을 수 없습니다. 잠시 후 다시 시도해 주세요.',
  order: '주문을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.',
};

export default async function Page({ params, searchParams }: Params) {
  const { slug } = await params;
  const err = one((await searchParams).err);
  const p = await getStoreProduct(slug);
  if (!p) notFound();

  const { ready } = paymentReadiness();

  return (
    <main className={styles.wrap}>
      <p className={styles.eyebrow}>BIZNESTA BOOK</p>
      <h1 className={styles.title}>주문</h1>

      <section className={styles.summary} aria-label="주문 내역">
        <p className={styles.sumName}>{p.name}</p>
        <p className={styles.sumKind}>{KIND_LABEL[p.kind] ?? '디지털 상품'} · 저자 원미희</p>
        <div className={styles.sumRow}>
          <span className={styles.sumLabel}>결제 금액</span>
          <span className={styles.sumPrice}>{formatPrice(p.amount, p.currency)}</span>
        </div>
      </section>

      {err && <p className={styles.warn} role="alert">{ERR[err] ?? '입력을 다시 확인해 주세요.'}</p>}

      {!ready && (
        <div className={styles.notice} role="note">
          <p className={styles.noticeTitle}>결제 연결을 준비하고 있습니다</p>
          <p>
            카드 결제 연결이 아직 열리지 않았습니다. 지금 구매를 원하시면
            {' '}<a href={`tel:${CONSULT_PHONE.replace(/-/g, '')}`}>{CONSULT_PHONE}</a> 또는
            {' '}<a href={`mailto:${CONSULT_EMAIL}`}>{CONSULT_EMAIL}</a> 로 연락해 주세요.
          </p>
        </div>
      )}

      <form action={startCheckout}>
        <input type="hidden" name="slug" value={p.productRef} />

        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">
            이메일 <span className={styles.req}>*</span>
          </label>
          <input id="email" name="email" type="email" className={styles.input}
                 inputMode="email" autoComplete="email" maxLength={254}
                 placeholder="name@example.com" required disabled={!ready} />
          <span className={styles.hint}>
            결제가 끝나면 이 주소로 열람 링크를 보내 드립니다. 주소가 틀리면 받아 보실 수 없습니다.
          </span>
        </div>

        <label className={styles.agree}>
          <input type="checkbox" name="agree" disabled={!ready} />
          <span>
            디지털 콘텐츠 상품이며, 열람 링크가 발급되면 청약철회가 제한될 수 있다는 점과
            {' '}<Link href="/privacy">개인정보처리방침</Link>에 동의합니다.
          </span>
        </label>

        <button type="submit" className={styles.cta} disabled={!ready}>
          {ready ? `${formatPrice(p.amount, p.currency)} 결제하기` : '결제 준비 중'}
        </button>
      </form>

      <div className={styles.policy}>
        <p>· 배송되는 상품이 아닙니다. 결제 후 이메일로 보내 드리는 링크로 열람합니다.</p>
        <p>· 열람 링크가 발급되기 전에는 전액 환불됩니다.</p>
        <p>· 환불·취소 문의는 {CONSULT_PHONE} 또는 {CONSULT_EMAIL} 로 접수해 주세요.</p>
      </div>

      <Link href={`/store/${p.productRef}`} className={styles.back}>← 상품 설명으로 돌아가기</Link>

      <BusinessInfo />
    </main>
  );
}
