import Link from 'next/link';
import { mo07 } from '@/data/mo07';
import { ArrowRight } from '@/components/shared/Arrows';
import { BulbIcon, HeartIcon, MonitorIcon } from '@/components/shared/LineIcons';
import { ALL_FILTER, categoryHref } from '@/data/showroom';
import styles from './Mo07.module.css';
import MobileMenu from '@/components/site/MobileMenu';

/** Measured off BN_MO_07_NEW_DESIGN.png, in 1024-wide artwork coordinates. */
const CHIP_X = [38, 157, 295, 394, 542, 668, 797, 885];
const CHIP_W = [105, 118, 82, 133, 102, 103, 83, 70];
const CARD_X = [41, 521];
const CARD_Y = [0, 255, 510];
const BAND_CX = [637, 742, 867];

const BAND_ICONS = { bulb: BulbIcon, monitor: MonitorIcon, heart: HeartIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

export default function Mo07() {
  const { header, hero, filters, badge, items, band } = mo07;
  const cards = items.filter((i) => i.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        {/* --------------------------- 히어로 --------------------------- */}
        <section className={styles.hero}>
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1024} height={465} fetchPriority="high" />
        </picture>

        <Link href="/" className={styles.logo} aria-label="BIZNESTA 홈으로">
          <img src={header.logo.src} alt={header.logo.alt} width={225} height={56} />
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
        </section>

        {/* --------------------------- 필터 칩 --------------------------- */}
        <nav className={styles.filters} aria-label="디자인 분류">
          {filters.map((f, i) => (
            <Link key={f.slug} href={`/design?filter=${f.slug}`}
                  className={`${styles.chip} ${f.active ? styles.chipOn : ''}`}
                  style={{ left: u(CHIP_X[i]), width: u(CHIP_W[i]) }}
                  aria-current={f.active ? 'page' : undefined}>
              {f.label}
            </Link>
          ))}
        </nav>

        {/* ---------------------- new design grid -------------------- */}
        <section className={styles.gallery} aria-label="새로 공개된 디자인 샘플">
          {cards.map((c, i) => (
            <article key={c.id} className={styles.card}
                     style={{ left: u(CARD_X[i % 2]), top: u(CARD_Y[Math.floor(i / 2)]) }}>
              <picture>
                <source srcSet={c.artwork.webp} type="image/webp" />
                <img className={styles.cardImg} src={c.artwork.jpg} alt={c.artwork.alt}
                     width={462} height={194} loading="lazy" />
              </picture>
              {/* NEW = a newly published BIZNESTA design, never a client project */}
              {c.newDesign && <span className={styles.badge}>{badge}</span>}
              <h2 className={styles.cardCap}>{c.caption}</h2>
              <Link href={categoryHref(c.categoryId ?? ALL_FILTER.id)} className={styles.cardGo}
                    aria-label={`${c.caption} 디자인 샘플 보기`}>
                <ArrowRight />
              </Link>
              {/* 카드 전체 탭 영역 — 보이지 않는 링크. 화살표와 목적지가 같고,
                  스크린리더·키보드는 위의 화살표 링크를 쓴다. */}
              <Link href={categoryHref(c.categoryId ?? ALL_FILTER.id)} className={styles.tapArea} aria-hidden tabIndex={-1} />
            </article>
          ))}
        </section>

        {/* -------------------------- band --------------------------- */}
        <section className={styles.band} aria-label="새 디자인 상담 안내">
          <div className={styles.bandBox}>
          <span className={styles.bandRule} aria-hidden />
          <div className={styles.bnCol}>
          <h2 className={styles.bandQuote}>
            <span>{band.quote[0]}</span>
            <span><span className={styles.bandGold}>비즈네스타</span>가 함께합니다.</span>
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
