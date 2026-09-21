import Link from 'next/link';
import { pc08 } from '@/data/pc08';
import { ArrowRight } from '@/components/shared/Arrows';
import {
  BulbIcon, CheckCircleIcon, CrownIcon, DiamondIcon, GearIcon,
  GrowthIcon, LayersIcon, PenIcon, SupportIcon, TargetIcon,
} from './Icons';
import styles from './Pc08.module.css';

/** Measured off BN_PC_08_SIGNATURE.png, in 1536-wide artwork coordinates. */
const NAV_CENTER_X = [408, 542, 667.5, 784, 897, 1008.5, 1117];
const FEATURE_X = [109.5, 261, 411.5, 553.5];
const FEATURE_RULE_X = [183, 339, 483.5];
const STEP_X = [64, 293, 520, 748, 975];
const STEP_W = [209, 207, 208, 208, 208];
const BAND_RULE_X = [268.5, 634, 792, 965, 1128];
const BAND_ICON_X = [657, 810, 984, 1146];
const BAND_TEXT_X = [710, 864, 1038, 1198];

const FEATURE_ICONS = { target: TargetIcon, diamond: DiamondIcon, layers: LayersIcon, support: SupportIcon };
const BAND_ICONS = { bulb: BulbIcon, pen: PenIcon, gear: GearIcon, growth: GrowthIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

export default function Pc08() {
  const { header, hero, signature, band } = pc08;
  const steps = signature.steps.filter((s) => s.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1536} height={519} fetchPriority="high" />
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
          <span className={styles.headTop}>
            <span className={styles.serif}>{hero.headlineTop.serif}</span>{hero.headlineTop.rest}
          </span>
          <span className={styles.headBottom}>{hero.headlineBottom}</span>
        </h1>
        <p className={styles.sub}>{hero.sub.map((s) => <span key={s}>{s}</span>)}</p>

        {hero.features.map((f, i) => {
          const Icon = FEATURE_ICONS[f.icon];
          return (
            <div key={f.title} className={styles.feature} style={{ left: u(FEATURE_X[i]) }}>
              <span className={styles.featureIcon} aria-hidden><Icon /></span>
              <span className={styles.featureTitle}>{f.title}</span>
              <span className={styles.featureDesc}>
                {f.desc.map((d) => <span key={d}>{d}</span>)}
              </span>
            </div>
          );
        })}
        {FEATURE_RULE_X.map((x) => (
          <span key={x} className={styles.featureRule} style={{ left: u(x) }} aria-hidden />
        ))}

        {/* ---------------------- signature steps -------------------- */}
        <section aria-label="BIZNESTA 시그니처 제작 과정">
          <p className={styles.midEyebrow}>{signature.eyebrow}</p>
          <span className={styles.midRuleLeft} aria-hidden />
          <span className={styles.midRuleRight} aria-hidden />
          <h2 className={styles.midTitle}>{signature.title}</h2>

          {steps.map((s, i) => (
            <article key={s.id} className={styles.step}
                     style={{ left: u(STEP_X[i]), width: u(STEP_W[i]) }}>
              <span className={styles.stepNumber}>{String(s.order).padStart(2, '0')}</span>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>
                {s.desc.map((d) => <span key={d}>{d}</span>)}
              </p>
              <picture>
                <source srcSet={s.artwork.webp} type="image/webp" />
                <img className={styles.stepImg} src={s.artwork.jpg} alt={s.artwork.alt}
                     width={STEP_W[i]} height={138} loading="lazy" />
              </picture>
            </article>
          ))}

          <div className={styles.reason}>
            <span className={styles.reasonCrown} aria-hidden><CrownIcon /></span>
            <h3 className={styles.reasonTitle}>
              <span className={styles.reasonSerif}>{signature.reason.title.serif}</span>{signature.reason.title.rest}
            </h3>
            <ul className={styles.reasonList}>
              {signature.reason.items.map((it) => (
                <li key={it} className={styles.reasonItem}>
                  <span className={styles.reasonCheck} aria-hidden><CheckCircleIcon /></span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
            <p className={styles.reasonQuote}>&ldquo; {signature.reason.quote} &rdquo;</p>
          </div>
        </section>

        {/* -------------------------- band --------------------------- */}
        <span className={styles.band} aria-hidden />
        <span className={styles.bandWordmark}>
          <img src={band.wordmark.src} alt={band.wordmark.alt}
               width={band.wordmark.width} height={band.wordmark.height} />
        </span>
        <span className={styles.bandTagline}>{band.tagline}</span>
        <p className={styles.bandQuote}>
          <span className={styles.quoteL1}><span className={styles.quoteMark}>&ldquo;</span> {band.quote[0]}</span>
          <span className={styles.quoteL2}>{band.quote[1]} <span className={styles.quoteMark}>&rdquo;</span></span>
        </p>
        {band.points.map((p, i) => {
          const Icon = BAND_ICONS[p.icon];
          return (
            <span key={p.en} className={styles.bandPoint}>
              <span className={styles.bandIcon} style={{ left: u(BAND_ICON_X[i]) }} aria-hidden><Icon /></span>
              <span className={styles.bandKo} style={{ left: u(BAND_TEXT_X[i]) }}>{p.ko}</span>
              <span className={styles.bandEn} style={{ left: u(BAND_TEXT_X[i]) }}>{p.en}</span>
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
