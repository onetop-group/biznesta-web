import Link from 'next/link';
import { pc07 } from '@/data/pc07';
import { ArrowLeft, ArrowRight } from '@/components/shared/Arrows';
import { BulbIcon, GemIcon, GearIcon, GrowthIcon, MonitorIcon, PenIcon, PeopleIcon } from './Icons';
import { ALL_FILTER, categoryHref } from '@/data/showroom';
import styles from './Pc07.module.css';

/** Measured off BN_PC_07_NEW_DESIGN.png, in 1536-wide artwork coordinates. */
const NAV_CENTER_X = [416, 552.5, 673, 786.5, 903, 1015.5, 1114.5];
const NAV_RULE_X = [491.5, 610.5, 734.5, 838.5, 966, 1060.5, 1230];
const FEATURE_X = [115.5, 249.5, 393, 534];
const FEATURE_RULE_X = [182, 321, 463];
const FILTER_X = [180.5, 281.5, 382, 480, 584.5, 690, 794.5, 900.5, 1000.5, 1104];
const CARD_X = [41, 409, 777, 1145];
const CARD_W = [351, 351, 353, 351];
const BAND_POINT_X = [731, 907, 1083];
const BAND_RULE_X = [700, 875, 1051, 1250];

const HERO_ICONS = { gem: GemIcon, people: PeopleIcon, monitor: MonitorIcon, growth: GrowthIcon };
const BAND_ICONS = { bulb: BulbIcon, pen: PenIcon, gear: GearIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

export default function Pc07() {
  const { header, hero, filters, items, band } = pc07;
  const shown = items.filter((i) => i.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1536} height={480} fetchPriority="high" />
        </picture>

        {/* header */}
        <Link href="/" className={styles.wordmark} aria-label="BIZNESTA 홈으로">
          <img src={header.wordmark.src} alt={header.wordmark.alt}
               width={header.wordmark.width} height={header.wordmark.height} />
        </Link>
        <span className={styles.headerTagline}>{header.tagline}</span>
        <nav aria-label="주 메뉴">
          {header.nav.map((item, i) => (
            <Link key={item.en} href={item.href} className={styles.navItem} style={{ left: u(NAV_CENTER_X[i]) }}>
              <span className={styles.navEn}>{item.en}</span>
              <span className={styles.navKo}>{item.ko}</span>
            </Link>
          ))}
        </nav>
        {NAV_RULE_X.map((x) => <span key={x} className={styles.navRule} style={{ left: u(x) }} aria-hidden />)}
        <Link href={header.cta.href} className={styles.headerCta}>
          <span className={styles.ctaLabel}>{header.cta.label}</span>
          <ArrowRight />
        </Link>

        {/* hero */}
        <p className={styles.eyebrow}>{hero.eyebrow}</p>
        <h1 className={styles.headline}>
          {hero.headline.map((l) => (
            <span key={l.text} className={l.tone === 'gold' ? styles.gold : undefined}>{l.text}</span>
          ))}
        </h1>
        <p className={styles.desc}>{hero.desc.map((d) => <span key={d}>{d}</span>)}</p>

        {hero.features.map((f, i) => {
          const Icon = HERO_ICONS[f.icon];
          return (
            <div key={f.label} className={styles.feature} style={{ left: u(FEATURE_X[i]) }}>
              <span className={styles.featureIcon} aria-hidden><Icon /></span>
              <span className={styles.featureLabel}>{f.label}</span>
            </div>
          );
        })}
        {FEATURE_RULE_X.map((x) => (
          <span key={x} className={styles.featureRule} style={{ left: u(x) }} aria-hidden />
        ))}

        <p className={styles.midKeywords}>{hero.midKeywords.map((k) => <span key={k}>{k}</span>)}</p>
        <p className={styles.sideKeywords}>{hero.sideKeywords.map((k) => <span key={k}>{k}</span>)}</p>
        <span className={styles.sideRule} aria-hidden />
        <p className={styles.sideNote}>{hero.sideNote.map((n) => <span key={n}>{n}</span>)}</p>

        {/* filters */}
        <nav aria-label="디자인 필터">
          <span className={styles.filterActive}>{filters.activeLabel}</span>
          {filters.items.map((f, i) => (
            <Link key={f.slug} href={`/design?filter=${f.slug}`}
                  className={styles.filterPill} style={{ left: u(FILTER_X[i]) }}>{f.label}</Link>
          ))}
          {/* 여기서 더 볼 것 = 완성된 43개 샘플 전체 */}
          <Link href={categoryHref(ALL_FILTER.id)} className={styles.moreLink}>
            {filters.moreLabel}
            <ArrowRight />
          </Link>
          <button type="button" className={styles.navBtn} style={{ left: u(1434) }} aria-label="이전">
            <ArrowLeft />
          </button>
          <button type="button" className={styles.navBtn} style={{ left: u(1468) }} aria-label="다음">
            <ArrowRight />
          </button>
        </nav>

        {/* new designs */}
        <section aria-label="새로 등록된 디자인">
          <h2 className={styles.srOnly}>새로 등록된 BIZNESTA 샘플 디자인</h2>
          {shown.map((item, i) => (
            <Link key={item.id} href={categoryHref(item.categoryId ?? ALL_FILTER.id)} className={styles.card}
                  style={{ left: u(CARD_X[i]), width: u(CARD_W[i]), height: u(332) }}>
              <picture>
                <source srcSet={item.artwork.webp} type="image/webp" />
                <img className={styles.cardImg} src={item.artwork.jpg} alt={item.artwork.alt}
                     width={CARD_W[i]} height={212} loading={i < 2 ? undefined : 'lazy'} />
              </picture>
              {item.isNew && <span className={styles.badge}>NEW</span>}
              <span className={styles.cardName}>{item.title}</span>
              <span className={styles.cardDesc}>
                {item.desc.map((d) => <span key={d}>{d}</span>)}
              </span>
              <span className={styles.cardTags}>
                {item.tags.map((t) => <span key={t} className={styles.cardTag}>{t}</span>)}
              </span>
              <span className={styles.cardDisc} aria-hidden><ArrowRight /></span>
            </Link>
          ))}
        </section>

        {/* closing band */}
        <span className={styles.band} aria-hidden />
        <span className={styles.bandWordmark}>
          <img src={band.wordmark.src} alt={band.wordmark.alt}
               width={band.wordmark.width} height={band.wordmark.height} />
        </span>
        <span className={styles.bandTagline}>{band.tagline}</span>
        <p className={styles.bandQuote}>
          <span><span className={styles.quoteMark}>&ldquo;</span> {band.quote[0]} <span className={styles.quoteMark}>&rdquo;</span></span>
          <span>{band.quote[1]}</span>
        </p>
        {band.points.map((p, i) => {
          const Icon = BAND_ICONS[p.icon];
          return (
            <span key={p.lines[0]} className={styles.bandPoint} style={{ left: u(BAND_POINT_X[i]) }}>
              <span className={styles.bandIcon} aria-hidden><Icon /></span>
              <span className={styles.bandLines}>
                {p.lines.map((l) => <span key={l}>{l}</span>)}
              </span>
            </span>
          );
        })}
        {BAND_RULE_X.map((x) => (
          <span key={x} className={styles.bandRule} style={{ left: u(x) }} aria-hidden />
        ))}
        <Link href={band.cta.href} className={styles.bandCta}>
          <span className={styles.bandCtaLabel}>{band.cta.label}</span>
          <ArrowRight />
        </Link>
      </div>
    </div>
  );
}
