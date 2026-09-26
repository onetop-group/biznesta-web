import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHead, ProductStatusBadge, fmtDate } from '@/components/admin/ui';
import {
  PRODUCT_KINDS, PRODUCT_STATUSES, PRODUCT_STATUS_LABEL,
  countOrdersFor, formatPrice, getProduct,
} from '@/lib/admin/store-products';
import { changeProductStatusAction, saveProductAction } from '../actions';
import styles from '../store.module.css';

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

const ERR: Record<string, string> = {
  name: '상품명을 입력해 주세요.',
  amount: '판매가는 1원 이상의 숫자로 입력해 주세요.',
  kind: '상품 유형을 골라 주세요.',
  currency: '지금은 원화(KRW)만 판매할 수 있습니다.',
  save: '저장하지 못했습니다. 잠시 후 다시 시도해 주세요.',
  status: '판매상태를 바꾸지 못했습니다.',
};
const OKMSG: Record<string, string> = {
  info: '상품 정보를 저장했습니다.',
  status: '판매상태를 바꿨습니다.',
};

export async function generateMetadata({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const p = await getProduct(ref);
  return { title: p ? p.name : '상품' };
}

export const dynamic = 'force-dynamic';

export default async function Page({
  params, searchParams,
}: { params: Promise<{ ref: string }>; searchParams: Promise<SP> }) {
  const { ref } = await params;
  const sp = await searchParams;
  const p = await getProduct(ref);
  if (!p) notFound();

  const orders = await countOrdersFor(ref);
  const err = one(sp.err);
  const saved = one(sp.saved);
  const created = one(sp.created) === '1';

  return (
    <>
      <PageHead title={p.name} desc={`상품 식별자 ${p.product_ref}`}>
        <Link href="/admin/store" className={styles.btn}>목록</Link>
      </PageHead>

      {created && <p className={styles.ok}>초안으로 등록했습니다. 내용을 확인한 뒤 판매를 시작해 주세요.</p>}
      {saved && OKMSG[saved] && <p className={styles.ok}>{OKMSG[saved]}</p>}
      {err && <p className={styles.warn} role="alert">{ERR[err] ?? '입력을 다시 확인해 주세요.'}</p>}

      {/* ── 판매상태 ───────────────────────────────────────── */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>판매상태</h2>
        <div className={styles.statusRow}>
          <ProductStatusBadge status={p.status} />
          <span className={styles.dd}>{PRODUCT_STATUS_LABEL[p.status].help}</span>
        </div>
        <div className={styles.actions}>
          {PRODUCT_STATUSES.filter((s) => s !== p.status).map((s) => (
            <form key={s} action={changeProductStatusAction} className={styles.statusForm}>
              <input type="hidden" name="product_ref" value={p.product_ref} />
              <input type="hidden" name="status" value={s} />
              <button type="submit" className={s === 'selling' ? styles.primary : styles.btn}>
                {s === 'selling' ? '판매 시작' : s === 'stopped' ? '판매 중지' : '초안으로 되돌리기'}
              </button>
            </form>
          ))}
        </div>
        <p className={styles.note}>
          공개 STORE 에 보이는 것은 <b>판매 중</b> 상품뿐입니다. 이 판정은 데이터베이스가
          판매상태에서 직접 계산하므로, 화면이나 브라우저에서 바꿀 수 없습니다.
        </p>
      </section>

      {/* ── 정보 수정 ───────────────────────────────────────── */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>상품 정보</h2>
        <form action={saveProductAction}>
          <input type="hidden" name="product_ref" value={p.product_ref} />
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="name">상품명 <span className={styles.req}>*</span></label>
              <input id="name" name="name" className={styles.input} maxLength={200} defaultValue={p.name} required />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="kind">상품 유형 <span className={styles.req}>*</span></label>
              <select id="kind" name="kind" className={styles.select} defaultValue={p.kind}>
                {PRODUCT_KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="ref_view">상품 식별자</label>
              <input id="ref_view" className={styles.input} defaultValue={p.product_ref} disabled />
              <span className={styles.hint}>
                주문과 영구히 이어진 값이라 바꿀 수 없습니다.
                {orders !== null && orders > 0 && <> 지금까지 이 식별자로 만들어진 주문 {orders}건.</>}
              </span>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="amount">판매가(원) <span className={styles.req}>*</span></label>
              <input id="amount" name="amount" className={styles.input} inputMode="numeric"
                     maxLength={20} defaultValue={String(p.amount)} required />
              <input type="hidden" name="currency" value={p.currency.trim()} />
              <span className={styles.hint}>
                바꾼 가격은 <b>다음 주문부터</b> 적용됩니다. 이미 결제된 주문의 금액은 그대로 남습니다.
              </span>
            </div>

            <div className={`${styles.field} ${styles.fieldWide}`}>
              <label className={styles.label} htmlFor="description">간단한 설명</label>
              <textarea id="description" name="description" className={styles.textarea}
                        maxLength={300} defaultValue={p.description ?? ''} />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.primary}>저장</button>
          </div>
        </form>
      </section>

      {/* ── 기록 · 앞으로 연결될 것 ──────────────────────────── */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>기록</h2>
        <dl className={styles.dl}>
          <div className={styles.dlRow}>
            <dt className={styles.dt}>공개 STORE 노출</dt>
            <dd className={styles.dd}>{p.active ? '보임 (판매 중)' : '보이지 않음'}</dd>
          </div>
          <div className={styles.dlRow}>
            <dt className={styles.dt}>현재 판매가</dt>
            <dd className={styles.dd}>{formatPrice(p.amount, p.currency)}</dd>
          </div>
          <div className={styles.dlRow}>
            <dt className={styles.dt}>주문 건수</dt>
            <dd className={styles.dd}>{orders === null ? '—' : `${orders}건`}</dd>
          </div>
          <div className={styles.dlRow}>
            <dt className={styles.dt}>등록 · 수정</dt>
            <dd className={styles.dd}>{fmtDate(p.created_at)} · {fmtDate(p.updated_at)}</dd>
          </div>
          <div className={styles.dlRow}>
            <dt className={styles.dt}>상세페이지</dt>
            <dd className={styles.dd}>
              {p.detail_path
                ? p.detail_path
                : <span className={styles.mute}>아직 연결되지 않았습니다. 상세페이지가 준비되면 연결합니다.</span>}
            </dd>
          </div>
          <div className={styles.dlRow}>
            <dt className={styles.dt}>전자책 파일</dt>
            <dd className={styles.dd}>
              <span className={styles.mute}>아직 연결되지 않았습니다. 원고가 완성된 뒤 연결합니다.</span>
            </dd>
          </div>
        </dl>
        <p className={styles.note}>
          이 상품은 아직 결제창과 이어져 있지 않습니다. 결제 연결은 별도 단계에서 진행합니다.
        </p>
      </section>
    </>
  );
}
