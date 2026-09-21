import Link from 'next/link';
import { pc11 } from '@/data/pc11';
import { ArrowRight } from '@/components/shared/Arrows';
import {
  BarsIcon, BulbIcon, ChatIcon, ChevronIcon, DatabaseIcon, DocIcon, GearIcon,
  ImageIcon, MegaphoneIcon, MonitorIcon, PenIcon, PeopleIcon, ShareIcon,
} from './Icons';
import styles from './Pc11.module.css';

/** Measured off BN_PC_11_CUSTOM_SOLUTION.png, in 1536-wide artwork coordinates. */
const NAV_CENTER_X = [410.5, 541.5, 664.5, 782.5, 897.5, 1010, 1118.5];
const STEP_CENTER_X = [419, 648.5, 892, 1140.5, 1389];
const CHEV_X = [534, 768, 1016, 1261];
const CARD_X = [315, 623, 931];
const CARD_W = [298, 299, 300];
const CARD_Y = [667, 780];
const CARD_H = [103, 106];
const BAND_ICON_X = [665, 815, 977, 1144];
const BAND_LABEL_X = [720, 878, 1035, 1201];

const STEP_ICONS = { chat: ChatIcon, doc: DocIcon, pen: PenIcon, monitor: MonitorIcon, bars: BarsIcon };
const AREA_ICONS = { monitor: MonitorIcon, share: ShareIcon, database: DatabaseIcon,
  image: ImageIcon, megaphone: MegaphoneIcon, gear: GearIcon };
const BAND_ICONS = { bulb: BulbIcon, people: PeopleIcon, gear: GearIcon, bars: BarsIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

export default function Pc11() {
  const { header, hero, process, solutions, band } = pc11;
  const steps = process.steps.filter((s) => s.visible).sort((a, b) => a.order - b.order);
  const areas = solutions.areas.filter((a) => a.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1536} height={464} fetchPriority="high" />
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
        <span className={styles.engRule} aria-hidden />
        <p className={styles.engQuote}>{hero.englishQuote.map((q) => <span key={q}>{q}</span>)}</p>

        <span className={styles.panelDashTop} aria-hidden />
        <p className={styles.panelLines}>{hero.panel.lines.map((l) => <span key={l}>{l}</span>)}</p>
        <span className={styles.panelDashBottom} aria-hidden />
        <p className={styles.panelKeywords}>{hero.panel.keywords.map((k) => <span key={k}>{k}</span>)}</p>

        {/* --------------------- solution process -------------------- */}
        <section aria-label="맞춤 제작 프로세스">
          <p className={styles.procEyebrow}>{process.eyebrow}</p>
          <h2 className={styles.procTitle}>{process.title.map((t) => <span key={t}>{t}</span>)}</h2>
          <p className={styles.procDesc}>{process.desc.map((d) => <span key={d}>{d}</span>)}</p>

          {steps.map((s, i) => {
            const Icon = STEP_ICONS[s.icon];
            return (
              <div key={s.id} className={styles.step} style={{ left: u(STEP_CENTER_X[i]) }}>
                <span className={styles.stepIcon} aria-hidden><Icon /></span>
                <span className={styles.stepLabel}>{s.label}</span>
                <span className={styles.stepDesc}>
                  {s.desc.map((d) => <span key={d}>{d}</span>)}
                </span>
              </div>
            );
          })}
          {CHEV_X.map((x) => (
            <span key={x} className={styles.chevron} style={{ left: u(x) }} aria-hidden><ChevronIcon /></span>
          ))}
        </section>

        {/* ----------------------- solution areas -------------------- */}
        <section aria-label="맞춤 솔루션 구성">
          <h2 className={styles.solTitle}>{solutions.title.map((t) => <span key={t}>{t}</span>)}</h2>
          <p className={styles.solDesc}>{solutions.desc.map((d) => <span key={d}>{d}</span>)}</p>
          <Link href={solutions.cta.href} className={styles.solCta}>
            <span className={styles.solCtaLabel}>{solutions.cta.label}</span>
            <ArrowRight />
          </Link>

          {areas.map((a, i) => {
            const Icon = AREA_ICONS[a.icon];
            const row = Math.floor(i / 3), col = i % 3;
            return (
              <article key={a.id} className={styles.area}
                       style={{ left: u(CARD_X[col]), top: u(CARD_Y[row]),
                                width: u(CARD_W[col]), height: u(CARD_H[row]) }}>
                <picture>
                  <source srcSet={a.artwork.webp} type="image/webp" />
                  <img className={styles.areaImg} src={a.artwork.jpg} alt={a.artwork.alt}
                       width={CARD_W[col]} height={CARD_H[row]} loading="lazy" />
                </picture>
                <span className={styles.areaIcon} aria-hidden><Icon /></span>
                <h3 className={styles.areaTitle}>{a.title}</h3>
                <p className={styles.areaDesc}>
                  {a.desc.map((d) => <span key={d}>{d}</span>)}
                </p>
              </article>
            );
          })}

          <span className={styles.panel} aria-hidden />
          <p className={styles.panelEyebrow}>{solutions.panel.eyebrow}</p>
          <h3 className={styles.panelTitle}>{solutions.panel.title.map((t) => <span key={t}>{t}</span>)}</h3>
          <span className={styles.panelRule} aria-hidden />
          <p className={styles.panelDesc}>{solutions.panel.desc.map((d) => <span key={d}>{d}</span>)}</p>
          <Link href={solutions.panel.cta.href} className={styles.panelCta}>
            <span className={styles.panelCtaLabel}>{solutions.panel.cta.label}</span>
            <ArrowRight />
          </Link>
          <p className={styles.panelBrand}>{solutions.panel.brand.map((b) => <span key={b}>{b}</span>)}</p>
        </section>

        {/* -------------------------- band --------------------------- */}
        <picture>
          <source srcSet={band.image.webp} type="image/webp" />
          <img className={styles.band} src={band.image.jpg} alt="" width={1536} height={115} loading="lazy" />
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
            <span key={p.lines[0]}>
              <span className={styles.bandIcon} style={{ left: u(BAND_ICON_X[i]) }} aria-hidden><Icon /></span>
              <span className={styles.bandLines} style={{ left: u(BAND_LABEL_X[i]) }}>
                {p.lines.map((l) => <span key={l}>{l}</span>)}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
