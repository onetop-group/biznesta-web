import Link from 'next/link';
import { pc06 } from '@/data/pc06';
import { ArrowRight } from '@/components/shared/Arrows';
import { BadgeIcon, BuildingIcon, CapIcon, CheckIcon, CrownIcon, DocIcon, PeopleIcon } from './Icons';
import { consultHref } from '@/data/navigation';
import styles from './Pc06.module.css';

/** Measured off BN_PC_06_DESIGN_DETAIL.png, in 1536-wide artwork coordinates. */
const NAV_CENTER_X = [407.5, 536, 654.5, 769, 895, 1010, 1118.5];
const NAV_RULE_X = [477, 593.5, 716, 826, 959, 1060, 1210];

const SWATCH_X = [44, 122, 200, 278];
const IND_Y = [538, 580, 623, 666, 708];
const FEAT_Y = [544, 580, 615, 650, 686, 721];
const GRADE_X = [948, 1126, 1304];
const GRADE_W = [172, 173, 183];
const SIM_X = [50, 327, 609, 886];
const SIM_W = [256, 258, 256, 258];
const COL_RULE_X = [372, 660, 930];

const IND_ICONS = { cap: CapIcon, doc: DocIcon, badge: BadgeIcon, people: PeopleIcon, building: BuildingIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

/* breadcrumb 각 단계가 가리키는 곳. 마지막(현재 디자인)은 링크가 아니다. */
const CRUMB_HREF = ['/', '/portfolio'];

export default function Pc06({ slug }: { slug?: string } = {}) {
  const { header, design, concept, industries, features, grades, similar, cta } = pc06;
  /* 상담 진입 시 어떤 디자인에서 왔는지 전달한다 (저장은 아직 하지 않는다) */
  const askHref = (fallback: string) =>
    slug ? consultHref('design-detail', { design: slug }) : fallback;

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        <picture>
          <source srcSet={design.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={design.image.jpg} alt={design.image.alt}
               width={1536} height={476} fetchPriority="high" />
        </picture>

        {/* header */}
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
        {NAV_RULE_X.map((x) => <span key={x} className={styles.navRule} style={{ left: u(x) }} aria-hidden />)}
        <Link href={header.cta.href} className={styles.headerCta}>
          <span className={styles.ctaLabel}>{header.cta.label}</span>
          <ArrowRight />
        </Link>

        {/* hero */}
        <nav className={styles.breadcrumb} aria-label="위치">
          {design.breadcrumb.map((c, i) => {
            const href = CRUMB_HREF[i];
            const last = i === design.breadcrumb.length - 1;
            return (
              <span key={c}>
                {i > 0 && <span className={styles.crumbSep}>{'  >  '}</span>}
                {href && !last
                  ? <Link href={href} className={styles.crumbLink}>{c}</Link>
                  : <span className={last ? styles.crumbCurrent : undefined}>{c}</span>}
              </span>
            );
          })}
        </nav>
        <p className={styles.eyebrow}>{design.eyebrow}</p>
        <h1 className={styles.title}>{design.title}</h1>
        <p className={styles.sub}>{design.sub}</p>
        <p className={styles.desc}>{design.desc.map((d) => <span key={d}>{d}</span>)}</p>
        <div className={styles.tags}>
          {design.tags.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
        </div>

        <span className={styles.asideRule} aria-hidden />
        <p className={styles.asideQuote}>
          {design.aside.quote.map((q, i) => (
            <span key={q}>{i === 0 ? `“${q}` : `${q}”`}</span>
          ))}
        </p>
        <p className={styles.asideKeywords}>
          {design.aside.keywords.map((k) => <span key={k}>{k}</span>)}
        </p>

        {COL_RULE_X.map((x) => <span key={x} className={styles.colRule} style={{ left: u(x) }} aria-hidden />)}

        {/* design concept */}
        <section aria-label="디자인 콘셉트">
          <p className={styles.conceptEyebrow}>{concept.eyebrow}</p>
          <h2 className={styles.conceptTitle}>
            {concept.title.map((t) => <span key={t}>{t}</span>)}
          </h2>
          <p className={styles.conceptDesc}>
            {concept.desc.map((d) => <span key={d}>{d}</span>)}
          </p>
          {concept.palette.map((p, i) => (
            <span key={p.role} className={styles.swatch} style={{ left: u(SWATCH_X[i]), width: u(66) }}>
              <span className={styles.swatchDot} style={{ background: p.hex }} aria-hidden />
              <span className={styles.swatchRole}>{p.role}</span>
              <span className={styles.swatchHex}>{p.hex}</span>
            </span>
          ))}
        </section>

        {/* recommended industries */}
        <section aria-label="추천 업종">
          <h2 className={styles.colTitle} style={{ left: u(391), top: u(501) }}>{industries.title}</h2>
          {industries.items.map((it, i) => {
            const Icon = IND_ICONS[it.icon];
            return (
              <span key={it.label} className={styles.listItem} style={{ left: u(407), top: u(IND_Y[i]) }}>
                <span className={styles.listIcon} aria-hidden><Icon /></span>
                <span className={styles.listLabel}>{it.label}</span>
              </span>
            );
          })}
        </section>

        {/* applicable features */}
        <section aria-label="적용 가능한 주요 기능">
          <h2 className={styles.colTitle} style={{ left: u(686), top: u(501) }}>{features.title}</h2>
          {features.items.map((f, i) => (
            <span key={f} className={styles.listItem} style={{ left: u(687), top: u(FEAT_Y[i]) }}>
              <span className={styles.listCheck} aria-hidden><CheckIcon /></span>
              <span className={styles.listLabel}>{f}</span>
            </span>
          ))}
        </section>

        {/* design grades */}
        <section aria-label="디자인 등급">
          <h2 className={styles.colTitle} style={{ left: u(952), top: u(501) }}>{grades.title}</h2>
          {grades.items.map((g, i) => (
            <span key={g.name}
                  className={`${styles.grade} ${g.featured ? styles.gradeFeatured : ''}`}
                  style={{ left: u(GRADE_X[i]), width: u(GRADE_W[i]) }}>
              {g.featured && <span className={styles.gradeCrown} aria-hidden><CrownIcon /></span>}
              <span className={styles.gradeName}>{g.name}</span>
              <span className={styles.gradeDesc}>
                {g.desc.map((d) => <span key={d}>{d}</span>)}
              </span>
            </span>
          ))}
          <Link href={askHref(grades.ctaPrimary.href)} className={styles.gradeCtaPrimary}>
            <span className={styles.gradeCtaLabel}>{grades.ctaPrimary.label}</span>
            <ArrowRight />
          </Link>
          <Link href={askHref(grades.ctaSecondary.href)} className={styles.gradeCtaSecondary}>
            <span className={styles.gradeCtaLabel}>{grades.ctaSecondary.label}</span>
            <ArrowRight />
          </Link>
          <p className={styles.gradeNote}>{grades.note}</p>
        </section>

        {/* similar designs */}
        <section aria-label="유사 디자인">
          <span className={styles.simRule} aria-hidden />
          <p className={styles.simEyebrow}>{similar.eyebrow}</p>
          <h2 className={styles.simTitle}>{similar.title}</h2>
          {similar.items.map((s, i) => (
            <Link key={s.id} href={`/design/${s.slug}`} className={styles.simCard}
                  style={{ left: u(SIM_X[i]), width: u(SIM_W[i]) }}>
              <picture>
                <source srcSet={s.artwork.webp} type="image/webp" />
                <img className={styles.simImg} src={s.artwork.jpg} alt={s.artwork.alt}
                     width={SIM_W[i]} height={127} loading="lazy" />
              </picture>
              <span className={styles.simFoot}>
                <span className={styles.simName}>{s.title}</span>
                <span className={styles.simDisc} aria-hidden><ArrowRight /></span>
              </span>
            </Link>
          ))}
        </section>

        {/* navy call to action */}
        <span className={styles.ctaCard} aria-hidden />
        <p className={styles.ctaEyebrow}>{cta.eyebrow}</p>
        <p className={styles.ctaTitle}>{cta.title.map((t) => <span key={t}>{t}</span>)}</p>
        <p className={styles.ctaSub}>{cta.sub}</p>
        <Link href={askHref(cta.button.href)} className={styles.ctaButton}>
          <span className={styles.ctaButtonLabel}>{cta.button.label}</span>
          <ArrowRight />
        </Link>
      </div>
    </div>
  );
}
