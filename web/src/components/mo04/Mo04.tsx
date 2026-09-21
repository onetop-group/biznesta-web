import Link from 'next/link';
import { mo04 } from '@/data/mo04';
import { ArrowRight } from '@/components/shared/Arrows';
import { BarsIcon, MonitorIcon, PenIcon } from '@/components/shared/LineIcons';
import { ALL_FILTER, categoryHref, isShowroomCategory } from '@/data/showroom';
import styles from './Mo04.module.css';
import MobileMenu from '@/components/site/MobileMenu';

/** Measured off BN_MO_04_DESIGN_GALLERY.png, in 1024-wide artwork coordinates.
 *  카드 y 와 밴드 좌표는 각 면의 시작점 기준으로 옮겨 적었다. */
const CHIP_X = [40, 163, 301, 401, 552, 677, 806, 916];
const CHIP_W = [110, 119, 82, 133, 101, 103, 83, 67];
const CARD_X = [39, 521];
const CARD_Y = [0, 358, 716];
const BAND_CX = [580.5, 719.5, 859];

const BAND_ICONS = { monitor: MonitorIcon, pen: PenIcon, bars: BarsIcon };

/* 시안 칩의 slug → 공식 카테고리. 글자 · 폭 · 좌표는 하나도 건드리지 않고
   목적지만 잇는다. 공식 카테고리가 아닌 칩(부동산 · 기타)은 전체 보기로 간다. */
const CHIP_CATEGORY: Record<string, string> = {
  corporate: 'corporate', commerce: 'shopping', expert: 'expert',
  education: 'education', medical: 'medical',
};
const chipHref = (slug: string) => {
  const id = CHIP_CATEGORY[slug];
  return categoryHref(id && isShowroomCategory(id) ? id : ALL_FILTER.id);
};
const u = (n: number) => `calc(${n} * var(--s))`;

/**
 * 2026-09-09 — /about(MO15)에서 승인된 방식으로 구조만 안전화했다.
 * 네 면(히어로 사진 · 필터 칩 · 2x3 갤러리 · 네이비 밴드)의 순서 · 비율 ·
 * artwork · crop 은 그대로다. 글 기둥만 흐름으로 바꿨다.
 */
export default function Mo04() {
  const { header, hero, filters, items, band } = mo04;
  const cards = items.filter((i) => i.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        {/* --------------------------- 히어로 --------------------------- */}
        <section className={styles.hero}>
          <picture>
            <source srcSet={hero.image.webp} type="image/webp" />
            <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
                 width={1024} height={375} fetchPriority="high" />
          </picture>
          <picture>
            <source srcSet={hero.deco.webp} type="image/webp" />
            <img className={styles.deco} src={hero.deco.jpg} alt={hero.deco.alt}
                 width={335} height={265} />
          </picture>

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
        </section>

        {/* --------------------------- 필터 칩 --------------------------- */}
        <nav className={styles.filters} aria-label="디자인 분류">
          {filters.map((f, i) => (
            <Link key={f.slug} href={chipHref(f.slug)}
                  className={`${styles.chip} ${f.active ? styles.chipOn : ''}`}
                  style={{ left: u(CHIP_X[i]), width: u(CHIP_W[i]) }}
                  aria-current={f.active ? 'page' : undefined}>
              {f.label}
            </Link>
          ))}
        </nav>

        {/* -------------------------- 2 x 3 갤러리 ------------------------ */}
        <section className={styles.gallery} aria-label="디자인 샘플 갤러리">
          {cards.map((c, i) => (
            <article key={c.id} className={styles.card}
                     style={{ left: u(CARD_X[i % 2]), top: u(CARD_Y[Math.floor(i / 2)]) }}>
              <picture>
                <source srcSet={c.artwork.webp} type="image/webp" />
                <img className={styles.cardImg} src={c.artwork.jpg} alt={c.artwork.alt}
                     width={467} height={268} loading="lazy" />
              </picture>
              <h2 className={styles.cardTitle}>{c.title}</h2>
              <span className={styles.cardSep} aria-hidden />
              {/* every design here is a BIZNESTA sample — see src/data/mo04.ts */}
              <span className={styles.cardCat}>{c.category}</span>
              <Link href={`/design/${c.slug}`} className={styles.cardGo}
                    aria-label={`${c.title} 디자인 샘플 보기`}>
                <ArrowRight />
              </Link>
              {/* 카드 전체 탭 영역 — 보이지 않는 링크. 화살표와 목적지가 같고,
                  스크린리더·키보드는 위의 화살표 링크를 쓴다. */}
              <Link href={`/design/${c.slug}`} className={styles.tapArea} aria-hidden tabIndex={-1} />
            </article>
          ))}
        </section>

        {/* -------------------------- 네이비 밴드 ------------------------- */}
        <section className={styles.band} aria-label="디자인 상담 안내">
          <div className={styles.bandBox}>
            <span className={styles.bandRule} aria-hidden />
            <div className={styles.bnCol}>
              <p className={styles.bandEyebrow}>{band.eyebrow}</p>
              <h2 className={styles.bandHead}>
                <span>{band.headline[0]}</span>
                <span><span className={styles.bandGold}>이렇게</span> 멋질 수 있습니다.</span>
              </h2>
              <p className={styles.bandTagline}>{band.tagline}</p>
            </div>
            <Link href={band.cta.href} className={styles.bandCta}>
              <span className={styles.bandCtaLabel}>{band.cta.label}</span>
              <ArrowRight />
            </Link>
            {band.items.map((it, i) => {
              const Icon = BAND_ICONS[it.icon];
              return (
                <span key={it.label} className={styles.bandItem} style={{ left: u(BAND_CX[i]) }}>
                  <span className={styles.bandIcon} aria-hidden><Icon /></span>
                  <span className={styles.bandLabel}>{it.label}</span>
                </span>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
