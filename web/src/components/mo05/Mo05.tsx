import Link from 'next/link';
import { mo05 } from '@/data/mo05';
import { ArrowRight } from '@/components/shared/Arrows';
import {
  ChatIcon, DiamondIcon, DocIcon, GearIcon, MonitorIcon, PenIcon, PeopleIcon,
} from '@/components/shared/LineIcons';

/** filled bronze check medallion — the artwork's own mark, not the outline icon */
const CheckMark = () => (
  <svg viewBox="0 0 32 32" aria-hidden>
    <circle cx="16" cy="16" r="15" fill="currentColor" />
    <path d="M9.5 16.4l4.4 4.3 8.6-8.8" fill="none" stroke="#fff" strokeWidth={2.6}
          strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
import { consultHref } from '@/data/navigation';
import styles from './Mo05.module.css';
import MobileMenu from '@/components/site/MobileMenu';

/** Measured off BN_MO_05_CATEGORY_DETAIL.png, in 1024-wide artwork coordinates. */
const FEAT_CX = [159, 394, 628.5, 865];
const FEAT_DIV = [276.5, 511, 746.5];
const ART_X = [43, 360, 677];
const SUP_X = [164, 441, 708];

const FEAT_ICONS = { diamond: DiamondIcon, pen: PenIcon, monitor: MonitorIcon, gear: GearIcon };
const SUP_ICONS = { chat: ChatIcon, doc: DocIcon, people: PeopleIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

export default function Mo05({ slug }: { slug?: string } = {}) {
  const { header, back, category, hero, features, recommend, gallery, band, cta, support } = mo05;
  /* 상담 진입 시 어떤 카테고리에서 왔는지 전달한다 (저장은 아직 하지 않는다) */
  const askHref = (fallback: string) =>
    slug ? consultHref('category', { category: slug }) : fallback;
  const feats = features.filter((f) => f.visible).sort((a, b) => a.order - b.order);
  const arts = gallery.items.filter((g) => g.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        {/* --------------------- 카테고리 히어로 ---------------------- */}
        <section className={styles.hero}>
        {/* the laptop + phone mockups, the desk, the books and the gold script
            are the photograph; every piece of copy over it is markup */}
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1024} height={560} fetchPriority="high" />
        </picture>

        <Link href="/" className={styles.logo} aria-label="BIZNESTA 홈으로">
          <img src={header.logo.src} alt={header.logo.alt} width={226} height={56} />
        </Link>
        <MobileMenu
          cls={{ btn: styles.menuBtn, burger: styles.burger, label: styles.menuLabel }}
          label={header.menuLabel}
        />

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
        <div className={styles.catRow}>
          <span className={styles.catNum}>{category.num}</span>
          <span className={styles.catSep} aria-hidden />
          <p className={styles.catName}>{category.categoryName}</p>
        </div>
        <h1 className={styles.headline}>
          <span>{hero.headline[0]}</span>
          <span className={styles.gold}>{hero.headline[1]}</span>
        </h1>
        <p className={styles.body}>{hero.body.map((b) => <span key={b}>{b}</span>)}</p>
        </div>
        </section>

        {/* ---------------------- 제작범위 4열 ------------------------ */}
        <section className={styles.feats} aria-label="카테고리 제작 범위">
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

        {/* ------------------------ 추천 패널 ------------------------- */}
        <section className={styles.rec} aria-label="추천 대상">
          <span className={styles.recPanel} aria-hidden />
          <picture>
            <source srcSet={recommend.script.webp} type="image/webp" />
            <img className={styles.recScript} src={recommend.script.jpg} alt={recommend.script.alt}
                 width={190} height={110} loading="lazy" />
          </picture>
          <span className={styles.recRule} aria-hidden />
          <h2 className={styles.recTitle}>{recommend.title}</h2>
          <ul className={styles.recList}>
            {recommend.rows.map((r, i) => (
              <li key={r} className={styles.recRow} style={{ top: u(i * 51) }}>
                <span className={styles.recCheck} aria-hidden><CheckMark /></span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ----------------------- 디자인 3-up ------------------------ */}
        <section className={styles.designs} aria-label="이 카테고리의 디자인 샘플">
          <h2 className={styles.secTitle}>{gallery.title}</h2>
          <Link href={gallery.more.href} className={styles.moreLink}>
            <span>{gallery.more.label}</span>
            <ArrowRight />
          </Link>
          {arts.map((a, i) => (
            <article key={a.id} className={styles.art} style={{ left: u(ART_X[i]) }}>
              <picture>
                <source srcSet={a.artwork.webp} type="image/webp" />
                <img className={styles.artImg} src={a.artwork.jpg} alt={a.artwork.alt}
                     width={301} height={150} loading="lazy" />
              </picture>
              {/* BIZNESTA sample design — never labelled as client work */}
              <p className={styles.artCap}>{a.caption}</p>
              <Link href={`/design/${a.slug}`} className={styles.artGo}
                    aria-label={`${a.caption} 디자인 샘플 보기`}>
                <ArrowRight />
              </Link>
              {/* 카드 전체 탭 영역 — 보이지 않는 링크. 화살표와 목적지가 같고,
                  스크린리더·키보드는 위의 화살표 링크를 쓴다. */}
              <Link href={`/design/${a.slug}`} className={styles.tapArea} aria-hidden tabIndex={-1} />
            </article>
          ))}
        </section>

        {/* -------------------------- 마무리 -------------------------- */}
        <section className={styles.close} aria-label="제작 상담 안내">
          {/* 패널이 글을 감싸므로 글자가 커지면 패널이 함께 자란다 */}
          <div className={styles.bandBox}>
            <p className={styles.bandQuote}>{band.quote.map((q) => <span key={q}>{q}</span>)}</p>
            <picture>
              <source srcSet={band.script.webp} type="image/webp" />
              <img className={styles.bandScript} src={band.script.jpg} alt={band.script.alt}
                   width={280} height={100} loading="lazy" />
            </picture>
          </div>
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
