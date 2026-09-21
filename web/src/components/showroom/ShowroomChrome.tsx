import Link from 'next/link';
import { ArrowRight } from '@/components/shared/Arrows';
import { ALL_FILTER, SHOWROOM_CATEGORIES, categoryHref } from '@/data/showroom';
import styles from './Showroom.module.css';

/** 쇼룸 화면들이 함께 쓰는 상단 · 카테고리 줄 · 하단. */

export function ShowroomTop() {
  return (
    <div className={styles.top}>
      <Link href="/" className={styles.brand} aria-label="BIZNESTA 홈으로">
        <img src="/assets/pc04/logo-wordmark-navy.png" alt="BIZNESTA" width={179} height={33} />
      </Link>
      <Link href="/contact?source=design" className={styles.topCta}>
        제작 상담하기
        <ArrowRight />
      </Link>
    </div>
  );
}

export function Crumb({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav className={styles.crumb} aria-label="현재 위치">
      {trail.map((t, i) => (
        <span key={t.label}>
          {i > 0 && <span className={styles.crumbSep}> · </span>}
          {t.href ? <Link href={t.href}>{t.label}</Link> : <span>{t.label}</span>}
        </span>
      ))}
    </nav>
  );
}

/** 전체 보기 + 공식 카테고리 8개. 9개가 아니라 8개 + 전체 필터다. */
export function CategoryChips({ current }: { current: string }) {
  const categories = [...SHOWROOM_CATEGORIES].sort((a, b) => a.no - b.no);
  return (
    <nav className={styles.chips} aria-label="디자인 카테고리">
      <Link href={categoryHref(ALL_FILTER.id)}
            className={`${styles.chip} ${current === ALL_FILTER.id ? styles.chipOn : ''}`}
            aria-current={current === ALL_FILTER.id ? 'page' : undefined}>
        {ALL_FILTER.name}
      </Link>
      {categories.map((c) => (
        <Link key={c.id} href={categoryHref(c.id)}
              className={`${styles.chip} ${current === c.id ? styles.chipOn : ''}`}
              aria-current={current === c.id ? 'page' : undefined}>
          {c.name}
        </Link>
      ))}
    </nav>
  );
}

/**
 * 하단 상담 안내. 확정되지 않은 값(가격 · 기간 · 실적)은 적지 않는다.
 */
export function ShowroomFoot({ href, text, note }: { href: string; text: string; note?: string }) {
  return (
    <div className={styles.foot}>
      <div>
        <p className={styles.footText}>{text}</p>
        {note && <p className={styles.footNote}>{note}</p>}
      </div>
      <Link href={href} className={styles.footCta}>
        상담 신청하기
        <ArrowRight />
      </Link>
    </div>
  );
}
