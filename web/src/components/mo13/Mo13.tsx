import type React from 'react';
import Link from 'next/link';
import { mo13 } from '@/data/mo13';
import { ArrowRight } from '@/components/shared/Arrows';
import { ChatIcon, DocIcon, PeopleIcon } from '@/components/shared/LineIcons';
import styles from './Mo13.module.css';
import MobileMenu from '@/components/site/MobileMenu';

/** Measured off BN_MO_13_PRICE.png, in 1024-wide artwork coordinates. */
const CARD_BOX: [number, number, number, number][] = [
  [36, 122, 228, 620],
  [277, 122, 234, 620],
  [523, 122, 228, 620],
  [763, 122, 228, 620],
];
/** The artwork gives each card its own feature rhythm — first ink top, pitch. */
const FEAT: [number, number][] = [[463, 35.5], [445, 33.5], [452, 32.5], [452, 32.5]];
const SUP_X = [113, 397, 661];
/** hairlines the artwork draws between the three support items */
const SEP_X = [325, 597];

const SUP_ICONS = { chat: ChatIcon, doc: DocIcon, people: PeopleIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

const strokeBox = (children: React.ReactNode) => (
  <svg viewBox="0 0 32 32" aria-hidden>
    <g fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </g>
  </svg>
);

/* Plan icons are local to MO 13 so the shared line-icon set — and every locked
   screen that imports it — is untouched by anything added here. */
const SproutIcon = () => strokeBox(<>
  <path d="M16 29v-11" />
  <path d="M16 18C16 12.5 11.5 8.5 5.5 8.5c0 5.8 4.4 9.5 10.5 9.5z" />
  <path d="M16 18c0-5 4-8.5 9.5-8.5 0 5.2-4 8.5-9.5 8.5z" />
</>);
const CrownIcon = () => strokeBox(<>
  <path d="M4.5 10.5 9 20h14l4.5-9.5-6 4L16 6l-5.5 8.5z" />
  <path d="M9 24.5h14" />
</>);
const DiamondIcon = () => strokeBox(<>
  <path d="M9 5h14l6 8-13 14L3 13z" />
  <path d="M3 13h26M11 13l5-8 5 8-5 14z" />
</>);
const CogIcon = () => strokeBox(<>
  <circle cx="16" cy="16" r="5" />
  <path d="M13.6 3.2h4.8l.6 3.2 2.4 1 2.7-1.8 3.4 3.4-1.8 2.7 1 2.4 3.2.6v4.8l-3.2.6-1 2.4 1.8 2.7-3.4 3.4-2.7-1.8-2.4 1-.6 3.2h-4.8l-.6-3.2-2.4-1-2.7 1.8-3.4-3.4 1.8-2.7-1-2.4L1.3 18.4v-4.8l3.2-.6 1-2.4-1.8-2.7 3.4-3.4 2.7 1.8 2.4-1z" />
</>);
const PLAN_ICONS = { sprout: SproutIcon, crown: CrownIcon, diamond: DiamondIcon, gear: CogIcon };

const CheckMark = () => (
  <svg viewBox="0 0 16 16" aria-hidden>
    <path d="M2.5 8.6 6 12l7.5-8.4" fill="none" stroke="currentColor"
          strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Mo13() {
  const { header, hero, plans, band, support } = mo13;
  const items = plans.items.filter((p) => p.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        {/* --------------------------- 히어로 --------------------------- */}
        <section className={styles.hero}>
        {/* the tablet, the phone, the gold script, the keyword column and the
            book spines are the photograph; every word over it is markup */}
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1024} height={545} fetchPriority="high" />
        </picture>

        <span className={styles.menuPanel} aria-hidden />
        <Link href="/" className={styles.logo} aria-label="BIZNESTA 홈으로">
          <img src={header.logo.src} alt={header.logo.alt} width={226} height={56} />
        </Link>
        <MobileMenu
          cls={{ btn: styles.menuBtn, burger: styles.burger, label: styles.menuLabel }}
          label={header.menuLabel}
        />

        <div className={styles.heroCap}>
        <p className={styles.eyebrow}>{hero.eyebrow}</p>
        <h1 className={styles.headline}>
          <span>{hero.headline[0]}</span>
          <span>{hero.headline[1]}</span>
          <span>{hero.headline[2]}</span>
          <span className={styles.gold}>{hero.headline[3]}</span>
        </h1>
        <p className={styles.body}>{hero.body.map((b) => <span key={b}>{b}</span>)}</p>
        <div className={styles.heroTag}>
          <span className={styles.heroRule} aria-hidden />
          <p className={styles.heroLabel}>{hero.label.map((l) => <span key={l}>{l}</span>)}</p>
        </div>
        </div>
        </section>

        {/* --------------------------- 제작 플랜 ---------------------- */}
        <section className={styles.plans} aria-label="제작 플랜 안내">
          <h2 id="plans" className={styles.secTitle}>{plans.title}</h2>
          <p className={styles.secSub}>{plans.sub}</p>

          {items.map((p, i) => {
            const [x, y, w, h] = CARD_BOX[i];
            const [ftop, fpitch] = FEAT[i];
            const Icon = PLAN_ICONS[p.icon];
            return (
              <article key={p.planId}
                       className={[styles.card, p.featured ? styles.featured : ''].join(' ')}
                       style={{ left: u(x), top: u(y), width: u(w), height: u(h) }}>
                {p.featured && <span className={styles.badge}>{plans.badgeLabel}</span>}
                <span className={styles.disc} aria-hidden />
                <span className={styles.planIcon} aria-hidden><Icon /></span>
                <p className={styles.planLabel}>{p.label}</p>
                <h3 className={styles.planName}>{p.name}</h3>
                <p className={styles.planDesc}>{p.desc.map((d) => <span key={d}>{d}</span>)}</p>
                {/* not a price — see src/data/mo13.ts */}
                <p className={styles.price}>{p.priceLabel}</p>
                <ul className={styles.features}>
                  {p.features.map((f, j) => (
                    <li key={f} style={{ top: u(ftop - y - 3 + j * fpitch) }}>
                      <span className={styles.check} aria-hidden><CheckMark /></span>
                      <span className={styles.featText}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={p.ctaHref} className={styles.planCta}>
                  <span>{p.ctaLabel}</span>
                  <ArrowRight />
                </Link>
              </article>
            );
          })}
        </section>

        {/* --------------------------- 마무리 ------------------------- */}
        <section className={styles.close} aria-label="제작 상담 안내">
          <div className={styles.bandBox}>
            <picture>
              <source srcSet={band.image.webp} type="image/webp" />
              <img className={styles.bandImg} src={band.image.jpg} alt={band.image.alt}
                   width={954} height={211} loading="lazy" />
            </picture>
            <span className={styles.ctaVeil} aria-hidden />
            <span className={styles.bandRule} aria-hidden />
            <p className={styles.bandLabel}>{band.label.map((l) => <span key={l}>{l}</span>)}</p>
            <div className={styles.bnCol}>
              <h2 className={styles.bandQuote}>{band.quote.map((q) => <span key={q}>{q}</span>)}</h2>
              <p className={styles.bandSub}>{band.sub}</p>
              <Link href={band.cta.href} className={styles.bandCta}>
                <span className={styles.bandCtaLabel}>{band.cta.label}</span>
                <ArrowRight />
              </Link>
            </div>
          </div>

          <div className={styles.supBox}>
          <div className={styles.supRow}>
            {support.map((s, i) => {
              const Icon = SUP_ICONS[s.icon];
              return (
                <span key={s.label} className={styles.sup} style={{ left: u(SUP_X[i]) }}>
                  <span className={styles.supIcon} aria-hidden><Icon /></span>
                  <span className={styles.supLabel}>{s.label}</span>
                </span>
              );
            })}
            {SEP_X.map((x) => (
              <span key={x} className={styles.supSep} style={{ left: u(x) }} aria-hidden />
            ))}
          </div>
          </div>
        </section>
      </div>
    </div>
  );
}
