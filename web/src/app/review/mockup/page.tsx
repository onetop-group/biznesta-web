import type { Metadata } from 'next';
import DesignCard from '@/components/showroom/DesignCard';
import DesignCardMockup from '@/components/showroom/DesignCardMockup';
import { getDesign } from '@/data/showroom';
import styles from '@/components/showroom/Showroom.module.css';

export const metadata: Metadata = {
  title: 'Portfolio 프레젠테이션 비교 — BIZNESTA',
  robots: { index: false, follow: false },
};

/**
 * 검수 전용 — 같은 작품 하나를 A안(현재 승인된 기본틀)과 B안(기기 목업)으로
 * 같은 폭에 나란히 두고 비교한다.
 *
 * 실제 카테고리 목록과 같은 격자를 쓰므로 PC 에서는 두 안의 카드 폭이
 * 정확히 같고, 좁은 화면에서는 위아래로 쌓인다. 이 페이지는 /review 아래에
 * 있어 색인되지 않으며 사이트 어디에서도 링크되지 않는다.
 */
export default function Page() {
  const design = getDesign('corporate-01');   /* 치과 홈페이지 */
  if (!design) return null;

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <header className={styles.head}>
          <p className={styles.collection}>BIZNESTA PORTFOLIO — PRESENTATION REVIEW</p>
          <h1 className={styles.title}>{design.title}</h1>
          <p className={styles.lead}>
            같은 작품을 A안(현재 승인된 기본틀)과 B안(PC + 모바일 기기 목업)으로
            비교합니다. 이 화면은 검수용이며 43개 전체에는 적용하지 않았습니다.
          </p>
          <span className={styles.headRule} aria-hidden />
        </header>

        <div className={styles.gallery}>
          <section aria-label="A안 현재 기본틀">
            <p className={styles.eyebrow}>A안 — 현재 승인된 기본틀</p>
            <DesignCard design={design} eager />
          </section>
          <section aria-label="B안 기기 목업">
            <p className={styles.eyebrow}>B안 — PC + 모바일 기기 목업</p>
            <DesignCardMockup design={design} />
          </section>
        </div>
      </div>
    </main>
  );
}
