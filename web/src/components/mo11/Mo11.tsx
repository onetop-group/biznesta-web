import Link from 'next/link';
import { mo11 } from '@/data/mo11';
import { ArrowRight } from '@/components/shared/Arrows';
import {
  ChatIcon, DocIcon, GearIcon, MonitorIcon, PenIcon, PeopleIcon, SearchIcon,
} from '@/components/shared/LineIcons';
import styles from './Mo11.module.css';
import MobileMenu from '@/components/site/MobileMenu';

/** Measured off BN_MO_11_CUSTOM_SOLUTION.png, in 1024-wide artwork coordinates. */
const STEP_CX = [131.5, 322, 512, 704, 894];
const REC_X = [43, 279, 517, 759];
const SUP_X = [60, 380.5, 701];
/** hairlines the artwork draws between the three support items */
const SEP_X = [292, 613];

const STEP_ICONS = { chat: ChatIcon, search: SearchIcon, pen: PenIcon, monitor: MonitorIcon, gear: GearIcon };
const SUP_ICONS = { chat: ChatIcon, doc: DocIcon, people: PeopleIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

export default function Mo11() {
  const { header, hero, process, recommend, principle, cta, support } = mo11;
  const steps = process.steps.filter((s) => s.visible).sort((a, b) => a.order - b.order);
  const recs = recommend.items.filter((r) => r.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        {/* --------------------------- 히어로 --------------------------- */}
        <section className={styles.hero}>
        {/* the tablet with the BIZNESTA checklist, the hand, the mug and the
            gold script are the photograph; the copy over it is markup */}
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1024} height={590} fetchPriority="high" />
        </picture>
        {/* 사진 속 금색 영문 필기체를 덮는 밝은 결 */}
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
          <span>{hero.headline[1]}</span>
          <span className={styles.gold}>{hero.headline[2]}</span>
        </h1>
        <p className={styles.body}>{hero.body.map((b) => <span key={b}>{b}</span>)}</p>
        </div>
        <p className={styles.aside}>{hero.aside.lines.map((l) => <span key={l}>{l}</span>)}</p>
        <span className={styles.asideRule} aria-hidden />
        <p className={styles.asideLabel}>{hero.aside.label.map((l) => <span key={l}>{l}</span>)}</p>

        </section>

        {/* --------------------------- 진행 과정 ---------------------- */}
        <section className={styles.proc} aria-label="맞춤 솔루션 진행 과정">
          <h2 id="process" className={styles.secTitle}>{process.title}</h2>
          <span className={styles.procPanel} aria-hidden />
          {steps.slice(0, 4).map((s, i) => (
            <span key={s.solutionId} className={styles.chev}
                  style={{ left: u((STEP_CX[i] + STEP_CX[i + 1]) / 2) }} aria-hidden>&rsaquo;</span>
          ))}
          {steps.map((s, i) => {
            const Icon = STEP_ICONS[s.icon];
            return (
              <div key={s.solutionId} className={styles.step} style={{ left: u(STEP_CX[i]) }}>
                <span className={styles.stepIcon} aria-hidden><Icon /></span>
                <h3 className={styles.stepTitle}>{s.num} {s.title}</h3>
                <p className={styles.stepDesc}>
                  {s.description.map((d) => <span key={d}>{d}</span>)}
                </p>
              </div>
            );
          })}
        </section>

        {/* ------------------------- recommend ----------------------- */}
        <section className={styles.recs} aria-label="맞춤 솔루션 추천 대상">
          <h2 className={styles.secTitle2}>{recommend.title}</h2>
          {recs.map((r, i) => (
            <article key={r.id} className={styles.rec} style={{ left: u(REC_X[i]) }}>
              <picture>
                <source srcSet={r.image.webp} type="image/webp" />
                <img className={styles.recImg} src={r.image.jpg} alt={r.image.alt}
                     width={228} height={116} loading="lazy" />
              </picture>
              <h3 className={styles.recTitle}>{r.title.map((t) => <span key={t}>{t}</span>)}</h3>
              {/* what a prospective customer wants — never an existing customer's words */}
              <p className={styles.recWant}>{r.want.map((w) => <span key={w}>{w}</span>)}</p>
            </article>
          ))}
        </section>

        {/* ------------------------- principle ----------------------- */}
        <section className={styles.principle} aria-label="비즈네스타의 맞춤 설계 원칙">
          <span className={styles.prPanel} aria-hidden />
          <picture>
            <source srcSet={principle.image.webp} type="image/webp" />
            <img className={styles.prImg} src={principle.image.jpg} alt={principle.image.alt}
                 width={323} height={171} loading="lazy" />
          </picture>
          {/* the artwork carried a customer testimonial here — see src/data/mo11.ts */}
          <p className={styles.prQuote}>{principle.quote.map((q) => <span key={q}>{q}</span>)}</p>
          <p className={styles.prBy}>{principle.by}</p>
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
