import Link from 'next/link';
import {
  PAGE_SIZE, PROJECT_STATUSES, PROJECT_STATUS_LABEL, SERVICE_TYPES,
  countProjectsByStatus, isProjectStatus, isServiceType, listProjects, serviceLabel,
} from '@/lib/admin/projects';
import { PageHead, ProjectStatusBadge, fmtDate } from '@/components/admin/ui';
import styles from './projects.module.css';

export const metadata = { title: '프로젝트' };

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

/**
 * 프로젝트 목록. 진행 중(제작 중 · 검수 · 준비 · 상담)이 위로 오고,
 * 그 안에서는 최근에 손댄 순이다. 필터는 전부 주소에 담긴다.
 */
export default async function Page({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const q = one(sp.q).slice(0, 100);
  const statusRaw = one(sp.status);
  const status = isProjectStatus(statusRaw) ? statusRaw : '';
  const serviceRaw = one(sp.service);
  const service = isServiceType(serviceRaw) ? serviceRaw : '';
  const page = Math.max(1, parseInt(one(sp.page) || '1', 10) || 1);

  const [{ rows, total, error }, { counts, total: all, active }] = await Promise.all([
    listProjects({ q, status, service, page }),
    countProjectsByStatus(),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const link = (over: Record<string, string | number>) => {
    const p = new URLSearchParams();
    const merged = { q, status, service, page: 1, ...over };
    for (const [k, v] of Object.entries(merged)) if (v !== '' && !(k === 'page' && v === 1)) p.set(k, String(v));
    const s = p.toString();
    return '/admin/projects' + (s ? '?' + s : '');
  };

  return (
    <>
      <PageHead title="프로젝트" desc={`전체 ${all}건 · 진행 중 ${active}건`}>
        <Link href="/admin/projects/new" className={styles.primary}>새 프로젝트</Link>
      </PageHead>

      <nav className={styles.tabs} aria-label="상태 필터">
        <Link href={link({ status: '' })} className={`${styles.tab} ${status === '' ? styles.tabOn : ''}`}>전체 <b>{all}</b></Link>
        {PROJECT_STATUSES.map((s) => (
          <Link key={s} href={link({ status: s })} className={`${styles.tab} ${status === s ? styles.tabOn : ''}`}>
            {PROJECT_STATUS_LABEL[s].label} <b>{counts[s]}</b>
          </Link>
        ))}
      </nav>

      <form className={styles.filters} method="get" action="/admin/projects">
        {status && <input type="hidden" name="status" value={status} />}
        <input type="search" name="q" defaultValue={q} placeholder="번호 · 고객 · 연락처 · 프로젝트명 검색"
               className={styles.search} maxLength={100} />
        <select name="service" defaultValue={service} className={styles.select} aria-label="제작 유형">
          <option value="">모든 유형</option>
          {SERVICE_TYPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <button type="submit" className={styles.btn}>적용</button>
        {(q || service) && <Link href={link({ q: '', service: '' })} className={styles.reset}>초기화</Link>}
      </form>

      {error && <p className={styles.warn} role="alert">프로젝트 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>}

      {rows.length === 0 && !error ? (
        <p className={styles.empty}>
          {q || status || service ? '조건에 맞는 프로젝트가 없습니다.' : (
            <>아직 등록된 프로젝트가 없습니다. <Link href="/admin/projects/new" className={styles.link}>새 프로젝트</Link>를 만들거나, <Link href="/admin/inquiries" className={styles.link}>문의함</Link>에서 상담이 끝난 문의를 전환해 보세요.</>
          )}
        </p>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>번호</th><th>고객</th><th>프로젝트명</th><th>유형</th>
                  <th>플랜</th><th>상태</th><th>목표 완료일</th><th>최근 업데이트</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className={styles.num}><Link href={`/admin/projects/${r.id}`} className={styles.rowLink}>{r.project_no}</Link></td>
                    <td><Link href={`/admin/projects/${r.id}`} className={`${styles.rowLink} ${styles.name}`}>{r.client_name}</Link></td>
                    <td className={styles.title}>{r.title}</td>
                    <td>{serviceLabel(r.service_type)}</td>
                    <td>{r.plan ?? '—'}</td>
                    <td><ProjectStatusBadge status={r.status} /></td>
                    <td className={styles.num}>{fmtDate(r.target_on, false)}</td>
                    <td className={`${styles.num} ${styles.mute}`}>{fmtDate(r.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className={styles.cards}>
            {rows.map((r) => (
              <li key={r.id}>
                <Link href={`/admin/projects/${r.id}`} className={styles.card}>
                  <span className={styles.cardTop}>
                    <span className={styles.name}>{r.client_name}</span>
                    <ProjectStatusBadge status={r.status} />
                  </span>
                  <span className={styles.cardTitle}>{r.title}</span>
                  <span className={styles.cardLine}>{serviceLabel(r.service_type)}{r.plan ? ` · ${r.plan}` : ''}</span>
                  <span className={`${styles.cardLine} ${styles.mute}`}>
                    {r.project_no}{r.target_on ? ` · 목표 ${fmtDate(r.target_on, false)}` : ''}
                  </span>
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
