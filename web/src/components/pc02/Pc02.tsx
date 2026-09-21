import Link from 'next/link';
import { pc02 } from '@/data/pc02';
import { ArrowDown, ArrowRight, BAND_ICONS } from './Icons';
import styles from './Pc02.module.css';

/** Centre of each header menu item, measured off BN_PC_02_BRAND_MESSAGE.png. */
const NAV_CENTER_X = [453.5, 578.5, 701.5, 818.5, 932.5, 1052.5, 1165];

/** Bottom band, in 1536-wide artwork coordinates. */
const BAND_ICON_X = [86, 423, 724, 1064];
const BAND_TEXT_X = [171, 497, 799, 1148];
const BAND_RULE_X = [368, 669, 1007, 1344];

const u = (n: number) => `calc(${n} * var(--s))`;

export default function Pc02() {
  const { header, stage, message, wall, exhibitionCaption, band, util } = pc02;

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        {/* ---- architectural stage: space, light, wall sign, exhibited work ---- */}
        <picture>
          <source srcSet={stage.webp} type="image/webp" />
          <img
            className={styles.plate}
            src={stage.jpg}
            alt={stage.alt}
            width={1536}
            height={1024}
            fetchPriority="high"
          />
        </picture>

        {/* ------------------------- header ------------------------- */}
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

        <Link href={header.cta.href} className={styles.headerCta}>
          <span className={styles.headerCtaLabel}>{header.cta.label}</span>
          <ArrowRight />
        </Link>

        {/* --------------------- brand message ---------------------- */}
        <p className={styles.eyebrow}>{message.eyebrow}</p>

        <h1 className={styles.headline}>
          {message.headline.map((line, i) => (
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
          {message.sub.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>

        <span className={styles.vRule} aria-hidden />
        <p className={styles.smallEn}>{message.smallEn}</p>

        <p className={styles.desc}>
          {message.desc.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>

        <span className={styles.script}>
          <img
            src={message.script.src}
            alt={message.script.text}
            width={message.script.width}
            height={message.script.height}
          />
        </span>
        <span className={styles.leftRule} aria-hidden />

        {/* ------------- signage printed on the wall panel ------------ */}
        <p className={styles.wallLines}>
          {wall.lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        <p className={styles.wallKeywords}>
          {wall.keywords.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </p>

        {/* -------------- caption under the exhibition ---------------- */}
        <p className={styles.caption}>
          {exhibitionCaption.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>

        {/* ---------------------- bottom band ------------------------ */}
        <section aria-label="BIZNESTA가 연결하는 것">
          {BAND_RULE_X.map((x, i) => (
            <span key={x} id={i === 0 ? "next" : undefined}
                  className={styles.bandRule} style={{ left: u(x) }} aria-hidden />
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

          <p className={styles.bandStack}>
            {band.stack.map((line) => (
              <span key={line}>{line}</span>
            ))}
            <span className={styles.bandStackBrand}>{band.stackBrand}</span>
          </p>
          <span className={styles.bandStackRule} aria-hidden />
        </section>

        {/* ---------------------- utility bar ------------------------ */}
        <span className={styles.utilLogo}>
          <img
            src={util.logo.src}
            alt={util.logo.alt}
            width={util.logo.width}
            height={util.logo.height}
          />
        </span>
        <span className={styles.utilTagline}>{util.tagline}</span>
        <span className={styles.utilLine}>{util.line}</span>
        <span className={styles.utilRule} aria-hidden />
        <span className={styles.utilScroll}>{util.scrollLabel}</span>
        <a href="#next" className={styles.utilDisc} aria-label="아래로 스크롤">
          <ArrowDown />
        </a>
      </div>
    </div>
  );
}
