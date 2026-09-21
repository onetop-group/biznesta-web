import type { Metadata } from 'next';
import Link from 'next/link';
import { LAST_UPDATED, PRIVACY, TBD } from '@/data/privacy';
import styles from './privacy.module.css';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '비즈네스타 상담 신청 시 수집하는 개인정보의 항목과 이용 목적, 보관 기간을 안내합니다.',
  alternates: { canonical: '/privacy' },
};

/**
 * 개인정보처리방침.
 *
 * 본문은 지금 코드와 DB 가 **실제로 수집하는 것**만 적었다 (src/data/privacy.ts).
 * 사업자 정보 · 보관기간 · 보호책임자처럼 사용자가 확정해야 하는 값은
 * 임의로 만들지 않고 "확정 필요" 로 표시한다. 그 표시가 하나라도 남아 있으면
 * Production 공개 전에 반드시 채워야 한다.
 */
export default function Page() {
  const pending = PRIVACY.some((s) => s.rows?.some((r) => r.value === TBD) || s.pending);

  return (
    <main className={styles.wrap}>
      <p className={styles.brand}>BIZNESTA</p>
      <h1 className={styles.title}>개인정보처리방침</h1>
      <p className={styles.meta}>최종 업데이트: {LAST_UPDATED}</p>

      {pending && (
        <p className={styles.draft} role="note">
          이 방침에는 사업자 정보와 보관 기간 등 <strong>확정 전 항목</strong>이 남아 있습니다.
          해당 항목이 확정되면 이 페이지에 반영됩니다.
        </p>
      )}

      {PRIVACY.map((s, i) => (
        <section key={s.title} className={styles.section}>
          <h2 className={styles.h2}>{i + 1}. {s.title}</h2>
          {s.body?.map((p) => <p key={p} className={styles.body}>{p}</p>)}
          {s.list && (
            <ul className={styles.list}>
              {s.list.map((li) => <li key={li}>{li}</li>)}
            </ul>
          )}
          {s.rows && (
            <dl className={styles.rows}>
              {s.rows.map((r) => (
                <div key={r.label} className={styles.row}>
                  <dt className={styles.dt}>{r.label}</dt>
                  <dd className={r.value === TBD ? `${styles.dd} ${styles.tbd}` : styles.dd}>
                    {r.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      ))}

      <Link href="/contact" className={styles.back}>상담 페이지로 돌아가기</Link>
    </main>
  );
}
