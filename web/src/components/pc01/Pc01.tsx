import Link from 'next/link';
import { pc01 } from '@/data/pc01';
import {
  ArrowDown,
  ArrowRight,
  BAND_ICONS,
  ChatIcon,
  SearchIcon,
} from './Icons';
import styles from './Pc01.module.css';

/** Centre of each header menu item, measured off BN_PC_01_HERO.png. */
const NAV_CENTER_X = [436.5, 555.5, 670.5, 778.5, 897, 1017, 1128.5];

/** x positions (in 1536-wide artwork coordinates) for the navy band. */
const BAND_ICON_X = [91, 392, 666, 940];
const BAND_TEXT_X = [170, 458, 733, 1012];
const BAND_RULE_X = [349.5, 622.5, 899, 1254];

const u = (n: number) => `calc(${n} * var(--s))`;

export default function Pc01() {
  const { header, hero, band } = pc01;

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        {/* ---------- photographic stage ---------- */}
        <picture>
          <source srcSet={hero.background.webp} type="image/webp" />
          <img
            className={styles.plate}
            src={hero.background.jpg}
            alt={hero.background.alt}
            width={1536}
            height={845}
            fetchPriority="high"
          />
        </picture>

        {/* ---------------- header ---------------- */}
        <div className={styles.headerBar} />

        <Link href="/" className={styles.logo} aria-label="BIZNESTA 홈으로">
          <img
            src={header.logo.src}
            alt={header.logo.alt}
            width={header.logo.width}
            height={header.logo.height}
          />
        </Link>

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

        <span className={styles.headerRule} aria-hidden />

        <button type="button" className={styles.search} aria-label={header.search.label}>
          <SearchIcon />
        </button>

        <Link href={header.cta.href} className={styles.headerCta}>
          <span className={styles.headerCtaLabel}>{header.cta.label}</span>
          <ArrowRight />
        </Link>

        {/* ----------------- hero ----------------- */}
        <p className={styles.eyebrow}>{hero.eyebrow}</p>

        <h1 className={styles.headline}>
          {hero.headline.map((line, i) => (
            <span key={i}>
              {line.map((seg, j) => (
                <span key={j} className={seg.tone === 'gold' ? styles.gold : undefined}>
                  {seg.text}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p className={styles.sub}>
          {hero.sub.map((line, i) => (
            <span key={i}>
              {line.map((seg, j) => (
                <span key={j} className={seg.tone === 'gold' ? styles.gold : undefined}>
                  {seg.text}
                </span>
              ))}
            </span>
          ))}
        </p>

        <p className={styles.body}>
          {hero.body.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </p>

        <div className={styles.ctaRow}>
          {hero.ctas.map((cta) => (
            <Link
              key={cta.label}
              href={cta.href}
              className={cta.variant === 'primary' ? styles.ctaPrimary : styles.ctaOutline}
            >
              <span className={styles.ctaLabel}>{cta.label}</span>
              {cta.variant === 'primary' ? <ArrowRight /> : <ChatIcon />}
            </Link>
          ))}
        </div>

        <span className={styles.scrollLabel}>{hero.scrollLabel}</span>
        <span className={styles.scrollRule} aria-hidden />
        <a href="#band" className={styles.scrollDisc} aria-label="아래로 스크롤">
          <ArrowDown />
        </a>

        {/* --------- right vertical typography --------- */}
        <span className={styles.vRule} aria-hidden />
        <p className={styles.vType}>
          {hero.verticalKeywords.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </p>

        {/* ---------------- navy band ---------------- */}
        <section id="band" className={styles.band} aria-label="BIZNESTA 소개">
          {BAND_RULE_X.map((x) => (
            <span key={x} className={styles.bandRule} style={{ left: u(x) }} aria-hidden />
          ))}

          {band.items.map((item, i) => {
            const Icon = BAND_ICONS[item.icon];
            return (
              <div key={item.label}>
                <span className={styles.bandIcon} style={{ left: u(BAND_ICON_X[i]) }} aria-hidden>
                  <Icon />
                </span>
                <div className={styles.bandText} style={{ left: u(BAND_TEXT_X[i]) }}>
                  <span className={styles.bandLabel}>{item.label}</span>
                  <span className={styles.bandSub}>
                    {item.sub.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </span>
                </div>
              </div>
            );
          })}

          <span className={styles.bandBrandLogo}>
            <img
              src={band.brand.logo.src}
              alt={band.brand.logo.alt}
              width={band.brand.logo.width}
              height={band.brand.logo.height}
            />
          </span>
          <p className={styles.bandBrandLines}>
            {band.brand.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </section>
      </div>
    </div>
  );
}
