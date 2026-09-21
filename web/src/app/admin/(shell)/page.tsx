import Link from 'next/link';
import { countByStatus, listInquiries } from '@/lib/admin/inquiries';
import { Card, PageHead, StatusBadge, fmtDate, sourceLabel } from '@/components/admin/ui';
import styles from './dashboard.module.css';

export const metadata = { title: '오늘의 운영' };

/**
 * 오늘의 운영 — V1.
 * 실제로 쌓이는 데이터가 문의뿐이므로 문의 지표만 보여준다.
 * 매출 · 프로젝트 · 결제 · 콘텐츠 성과처럼 없는 데이터는 만들지 않는다.
 */
export default async function Page() {
  const [{ counts, total, error }, fresh, recent] = await Promise.all([
    countByStatus(),
    listInquiries({ status: 'NEW' }),
    listInquiries({}),
  ]);

  const kpi = [
    { label: '전체 문의', value: total, href: '/admin/inquiries' },
    { label: '신규', value: counts.NEW, href: '/admin/inquiries?status=NEW', hot: counts.NEW > 0 },
    { label: '진행 중', value: counts.IN_PROGRESS, href: '/admin/inquiries?status=IN_PROGRESS' },
    { label: '완료', value: counts.DONE, href: '/admin/inquiries?status=DONE' },
  ];

  return (
    <>
      <PageHead title="오늘의 운영" desc="홈페이지 상담폼으로 들어온 문의 현황입니다." />

      {error && (
        <p className={styles.warn} role="alert">
          문의 데이터를 불러오지 못했습니다. 잠시 후 새로고침해 주세요. (데이터베이스 연결 또는 권한 문제)
        </p>
      )}

      <div className={styles.kpis}>
        {kpi.map((k) => (
          <Link key={k.label} href={k.href} className={`${styles.kpi} ${k.hot ? styles.kpiHot : ''}`}>
            <span className={styles.kpiLabel}>{k.label}</span>
            <span className={styles.kpiValue}>{k.value}</span>
          </Link>
        ))}
      </div>

      <div className={styles.cols}>
        <Card title={`지금 확인해야 할 문의 · 신규 ${counts.NEW}건`} className={styles.col}>
          {fresh.rows.length === 0 ? (
            <p className={styles.empty}>확인할 신규 문의가 없습니다.</p>
          ) : (
            <ul className={styles.list}>
              {fresh.rows.slice(0, 8).map((r) => (
                <li key={r.id}>
                  <Link href={`/admin/inquiries/${r.id}`} className={styles.row}>
                    <span className={styles.rowMain}>
                      <span className={styles.rowName}>{r.name}</span>
                      <span className={styles.rowSub}>{r.service} · {sourceLabel(r.consultation_source)}</span>
                    </span>
                    <span className={styles.rowDate}>{fmtDate(r.created_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {counts.NEW > 8 && (
            <Link href="/admin/inquiries?status=NEW" className={styles.more}>신규 문의 전체 보기 →</Link>
          )}
        </Card>

        <Card title="최근 문의" className={styles.col}>
          {recent.rows.length === 0 ? (
            <p className={styles.empty}>아직 들어온 문의가 없습니다.</p>
          ) : (
            <ul className={styles.list}>
              {recent.rows.slice(0, 8).map((r) => (
                <li key={r.id}>
                  <Link href={`/admin/inquiries/${r.id}`} className={styles.row}>
                    <span className={styles.rowMain}>
                      <span className={styles.rowName}>{r.name}</span>
                      <span className={styles.rowSub}>{r.service}</span>
                    </span>
                    <span className={styles.rowRight}>
                      <StatusBadge status={r.status} />
                      <span className={styles.rowDate}>{fmtDate(r.created_at, false)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/inquiries" className={styles.more}>문의함 열기 →</Link>
        </Card>
      </div>
    </>
  );
}
