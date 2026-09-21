import Link from 'next/link';
import { mo08 } from '@/data/mo08';
import { ArrowRight } from '@/components/shared/Arrows';
import { BarsIcon, ChatIcon, DiamondIcon, DocIcon, MonitorIcon, PenIcon, PeopleIcon } from '@/components/shared/LineIcons';
import styles from './Mo08.module.css';
import MobileMenu from '@/components/site/MobileMenu';

/** filled bronze check medallion — the artwork's own mark */
const CheckMark = () => (
  <svg viewBox="0 0 32 32" aria-hidden>
    <circle cx="16" cy="16" r="15" fill="currentColor" />
    <path d="M9.5 16.4l4.4 4.3 8.6-8.8" fill="none" stroke="#fff" strokeWidth={2.6}
          strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Measured off BN_MO_08_SIGNATURE.png, in 1024-wide artwork coordinates. */
const FEAT_CX = [154, 392.5, 632, 873];
const FEAT_DIV = [273, 512, 752.5];
const THUMB_X = [40, 247, 454, 661, 868];
const SUP_X = [130, 407, 674];

const FEAT_ICONS = { diamond: DiamondIcon, pen: PenIcon, monitor: MonitorIcon, bars: BarsIcon };
const SUP_ICONS = { chat: ChatIcon, doc: DocIcon, people: PeopleIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

export default function Mo08() {
  const { header, hero, features, band, signature, promise, cta, support } = mo08;
  const feats = features.filter((f) => f.visible).sort((a, b) => a.order - b.order);
  const sigs = signature.items.filter((s) => s.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        {/* --------------------------- 히어로 --------------------------- */}
        <section className={styles.hero}>
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1024} height={455} fetchPriority="high" />
        </picture>

        {/* 사진 위 글 뒤를 덮는 밝은 결 — 노트북 · 책과 글이 부딪히지 않는다 */}
        <span className={styles.heroWash} aria-hidden />
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
          <span className={styles.gold}>{hero.headline[1]}</span>
        </h1>
        <p className={styles.body}>{hero.body.map((b) => <span key={b}>{b}</span>)}</p>
        </div>
        <p className={styles.aside}>{hero.aside.lines.map((l) => <span key={l}>{l}</span>)}</p>
        <span className={styles.asideRule} aria-hidden />
        <p className={styles.asideLabel}>{hero.aside.label.map((l) => <span key={l}>{l}</span>)}</p>

        </section>

        {/* ------------------------- 제작 기준 4열 --------------------- */}
        <section className={styles.feats} aria-label="비즈네스타 제작 기준">
          <span className={styles.featPanel} aria-hidden />
          {FEAT_DIV.map((x) => (
            <span key={x} className={styles.featDiv} style={{ left: u(x) }} aria-hidden />
          ))}
          {feats.map((f, i) => {
            const Icon = FEAT_ICONS[f.icon];
            return (
              <div key={f.id} className={styles.feat} style={{ left: u(FEAT_CX[i]) }}>
                <span className={styles.featIcon} aria-hidden><Icon /></span>
                <h2 className={styles.featTitle}>{f.title}</h2>
                <p className={styles.featSub}>{f.sub.map((t) => <span key={t}>{t}</span>)}</p>
              </div>
            );
          })}
        </section>

        {/* -------------------- positioning band --------------------- */}
        <section className={styles.pos} aria-label="비즈네스타의 포지셔닝">
          <span className={styles.band} aria-hidden />
          <picture>
            <source srcSet={band.image.webp} type="image/webp" />
            <img className={styles.bandImg} src={band.image.jpg} alt={band.image.alt}
                 width={242} height={213} loading="lazy" />
          </picture>
          <span className={styles.bandRule} aria-hidden />
          <h2 className={styles.bandLines}>
            <span>{band.lines[0]}</span>
            <span>{band.lines[1]}</span>
            <span className={styles.bandGold}>{band.lines[2]}</span>
          </h2>
          <p className={styles.bandLabel}>{band.label}</p>
          <ul className={styles.bandChecks}>
            {band.checks.map((c, i) => (
              <li key={c} className={styles.bandCheckRow} style={{ top: u(i * 48) }}>
                <span className={styles.bandCheck} aria-hidden><CheckMark /></span>
                <span className={styles.bandCheckText}>{c}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* --------------------- signature designs ------------------- */}
        <section className={styles.sig} aria-label="시그니처 디자인 샘플">
          <h2 className={styles.sigTitle}>{signature.title}</h2>
          <Link href={signature.more.href} className={styles.sigMore}>
            <span>{signature.more.label}</span>
            <ArrowRight />
          </Link>
          {sigs.map((s, i) => (
            <Link key={s.id} href={`/design/${s.slug}`} className={styles.thumb}
                  style={{ left: u(THUMB_X[i]), width: u(i === 4 ? 156 : 190) }}>
              <picture>
                <source srcSet={s.image.webp} type="image/webp" />
                <img className={styles.thumbImg} src={s.image.jpg} alt={s.image.alt}
                     width={i === 4 ? 156 : 190} height={124} loading="lazy" />
              </picture>
              {/* BIZNESTA sample designs — no customer is named */}
              <span className={styles.thumbName}>{s.name}</span>
              <span className={styles.thumbNote}>{s.note}</span>
            </Link>
          ))}
          <span className={styles.sigNext} aria-hidden><ArrowRight /></span>
        </section>

        {/* ------------------------- promise ------------------------- */}
        <section className={styles.promise} aria-label="비즈네스타의 약속">
          <span className={styles.promisePanel} aria-hidden />
          <span className={`${styles.qMark} ${styles.qOpen}`} aria-hidden>&ldquo;</span>
          {/* the artwork carried a customer testimonial here — see src/data/mo08.ts */}
          <p className={styles.promiseQuote}>{promise.quote.map((q) => <span key={q}>{q}</span>)}</p>
          <span className={`${styles.qMark} ${styles.qClose}`} aria-hidden>&rdquo;</span>
          <p className={styles.promiseBy}>{promise.by}</p>
          <p className={styles.promiseLabel}>{promise.label}</p>
          <picture>
            <source srcSet={promise.image.webp} type="image/webp" />
            <img className={styles.promiseImg} src={promise.image.jpg} alt={promise.image.alt}
                 width={205} height={171} loading="lazy" />
          </picture>
        </section>

        {/* ---------------------------- 마무리 ------------------------ */}
        <section className={styles.close}>
          {/* 사용자 제공 시안 — 버튼과 상담 3종을 한 상자에 */}
          <div className={styles.ctaBox}>
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
          </div>
          </div>
        </section>
      </div>
    </div>
  );
}
