import type React from 'react';
import Link from 'next/link';
import { mo12 } from '@/data/mo12';
import { ArrowRight } from '@/components/shared/Arrows';
import { ChatIcon, DocIcon, PeopleIcon } from '@/components/shared/LineIcons';
import { SERVICE_ROUTE, consultHref } from '@/data/navigation';
import styles from './Mo12.module.css';
import MobileMenu from '@/components/site/MobileMenu';

/** Measured off BN_MO_12_SERVICE.png, in 1024-wide artwork coordinates. */
const CARD_BOX: [number, number, number, number][] = [
  [33, 0, 540, 340],
  [579, 0, 413, 340],
  [34, 370, 472, 320],
  [514, 370, 479, 320],
  [34, 720, 332, 296],
  [374, 720, 300, 296],
  [682, 720, 309, 296],
];
const SUP_X = [132, 400, 669];
/** hairlines the artwork draws between the three support items */
const SEP_X = [346, 580];
/** Row band each card belongs to. The artwork sets a different type scale
    per row (234px / 219px / 203px cards), so the row drives the CSS. */
const CARD_ROW = [1, 1, 2, 2, 3, 3, 3];
/** Names whose tracking in the artwork is tighter than the row default. */
const NAME_LS: Record<number, Record<string, string>> = {
  1: { '--nls': '-0.122em', '--nws': '0.09em' },
  2: { '--nls': '-0.095em', '--nws': '0.09em' },
};

const SUP_ICONS = { chat: ChatIcon, doc: DocIcon, people: PeopleIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

export default function Mo12() {
  const { header, hero, services, band, support } = mo12;
  const cards = services.filter((s) => s.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        {/* --------------------------- 히어로 --------------------------- */}
        <section className={styles.hero}>
        {/* the monitor, the phone, the book spines and the gold script are the
            photograph; every service card carries its own website artwork */}
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1024} height={530} fetchPriority="high" />
        </picture>
        {/* 사진 속 금색 영문 필기체를 덮는 밝은 결 */}
        <span className={styles.heroWash} aria-hidden />

        <span className={styles.menuPanel} aria-hidden />
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
        <div className={styles.heroTag}>
          <span className={styles.heroRule} aria-hidden />
          <p className={styles.heroLabel}>{hero.label.map((l) => <span key={l}>{l}</span>)}</p>
        </div>
        </div>
        </section>

        {/* --------------------------- 서비스 카드 --------------------- */}
        <section className={styles.grid} aria-label="비즈네스타 서비스">
          {cards.map((s, i) => {
            const [x, y, w, h] = CARD_BOX[i];
            return (
              <article key={s.serviceId}
                       className={[styles.card, styles[`r${CARD_ROW[i]}`],
                                   s.tone === 'dark' ? styles.dark : ''].join(' ')}
                       style={{ left: u(x), top: u(y), width: u(w), height: u(h),
                                ...(NAME_LS[i] ?? {}) } as React.CSSProperties}>
                <picture>
                  <source srcSet={s.image.webp} type="image/webp" />
                  <img className={styles.cardImg} src={s.image.jpg} alt={s.image.alt}
                       width={w} height={h} loading="lazy" />
                </picture>
                <span className={styles.num}>{s.num}</span>
                <h2 className={styles.name}>{s.serviceName}</h2>
                <p className={styles.label}>{s.label}</p>
                <p className={styles.desc}>{s.description.map((d) => <span key={d}>{d}</span>)}</p>
                {/* 카드 전체가 링크다. "자세히 보기" 버튼을 없앤 대신 이 링크가
                    카드의 정식 링크가 되어 이름과 키보드 초점을 갖는다. */}
                <Link href={SERVICE_ROUTE[s.slug] ?? s.ctaHref ?? consultHref('service', { service: s.slug })}
                      className={styles.tapArea}
                      aria-label={`${s.serviceName} ${s.ctaLabel}`} />
              </article>
            );
          })}
        </section>

        {/* -------------------------- band --------------------------- */}
        <section className={styles.close} aria-label="서비스 상담 안내">
          <div className={styles.bandBox}>
          <picture>
            <source srcSet="/assets/mo12/band.webp" type="image/webp" />
            <img className={styles.bandImg} src="/assets/mo12/band.jpg" alt=""
                 width={956} height={193} loading="lazy" />
          </picture>
          <div className={styles.bnCol}>
            <h2 className={styles.bandQuote}>{band.quote.map((q) => <span key={q}>{q}</span>)}</h2>
            <p className={styles.bandBody}>{band.body}</p>
            <p className={styles.bandLabel}>{band.label}</p>
          </div>
          <Link href={band.cta.href} className={styles.bandCta}>
            <span className={styles.bandCtaLabel}>{band.cta.label}</span>
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
