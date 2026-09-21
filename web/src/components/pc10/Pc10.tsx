import Link from 'next/link';
import { pc10 } from '@/data/pc10';
import { ArrowRight } from '@/components/shared/Arrows';
import {
  BarsIcon, CheckCircleIcon, ClockIcon, DocIcon, GearIcon,
  ImageIcon, MailIcon, PeopleIcon,
} from './Icons';
import styles from './Pc10.module.css';

/** Measured off BN_PC_10_ADMIN_SYSTEM.png, in 1536-wide artwork coordinates. */
const NAV_CENTER_X = [411.5, 540.5, 663.5, 781.5, 897, 1011.5, 1120];
const CHECK_Y = [368, 399.5, 431];
const CARD_X = [350, 536, 726, 915, 1105, 1300];
const CARD_W = [176, 180, 179, 181, 186, 185];
const BAND_CENTER_X = [652.5, 769.5, 918, 1099];

const CARD_ICONS = { mail: MailIcon, people: PeopleIcon, doc: DocIcon, image: ImageIcon, bars: BarsIcon, gear: GearIcon };
const BAND_ICONS = { clock: ClockIcon, gear: GearIcon, bars: BarsIcon, people: PeopleIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

export default function Pc10() {
  const { header, hero, features, band } = pc10;
  const cards = features.items.filter((f) => f.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1536} height={612} fetchPriority="high" />
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
          <span>{hero.headline[0]}</span>
          <span className={styles.headCream}>{hero.headline[1]}</span>
        </h1>
        <p className={styles.sub}>{hero.sub.map((s) => <span key={s}>{s}</span>)}</p>

        <ul className={styles.checks}>
          {hero.checks.map((c, i) => (
            <li key={c} className={styles.check} style={{ top: u(CHECK_Y[i]) }}>
              <span className={styles.checkIcon} aria-hidden><CheckCircleIcon /></span>
              <span className={styles.checkText}>{c}</span>
            </li>
          ))}
        </ul>

        <span className={styles.heroDash} aria-hidden />
        <span className={styles.heroQuoteRule} aria-hidden />
        <p className={styles.heroQuote}>{hero.englishQuote.map((q) => <span key={q}>{q}</span>)}</p>

        {/* ---------------------- admin features --------------------- */}
        <section aria-label="관리자 시스템 주요 기능">
          <p className={styles.featEyebrow}>{features.eyebrow}</p>
          <h2 className={styles.featTitle}>{features.title.map((t) => <span key={t}>{t}</span>)}</h2>
          <p className={styles.featDesc}>{features.desc.map((d) => <span key={d}>{d}</span>)}</p>

          {cards.map((f, i) => {
            const Icon = CARD_ICONS[f.icon];
            return (
              <article key={f.id} className={styles.card}
                       style={{ left: u(CARD_X[i]), width: u(CARD_W[i]) }}>
                <span className={styles.cardIcon} aria-hidden><Icon /></span>
                <h3 className={styles.cardTitle}>{f.title}</h3>
                <p className={styles.cardDesc}>
                  {f.desc.map((d) => <span key={d}>{d}</span>)}
                </p>
              </article>
            );
          })}
        </section>

        {/* -------------------------- band --------------------------- */}
        <picture>
          <source srcSet={band.image.webp} type="image/webp" />
          <img className={styles.band} src={band.image.jpg} alt="" width={1536} height={141} loading="lazy" />
        </picture>
        <span className={styles.bandWordmark}>
          <img src={band.wordmark.src} alt={band.wordmark.alt}
               width={band.wordmark.width} height={band.wordmark.height} />
        </span>
        <span className={styles.bandTagline}>{band.tagline}</span>
        <p className={styles.bandQuote}>
          <span><span className={styles.quoteMark}>&ldquo;</span> {band.quote[0]}</span>
          <span>{band.quote[1]} <span className={styles.quoteMark}>&rdquo;</span></span>
        </p>
        {band.points.map((p, i) => {
          const Icon = BAND_ICONS[p.icon];
          return (
            <span key={p.ko}>
              <span className={styles.bandIcon} style={{ left: u(BAND_CENTER_X[i]) }} aria-hidden><Icon /></span>
              <span className={styles.bandLabel} style={{ left: u(BAND_CENTER_X[i]) }}>{p.ko}</span>
            </span>
          );
        })}
        <Link href={band.cta.href} className={styles.bandCta}>
          <span className={styles.bandCtaLabel}>{band.cta.label}</span>
          <ArrowRight />
        </Link>
        <p className={styles.bandCtaNote}>{band.ctaNote}</p>
      </div>
    </div>
  );
}
