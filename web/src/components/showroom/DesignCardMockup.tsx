import Link from 'next/link';
import { ArrowRight } from '@/components/shared/Arrows';
import { type ShowroomDesign, designHref, getCategory } from '@/data/showroom';
import ZoomImage from './ZoomImage';
import styles from './Showroom.module.css';

/**
 * B안 — PC + 모바일을 기기 목업에 얹어 보여주는 프레젠테이션 (검수용 샘플).
 *
 * A안(현재 승인된 기본틀)과 비교하려고 만든 것이며 43개 전체에는 적용하지
 * 않았다. 캡션 · 제목 · 소개문 · VIEW MORE · 크게 보기는 A안과 똑같다.
 *
 * 원본 이미지는 건드리지 않는다: 노트북 화면과 휴대폰 화면의 크기는 이미지의
 * 원래 가로세로비를 그대로 따라간다(고정 비율 틀에 끼워 넣지 않는다).
 * 그래서 목업을 씌워도 잘리거나 늘어나는 곳이 없다.
 */
export default function DesignCardMockup({ design }: { design: ShowroomDesign }) {
  const category = getCategory(design.category);

  return (
    <article className={styles.work}>
      <div className={`${styles.stage} ${styles.mockStage}`}>
        {/* 노트북 */}
        <div className={styles.laptop}>
          <div className={styles.laptopScreen}>
            <ZoomImage image={design.pc} alt={`${design.title} PC 화면`}
                       caption={`${design.title} — PC DESIGN`}
                       className={styles.laptopShot} eager />
          </div>
          <span className={styles.laptopBase} aria-hidden />
        </div>

        {/* 휴대폰 */}
        <div className={styles.phone}>
          <div className={styles.phoneBody}>
            <span className={styles.phoneNotch} aria-hidden />
            <ZoomImage image={design.mo} alt={`${design.title} 모바일 화면`}
                       caption={`${design.title} — MOBILE DESIGN`}
                       className={styles.phoneShot} eager />
          </div>
        </div>
      </div>

      <div className={styles.caption}>
        <span className={styles.catLabel}>{category?.name}</span>
        <span className={styles.workNo}>
          {category?.label} {String(design.order).padStart(2, '0')}
        </span>
      </div>
      <h3 className={styles.workName}>
        <Link href={designHref(design.id)}>{design.title}</Link>
      </h3>
      <p className={styles.workDesc}>{design.desc}</p>
      <div className={styles.workFoot}>
        <span className={styles.workMeta}>
          <span className={styles.metaRule} aria-hidden />
          PC + MOBILE DESIGN
        </span>
        <Link href={designHref(design.id)} className={styles.viewMore}>
          VIEW MORE
          <span className={styles.viewMoreDisc} aria-hidden><ArrowRight /></span>
        </Link>
      </div>
    </article>
  );
}
