import Link from 'next/link';
import { mo14 } from '@/data/mo14';
import { ArrowRight } from '@/components/shared/Arrows';
import {
  ChatIcon, CodeIcon, DocIcon, GrowthIcon, PenIcon, PeopleIcon, SearchIcon,
} from '@/components/shared/LineIcons';
import styles from './Mo14.module.css';
import MobileMenu from '@/components/site/MobileMenu';

/** Measured off BN_MO_14_PROCESS.png, in 1024-wide artwork coordinates. */
const STEP_CX = [99, 264, 427, 592, 761, 924];
const BAND_CX = [263, 405.5, 544, 690.5];
const SUP_X = [154, 427, 689];
/** hairlines the artwork draws between the three support items */
const SEP_X = [365, 627];

const STEP_ICONS = { chat: ChatIcon, doc: DocIcon, pen: PenIcon, code: CodeIcon,
                     search: SearchIcon, growth: GrowthIcon };
const SUP_ICONS = { chat: ChatIcon, doc: DocIcon, people: PeopleIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

export default function Mo14() {
  const { header, hero, process: pr, band, principle, cta, support } = mo14;
  const steps = pr.steps.filter((s) => s.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        {/* --------------------------- 히어로 --------------------------- */}
        <section className={styles.hero}>
        {/* the laptop, the phone, the framed gold script, the keyword column
            and the book spines are the photograph; the copy over it is markup */}
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1024} height={530} fetchPriority="high" />
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
          <span className={styles.gold}>{hero.headline[2]}</span>
        </h1>
        <p className={styles.body}>{hero.body.map((b) => <span key={b}>{b}</span>)}</p>
        <div className={styles.heroTag}>
          <span className={styles.heroRule} aria-hidden />
          <p className={styles.heroLabel}>{hero.label.map((l) => <span key={l}>{l}</span>)}</p>
        </div>
        </div>
        </section>

        {/* ------------------------- process ------------------------- */}
        <section className={styles.proc} aria-label="제작 진행 과정">
          <h2 className={styles.secTitle}>{pr.title}</h2>
          <p className={styles.secSub}>{pr.sub}</p>
          <Link href={pr.more.href} className={styles.secMore}>
            <span>{pr.more.label}</span>
            <ArrowRight />
          </Link>

          {steps.slice(0, 5).map((s, i) => (
            <span key={s.stepId} className={styles.link} aria-hidden
                  style={{ left: u(STEP_CX[i] + 47), width: u(STEP_CX[i + 1] - STEP_CX[i] - 94) }} />
          ))}
          {steps.map((s, i) => {
            const Icon = STEP_ICONS[s.icon];
            return (
              <div key={s.stepId} className={styles.step} style={{ left: u(STEP_CX[i]) }}>
                <span className={styles.disc} aria-hidden />
                <span className={styles.stepIcon} aria-hidden><Icon /></span>
                <p className={styles.stepNum}>{s.num}</p>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc.map((d) => <span key={d}>{d}</span>)}</p>
              </div>
            );
          })}
        </section>

        {/* --------------------- why BIZNESTA band ------------------- */}
        <section className={styles.reasons} aria-label="비즈네스타를 선택하는 이유">
          <picture>
            <source srcSet={band.image.webp} type="image/webp" />
            <img className={styles.bandImg} src={band.image.jpg} alt={band.image.alt}
                 width={965} height={169} loading="lazy" />
          </picture>
          {band.items.map((it, i) => (
            <p key={it[0]} className={styles.bandItem} style={{ left: u(BAND_CX[i]) }}>
              <span>{it[0]}</span><span>{it[1]}</span>
            </p>
          ))}
          <p className={styles.bandQuote}>{band.quote.map((q) => <span key={q}>{q}</span>)}</p>
          <p className={styles.bandBrand}>{band.brand}</p>
        </section>

        {/* ------------------------ principle ------------------------ */}
        <section className={styles.principle} aria-label="비즈네스타의 제작 원칙">
          <picture>
            <source srcSet={principle.image.webp} type="image/webp" />
            <img className={styles.tesImg} src={principle.image.jpg} alt={principle.image.alt}
                 width={965} height={238} loading="lazy" />
          </picture>
          <h2 className={styles.tesTitle}>
            {principle.title.map((t) => <span key={t}>{t}</span>)}
          </h2>
          {/* the artwork carried a customer testimonial here — see src/data/mo14.ts */}
          <p className={styles.tesQuote}>{principle.quote.map((q) => <span key={q}>{q}</span>)}</p>
          <p className={styles.tesBy}>{principle.by}</p>
        </section>

        {/* --------------------------- 마무리 ------------------------- */}
        <section className={styles.close}>
          <Link href={cta.href} className={styles.cta}>
            <span className={styles.ctaLabel}>{cta.label}</span>
            <ArrowRight />
          </Link>
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
        </section>
      </div>
    </div>
  );
}
