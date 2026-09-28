import Link from 'next/link';
import BusinessInfo from '@/components/site/BusinessInfo';
import Breadcrumb from '@/components/book/Breadcrumb';
import { POLICY_UPDATED, SCOPE_NOTICE, type PolicySection } from '@/data/book-policy';
import styles from './Policy.module.css';

/**
 * BOOK 정책 문서의 공통 틀.
 *
 * 두 문서(이용약관 · 환불정책)가 같은 모양이어야 읽는 사람이 헤매지 않는다.
 * 맨 위 「적용 범위」는 두 문서에 똑같이 붙는다 — 홈페이지 제작 서비스와
 * 전자책 판매를 섞지 않는다는 것이 이 정책의 출발점이기 때문이다.
 */

export type PolicyLink = { href: string; label: string };

/** 네 문서를 서로 오갈 수 있게 한다. 현재 문서는 링크가 아니다. */
const RELATED: PolicyLink[] = [
  { href: '/book/terms', label: 'BIZNESTA BOOK 이용약관' },
  { href: '/book/refund', label: '전자책 환불·취소·청약철회 정책' },
  { href: '/privacy', label: '개인정보처리방침' },
  { href: '/book/contact', label: 'BIZNESTA BOOK 문의' },
];

export default function PolicyPage({
  title, sections, current, pendingNote,
}: {
  title: string;
  sections: PolicySection[];
  /** 지금 보고 있는 문서의 경로 — 관련 문서 줄에서 링크로 만들지 않는다 */
  current: string;
  /** 확정 전 내용이 있을 때 맨 위에 붙는 안내 */
  pendingNote?: string;
}) {
  return (
    <>
      <Breadcrumb trail={[
        { label: 'HOME', href: '/' },
        { label: 'BIZNESTA BOOK', href: '/book' },
        { label: title },
      ]} />

      <main className={styles.wrap}>
        <p className={styles.eyebrow}>BIZNESTA BOOK</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.meta}>최종 개정일 {POLICY_UPDATED}</p>

        <section className={styles.scope} aria-label="적용 범위">
          <p className={styles.scopeTitle}>적용 범위</p>
          {SCOPE_NOTICE.map((p) => <p key={p} className={styles.scopeBody}>{p}</p>)}
        </section>

        {pendingNote && <p className={styles.pendingBar} role="note">{pendingNote}</p>}

        {sections.map((s, i) => (
          <section key={s.title} className={styles.section}>
            <h2 className={styles.h2}>
              {i + 1}. {s.title}
              {s.pending && <span className={styles.pendingTag}>확정 전</span>}
            </h2>
            {s.body?.map((p) => <p key={p} className={styles.body}>{p}</p>)}
            {s.list && (
              <ul className={styles.list}>
                {s.list.map((li) => <li key={li}>{li}</li>)}
              </ul>
            )}
          </section>
        ))}

        <nav className={styles.related} aria-label="관련 문서">
          <p className={styles.relatedTitle}>관련 문서</p>
          <ul className={styles.relatedList}>
            {RELATED.map((r) => (
              <li key={r.href}>
                {r.href === current
                  ? <span className={styles.current}>{r.label} (현재 문서)</span>
                  : <Link href={r.href}>{r.label}</Link>}
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/book" className={styles.back}>← BIZNESTA BOOK 목록</Link>
      </main>

      <BusinessInfo />
    </>
  );
}
