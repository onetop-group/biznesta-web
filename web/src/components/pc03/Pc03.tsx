import Link from 'next/link';
import { pc03 } from '@/data/pc03';
import { ArrowRight, BAND_ICONS, HERO_ICONS } from './Icons';
import styles from './Pc03.module.css';

/** Measured off BN_PC_03_CATEGORY.png, in 1536-wide artwork coordinates. */
const NAV_CENTER_X = [420, 553.5, 671.5, 780.5, 893, 1004, 1104.5];
const NAV_RULE_X = [494.5, 1194];

const CARD_X = [35, 333, 628, 922, 1220];
const CARD_Y = [437, 594, 749];
const CARD_H = [150, 147, 148];

/** band-relative x for the three points and the rules between them */
const BAND_RULE_X = [297, 718, 896, 1077, 1264];
const BAND_ICON_X = [749, 934, 1115];
const BAND_TEXT_X = [800, 977, 1161];

const u = (n: number) => `calc(${n} * var(--s))`;

export default function Pc03() {
  const { header, hero, categories, band } = pc03;
  const shown = categories.filter((c) => c.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        {/* --------------------- hero photograph --------------------- */}
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img
            className={styles.heroImg}
            src={hero.image.jpg}
            alt={hero.image.alt}
            width={1536}
            height={433}
            fetchPriority="high"
          />
        </picture>

        {/* ------------------------- header -------------------------- */}
        <Link href="/" className={styles.wordmark} aria-label="BIZNESTA 홈으로">
          <img
            src={header.wordmark.src}
            alt={header.wordmark.alt}
            width={header.wordmark.width}
            height={header.wordmark.height}
          />
        </Link>
        <span className={styles.headerTagline}>{header.tagline}</span>

        <nav aria-label="주 메뉴">
          {header.nav.map((item, i) => (
            <Link
              key={item.en}
              href={item.href}
              className={styles.navItem}
              style={{ left: u(NAV_CENTER_X[i]) }}
            >
              <span className={styles.navEn}>{item.en}</span>
              <span className={styles.navKo}>{item.ko}</span>
            </Link>
          ))}
        </nav>
        {NAV_RULE_X.map((x) => (
          <span key={x} className={styles.navRule} style={{ left: u(x) }} aria-hidden />
        ))}

        <Link href={header.cta.href} className={styles.headerCta}>
          <span className={styles.headerCtaLabel}>{header.cta.label}</span>
          <ArrowRight />
        </Link>

        {/* ---------------------- hero content ----------------------- */}
        <p className={styles.eyebrow}>{hero.eyebrow}</p>

        <h1 className={styles.headline}>
          {hero.headline.map((line) => (
            <span key={line.text} className={line.tone === 'gold' ? styles.gold : undefined}>
              {line.text}
            </span>
          ))}
        </h1>

        <p className={styles.sub}>
          {hero.sub.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>

        <div className={styles.points}>
          {hero.points.map((p, i) => {
            const Icon = HERO_ICONS[p.icon];
            return (
              <div key={p.label} style={{ display: 'contents' }}>
                {i > 0 && <span className={styles.pointRule} aria-hidden />}
                <span className={styles.point}>
                  <span className={styles.pointIcon} aria-hidden>
                    <Icon />
                  </span>
                  <span className={styles.pointLabel}>{p.label}</span>
                </span>
              </div>
            );
          })}
        </div>

        <p className={styles.keywords}>
          {hero.keywords.map((k) => (
            <span key={k}>{k}</span>
          ))}
        </p>
        <span className={styles.keywordRule} aria-hidden />

        {/* --------------------- category grid ----------------------- */}
        <section aria-label="홈페이지 유형">
          <h2 className={styles.srOnly}>홈페이지 유형 15가지</h2>
          {shown.map((cat, i) => {
            const col = i % 5;
            const row = Math.floor(i / 5);
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={styles.card}
                style={{ left: u(CARD_X[col]), top: u(CARD_Y[row]), height: u(CARD_H[row]) }}
              >
                <picture>
                  <source srcSet={cat.thumbnail.webp} type="image/webp" />
                  <img
                    className={styles.cardImg}
                    src={cat.thumbnail.jpg}
                    alt={cat.thumbnail.alt}
                    width={282}
                    height={CARD_H[row]}
                    loading={row === 0 ? undefined : 'lazy'}
                  />
                </picture>
                <span className={styles.cardBody}>
                  <span className={styles.cardNumber}>{String(cat.order).padStart(2, '0')}</span>
                  <span className={styles.cardName}>{cat.name}</span>
                  <span className={styles.cardLabel}>{cat.label}</span>
                  <span className={styles.cardDesc}>
                    {cat.desc.map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </span>
                  <span className={styles.cardDisc} style={{ top: u(CARD_H[row] - 42) }} aria-hidden>
                    <ArrowRight />
                  </span>
                </span>
              </Link>
            );
          })}
        </section>

        {/* ----------------------- navy band ------------------------- */}
        <picture>
          <source srcSet={band.image.webp} type="image/webp" />
          <img
            className={styles.bandImg}
            src={band.image.jpg}
            alt=""
            width={1536}
            height={112}
            loading="lazy"
          />
        </picture>

        <section className={styles.band} aria-label="BIZNESTA 제작 원칙">
          <span className={styles.bandWordmark}>
            <img
              src={band.wordmark.src}
              alt={band.wordmark.alt}
              width={band.wordmark.width}
              height={band.wordmark.height}
            />
          </span>
          <span className={styles.bandTagline}>{band.tagline}</span>

          {BAND_RULE_X.map((x) => (
            <span key={x} className={styles.bandRule} style={{ left: u(x) }} aria-hidden />
          ))}

          <p className={styles.quote}>
            <span>
              <span className={styles.quoteMark}>&ldquo;</span> {band.quote[0]}
            </span>
            <span className={styles.quoteIndent}>
              <span className={styles.quoteLatin}>BIZNESTA</span>
              {band.quote[1].replace('BIZNESTA', '')} <span className={styles.quoteMark}>&rdquo;</span>
            </span>
          </p>

          {band.points.map((p, i) => {
            const Icon = BAND_ICONS[p.icon];
            return (
              <div key={p.en}>
                <span className={styles.bandIcon} style={{ left: u(BAND_ICON_X[i]) }} aria-hidden>
                  <Icon />
                </span>
                <span className={styles.bandKo} style={{ left: u(BAND_TEXT_X[i]) }}>
                  {p.ko}
                </span>
                <span className={styles.bandEn} style={{ left: u(BAND_TEXT_X[i]) }}>
                  {p.en}
                </span>
              </div>
            );
          })}

          <Link href={band.cta.href} className={styles.bandCta}>
            <span className={styles.bandCtaLabel}>{band.cta.label}</span>
            <ArrowRight />
          </Link>
        </section>
      </div>
    </div>
  );
}
