import Link from 'next/link';
import { mo09 } from '@/data/mo09';
import { ArrowRight } from '@/components/shared/Arrows';
import { BarsIcon, ChatIcon, DocIcon, PeopleIcon, ShareIcon } from '@/components/shared/LineIcons';
import styles from './Mo09.module.css';
import MobileMenu from '@/components/site/MobileMenu';

/** picture icon — local to this screen so no locked screen can be affected */
const ImageIcon = () => (
  <svg viewBox="0 0 32 32" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.7}
       strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="7" width="24" height="18" rx="2.5" />
    <circle cx="11.5" cy="13.5" r="2.2" />
    <path d="M6 22l6.5-6.5 5 5 4-4L26 21" />
  </svg>
);

/** Measured off BN_MO_09_CONTENT.png, in 1024-wide artwork coordinates. */
const CARD_X = [44, 282, 518, 757];
const THUMB_X = [42, 232, 422, 612, 802];
const SUP_X = [60, 376, 692];
/** hairlines the artwork draws between the three support items */
const SEP_X = [293, 609];

/** 콘텐츠 기획 — the artwork draws a document with a pencil over it.
    Kept local to MO 09 so the shared line-icon set stays untouched. */
const PlanIcon = () => (
  <svg viewBox="0 0 32 32" aria-hidden>
    <g fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3.5h11L23.5 10v7" />
      <path d="M16.5 3.5V10H23" />
      <path d="M23.5 24v4.5H6V3.5" />
      <path d="M10.5 15h7M10.5 19.5h4.5" />
      <path d="m26 13.5 3.5 3.5-9 9-4.5 1 1-4.5z" />
    </g>
  </svg>
);

const CARD_ICONS = { doc: PlanIcon, image: ImageIcon, share: ShareIcon, bars: BarsIcon };
const SUP_ICONS = { chat: ChatIcon, doc: DocIcon, people: PeopleIcon };


const u = (n: number) => `calc(${n} * var(--s))`;

export default function Mo09() {
  const { header, hero, services, band, examples, cta, support } = mo09;
  const cards = services.items.filter((s) => s.visible).sort((a, b) => a.order - b.order);
  const items = examples.items.filter((e) => e.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        {/* --------------------------- 히어로 --------------------------- */}
        <section className={styles.hero}>
        {/* the phone, the plants and the IDEA / PLAN / CONTENT / RESULT books are
            the photograph, and so is the gold script; the copy over it is markup */}
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1024} height={545} fetchPriority="high" />
        </picture>

        <Link href="/" className={styles.logo} aria-label="BIZNESTA 홈으로">
          <img src={header.logo.src} alt={header.logo.alt} width={227} height={56} />
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
        <p className={styles.aside}>{hero.aside.map((a) => <span key={a}>{a}</span>)}</p>

        </section>

        {/* -------------------------- 콘텐츠 서비스 -------------------- */}
        <section className={styles.services} aria-label="콘텐츠 서비스">
          <h2 className={styles.secTitle}>{services.title}</h2>
          {cards.map((c, i) => {
            const Icon = CARD_ICONS[c.icon];
            return (
              <article key={c.serviceId} className={styles.card} style={{ left: u(CARD_X[i]) }}>
                <span className={styles.cardDisc} aria-hidden />
                <span className={styles.cardIcon} aria-hidden><Icon /></span>
                <h3 className={styles.cardTitle}>{c.serviceName}</h3>
                <p className={styles.cardDesc}>{c.description.map((d) => <span key={d}>{d}</span>)}</p>
              </article>
            );
          })}
        </section>

        {/* -------------------------- band --------------------------- */}
        <section className={styles.ops} aria-label="지속적인 콘텐츠 운영">
          <picture>
            <source srcSet={band.image.webp} type="image/webp" />
            <img className={styles.bandImg} src={band.image.jpg} alt={band.image.alt}
                 width={934} height={191} loading="lazy" />
          </picture>
          <h2 className={styles.bandHead}>{band.headline.map((h) => <span key={h}>{h}</span>)}</h2>
          <p className={styles.bandBody}>{band.body}</p>
          <p className={styles.bandLabel}>{band.label}</p>
        </section>

        {/* ----------------------- content examples ------------------ */}
        <section className={styles.samples} aria-label="콘텐츠 예시">
          <h2 id="examples" className={styles.secTitle2}>{examples.title}</h2>
          {items.map((e, i) => (
            <figure key={e.contentId} className={styles.thumb} style={{ left: u(THUMB_X[i]) }}>
              <picture>
                <source srcSet={e.thumbnail.webp} type="image/webp" />
                <img className={styles.thumbImg} src={e.thumbnail.jpg} alt={e.thumbnail.alt}
                     width={180} height={125} loading="lazy" />
              </picture>
              <figcaption>
                <span className={styles.thumbTitle}>{e.title}</span>
                <span className={styles.thumbDesc}>
                  {e.summary.map((s) => <span key={s}>{s}</span>)}
                </span>
              </figcaption>
            </figure>
          ))}
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
