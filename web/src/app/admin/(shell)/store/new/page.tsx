import Link from 'next/link';
import { PageHead } from '@/components/admin/ui';
import { PRODUCT_KINDS } from '@/lib/admin/store-products';
import { createProductAction } from '../actions';
import styles from '../store.module.css';

export const metadata = { title: '새 상품' };

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

const ERR: Record<string, string> = {
  ref: '상품 식별자는 영문 소문자로 시작하고, 소문자·숫자·붙임표만 3~64자로 적어 주세요.',
  name: '상품명을 입력해 주세요.',
  amount: '판매가는 1원 이상의 숫자로 입력해 주세요.',
  kind: '상품 유형을 골라 주세요.',
  currency: '지금은 원화(KRW)만 판매할 수 있습니다.',
  duplicate: '같은 상품 식별자가 이미 있습니다. 다른 값을 써 주세요.',
  save: '저장하지 못했습니다. 잠시 후 다시 시도해 주세요.',
};

/**
 * 새 상품 등록.
 *
 * ★ 판매상태를 고르는 칸이 없다. 새 상품은 언제나 '초안' 으로 태어난다
 *   (DB 기본값). 만들자마자 실수로 팔리는 일이 없어야 하기 때문이다.
 *   판매 시작은 상세 화면에서 따로 누른다.
 */
export default async function Page({ searchParams }: { searchParams: Promise<SP> }) {
  const err = one((await searchParams).err);

  return (
    <>
      <PageHead title="새 상품" desc="등록하면 초안으로 저장됩니다. 판매는 확인 후 따로 시작합니다." />

      {err && <p className={styles.warn} role="alert">{ERR[err] ?? '입력을 다시 확인해 주세요.'}</p>}

      <form action={createProductAction} className={styles.card}>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">상품명 <span className={styles.req}>*</span></label>
            <input id="name" name="name" className={styles.input} maxLength={200} required />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="kind">상품 유형 <span className={styles.req}>*</span></label>
            <select id="kind" name="kind" className={styles.select} defaultValue="ebook">
              {PRODUCT_KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="product_ref">상품 식별자 <span className={styles.req}>*</span></label>
            <input id="product_ref" name="product_ref" className={styles.input} maxLength={64}
                   placeholder="ebook-first-book" pattern="[a-z][a-z0-9-]{2,63}" required />
            <span className={styles.hint}>
              주문과 영구히 이어지는 값입니다. <b>등록 후에는 바꿀 수 없습니다.</b>
              영문 소문자·숫자·붙임표만 씁니다.
            </span>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="amount">판매가(원) <span className={styles.req}>*</span></label>
            <input id="amount" name="amount" className={styles.input} inputMode="numeric"
                   maxLength={20} placeholder="19000" required />
            <input type="hidden" name="currency" value="KRW" />
            <span className={styles.hint}>결제 금액은 언제나 여기 저장된 값입니다.</span>
          </div>

          <div className={`${styles.field} ${styles.fieldWide}`}>
            <label className={styles.label} htmlFor="description">간단한 설명</label>
            <textarea id="description" name="description" className={styles.textarea} maxLength={300} />
            <span className={styles.hint}>목록에 한 줄로 보입니다. 상세페이지 본문이 아닙니다(300자).</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.primary}>초안으로 등록</button>
          <Link href="/admin/store" className={styles.btn}>취소</Link>
        </div>
      </form>
    </>
  );
}
