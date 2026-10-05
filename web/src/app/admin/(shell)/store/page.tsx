import Link from 'next/link';
import { PageHead, ProductStatusBadge, fmtDate } from '@/components/admin/ui';
import {
  PRODUCT_STATUSES, PRODUCT_STATUS_LABEL, countProductsByStatus,
  formatPrice, isProductStatus, kindLabel, listProducts,
} from '@/lib/admin/store-products';
import styles from './store.module.css';

export const metadata = { title: 'STORE 상품' };
export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

/**
 * STORE 상품 목록. 판매 중이 위로 오고, 그 안에서는 최근에 만든 순이다.
 * 공개 STORE 에 실제로 보이는 것은 '판매 중' 뿐이다.
 */
export default async function Page({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const statusRaw = one(sp.status);
  const status = isProductStatus(statusRaw) ? statusRaw : '';

  const [{ rows, error }, { counts, total }] = await Promise.all([
    listProducts(),
    countProductsByStatus(),
  ]);
  const shown = status ? rows.filter((r) => r.status === status) : rows;
  const link = (s: string) => '/admin/store' + (s ? `?status=${s}` : '');

  return (
    <>
      <PageHead title="STORE 상품" desc={`전체 ${total}건 · 판매 중 ${counts.selling}건`}>
        <Link href="/admin/store/new" className={styles.primary}>새 상품</Link>
      </PageHead>

      <nav className={styles.tabs} aria-label="판매상태 필터">
        <Link href={link('')} className={`${styles.tab} ${status === '' ? styles.tabOn : ''}`}>전체 <b>{total}</b></Link>
        {PRODUCT_STATUSES.map((s) => (
          <Link key={s} href={link(s)} className={`${styles.tab} ${status === s ? styles.tabOn : ''}`}>
            {PRODUCT_STATUS_LABEL[s].label} <b>{counts[s]}</b>
          </Link>
        ))}
      </nav>

      {error && <p className={styles.warn} role="alert">상품 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>}

      {shown.length === 0 && !error ? (
        <p className={styles.empty}>
          {status ? '이 상태의 상품이 없습니다.' : (
            <>아직 등록된 상품이 없습니다. <Link href="/admin/store/new" className={styles.link}>새 상품</Link>을 만들어 보세요.
              <br />새로 만든 상품은 <b>초안</b>으로 시작하고, 판매를 시작해야 공개 STORE 에 나타납니다.</>
          )}
        </p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>상태</th><th>상품명</th><th>식별자</th><th>유형</th><th>판매가</th><th>수정</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => (
                <tr key={p.product_ref}>
                  <td><ProductStatusBadge status={p.status} /></td>
                  <td>
                    <Link href={`/admin/store/${p.product_ref}`} className={styles.name}>{p.name}</Link>
                    {p.description && <div className={styles.mute}>{p.description}</div>}
                  </td>
                  <td><span className={styles.ref}>{p.product_ref}</span></td>
                  <td>{kindLabel(p.kind)}</td>
                  <td className={styles.price}>{formatPrice(p.amount, p.currency)}</td>
                  <td className={styles.mute}>{fmtDate(p.updated_at, false)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className={styles.note}>
        판매가는 서버에 저장된 값만 쓰입니다. 결제 금액은 언제나 이 표의 값이며, 화면에서 보낸 금액은 사용하지 않습니다.
        상품 식별자는 주문과 영구히 이어지므로 등록 후에는 바꿀 수 없습니다.
      </p>
    </>
  );
}
