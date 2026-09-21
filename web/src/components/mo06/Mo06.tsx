import Link from 'next/link';
import { mo06 } from '@/data/mo06';
import { ArrowRight } from '@/components/shared/Arrows';
import { ChatIcon, DiamondIcon, DocIcon, GearIcon, MonitorIcon, PeopleIcon } from '@/components/shared/LineIcons';
import { consultHref } from '@/data/navigation';
import styles from './Mo06.module.css';
import MobileMenu from '@/components/site/MobileMenu';

/** filled bronze check medallion — the artwork's own mark */
const CheckMark = () => (
  <svg viewBox="0 0 32 32" aria-hidden>
    <circle cx="16" cy="16" r="15" fill="currentColor" />
    <path d="M9.5 16.4l4.4 4.3 8.6-8.8" fill="none" stroke="#fff" strokeWidth={2.6}
          strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Measured off BN_MO_06_DESIGN_DETAIL.png, in 1024-wide artwork coordinates. */
const FEAT_CX = [111.5, 256.5, 402.5];
const FEAT_DIV = [186, 331];
const PAGE_X = [54, 243, 430, 619, 807];
const SUP_X = [165, 441, 699];

const FEAT_ICONS = { diamond: DiamondIcon, monitor: MonitorIcon, gear: GearIcon };
const SUP_ICONS = { chat: ChatIcon, doc: DocIcon, people: PeopleIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

export default function Mo06({ slug }: { slug?: string } = {}) {
  const { header, back, crumb, hero, spec, points, preview, cta, support } = mo06;
  /* 상담 진입 시 어떤 디자인에서 왔는지 전달한다 (저장은 아직 하지 않는다) */
  const askHref = (fallback: string) =>
    slug ? consultHref('design-detail', { design: slug }) : fallback;
  const pages = preview.pages.filter((p) => p.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        {/* --------------------------- 히어로 ------------------------- */}
        <section className={styles.hero}>
        {/* the phone carrying the whole LUMIÈRE design, the books and the gold
            script are the photograph; the copy over it is markup */}
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1024} height={600} fetchPriority="high" />
        </picture>

        <Link href="/" className={styles.logo} aria-label="BIZNESTA 홈으로">
          <img src={header.logo.src} alt={header.logo.alt} width={226} height={56} />
        </Link>
        <MobileMenu
          cls={{ btn: styles.menuBtn, burger: styles.burger, label: styles.menuLabel }}
          label={header.menuLabel}
        />

        {/* ------------------------ design hero ---------------------- */}
        <div className={styles.heroCap}>
        <Link href={back.href} className={styles.back}>
          <span className={styles.backIcon} aria-hidden>
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={2}
                 strokeLinecap="round" strokeLinejoin="round">
              <path d="M26 16H6M13 8l-7 8 7 8" />
            </svg>
          </span>
          <span>{back.label}</span>
        </Link>
        <nav className={styles.crumb} aria-label="현재 위치">
          <Link href="/category/corporate">{crumb[0]}</Link>
          <span className={styles.crumbSep} aria-hidden>&rsaquo;</span>
          <span className={styles.crumbNow}>{crumb[1]}</span>
        </nav>
        <h1 className={styles.headline}>
          <span>{hero.headline[0]}</span>
          <span className={styles.gold}>{hero.headline[1]}</span>
        </h1>
        <p className={styles.body}>{hero.body.map((b) => <span key={b}>{b}</span>)}</p>
        </div>
        </section>

        {/* --------------------------- 3열 라벨 ----------------------- */}
        <section className={styles.feats} aria-label="디자인 특징">

        {FEAT_DIV.map((x) => (
          <span key={x} className={styles.featDiv} style={{ left: u(x) }} aria-hidden />
        ))}
        {hero.features.map((f, i) => {
          const Icon = FEAT_ICONS[f.icon];
          return (
            <div key={f.lines[0]} className={styles.feat} style={{ left: u(FEAT_CX[i]) }}>
              <span className={styles.featIcon} aria-hidden><Icon /></span>
              <p className={styles.featLabel}>{f.lines.map((l) => <span key={l}>{l}</span>)}</p>
            </div>
          );
        })}
        </section>

        {/* ------------------------- 사양 패널 ------------------------ */}
        <section className={styles.specs} aria-label="디자인 개요와 제작 포인트">
          <span className={`${styles.panel} ${styles.panelL}`} aria-hidden />
          <span className={`${styles.panel} ${styles.panelR}`} aria-hidden />

          <h2 className={styles.specTitle}>{spec.title}</h2>
          <ul className={styles.specList}>
            {spec.rows.map((r, i) => (
              <li key={r.label} className={styles.specRow} style={{ top: u(i * 41.5) }}>
                <span className={styles.specLabel}>{r.label}</span>
                <span className={styles.specValue}>
                  {r.value.map((v) => <span key={v}>{v}</span>)}
                </span>
              </li>
            ))}
          </ul>

          <h2 className={styles.pointTitle}>{points.title}</h2>
          <ul className={styles.pointList}>
            {points.rows.map((p, i) => (
              <li key={p} className={styles.pointRow} style={{ top: u(i * 46.5) }}>
                <span className={styles.pointCheck} aria-hidden><CheckMark /></span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------- 페이지 미리보기 --------------------- */}
        <section className={styles.preview} aria-label="페이지 미리보기">
          <h2 className={styles.prevTitle}>{preview.title}</h2>
          <Link href={preview.more.href} className={styles.prevMore}>
            <span>{preview.more.label}</span>
            <ArrowRight />
          </Link>
          {pages.map((p, i) => (
            <figure key={p.id} className={styles.page} style={{ left: u(PAGE_X[i]) }}>
              <picture>
                <source srcSet={p.image.webp} type="image/webp" />
                <img className={styles.pageImg} src={p.image.jpg} alt={p.image.alt}
                     width={166} height={284} loading="lazy" />
              </picture>
              <figcaption className={styles.pageCap}>{p.caption}</figcaption>
            </figure>
          ))}
        </section>

        {/* ------------------------- 맞춤 제작 ------------------------ */}
        <section className={styles.close}>
          <Link href={askHref(cta.href)} className={styles.cta}>
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
        </section>
      </div>
    </div>
  );
}
