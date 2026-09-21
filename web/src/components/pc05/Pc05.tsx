import Link from 'next/link';
import { pc05 } from '@/data/pc05';
import { ArrowLeft, ArrowRight } from '@/components/shared/Arrows';
import { CalendarIcon, CheckIcon, CupIcon, HomeIcon, PinIcon, ShareIcon } from './Icons';
import { consultHref } from '@/data/navigation';
import styles from './Pc05.module.css';

/** Measured off BN_PC_05_CATEGORY_DETAIL.png, in 1536-wide artwork coordinates. */
const NAV_CENTER_X = [436.5, 558, 676.5, 783, 897.5, 1018, 1133];
const FEATURE_X = [145.5, 288, 428, 556.5];
const FEATURE_TOP = 388;

/** sidebar item ink positions; index 1 is the active pill */
const SIDE_Y = [568, 0, 622, 650, 677, 705, 732, 759, 786, 812, 839, 866, 893, 920];

const CARD_X = [305, 622, 936];
const CARD_W = [303, 300, 298];
const REC_Y = [569, 596, 623, 651, 678, 706, 733, 761];
const BAND_RULE_X = [840, 1200];

const HERO_ICONS = { cup: CupIcon, calendar: CalendarIcon, pin: PinIcon, share: ShareIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

/* breadcrumb 각 단계가 가리키는 곳. 마지막(현재 카테고리)은 링크가 아니다. */
const CRUMB_HREF = ['/', '/category'];

export default function Pc05({ slug }: { slug?: string } = {}) {
  const { header, hero, sidebar, designs, recommend, band } = pc05;
  /* 상담 진입 시 어떤 카테고리에서 왔는지 전달한다 (저장은 아직 하지 않는다) */
  const askHref = (fallback: string) =>
    slug ? consultHref('category', { category: slug }) : fallback;

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1536} height={504} fetchPriority="high" />
        </picture>

        {/* ------------------------- header -------------------------- */}
        <Link href="/" className={styles.wordmark} aria-label="BIZNESTA 홈으로">
          <img src={header.wordmark.src} alt={header.wordmark.alt}
               width={header.wordmark.width} height={header.wordmark.height} />
        </Link>
        <span className={styles.headerTagline}>{header.tagline}</span>
        <nav aria-label="주 메뉴">
          {header.nav.map((item, i) => (
            <Link key={item.en} href={item.href} className={styles.navItem}
                  style={{ left: u(NAV_CENTER_X[i]) }}>
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
        <nav className={styles.breadcrumb} aria-label="위치">
          <HomeIcon />
          {hero.breadcrumb.map((c, i) => {
            const href = CRUMB_HREF[i];
            const last = i === hero.breadcrumb.length - 1;
            return (
              <span key={c}>
                {i > 0 && <span className={styles.crumbSep}>{'›'} </span>}
                {href && !last
                  ? <Link href={href} className={styles.crumbLink}>{c}</Link>
                  : <span className={last ? styles.crumbCurrent : undefined}>{c}</span>}
              </span>
            );
          })}
        </nav>

        <p className={styles.eyebrow}>{hero.eyebrow}</p>
        <h1 className={styles.headline}>{hero.headline}</h1>
        <p className={styles.sub}>{hero.sub}</p>
        <p className={styles.desc}>{hero.desc.map((d) => <span key={d}>{d}</span>)}</p>

        {hero.features.map((f, i) => {
          const Icon = HERO_ICONS[f.icon];
          return (
            <div key={f.label} className={styles.feature}
                 style={{ left: u(FEATURE_X[i]), top: u(FEATURE_TOP) }}>
              <span className={styles.featureIcon} aria-hidden><Icon /></span>
              <span className={styles.featureLabel}>{f.label}</span>
            </div>
          );
        })}

        <p className={styles.keywords}>{hero.keywords.map((k) => <span key={k}>{k}</span>)}</p>

        {/* ------------------------- sidebar ------------------------- */}
        <nav aria-label="홈페이지 디자인 유형">
          <p className={styles.sideTitle}>{sidebar.title}</p>
          {sidebar.items.map((item, i) =>
            i === sidebar.activeIndex ? (
              <span key={item.slug} className={styles.sideActive}>
                {item.label}
                <ArrowRight />
              </span>
            ) : (
              <Link key={item.slug} href={`/category/${item.slug}`}
                    className={styles.sideItem} style={{ top: u(SIDE_Y[i]) }}>
                {item.label}
              </Link>
            )
          )}
        </nav>
        <span className={styles.sideRule} aria-hidden />

        {/* -------------------- recommended designs ------------------ */}
        <section aria-label="추천 디자인 시안">
          <h2 className={styles.designTitle}>{designs.title}</h2>
          <p className={styles.designSub}>{designs.sub}</p>
          <Link href="/design" className={styles.moreLink}>
            {designs.moreLabel}
            <ArrowRight />
          </Link>
          <button type="button" className={styles.navBtn} style={{ left: u(1154) }} aria-label="이전">
            <ArrowLeft />
          </button>
          <button type="button" className={styles.navBtn} style={{ left: u(1193) }} aria-label="다음">
            <ArrowRight />
          </button>

          {designs.items.map((d, i) => (
            <Link key={d.id} href={`/design/${d.slug}`} className={styles.card}
                  style={{ left: u(CARD_X[i]), width: u(CARD_W[i]) }}>
              <picture>
                <source srcSet={d.artwork.webp} type="image/webp" />
                <img className={styles.cardImg} src={d.artwork.jpg} alt={d.artwork.alt}
                     width={CARD_W[i]} height={155} />
              </picture>
              <span className={styles.cardNumber}>{String(d.order).padStart(2, '0')}</span>
              <span className={styles.cardName}>{d.name}</span>
              <span className={styles.cardDesc}>
                {d.desc.map((x) => <span key={x}>{x}</span>)}
              </span>
              <span className={styles.cardBtn}>
                {designs.detailLabel}
                <ArrowRight />
              </span>
              <span className={styles.cardDisc} style={{ left: u(CARD_W[i] - 48) }} aria-hidden>
                <ArrowRight />
              </span>
            </Link>
          ))}
        </section>

        {/* --------------------- recommended features ---------------- */}
        <section aria-label="추천 기능">
          <h2 className={styles.recTitle}>{recommend.title}</h2>
          {recommend.items.map((r, i) => (
            <span key={r} className={styles.recItem} style={{ top: u(REC_Y[i]) }}>
              <span className={styles.recCheck} aria-hidden><CheckIcon /></span>
              <span className={styles.recLabel}>{r}</span>
            </span>
          ))}
          <Link href={askHref(recommend.cta.href)} className={styles.recCta}>
            <span className={styles.recCtaLabel}>{recommend.cta.label}</span>
            <ArrowRight />
          </Link>
          <p className={styles.recNote}>
            {recommend.note.map((n) => <span key={n}>{n}</span>)}
          </p>
        </section>

        {/* -------------------------- band --------------------------- */}
        <picture>
          <source srcSet={band.image.webp} type="image/webp" />
          <img className={styles.bandImg} src={band.image.jpg} alt="" width={1536} height={115} loading="lazy" />
        </picture>
        <p className={styles.bandQuote}>
          <span className={styles.quoteMark}>&ldquo;</span> {band.quote} <span className={styles.quoteMark}>&rdquo;</span>
        </p>
        <p className={styles.bandLines}>{band.lines.map((l) => <span key={l}>{l}</span>)}</p>
        <p className={styles.bandKeywords}>{band.keywords.map((k) => <span key={k}>{k}</span>)}</p>
        {BAND_RULE_X.map((x) => (
          <span key={x} className={styles.bandRule} style={{ left: u(x) }} aria-hidden />
        ))}
      </div>
    </div>
  );
}
