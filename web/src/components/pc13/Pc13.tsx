import Link from 'next/link';
import { pc13 } from '@/data/pc13';
import { ArrowRight } from '@/components/shared/Arrows';
import {
  BarsIcon, CheckCircleIcon, ClockIcon, CrownIcon, DiamondIcon, GearIcon,
  HandshakeIcon, HeadsetIcon, MegaphoneIcon, PenIcon, PeopleIcon, ShareIcon,
} from '@/components/shared/LineIcons';
import { consultHref } from '@/data/navigation';
import styles from './Pc13.module.css';

/** Measured off BN_PC_13_PRICE.png, in 1536-wide artwork coordinates. */
const NAV_CENTER_X = [404, 536.5, 654, 762.5, 881.5, 996.5, 1107];
const PLAN_X = [302, 544, 804, 1053];
const PLAN_W = [229, 247, 234, 232];
const ADDON_X = [320, 513, 709, 906, 1102, 1298];
const ADDON_W = [182, 186, 187, 185, 187, 188];
const BAND_CX = [674, 811, 969.5, 1149.5];

const POINT_ICONS = { diamond: DiamondIcon, clock: ClockIcon, people: PeopleIcon };
const ADDON_ICONS = { headset: HeadsetIcon, pen: PenIcon, gear: GearIcon,
  share: ShareIcon, megaphone: MegaphoneIcon, bars: BarsIcon };
const BAND_ICONS = { handshake: HandshakeIcon, diamond: DiamondIcon, people: PeopleIcon, bars: BarsIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

export default function Pc13() {
  const { header, hero, plans, addons, band } = pc13;
  const planItems = plans.items.filter((p) => p.visible).sort((a, b) => a.order - b.order);
  const addonItems = addons.items.filter((a) => a.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1536} height={360} fetchPriority="high" />
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
        <p className={styles.heroQuote}>
          <span><span className={styles.quoteMark}>&ldquo;</span> {hero.panel.quote[0]}</span>
          <span>{hero.panel.quote[1]} <span className={styles.quoteMark}>&rdquo;</span></span>
        </p>
        <p className={styles.heroKeywords}>{hero.panel.keywords.map((k) => <span key={k}>{k}</span>)}</p>

        {/* -------------------------- plans -------------------------- */}
        <section aria-label="제작 플랜">
          <p className={styles.planEyebrow}>{plans.eyebrow}</p>
          <h2 className={styles.planTitle}>{plans.title.map((t) => <span key={t}>{t}</span>)}</h2>
          <p className={styles.planDesc}>{plans.desc.map((d) => <span key={d}>{d}</span>)}</p>
          <ul className={styles.planPoints}>
            {plans.points.map((p, i) => {
              const Icon = POINT_ICONS[p.icon];
              return (
                <li key={p.ko} className={styles.planPoint} style={{ top: u(577 + i * 46.5) }}>
                  <span className={styles.planPointIcon} aria-hidden><Icon /></span>
                  <span className={styles.planPointLabel}>{p.ko}</span>
                </li>
              );
            })}
          </ul>

          {planItems.map((p, i) => (
            <article key={p.id}
                     className={`${styles.plan} ${p.featured ? styles.planFeatured : ''}`}
                     style={{ left: u(PLAN_X[i]), width: u(PLAN_W[i]) }}>
              {p.featured && (
                <span className={styles.planBadge}>
                  <span className={styles.badgeIcon} aria-hidden><CrownIcon /></span>
                  {plans.badgeLabel}
                </span>
              )}
              <h3 className={styles.planName}>{p.name}</h3>
              <p className={styles.planTagline}>{p.tagline}</p>
              <p className={styles.planCardDesc}>
                {p.desc.map((d) => <span key={d}>{d}</span>)}
              </p>
              {/* Price slot — the artwork's amount is a draft, so the confirmed
                  label sits here at the same size, weight and colour. */}
              <p className={styles.planPrice}>{p.priceLabel}</p>
              <ul className={styles.planFeatures}>
                {p.features.map((f, k) => (
                  <li key={f} className={styles.planFeature} style={{ top: u(k * 24.5) }}>
                    <span className={styles.featureCheck} aria-hidden><CheckCircleIcon /></span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={consultHref('price', { plan: p.slug })}
                    className={`${styles.planCta} ${p.featured ? styles.planCtaFilled : ''}`}>
                {p.cta}
                <ArrowRight />
              </Link>
            </article>
          ))}

          <span className={styles.navyPanel} aria-hidden />
          <span className={styles.navyIcon} aria-hidden><BarsIcon /></span>
          <p className={styles.navyTitle}>{plans.panel.title.map((t) => <span key={t}>{t}</span>)}</p>
          <span className={styles.navyDashTop} aria-hidden />
          <ul className={styles.navyChecks}>
            {plans.panel.checks.map((c, i) => (
              <li key={c} className={styles.navyCheck} style={{ top: u(i * 32.7) }}>
                <span className={styles.navyCheckIcon} aria-hidden><CheckCircleIcon /></span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
          <span className={styles.navyDashBottom} aria-hidden />
          <p className={styles.navyBrand}>{plans.panel.brand.map((b) => <span key={b}>{b}</span>)}</p>
        </section>

        {/* ------------------------- add-ons ------------------------- */}
        <section aria-label="추가 서비스">
          <p className={styles.addEyebrow}>{addons.eyebrow}</p>
          <h2 className={styles.addTitle}>{addons.title.map((t) => <span key={t}>{t}</span>)}</h2>

          {addonItems.map((a, i) => {
            const Icon = ADDON_ICONS[a.icon];
            return (
              <article key={a.id} className={styles.addon}
                       style={{ left: u(ADDON_X[i]), width: u(ADDON_W[i]) }}>
                <span className={styles.addonIcon} aria-hidden><Icon /></span>
                <h3 className={`${styles.addonTitle} ${a.note ? styles.addonTitleTight : ''}`}>{a.title}</h3>
                {a.note && <p className={styles.addonNote}>{a.note}</p>}
                <p className={`${styles.addonPrice} ${a.note ? styles.addonPriceLow : ''}`}>{a.priceLabel}</p>
              </article>
            );
          })}
        </section>

        {/* -------------------------- band --------------------------- */}
        <picture>
          <source srcSet={band.image.webp} type="image/webp" />
          <img className={styles.band} src={band.image.jpg} alt="" width={1536} height={109} loading="lazy" />
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
      </div>
    </div>
  );
}
