import Link from 'next/link';
import { STATUS_LABEL, type InquiryStatus } from '@/lib/admin/inquiries';
import { PROJECT_STATUS_LABEL, type ProjectStatus } from '@/lib/admin/projects';
import { NAV_STATE_LABEL, type AdminNavItem } from '@/lib/admin/nav';
import styles from './ui.module.css';

/** 페이지 머리: 제목 · 설명 · 오른쪽 도구 */
export function PageHead({ title, desc, children }: { title: string; desc?: string; children?: React.ReactNode }) {
  return (
    <div className={styles.head}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {desc && <p className={styles.desc}>{desc}</p>}
      </div>
      {children && <div className={styles.headTools}>{children}</div>}
    </div>
  );
}

export function Card({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`${styles.card} ${className}`}>
      {title && <h2 className={styles.cardTitle}>{title}</h2>}
      {children}
    </section>
  );
}

export function StatusBadge({ status }: { status: InquiryStatus }) {
  const s = STATUS_LABEL[status] ?? { label: status, tone: 'spam' as const };
  return <span className={`${styles.status} ${styles['status_' + s.tone]}`}>{s.label}</span>;
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const s = PROJECT_STATUS_LABEL[status] ?? { label: status, tone: 'cancelled' as const };
  return <span className={`${styles.status} ${styles['status_' + s.tone]}`}>{s.label}</span>;
}

/** 아직 기능이 없는 메뉴의 화면. 동작하는 척하지 않는다. */
export function Placeholder({ item }: { item: AdminNavItem }) {
  return (
    <>
      <PageHead title={item.label} />
      <section className={styles.placeholder}>
        <span className={styles.placeholderBadge}>{NAV_STATE_LABEL[item.state]}</span>
        <p className={styles.placeholderText}>{item.note}</p>
        <p className={styles.placeholderSub}>
          이 화면은 아직 기능이 없습니다. 지금 운영 가능한 메뉴는
          {' '}<Link href="/admin" className={styles.link}>오늘의 운영</Link>과
          {' '}<Link href="/admin/inquiries" className={styles.link}>문의함</Link>입니다.
        </p>
      </section>
    </>
  );
}

/** 접수 시각 표기 — 한국 시간, 초 생략 */
export function fmtDate(iso: string | null | undefined, withTime = true) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const opt: Intl.DateTimeFormatOptions = withTime
    ? { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Seoul' }
    : { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Seoul' };
  return new Intl.DateTimeFormat('ko-KR', opt).format(d).replace(/\. /g, '.').replace(/\.$/, '');
}

/** 유입 경로 코드 → 운영자 언어 */
const SOURCE_LABEL: Record<string, string> = {
  home: '홈', brand: '브랜드 메시지', category: '카테고리', design: '홈페이지 디자인',
  'design-detail': '디자인 상세', 'design-new': 'NEW DESIGN', portfolio: '제작 사례',
  content: '콘텐츠 기획', admin: '운영 관리자 시스템', solution: '맞춤 솔루션',
  service: '제작 서비스', price: '제작 비용', process: '제작 과정', about: '회사소개',
  contact: '제작 상담', journal: '저널',
};
export const sourceLabel = (v: string | null) => (v ? (SOURCE_LABEL[v] ?? v) : '—');
export const screenLabel = (v: string | null) => (v === 'pc' ? 'PC' : v === 'mobile' ? '모바일' : '—');
