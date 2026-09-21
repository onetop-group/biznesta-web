import Link from 'next/link';
import { pc14 } from '@/data/pc14';
import { ArrowLeft, ArrowRight } from '@/components/shared/Arrows';
import {
  BarsIcon, BulbIcon, ChatIcon, ChevronIcon, ClipboardIcon, CloudIcon, CodeIcon,
  DiamondIcon, DocIcon, HandshakeIcon, HeadsetIcon, HeartIcon, PenIcon, PeopleIcon,
  SearchIcon, ShieldIcon,
} from '@/components/shared/LineIcons';
import styles from './Pc14.module.css';

/** Measured off BN_PC_14_PROCESS.png, in 1536-wide artwork coordinates. */
const NAV_CENTER_X = [410.5, 540, 659, 778, 895.5, 1010, 1120];
const HERO_POINT_X = [73, 236, 400];
const CARD_X = [43, 229, 411, 593, 776, 958, 1142, 1324];
const CARD_W = [178, 174, 174, 174, 174, 176, 173, 175];
const CHEV_X = [224.5, 406.5, 588.5, 771, 953.5, 1137.5, 1319];
const PANEL_CX = [685, 790, 911, 1032, 1138];

const HERO_ICONS = { handshake: HandshakeIcon, doc: DocIcon, bars: BarsIcon };
const STEP_ICONS = { chat: ChatIcon, search: SearchIcon, bulb: BulbIcon, pen: PenIcon,
  code: CodeIcon, clipboard: ClipboardIcon, cloud: CloudIcon, headset: HeadsetIcon };
const PANEL_ICONS = { diamond: DiamondIcon, people: PeopleIcon, shield: ShieldIcon,
  bars: BarsIcon, heart: HeartIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

export default function Pc14() {
  const { header, hero, steps, closing } = pc14;
  const items = steps.items.filter((s) => s.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1536} height={407} fetchPriority="high" />
        </picture>

        {/* ------------------------- header -------------------------- */}
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
        <Link href={header.cta.href} className={styles.headerCta}>
          <span className={styles.ctaLabel}>{header.cta.label}</span>
          <ArrowRight />
        </Link>

        {/* -------------------------- hero --------------------------- */}
        <p className={styles.eyebrow}>{hero.eyebrow}</p>
        <h1 className={styles.headline}>
          <span>{hero.headline[0]}</span>
          <span className={styles.headBrown}>{hero.headline[1]}</span>
        </h1>
        <p className={styles.sub}>{hero.sub.map((s) => <span key={s}>{s}</span>)}</p>
        {hero.points.map((p, i) => {
          const Icon = HERO_ICONS[p.icon];
          return (
            <span key={p.ko} className={styles.heroPoint} style={{ left: u(HERO_POINT_X[i]) }}>
              <span className={styles.heroPointIcon} aria-hidden><Icon /></span>
              <span className={styles.heroPointLabel}>{p.ko}</span>
            </span>
          );
        })}
        <p className={styles.panelQuote}>
          <span><span className={styles.quoteMark}>&ldquo;</span> {hero.panel.quote[0]}</span>
          <span>{hero.panel.quote[1]}</span>
          <span>{hero.panel.quote[2]} <span className={styles.quoteMark}>&rdquo;</span></span>
        </p>
        <p className={styles.panelKeywords}>{hero.panel.keywords.map((k) => <span key={k}>{k}</span>)}</p>

        {/* ------------------------- steps --------------------------- */}
        <section aria-label="제작 프로세스">
          <p className={styles.secEyebrow}>{steps.eyebrow}</p>
          <h2 className={styles.secTitle}>{steps.title}</h2>
          <span className={styles.secRule} aria-hidden />
          <p className={styles.secNote}>{steps.note}</p>
          <button type="button" className={styles.secBtn} style={{ left: u(1389) }} aria-label="이전 단계">
            <ArrowLeft />
          </button>
          <button type="button" className={styles.secBtn} style={{ left: u(1442) }} aria-label="다음 단계">
            <ArrowRight />
          </button>

          {items.map((s, i) => {
            const Icon = STEP_ICONS[s.icon];
            return (
              <article key={s.id} className={styles.step}
                       style={{ left: u(CARD_X[i]), width: u(CARD_W[i]) }}>
                <span className={styles.stepCircle}>{String(s.order).padStart(2, '0')}</span>
                <span className={styles.stepIcon} aria-hidden><Icon /></span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>
                  {s.desc.map((d) => <span key={d}>{d}</span>)}
                </p>
              </article>
            );
          })}
          {CHEV_X.map((x) => (
            <span key={x} className={styles.chevron} style={{ left: u(x) }} aria-hidden><ChevronIcon /></span>
          ))}
          {items.map((s, i) => (
            <span key={`p${s.id}`}>
              <picture>
                <source srcSet={s.artwork.webp} type="image/webp" />
                <img className={styles.stepImg} src={s.artwork.jpg} alt={s.artwork.alt}
                     style={{ left: u(CARD_X[i]), width: u(CARD_W[i]) }}
                     width={CARD_W[i]} height={101} loading="lazy" />
              </picture>
              <span className={styles.stepCaption}
                    style={{ left: u(CARD_X[i] + CARD_W[i] / 2) }}>{s.caption}</span>
            </span>
          ))}
        </section>

        {/* ------------------------- closing ------------------------- */}
        <section aria-label="제작 상담 안내">
          <span className={styles.bar} aria-hidden />
          <span className={styles.barIcon} aria-hidden><PeopleIcon /></span>
          <h2 className={styles.barTitle}>{closing.bar.title.map((t) => <span key={t}>{t}</span>)}</h2>
          <p className={styles.barNote}>{closing.bar.note}</p>
          <Link href={closing.bar.cta.href} className={styles.barCta}>
            <span className={styles.barCtaLabel}>{closing.bar.cta.label}</span>
            <ArrowRight />
          </Link>

          <span className={styles.panel} aria-hidden />
          {closing.panel.points.map((p, i) => {
            const Icon = PANEL_ICONS[p.icon];
            return (
              <span key={p.ko}>
                <span className={styles.panelIcon} style={{ left: u(PANEL_CX[i]) }} aria-hidden><Icon /></span>
                <span className={styles.panelLabel} style={{ left: u(PANEL_CX[i]) }}>{p.ko}</span>
              </span>
            );
          })}
          <span className={styles.panelRule} aria-hidden />
          <p className={styles.panelBrandTop}>{closing.panel.brandTop}</p>
          <p className={styles.panelBigQuote}>
            {closing.panel.quote.map((q) => <span key={q}>{q}</span>)}
          </p>
          <p className={styles.panelBrandBottom}>{closing.panel.brandBottom}</p>
        </section>
      </div>
    </div>
  );
}
