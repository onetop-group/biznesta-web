import Link from 'next/link';
import { ArrowRight } from '@/components/shared/Arrows';
import { type ShowroomDesign, designHref, getCategory } from '@/data/showroom';
import ZoomImage from './ZoomImage';
import styles from './Showroom.module.css';

/**
 * 전시물 한 점 = 홈페이지 디자인 한 작품.
 *
 * PC 와 모바일은 하나의 작품이므로 목록에서도 **두 화면을 함께** 세운다.
 * 잘라내지 않는다 — 두 이미지 모두 원본 비율 그대로 폭에 맞춰 들어간다.
 * flex-grow 를 각 이미지의 가로세로비(w/h)로 주면 두 이미지의 높이가
 * 저절로 같아져서, crop 없이도 나란히 선 한 쌍으로 보인다.
 *
 * 이미지를 누르면 크게 보고, VIEW MORE 를 누르면 작품 상세로 간다.
 */
export default function DesignCard({ design, eager = false }: { design: ShowroomDesign; eager?: boolean }) {
  const category = getCategory(design.category);
  const pcRatio = design.pc.width / design.pc.height;
  const moRatio = design.mo.width / design.mo.height;

  return (
    <article className={styles.work}>
      <div className={styles.stage}>
        <ZoomImage image={design.pc} alt={`${design.title} PC 화면`}
                   caption={`${design.title} — PC DESIGN`}
                   className={styles.shotPc} style={{ flex: `${pcRatio} 1 0` }}
                   variant="pc" eager={eager} />
        <ZoomImage image={design.mo} alt={`${design.title} 모바일 화면`}
                   caption={`${design.title} — MOBILE DESIGN`}
                   className={styles.shotMo} style={{ flex: `${moRatio} 1 0` }}
                   variant="mo" eager={eager} />
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
