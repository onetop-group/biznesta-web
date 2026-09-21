import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './review.module.css';

export const metadata: Metadata = {
  title: 'BIZNESTA — 디자인 검수 인덱스',
  robots: { index: false, follow: false },
};

/**
 * Development review index. Not part of the BIZNESTA website — it exists
 * only so the approved and in-review screens can be opened quickly.
 */
const SCREENS = [
  { n: '01', slug: 'pc-01', name: 'HERO', file: 'BN_PC_01_HERO', status: 'FINAL LOCK' },
  { n: '02', slug: 'pc-02', name: 'BRAND MESSAGE', file: 'BN_PC_02_BRAND_MESSAGE', status: 'FINAL LOCK' },
  { n: '03', slug: 'pc-03', name: 'CATEGORY', file: 'BN_PC_03_CATEGORY', status: 'FINAL LOCK' },
  { n: '04', slug: 'pc-04', name: 'DESIGN SHOWROOM', file: 'BN_PC_04_DESIGN_SHOWROOM', status: 'FINAL LOCK' },
  { n: '05', slug: 'pc-05', name: 'CATEGORY DETAIL', file: 'BN_PC_05_CATEGORY_DETAIL', status: 'FINAL LOCK' },
  { n: '06', slug: 'pc-06', name: 'DESIGN DETAIL', file: 'BN_PC_06_DESIGN_DETAIL', status: 'FINAL LOCK' },
  { n: '07', slug: 'pc-07', name: 'NEW DESIGN', file: 'BN_PC_07_NEW_DESIGN', status: 'FINAL LOCK' },
  { n: '08', slug: 'pc-08', name: 'SIGNATURE', file: 'BN_PC_08_SIGNATURE', status: 'FINAL LOCK' },
  { n: '09', slug: 'pc-09', name: 'CONTENT GROWTH', file: 'BN_PC_09_CONTENT_GROWTH', status: 'FINAL LOCK' },
  { n: '10', slug: 'pc-10', name: 'ADMIN SYSTEM', file: 'BN_PC_10_ADMIN_SYSTEM', status: 'FINAL LOCK' },
  { n: '11', slug: 'pc-11', name: 'CUSTOM SOLUTION', file: 'BN_PC_11_CUSTOM_SOLUTION', status: 'FINAL LOCK' },
  { n: '12', slug: 'pc-12', name: 'SERVICE SELECT', file: 'BN_PC_12_SERVICE_SELECT', status: 'FINAL LOCK' },
  { n: '13', slug: 'pc-13', name: 'PRICE', file: 'BN_PC_13_PRICE', status: 'FINAL LOCK' },
  { n: '14', slug: 'pc-14', name: 'PROCESS', file: 'BN_PC_14_PROCESS', status: 'FINAL LOCK' },
  { n: '15', slug: 'pc-15', name: 'ABOUT', file: 'BN_PC_15_ABOUT', status: 'FINAL LOCK' },
  { n: '16', slug: 'pc-16', name: 'CONTACT', file: 'BN_PC_16_CONTACT', status: 'FINAL LOCK' },
];

const MOBILE = [
  { n: '01', slug: 'mo-01', name: 'HERO', file: 'BN_MO_01_HERO', status: 'FINAL LOCK' },
  { n: '02', slug: 'mo-02', name: 'BRAND MESSAGE', file: 'BN_MO_02_BRAND_MESSAGE', status: 'FINAL LOCK' },
  { n: '03', slug: 'mo-03', name: 'CATEGORY', file: 'BN_MO_03_CATEGORY', status: 'FINAL LOCK' },
  { n: '04', slug: 'mo-04', name: 'DESIGN GALLERY', file: 'BN_MO_04_DESIGN_GALLERY', status: 'FINAL LOCK' },
];

const MOBILE2 = [
  { n: '05', slug: 'mo-05', name: 'CATEGORY DETAIL', file: 'BN_MO_05_CATEGORY_DETAIL', status: 'FINAL LOCK' },
  { n: '06', slug: 'mo-06', name: 'DESIGN DETAIL', file: 'BN_MO_06_DESIGN_DETAIL', status: 'FINAL LOCK' },
  { n: '07', slug: 'mo-07', name: 'NEW DESIGN', file: 'BN_MO_07_NEW_DESIGN', status: 'FINAL LOCK' },
  { n: '08', slug: 'mo-08', name: 'SIGNATURE', file: 'BN_MO_08_SIGNATURE', status: 'FINAL LOCK' },
];

const MOBILE3 = [
  { n: '09', slug: 'mo-09', name: 'CONTENT GROWTH', file: 'BN_MO_09_CONTENT_GROWTH', status: 'FINAL LOCK' },
  { n: '10', slug: 'mo-10', name: 'ADMIN SYSTEM', file: 'BN_MO_10_ADMIN_SYSTEM', status: 'FINAL LOCK' },
  { n: '11', slug: 'mo-11', name: 'CUSTOM SOLUTION', file: 'BN_MO_11_CUSTOM_SOLUTION', status: 'FINAL LOCK' },
  { n: '12', slug: 'mo-12', name: 'SERVICE SELECT', file: 'BN_MO_12_SERVICE_SELECT', status: 'FINAL LOCK' },
];


const MOBILE4 = [
  { n: '13', slug: 'mo-13', name: 'PRICE', file: 'BN_MO_13_PRICE', status: 'FINAL LOCK' },
  { n: '14', slug: 'mo-14', name: 'PROCESS', file: 'BN_MO_14_PROCESS', status: 'FINAL LOCK' },
  { n: '15', slug: 'mo-15', name: 'ABOUT', file: 'BN_MO_15_ABOUT', status: 'FINAL LOCK' },
  { n: '16', slug: 'mo-16', name: 'CONTACT', file: 'BN_MO_16_CONTACT', status: 'FINAL LOCK' },
];

/** One block per batch, so every screen built so far is reachable here. */
const BLOCKS: [string, string, typeof SCREENS][] = [
  ['PC 01~16', 'BN_PC 시안 16화면.', SCREENS],
  ['MOBILE 01~04', 'BN_MO 시안 1차 배치.', MOBILE],
  ['MOBILE 05~08', 'BN_MO 시안 2차 배치.', MOBILE2],
  ['MOBILE 09~12', 'BN_MO 시안 3차 배치.', MOBILE3],
  ['MOBILE 13~16', 'BN_MO 시안 최종 배치.', MOBILE4],
];
export default function ReviewIndex() {
  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>BIZNESTA · DEVELOPMENT REVIEW</p>
        <h1 className={styles.title}>화면 검수 인덱스</h1>
        <p className={styles.note}>
          이 페이지는 개발 검수 전용입니다. 실제 BIZNESTA 웹사이트의 일부가 아닙니다.
        </p>
        <p className={styles.note}>
          <strong>BIZNESTA · PC01~16 + MO01~16 · TOTAL 32 SCREEN · OFFICIAL VISUAL
          MASTER · FINAL LOCK</strong> (2026-09-06 사용자 최종 승인). 별도 지시 없이
          레이아웃 · 이미지 · 타이포그래피 · 섹션 위치 · CTA 위치를 수정하지 않습니다.
          변경 금지 범위와 사실성 정책은 <code>VISUAL_MASTER_LOCK.md</code>에 있습니다.
          배포는 Preview 단계이며 Production에는 반영하지 않았습니다.
        </p>
      </header>

      {/* 아직 승인 전인 신규 MASTER — 32화면과 섞이지 않게 따로 둔다. */}
      <section>
        <h2 className={styles.title} style={{ fontSize: '1.05rem' }}>BIZNESTA JOURNAL · OFFICIAL VISUAL MASTER · FINAL LOCK</h2>
        <p className={styles.note}>
          2026-09-08 사용자 최종 승인. 이 두 화면이 JOURNAL 의 공식 Visual Master 기준입니다. 공개 경로(/journal)는 아직 열지 않았습니다.
        </p>
        <ul className={styles.list}>
          <li><Link href="/review/journal-pc">BN_PC_JOURNAL — PC MASTER (1536 × 1024)</Link></li>
          <li><Link href="/review/journal-mo">BN_MO_JOURNAL — MOBILE MASTER (1024 × 2106)</Link></li>
        </ul>
      </section>

      {BLOCKS.map(([heading, note, rows]) => (
        <section key={heading}>
          <h2 className={styles.title} style={{ fontSize: '1.05rem', marginTop: '2rem' }}>
            {heading}
          </h2>
          <p className={styles.note}>{note}</p>
          <ul className={styles.list}>
            {rows.map((s) => (
              <li key={s.slug}>
                <Link href={`/review/${s.slug}`} className={styles.row}>
                  <span className={styles.num}>{s.n}</span>
                  <span className={styles.name}>{s.name}</span>
                  <span className={styles.file}>{s.file}.png</span>
                  <span
                    className={`${styles.status} ${
                      s.status === 'FINAL LOCK' ? styles.approved : styles.review
                    }`}
                  >
                    {s.status}
                  </span>
                  <span className={styles.arrow} aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
