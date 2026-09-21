import Link from 'next/link';
import {
  type ShowroomDesign, categoryHref, getCategory, relatedDesigns,
} from '@/data/showroom';
import { consultHref } from '@/data/navigation';
import DesignCard from './DesignCard';
import ZoomImage from './ZoomImage';
import { ArrowRight } from '@/components/shared/Arrows';
import { Crumb, ShowroomFoot, ShowroomTop } from './ShowroomChrome';
import styles from './Showroom.module.css';

/**
 * 디자인 상세 — PC 와 모바일은 한 작품의 두 화면이다.
 *
 * 두 이미지는 각자의 원본 비율을 그대로 쓴다. 억지로 같은 비율로 맞추지 않고,
 * 작게 줄이지도 않는다.
 *
 * 앞으로 "이런 사업에 추천 · 디자인 특징 · 추천 구성 · 적용 가능한 기능" 이
 * 이 아래에 붙는다. 지금은 확정된 내용이 없으므로 데이터에 값이 있을 때만
 * 그리도록 두고, 임의로 지어내 채우지 않는다.
 */
export default function DesignDetail({ design }: { design: ShowroomDesign }) {
  const category = getCategory(design.category);
  const related = relatedDesigns(design);
  const name = design.title;

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <ShowroomTop />
        <Crumb trail={[
          { label: '홈', href: '/' },
          { label: '홈페이지 디자인', href: '/design' },
          { label: category?.name ?? '디자인', href: categoryHref(design.category) },
          { label: name },
        ]} />

        <header className={styles.detailHead}>
          <p className={styles.collection}>BIZNESTA DESIGN COLLECTION</p>
          <p className={styles.eyebrow}>{category?.label}</p>
          <h1 className={styles.title}>{name}</h1>
          <p className={styles.lead}>{design.desc}</p>
          <span className={styles.headRule} aria-hidden />
        </header>

        <div className={styles.viewer}>
          <section className={styles.viewBlock} aria-label="PC 디자인">
            <div className={styles.viewTitle}>
              <h2>PC DESIGN</h2>
              <span>{design.pc.width} × {design.pc.height}</span>
            </div>
            <ZoomImage image={design.pc} alt={`${name} PC 화면`}
                       caption={`${name} — PC DESIGN`}
                       className={`${styles.viewFrame} ${styles.viewPc}`} variant="pc" eager />
          </section>

          <section className={styles.viewBlock} aria-label="모바일 디자인">
            <div className={styles.viewTitle}>
              <h2>MOBILE DESIGN</h2>
              <span>{design.mo.width} × {design.mo.height}</span>
            </div>
            {/* 모바일 화면은 세로로 길어 오른쪽에 자리가 남는다. 그 자리를
                비워 두지 않고 상담으로 이어지는 길을 놓는다. 이미지 크기 ·
                비율에는 손대지 않는다. */}
            <div className={styles.viewMoRow}>
              <ZoomImage image={design.mo} alt={`${name} 모바일 화면`}
                         caption={`${name} — MOBILE DESIGN`}
                         className={`${styles.viewFrame} ${styles.viewMo}`} variant="mo" />
              <div className={styles.moCta}>
                <p className={styles.moCtaText}>
                  이 디자인처럼 만들고 싶으신가요?
                </p>
                <Link href={consultHref('design', { category: design.category, design: design.id })}
                      className={styles.topCta}>
                  제작 상담하기
                  <ArrowRight />
                </Link>
                <p className={styles.moCtaNote}>
                  상담 신청에 이 디자인이 함께 전달됩니다.
                </p>
              </div>
            </div>
          </section>
        </div>

        {related.length > 0 && (
          <section className={styles.related} aria-label="같은 카테고리의 다른 디자인">
            <div className={styles.relatedHead}>
              <h2>{category?.name} 의 다른 디자인</h2>
              <Link href={categoryHref(design.category)} className={styles.relatedMore}>
                전체 보기
              </Link>
            </div>
            <div className={styles.gallery}>
              {related.slice(0, 2).map((d) => <DesignCard key={d.id} design={d} />)}
            </div>
          </section>
        )}

        <ShowroomFoot
          href={consultHref('design', { category: design.category, design: design.id })}
          text="이 디자인으로 상담을 시작할 수 있습니다."
          note="상담 신청에 이 디자인이 함께 전달됩니다."
        />
      </div>
    </main>
  );
}
