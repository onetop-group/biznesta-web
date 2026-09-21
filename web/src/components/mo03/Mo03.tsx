import Link from 'next/link';
import { mo03 } from '@/data/mo03';
import { ArrowRight } from '@/components/shared/Arrows';
import { DocIcon, HeadsetIcon, MonitorIcon } from '@/components/shared/LineIcons';
import styles from './Mo03.module.css';
import MobileMenu from '@/components/site/MobileMenu';

/** Measured off BN_MO_03_CATEGORY.png, in 1024-wide artwork coordinates.
 *  카드 y 와 밴드 좌표는 각 면의 시작점 기준으로 옮겨 적었다. */
const CARD_X = [46, 369, 683];
const CARD_W = [303, 295, 295];
const CARD_Y = [0, 274, 550];
const BAND_CX = [599, 714.5, 839];
const DOT_X = [472, 501, 530, 559];

const BAND_ICONS = { monitor: MonitorIcon, doc: DocIcon, headset: HeadsetIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

/**
 * 2026-09-09 — /about(MO15)에서 승인된 방식으로 구조만 안전화했다.
 * 네 면(히어로 사진 · 3x3 카드 · 네이비 밴드 · 페이저)의 순서 · 비율 ·
 * 카드 구성은 그대로다. 글 기둥만 흐름으로 바꿨다.
 */
export default function Mo03() {
  const { header, hero, cards, pager, band, footer } = mo03;
  const items = cards.filter((c) => c.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        {/* --------------------------- 히어로 --------------------------- */}
        <section className={styles.hero}>
          <picture>
            <source srcSet={hero.image.webp} type="image/webp" />
            <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
                 width={1024} height={412} fetchPriority="high" />
          </picture>
          <picture>
            <source srcSet={hero.deco.webp} type="image/webp" />
            <img className={styles.deco} src={hero.deco.jpg} alt={hero.deco.alt}
                 width={335} height={250} />
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

        {/* -------------------------- 3 x 3 카드 ------------------------- */}
        <section className={styles.grid} aria-label="홈페이지 카테고리">
          {items.map((c, i) => {
            const x = CARD_X[i % 3], w = CARD_W[i % 3], y = CARD_Y[Math.floor(i / 3)];
            return (
              <article key={c.id} className={styles.card} style={{ left: u(x), top: u(y), width: u(w) }}>
                <picture>
                  <source srcSet={c.thumbnail.webp} type="image/webp" />
                  <img className={styles.cardImg} src={c.thumbnail.jpg} alt={c.thumbnail.alt}
                       width={w} height={261} loading="lazy" />
                </picture>
                <span className={styles.cardNum}>{c.num}</span>
                <h2 className={styles.cardName}>{c.name}</h2>
                <p className={styles.cardDesc}>{c.desc.map((d) => <span key={d}>{d}</span>)}</p>
                <Link href={`/category/${c.slug}`} className={styles.cardGo}
                      aria-label={`${c.name} 자세히 보기`}>
                  <ArrowRight />
                </Link>
                {/* 카드 전체 탭 영역 — 보이지 않는 링크. 화살표와 목적지가 같고,
                    스크린리더·키보드는 위의 화살표 링크를 쓴다. */}
                <Link href={`/category/${c.slug}`} className={styles.tapArea} aria-hidden tabIndex={-1} />
              </article>
            );
          })}
        </section>

        {/* -------------------------- 네이비 밴드 ------------------------- */}
        <section className={styles.band} aria-label="업종별 상담 안내">
          <div className={styles.bandBox}>
            <span className={styles.bandRule} aria-hidden />
            <div className={styles.bnCol}>
              <p className={styles.bandEyebrow}>{band.eyebrow}</p>
              <h2 className={styles.bandHead}>
                <span>{band.headline[0]}</span>
                <span><span className={styles.bandGold}>더</span> 좋은 홈페이지가 있습니다.</span>
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

        {/* --------------------------- 페이저 ---------------------------- */}
        <section className={styles.foot}>
          <div className={styles.pager} role="tablist" aria-label="카테고리 페이지">
            {DOT_X.map((x, i) => (
              <span key={x} className={`${styles.dot} ${i + 1 === pager.current ? styles.dotOn : ''}`}
                    style={{ left: u(x) }} aria-hidden />
            ))}
          </div>
          <p className={styles.footer}>{footer}</p>
        </section>
      </div>
    </div>
  );
}
