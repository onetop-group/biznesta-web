import Link from 'next/link';
import {
  INQUIRY_STATUSES, PAGE_SIZE, STATUS_LABEL, countByStatus, distinctServices, isInquiryStatus, listInquiries,
} from '@/lib/admin/inquiries';
import { PageHead, StatusBadge, fmtDate, screenLabel, sourceLabel } from '@/components/admin/ui';
import styles from './inquiries.module.css';

export const metadata = { title: '문의함' };

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

/**
 * 문의함 목록. 필터는 전부 주소(query)에 담긴다 — 새로고침 · 공유 · 뒤로가기가 그대로 된다.
 * 컬럼은 inquiries 테이블에 실제로 있는 것만 보여준다.
 */
export default async function Page({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const q = one(sp.q).slice(0, 100);
  const statusRaw = one(sp.status);
  const status = isInquiryStatus(statusRaw) ? statusRaw : '';
  const service = one(sp.service).slice(0, 100);
  const page = Math.max(1, parseInt(one(sp.page) || '1', 10) || 1);

  const [{ rows, total, error }, { counts, total: all }, services] = await Promise.all([
    listInquiries({ q, status, service, page }),
    countByStatus(),
    distinctServices(),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const link = (over: Record<string, string | number>) => {
    const p = new URLSearchParams();
    const merged = { q, status, service, page: 1, ...over };
    for (const [k, v] of Object.entries(merged)) if (v !== '' && !(k === 'page' && v === 1)) p.set(k, String(v));
    const s = p.toString();
    return '/admin/inquiries' + (s ? '?' + s : '');
  };

  return (
    <>
      <PageHead title="문의함" desc={`전체 ${all}건 · 신규 ${counts.NEW}건`} />

      {/* 상태 탭 */}
      <nav className={styles.tabs} aria-label="상태 필터">
        <Link href={link({ status: '' })} className={`${styles.tab} ${status === '' ? styles.tabOn : ''}`}>전체 <b>{all}</b></Link>
        {INQUIRY_STATUSES.map((s) => (
          <Link key={s} href={link({ status: s })} className={`${styles.tab} ${status === s ? styles.tabOn : ''}`}>
            {STATUS_LABEL[s].label} <b>{counts[s]}</b>
          </Link>
        ))}
      </nav>

      {/* 검색 · 서비스 필터 (GET) */}
      <form className={styles.filters} method="get" action="/admin/inquiries">
        {status && <input type="hidden" name="status" value={status} />}
        <input type="search" name="q" defaultValue={q} placeholder="이름 · 연락처 · 이메일 · 내용 검색"
               className={styles.search} maxLength={100} />
        <select name="service" defaultValue={service} className={styles.select} aria-label="문의 서비스">
          <option value="">모든 서비스</option>
          {services.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="submit" className={styles.btn}>적용</button>
        {(q || service) && <Link href={link({ q: '', service: '' })} className={styles.reset}>초기화</Link>}
      </form>

      {error && (
        <p className={styles.warn} role="alert">문의 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
      )}

      {rows.length === 0 && !error ? (
        <p className={styles.empty}>{q || status || service ? '조건에 맞는 문의가 없습니다.' : '아직 들어온 문의가 없습니다.'}</p>
      ) : (
        <>
          {/* PC: 표 */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>접수일</th><th>이름</th><th>연락처</th><th>이메일</th>
                  <th>문의 서비스</th><th>플랜</th><th>유입</th><th>상태</th><th>최근 업데이트</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className={styles.num}><Link href={`/admin/inquiries/${r.id}`} className={styles.rowLink}>{fmtDate(r.created_at)}</Link></td>
                    <td><Link href={`/admin/inquiries/${r.id}`} className={`${styles.rowLink} ${styles.name}`}>{r.name}</Link></td>
                    <td className={styles.num}>{r.contact}</td>
                    <td className={styles.mail}>{r.email ?? '—'}</td>
                    <td>{r.service}</td>
                    <td>{r.selected_plan ?? '—'}</td>
                    <td className={styles.mute}>
                      {sourceLabel(r.consultation_source)}
                      {r.selected_design ? ` · ${r.selected_design}` : ''}
                      {r.screen ? ` · ${screenLabel(r.screen)}` : ''}
                    </td>
                    <td><StatusBadge status={r.status} /></td>
                    <td className={`${styles.num} ${styles.mute}`}>{fmtDate(r.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 모바일: 카드 */}
          <ul className={styles.cards}>
            {rows.map((r) => (
              <li key={r.id}>
                <Link href={`/admin/inquiries/${r.id}`} className={styles.card}>
                  <span className={styles.cardTop}>
                    <span className={styles.name}>{r.name}</span>
                    <StatusBadge status={r.status} />
                  </span>
                  <span className={styles.cardLine}>{r.contact}{r.email ? ` · ${r.email}` : ''}</span>
                  <span className={styles.cardLine}>{r.service}{r.selected_plan ? ` · ${r.selected_plan}` : ''}</span>
                  <span className={`${styles.cardLine} ${styles.mute}`}>{fmtDate(r.created_at)} · {sourceLabel(r.consultation_source)}</span>
                </Link>
              </li>
            ))}
          </ul>

          {pages > 1 && (
            <nav className={styles.pager} aria-label="페이지">
              {page > 1 && <Link href={link({ page: page - 1 })} className={styles.pageBtn}>← 이전</Link>}
              <span className={styles.pageInfo}>{page} / {pages}</span>
              {page < pages && <Link href={link({ page: page + 1 })} className={styles.pageBtn}>다음 →</Link>}
            </nav>
          )}
        </>
      )}
    </>
  );
}
