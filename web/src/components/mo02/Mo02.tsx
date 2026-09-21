import Link from 'next/link';
import { mo02 } from '@/data/mo02';
import { ArrowRight } from '@/components/shared/Arrows';
import { BarsIcon, BulbIcon, DiamondIcon, PeopleIcon } from '@/components/shared/LineIcons';
import styles from './Mo02.module.css';
import MobileMenu from '@/components/site/MobileMenu';

/** Measured off BN_MO_02_BRAND_MESSAGE.png, in 1024-wide artwork coordinates. */
const VALUE_CX = [165, 397, 630.5, 861.5];
const VALUE_DIV = [281, 514, 746];

const VALUE_ICONS = { diamond: DiamondIcon, bulb: BulbIcon, bars: BarsIcon, people: PeopleIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

/**
 * 2026-09-09 — /about(MO15)에서 승인된 방식으로 구조만 안전화했다.
 * 다섯 면(히어로 사진 · 가치 4열 · 비전 패널 · 상담 바 · 꼬리표)의 순서 ·
 * 비율 · 사진 위 편집은 그대로다. 글 기둥만 흐름으로 바꿨다.
 */
export default function Mo02() {
  const { header, hero, values, vision, closing, footer } = mo02;
  const items = values.filter((v) => v.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        {/* --------------------------- 히어로 --------------------------- */}
        <section className={styles.hero}>
          {/* 실내 풍경 · 이젤 카드 · 책 · 금색 필기체는 전부 사진이다 */}
          <picture>
            <source srcSet={hero.image.webp} type="image/webp" />
            <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
                 width={1024} height={775} fetchPriority="high" />
          </picture>

          <Link href="/" className={styles.logo} aria-label="BIZNESTA 홈으로">
            <img src={header.logo.src} alt={header.logo.alt} width={258} height={64} />
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

        {/* --------------------------- 가치 4열 -------------------------- */}
        <section className={styles.values} aria-label="비즈네스타의 가치">
          <span className={styles.valPanel} aria-hidden />
          {VALUE_DIV.map((x) => (
            <span key={x} className={styles.valDiv} style={{ left: u(x) }} aria-hidden />
          ))}
          {items.map((v, i) => {
            const Icon = VALUE_ICONS[v.icon];
            return (
              <div key={v.id} className={styles.val} style={{ left: u(VALUE_CX[i]) }}>
                <span className={styles.valIcon} aria-hidden><Icon /></span>
                <h2 className={styles.valTitle}>{v.title}</h2>
                <p className={styles.valSub}>{v.sub.map((t) => <span key={t}>{t}</span>)}</p>
              </div>
            );
          })}
        </section>

        {/* --------------------------- 비전 패널 -------------------------- */}
        <section className={styles.vision} aria-label="비즈네스타 비전">
          <div className={styles.pvBox}>
            <picture>
              <source srcSet={vision.image.webp} type="image/webp" />
              <img className={styles.panelImg} src={vision.image.jpg} alt={vision.image.alt}
                   width={923} height={254} loading="lazy" />
            </picture>
            <p className={styles.pvBrand}>{vision.brand.map((b) => <span key={b}>{b}</span>)}</p>
            <div className={styles.pvCol}>
              <p className={styles.pvEyebrow}>{vision.eyebrow}</p>
              <h2 className={styles.pvHead}>
                <span>{vision.headline[0]}</span>
                <span className={styles.pvGold}>{vision.headline[1]}</span>
              </h2>
              <p className={styles.pvBody}>{vision.body.map((b) => <span key={b}>{b}</span>)}</p>
            </div>
          </div>
        </section>

        {/* --------------------------- 상담 바 ---------------------------- */}
        <section className={styles.close} aria-label="제작 상담 안내">
          {/* 패널이 글을 감싸므로 글자가 커지면 패널이 함께 자란다 */}
          <div className={styles.barBox}>
            <img className={styles.leaf} src={closing.leaf.src} alt={closing.leaf.alt}
                 width={66} height={62} loading="lazy" />
            <p className={styles.barText}>{closing.lines.map((l) => <span key={l}>{l}</span>)}</p>
            <Link href={closing.cta.href} className={styles.barCta}>
              <span className={styles.barCtaLabel}>{closing.cta.label}</span>
              <ArrowRight />
            </Link>
          </div>
        </section>

        {/* ---------------------------- 꼬리표 ---------------------------- */}
        <section className={styles.foot}>
          <span className={`${styles.ftRule} ${styles.ftRuleL}`} aria-hidden />
          <span className={`${styles.ftRule} ${styles.ftRuleR}`} aria-hidden />
          <div className={styles.ftCol}>
            <p className={styles.ftBrand}>{footer.brand}</p>
            <p className={styles.ftTagline}>{footer.tagline}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
