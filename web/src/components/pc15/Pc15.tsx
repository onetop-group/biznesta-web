import Link from 'next/link';
import { pc15 } from '@/data/pc15';
import { ArrowRight } from '@/components/shared/Arrows';
import {
  BarsIcon, BulbIcon, CheckCircleIcon, DiamondIcon, GearIcon, MonitorIcon, PeopleIcon,
} from '@/components/shared/LineIcons';
import styles from './Pc15.module.css';

/** Measured off BN_PC_15_ABOUT.png, in 1536-wide artwork coordinates. */
const NAV_CENTER_X = [408, 537, 656, 773.5, 891, 1005.5, 1118];
const MISSION_X = [308, 541, 777, 1007];
const MISSION_W = [224, 227, 224, 223];
const BAND_CX = [636.5, 781, 941.5, 1117];

const MISSION_ICONS = { diamond: DiamondIcon, bulb: BulbIcon, bars: BarsIcon, people: PeopleIcon };
const BAND_ICONS = { monitor: MonitorIcon, gear: GearIcon, people: PeopleIcon, bars: BarsIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

export default function Pc15() {
  const { header, hero, mission, standard, founder, why, goldCard, band } = pc15;
  const cards = mission.items.filter((m) => m.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1536} height={431} fetchPriority="high" />
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
          <span className={styles.headBrown}>{hero.headline[1]}</span>
        </h1>
        <p className={styles.sub}>{hero.sub.map((s) => <span key={s}>{s}</span>)}</p>
        <span className={styles.engDash} aria-hidden />
        <span className={styles.engRule} aria-hidden />
        <p className={styles.engQuote}>{hero.englishQuote.map((q) => <span key={q}>{q}</span>)}</p>

        <p className={styles.heroPanelQuote}>
          <span><span className={styles.quoteMark}>&ldquo;</span> {hero.panel.quote[0]}</span>
          <span>{hero.panel.quote[1]}</span>
          <span>{hero.panel.quote[2]} <span className={styles.quoteMark}>&rdquo;</span></span>
        </p>
        <span className={styles.heroPanelDash} aria-hidden />
        <p className={styles.heroPanelBrand}>{hero.panel.brand.map((b) => <span key={b}>{b}</span>)}</p>
        <p className={styles.heroPanelKeywords}>{hero.panel.keywords.map((k) => <span key={k}>{k}</span>)}</p>

        {/* -------------------------- mission ------------------------ */}
        <section aria-label="비즈네스타가 지향하는 가치">
          <p className={styles.misEyebrow}>{mission.eyebrow}</p>
          <h2 className={styles.misTitle}>{mission.title.map((t) => <span key={t}>{t}</span>)}</h2>
          <p className={styles.misDesc}>{mission.desc.map((d) => <span key={d}>{d}</span>)}</p>

          {cards.map((m, i) => {
            const Icon = MISSION_ICONS[m.icon];
            return (
              <article key={m.id} className={styles.misCard}
                       style={{ left: u(MISSION_X[i]), width: u(MISSION_W[i]) }}>
                <span className={styles.misIcon} aria-hidden><Icon /></span>
                <h3 className={styles.misCardTitle}>{m.title}</h3>
                <p className={styles.misCardDesc}>
                  {m.desc.map((d) => <span key={d}>{d}</span>)}
                </p>
              </article>
            );
          })}

          {/* BIZNESTA STANDARD — replaces the artwork's unverified figures */}
          <span className={styles.stdPanel} aria-hidden />
          <p className={styles.stdEyebrow}>{standard.eyebrow}</p>
          <ul className={styles.stdRows}>
            {standard.rows.map((r, i) => (
              <li key={r.value} className={styles.stdRow} style={{ top: u(i * 28.3) }}>
                <span className={styles.stdValue}>{r.value}</span>
                <span className={styles.stdLabel}>{r.label}</span>
              </li>
            ))}
          </ul>
          <span className={styles.stdDash} aria-hidden />
          <span className={styles.stdRule} aria-hidden />
          <p className={styles.stdTagline}>{standard.tagline.map((t) => <span key={t}>{t}</span>)}</p>
        </section>

        {/* ------------------------- founder ------------------------- */}
        <section aria-label="대표 메시지">
          <picture>
            <source srcSet={founder.image.webp} type="image/webp" />
            <img className={styles.founderImg} src={founder.image.jpg} alt={founder.image.alt}
                 width={386} height={263} loading="lazy" />
          </picture>
          <p className={styles.fmEyebrow}>{founder.eyebrow}</p>
          <p className={styles.fmQuote}>
            <span><span className={styles.quoteMark}>&ldquo;</span> {founder.quote[0]}</span>
            <span>{founder.quote[1]} <span className={styles.quoteMark}>&rdquo;</span></span>
          </p>
          <p className={styles.fmBody}>{founder.body.map((b) => <span key={b}>{b}</span>)}</p>
          <p className={styles.fmSign}>
            <span className={styles.fmName}>{founder.signature[0]}</span>
            <span className={styles.fmSep} aria-hidden>|</span>
            <span>{founder.signature[1]}</span>
            <span className={styles.fmSep} aria-hidden>|</span>
            <span>{founder.signature[2]}</span>
          </p>
        </section>

        {/* --------------------------- why --------------------------- */}
        <section aria-label="비즈네스타가 다른 이유">
          <p className={styles.whyEyebrow}>{why.eyebrow}</p>
          <h2 className={styles.whyTitle}>{why.title.map((t) => <span key={t}>{t}</span>)}</h2>
          <ul className={styles.whyList}>
            {why.items.map((w, i) => (
              <li key={w} className={styles.whyItem} style={{ top: u(i * 25.4) }}>
                <span className={styles.whyCheck} aria-hidden><CheckCircleIcon /></span>
                <span>{w}</span>
              </li>
            ))}
          </ul>

          <picture>
            <source srcSet={goldCard.image.webp} type="image/webp" />
            <img className={styles.goldImg} src={goldCard.image.jpg} alt=""
                 width={247} height={263} loading="lazy" />
          </picture>
          <p className={styles.goldLines}>{goldCard.lines.map((l, i) => <span key={`${l}${i}`}>{l}</span>)}</p>
          <span className={styles.goldDash} aria-hidden />
          <p className={styles.goldBrand}>{goldCard.brand.map((b) => <span key={b}>{b}</span>)}</p>
        </section>

        {/* -------------------------- band --------------------------- */}
        <picture>
          <source srcSet={band.image.webp} type="image/webp" />
          <img className={styles.band} src={band.image.jpg} alt="" width={1536} height={108} loading="lazy" />
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
              <span className={styles.bandIcon} style={{ left: u(BAND_CX[i]) }} aria-hidden><Icon /></span>
              <span className={styles.bandLabel} style={{ left: u(BAND_CX[i]) }}>{p.ko}</span>
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
