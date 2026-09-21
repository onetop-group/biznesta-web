import Link from 'next/link';
import { pc09 } from '@/data/pc09';
import { ArrowLeft, ArrowRight } from '@/components/shared/Arrows';
import {
  BarsIcon, ChevronIcon, DocIcon, GearIcon, GrowthIcon,
  ImageIcon, PlayIcon, SearchIcon, ShareIcon,
} from './Icons';
import styles from './Pc09.module.css';

/** Measured off BN_PC_09_CONTENT_GROWTH.png, in 1536-wide artwork coordinates. */
const NAV_CENTER_X = [414, 546.5, 671, 788, 906, 1024, 1137.5];
const PROC_X = [57, 344, 645, 936, 1232];
const PROC_W = [231, 245, 235, 240, 250];
const CHEV_X = [315.5, 616.5, 907.5, 1203.5];
const TYPE_X = [55, 255, 455, 655, 855, 1055];
const TYPE_W = [181, 181, 181, 181, 183, 181];
const BAND_ICON_X = [623, 736, 846, 957, 1057];
const BAND_LABEL_X = [662, 776, 890, 994, 1101];

const PROC_ICONS = { search: SearchIcon, doc: DocIcon, share: ShareIcon, bars: BarsIcon, growth: GrowthIcon };
const BAND_ICONS = { doc: DocIcon, image: ImageIcon, play: PlayIcon, bars: BarsIcon, gear: GearIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

export default function Pc09() {
  const { header, hero, process, types, band } = pc09;
  const steps = process.steps.filter((s) => s.visible).sort((a, b) => a.order - b.order);
  const items = types.items.filter((t) => t.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1536} height={461} fetchPriority="high" />
        </picture>

        {/* ------------------------- header -------------------------- */}
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
        <Link href={header.cta.href} className={styles.headerCta}>
          <span className={styles.ctaLabel}>{header.cta.label}</span>
          <ArrowRight />
        </Link>

        {/* -------------------------- hero --------------------------- */}
        <p className={styles.eyebrow}>{hero.eyebrow}</p>
        <h1 className={styles.headline}>
          {hero.headline.map((l) => (
            <span key={l.text} className={l.tone === 'gold' ? styles.gold : undefined}>{l.text}</span>
          ))}
        </h1>
        <p className={styles.sub}>{hero.sub.map((s) => <span key={s}>{s}</span>)}</p>
        <span className={styles.heroDash} aria-hidden />
        <span className={styles.heroQuoteRule} aria-hidden />
        <p className={styles.heroQuote}>{hero.quote.map((q) => <span key={q}>{q}</span>)}</p>

        {/* right panel printed on the dark edge of the hero photograph */}
        <span className={styles.panelRule} aria-hidden />
        <p className={styles.panelLabel}>{hero.panel.label.map((l) => <span key={l}>{l}</span>)}</p>
        <span className={styles.panelTick} aria-hidden />
        <p className={styles.panelLines}>{hero.panel.lines.map((l) => <span key={l}>{l}</span>)}</p>
        <span className={styles.panelDash} aria-hidden />
        <p className={styles.panelKeywords}>{hero.panel.keywords.map((k) => <span key={k}>{k}</span>)}</p>

        {/* ----------------------- content process ------------------- */}
        <section aria-label="콘텐츠 운영 프로세스">
          <p className={styles.procEyebrow}>{process.eyebrow}</p>
          <h2 className={styles.procTitle}>{process.title}</h2>
          <span className={styles.procRule} aria-hidden />
          <p className={styles.procNote}>{process.note}</p>
          <button type="button" className={styles.procBtn} style={{ left: u(1408) }} aria-label="이전 단계">
            <ArrowLeft />
          </button>
          <button type="button" className={styles.procBtn} style={{ left: u(1452) }} aria-label="다음 단계">
            <ArrowRight />
          </button>

          {steps.map((s, i) => {
            const Icon = PROC_ICONS[s.icon];
            return (
              <article key={s.id}
                       className={`${styles.proc} ${s.featured ? styles.procFeatured : ''}`}
                       style={{ left: u(PROC_X[i]), width: u(PROC_W[i]) }}>
                <span className={styles.procNumber}>{String(s.order).padStart(2, '0')}</span>
                <span className={styles.procIcon} aria-hidden><Icon /></span>
                <h3 className={styles.procStepTitle}>{s.title}</h3>
                <p className={styles.procDesc}>
                  {s.desc.map((d) => <span key={d}>{d}</span>)}
                </p>
              </article>
            );
          })}
          {CHEV_X.map((x) => (
            <span key={x} className={styles.chevron} style={{ left: u(x) }} aria-hidden><ChevronIcon /></span>
          ))}
        </section>

        {/* ----------------------- content types --------------------- */}
        <section aria-label="제작 가능한 콘텐츠">
          <p className={styles.typesEyebrow}>{types.eyebrow}</p>
          <h2 className={styles.typesTitle}>{types.title}</h2>
          <span className={styles.typesRule} aria-hidden />
          <p className={styles.typesNote}>{types.note}</p>

          {items.map((t, i) => (
            <article key={t.id} className={styles.type}
                     style={{ left: u(TYPE_X[i]), width: u(TYPE_W[i]) }}>
              <picture>
                <source srcSet={t.artwork.webp} type="image/webp" />
                <img className={styles.typeImg} src={t.artwork.jpg} alt={t.artwork.alt}
                     width={TYPE_W[i]} height={91} loading="lazy" />
              </picture>
              <h3 className={styles.typeTitle}>{t.title}</h3>
              <p className={styles.typeDesc}>{t.desc}</p>
            </article>
          ))}

          <div className={styles.quoteCard}>
            <p className={styles.quoteText}>
              <span><span className={styles.quoteMark}>&ldquo;</span> {types.quoteCard.quote[0]}</span>
              <span>{types.quoteCard.quote[1]} <span className={styles.quoteMark}>&rdquo;</span></span>
            </p>
            <span className={styles.quoteDash} aria-hidden />
            <p className={styles.quoteBrand}>
              {types.quoteCard.brand.map((b) => <span key={b}>{b}</span>)}
            </p>
          </div>
        </section>

        {/* -------------------------- band --------------------------- */}
        <picture>
          <source srcSet={band.image.webp} type="image/webp" />
          <img className={styles.band} src={band.image.jpg} alt="" width={1536} height={104} loading="lazy" />
        </picture>
        <span className={styles.bandWordmark}>
          <img src={band.wordmark.src} alt={band.wordmark.alt}
               width={band.wordmark.width} height={band.wordmark.height} />
        </span>
        <span className={styles.bandTagline}>{band.tagline}</span>
        <p className={styles.bandQuote}>
          <span className={styles.quoteMark}>&ldquo;</span> {band.quote} <span className={styles.quoteMark}>&rdquo;</span>
        </p>
        {band.points.map((p, i) => {
          const Icon = BAND_ICONS[p.icon];
          return (
            <span key={p.ko}>
              <span className={styles.bandIcon} style={{ left: u(BAND_ICON_X[i]) }} aria-hidden><Icon /></span>
              <span className={styles.bandLabel} style={{ left: u(BAND_LABEL_X[i]) }}>{p.ko}</span>
            </span>
          );
        })}
        <Link href={band.cta.href} className={styles.bandCta}>
          <span className={styles.bandCtaLabel}>{band.cta.label}</span>
          <ArrowRight />
        </Link>
      </div>
    </div>
  );
}
