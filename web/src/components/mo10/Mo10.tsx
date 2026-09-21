import Link from 'next/link';
import { mo10 } from '@/data/mo10';
import { ArrowRight } from '@/components/shared/Arrows';
import { ChatIcon, ClipboardIcon, DocIcon, GearIcon, PeopleIcon } from '@/components/shared/LineIcons';
import styles from './Mo10.module.css';
import MobileMenu from '@/components/site/MobileMenu';

/** picture icon — local to this screen so no locked screen can be affected */
const ImageIcon = () => (
  <svg viewBox="0 0 32 32" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.7}
       strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="7" width="24" height="18" rx="2.5" />
    <circle cx="11.5" cy="13.5" r="2.2" />
    <path d="M6 22l6.5-6.5 5 5 4-4L26 21" />
  </svg>
);

/** Measured off BN_MO_10_ADMIN.png, in 1024-wide artwork coordinates. */
const CARD_X = [44, 234, 424, 614, 804];
const SCREEN_X = [43, 233, 424, 615, 806];
const CAP_CX = [125, 318, 510, 702, 895];
const SUP_X = [19, 325.5, 632];
/** hairlines the artwork draws between the three support items */
const SEP_X = [244, 551];
const SUP_DIV = [244, 551];

const FEAT_ICONS = { people: PeopleIcon, clipboard: ClipboardIcon, doc: DocIcon, image: ImageIcon, gear: GearIcon };
const SUP_ICONS = { chat: ChatIcon, doc: DocIcon, people: PeopleIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

export default function Mo10() {
  const { header, hero, features, preview, band, support } = mo10;
  const cards = features.items.filter((f) => f.visible).sort((a, b) => a.order - b.order);
  const screens = preview.screens.filter((s) => s.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        {/* --------------------------- 히어로 --------------------------- */}
        <section className={styles.hero}>
        {/* the phone with the DEMO admin interface, both gold scripts and the
            PEOPLE / PROCESS / RESULT books are the photograph */}
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1024} height={610} fetchPriority="high" />
        </picture>
        {/* 사진 속 폰 목업과 금색 필기체가 글 뒤로 비치지 않게 덮는 밝은 결 */}
        <span className={styles.heroWash} aria-hidden />

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

        {/* ---------------------- admin features --------------------- */}
        <section className={styles.feats} aria-label="주요 관리자 기능">
          <h2 id="features" className={styles.secTitle}>{features.title}</h2>
          {cards.map((c, i) => {
            const Icon = FEAT_ICONS[c.icon];
            return (
              <article key={c.id} className={styles.card} style={{ left: u(CARD_X[i]) }}>
                <span className={styles.cardIcon} aria-hidden><Icon /></span>
                <h3 className={styles.cardTitle}>{c.title}</h3>
                <p className={styles.cardDesc}>{c.desc.map((d) => <span key={d}>{d}</span>)}</p>
              </article>
            );
          })}
        </section>

        {/* --------------------- admin screen preview ---------------- */}
        <section className={styles.screens} aria-label="관리자 페이지 미리보기">
          <h2 id="preview" className={styles.secTitle2}>{preview.title}</h2>
          {screens.map((s, i) => (
            <figure key={s.id} className={styles.screen} style={{ left: u(SCREEN_X[i]) }}>
              <picture>
                <source srcSet={s.image.webp} type="image/webp" />
                <img className={styles.screenImg} src={s.image.jpg} alt={s.image.alt}
                     width={175} height={302} loading="lazy" />
              </picture>
              <figcaption className={styles.screenCap} style={{ left: u(CAP_CX[i] - SCREEN_X[i]) }}>
                {s.caption}
              </figcaption>
            </figure>
          ))}
        </section>

        {/* -------------------------- band --------------------------- */}
        <section className={styles.close} aria-label="관리자 시스템 상담 안내">
          {/* 패널이 글을 감싸므로 글자가 커지면 패널이 함께 자란다 */}
          <div className={styles.bandBox}>
          <h2 className={styles.bandQuote}>
            <span>{band.quote[0]}</span>
            <span><span className={styles.bandGold}>비즈네스타</span>가 함께합니다.</span>
          </h2>
          <Link href={band.cta.href} className={styles.bandCta}>
            <span className={styles.bandCtaLabel}>{band.cta.label}</span>
            <ArrowRight />
          </Link>

          <div className={styles.supRow}>
            {SUP_DIV.map((x) => (
              <span key={x} className={styles.supDiv} style={{ left: u(x) }} aria-hidden />
            ))}
            {support.map((s, i) => {
              const Icon = SUP_ICONS[s.icon];
              return (
                <span key={s.label} className={styles.sup} style={{ left: u(SUP_X[i]) }}>
                  <span className={styles.supIcon} aria-hidden><Icon /></span>
                  <span className={styles.supLabel}>{s.label}</span>
                </span>
              );
            })}
            {SEP_X.map((x) => (
              <span key={x} className={styles.supSep} style={{ left: u(x) }} aria-hidden />
            ))}
          </div>
          </div>

        </section>
      </div>
    </div>
  );
}
