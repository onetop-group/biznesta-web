import Link from 'next/link';
import { pc04 } from '@/data/pc04';
import { ArrowLeft, ArrowRight } from '@/components/shared/Arrows';
import { ALL_FILTER, categoryHref } from '@/data/showroom';
import styles from './Pc04.module.css';

/** Measured off BN_PC_04_DESIGN_SHOWROOM.png, in 1536-wide artwork coordinates. */
const NAV_CENTER_X = [426.5, 550, 666.5, 776, 888, 1000.5, 1111];
/* 공식 카테고리 8개. 첫 칩 217 · 마지막 칩 1342.5 는 시안 그대로이고 그
   사이를 균등 분할했다 — 바의 폭과 좌우 여백은 달라지지 않는다. */
const FILTER_X = [217, 377.8, 538.6, 699.4, 860.1, 1020.9, 1181.7, 1342.5];
const FILTER_RULE_X = [297.4, 458.2, 619, 779.8, 940.5, 1101.3, 1262.1, 1400.5];

const ITEM_X = [44, 409, 774, 1139];
/** row: card top, artwork height, name/desc/disc offsets from the card top */
const ROW = [
  { top: 398, art: 212, name: 226, desc: 247, disc: 228 },
  { top: 684, art: 194, name: 209, desc: 229, disc: 211 },
];

const u = (n: number) => `calc(${n} * var(--s))`;

export default function Pc04() {
  const { header, hero, filters, items, footer } = pc04;
  const shown = items.filter((i) => i.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1536} height={327} fetchPriority="high" />
        </picture>

        {/* ------------------------- header -------------------------- */}
        <Link href="/" className={styles.wordmark} aria-label="BIZNESTA 홈으로">
          <img src={header.wordmark.src} alt={header.wordmark.alt}
               width={header.wordmark.width} height={header.wordmark.height} />
        </Link>
        <span className={styles.headerTagline}>{header.tagline}</span>

        <nav aria-label="주 메뉴">
          {header.nav.map((item, i) => (
            <Link key={item.en} href={item.href} className={styles.navItem}
                  style={{ left: u(NAV_CENTER_X[i]) }}>
              <span className={styles.navEn}>{item.en}</span>
              <span className={styles.navKo}>{item.ko}</span>
            </Link>
          ))}
        </nav>
        <span className={styles.navRule} aria-hidden />
        <Link href={header.cta.href} className={styles.headerCta}>
          <span className={styles.ctaLabel}>{header.cta.label}</span>
          <ArrowRight />
        </Link>

        {/* -------------------------- hero --------------------------- */}
        <p className={styles.eyebrow}>{hero.eyebrow}</p>
        <h1 className={styles.headline}>{hero.headline}</h1>
        <p className={styles.sub}>{hero.sub}</p>
        <p className={styles.desc}>
          {hero.desc.map((d) => <span key={d}>{d}</span>)}
        </p>
        <p className={styles.wall}>
          {hero.wall.map((w) => <span key={w}>{w}</span>)}
        </p>
        <p className={styles.keywords}>
          {hero.keywords.map((k) => <span key={k}>{k}</span>)}
        </p>

        {/* ------------------------ filter row ----------------------- */}
        <nav aria-label="디자인 유형 필터">
          {/* 전체 보기 = 9번째 카테고리가 아니라 8개를 모두 보는 기능이다. */}
          <Link href={categoryHref(ALL_FILTER.id)} className={styles.filterPill}>
            {filters.activeLabel}
          </Link>
          {filters.items.map((f, i) => (
            <Link key={f.slug} href={categoryHref(f.category ?? ALL_FILTER.id)}
                  className={styles.filterItem} style={{ left: u(FILTER_X[i]) }}>
              {f.label}
            </Link>
          ))}
          {FILTER_RULE_X.map((x) => (
            <span key={x} className={styles.filterRule} style={{ left: u(x) }} aria-hidden />
          ))}
          <Link href="/category" className={styles.moreBtn} aria-label={filters.moreLabel}>···</Link>
        </nav>

        {/* ------------------------- showroom ------------------------ */}
        <section aria-label="디자인 쇼룸">
          <h2 className={styles.srOnly}>BIZNESTA 샘플 디자인</h2>
          {shown.map((item, i) => {
            const col = i % 4;
            const r = ROW[Math.floor(i / 4)];
            return (
              <Link key={item.id} href={categoryHref(item.category)} className={styles.item}
                    style={{ left: u(ITEM_X[col]), top: u(r.top), height: u(r.desc + 26) }}>
                <picture>
                  <source srcSet={item.artwork.webp} type="image/webp" />
                  <img className={styles.artwork} src={item.artwork.jpg} alt={item.artwork.alt}
                       width={354} height={r.art} style={{ height: u(r.art) }}
                       loading={i < 4 ? undefined : 'lazy'} />
                </picture>
                <span className={`${styles.itemNumber} ${item.tone === 'light' ? styles.inkLight : ''}`}>
                  {String(item.order).padStart(2, '0')}
                </span>
                <span className={`${styles.itemLabel} ${item.tone === 'light' ? styles.inkLight : ''}`}>{item.label}</span>
                <span className={styles.itemName} style={{ top: u(r.name) }}>{item.name}</span>
                <span className={styles.itemDesc} style={{ top: u(r.desc) }}>{item.desc}</span>
                <span className={styles.itemDisc} style={{ top: u(r.disc) }} aria-hidden>
                  <ArrowRight />
                </span>
              </Link>
            );
          })}
        </section>

        {/* -------------------------- footer ------------------------- */}
        <span className={styles.footWordmark}>
          <img src={footer.wordmark.src} alt={footer.wordmark.alt}
               width={footer.wordmark.width} height={footer.wordmark.height} />
        </span>
        <span className={styles.footLabel}>{footer.label}</span>

        <Link href={footer.cta.href} className={styles.footCta}>
          <span className={styles.footCtaLabel}>{footer.cta.label}</span>
          <ArrowRight />
        </Link>

        <span className={styles.pageNum} style={{ left: u(1299) }}>
          {String(footer.pagination.current).padStart(2, '0')}
        </span>
        <span className={styles.pageDash} aria-hidden />
        <span className={`${styles.pageNum} ${styles.pageNumMuted}`} style={{ left: u(1361) }}>
          {String(footer.pagination.total).padStart(2, '0')}
        </span>
        <button type="button" className={`${styles.pageBtn} ${styles.pagePrev}`} aria-label="이전 페이지">
          <ArrowLeft />
        </button>
        <button type="button" className={`${styles.pageBtn} ${styles.pageNext}`} aria-label="다음 페이지">
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
