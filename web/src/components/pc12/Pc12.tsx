import Link from 'next/link';
import { pc12 } from '@/data/pc12';
import { ArrowRight } from '@/components/shared/Arrows';
import {
  BarsIcon, BulbIcon, DiamondIcon, DocIcon, GearIcon, HeadsetIcon,
  MonitorIcon, PenIcon, PeopleIcon, PlayIcon, ShareIcon,
} from '@/components/shared/LineIcons';
import { SERVICE_ROUTE, consultHref } from '@/data/navigation';
import styles from './Pc12.module.css';

/** Measured off BN_PC_12_SERVICE_SELECT.png, in 1536-wide artwork coordinates. */
const NAV_CENTER_X = [409.5, 537.5, 657, 777.5, 896.5, 1010, 1119];
const CARD_X = [54, 295, 535, 776, 1017, 1259];
const CARD_W = [226, 226, 227, 226, 227, 227];
const ADV_CX = [1011.5, 1120, 1229.5, 1341];
const BAND_CX = [581.5, 670, 760, 861.5, 961.5];

const CARD_ICONS = { monitor: MonitorIcon, pen: PenIcon, share: ShareIcon,
  gear: GearIcon, bars: BarsIcon, bulb: BulbIcon };
const ADV_ICONS = { diamond: DiamondIcon, people: PeopleIcon, doc: DocIcon, gear: GearIcon };
const BAND_ICONS = { monitor: MonitorIcon, share: ShareIcon, gear: GearIcon,
  play: PlayIcon, bulb: BulbIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

export default function Pc12() {
  const { header, hero, services, advisory, band } = pc12;
  const items = services.items.filter((s) => s.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1536} height={433} fetchPriority="high" />
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
          <span className={styles.headCream}>{hero.headline[1]}</span>
        </h1>
        <p className={styles.sub}>{hero.sub.map((s) => <span key={s}>{s}</span>)}</p>
        <span className={styles.engRule} aria-hidden />
        <p className={styles.engQuote}>{hero.englishQuote.map((q) => <span key={q}>{q}</span>)}</p>

        {/* ------------------------ services ------------------------- */}
        <section aria-label="제작 서비스 선택">
          <p className={styles.svcEyebrow}>{services.eyebrow}</p>
          {/* 제목 · 라인 · 설명은 좌표를 하나씩 못 박지 않고 한 행으로 묶는다.
              글꼴이 조금만 넓어져도(웹폰트 로드 전 대체글꼴 등) 서로 겹치기
              때문이다. 가운데 라인이 남는 폭을 흡수한다. */}
          <div className={styles.svcHead}>
            <h2 id="services" className={styles.svcTitle}>{services.title}</h2>
            <span className={styles.svcRule} aria-hidden />
            <p className={styles.svcNote}>{services.note}</p>
          </div>

          {items.map((s, i) => {
            const Icon = CARD_ICONS[s.icon];
            return (
              <article key={s.id} className={styles.card}
                       style={{ left: u(CARD_X[i]), width: u(CARD_W[i]) }}>
                <span className={styles.cardNumber}>{String(s.order).padStart(2, '0')}</span>
                <span className={styles.cardIcon} aria-hidden><Icon /></span>
                <h3 className={styles.cardTitle}>{s.title}</h3>
                <p className={styles.cardDesc}>
                  {s.desc.map((d) => <span key={d}>{d}</span>)}
                </p>
                <picture>
                  <source srcSet={s.artwork.webp} type="image/webp" />
                  <img className={styles.cardImg} src={s.artwork.jpg} alt={s.artwork.alt}
                       width={CARD_W[i]} height={112} loading="lazy" />
                </picture>
                {/* 카드 전체가 링크다. "자세히 보기" 버튼을 없앤 대신 이 링크가
                    카드의 정식 링크가 되어 이름과 키보드 초점을 갖는다. */}
                <Link href={SERVICE_ROUTE[s.slug] ?? consultHref('service', { service: s.slug })}
                      className={styles.tapArea}
                      aria-label={`${s.title} ${services.detailLabel}`} />
              </article>
            );
          })}
        </section>

        {/* ----------------------- advisory bar ---------------------- */}
        <section aria-label="맞춤 상담 안내">
          <span className={styles.advBar} aria-hidden />
          <span className={styles.advIcon} aria-hidden><HeadsetIcon /></span>
          <h2 className={styles.advTitle}>{advisory.title}</h2>
          <p className={styles.advDesc}>{advisory.desc}</p>
          <Link href={advisory.cta.href} className={styles.advCta}>
            <span className={styles.advCtaLabel}>{advisory.cta.label}</span>
            <ArrowRight />
          </Link>
          <span className={styles.advRule} aria-hidden />
          {advisory.points.map((p, i) => {
            const Icon = ADV_ICONS[p.icon];
            return (
              <span key={p.ko}>
                <span className={styles.advPointIcon} style={{ left: u(ADV_CX[i]) }} aria-hidden><Icon /></span>
                <span className={styles.advPointLabel} style={{ left: u(ADV_CX[i]) }}>{p.ko}</span>
              </span>
            );
          })}
        </section>

        {/* -------------------------- band --------------------------- */}
        <picture>
          <source srcSet={band.image.webp} type="image/webp" />
          <img className={styles.band} src={band.image.jpg} alt="" width={1536} height={94} loading="lazy" />
        </picture>
        <span className={styles.bandWordmark}>
          <img src={band.wordmark.src} alt={band.wordmark.alt}
               width={band.wordmark.width} height={band.wordmark.height} />
        </span>
        <span className={styles.bandTagline}>{band.tagline}</span>
        <p className={styles.bandQuote}>
          <span><span className={styles.quoteMark}>&ldquo;</span> {band.quote[0]}</span>
          <span>{band.quote[1]} <span className={styles.quoteMark}>&rdquo;</span></span>
        </p>
        {band.points.map((p, i) => {
          const Icon = BAND_ICONS[p.icon];
          return (
            <span key={p.ko}>
              <span className={styles.bandIcon} style={{ left: u(BAND_CX[i]) }} aria-hidden><Icon /></span>
              <span className={styles.bandLabel} style={{ left: u(BAND_CX[i]) }}>{p.ko}</span>
            </span>
          );
        })}
        <Link href={band.cta.href} className={styles.bandCta}>
          <span className={styles.bandCtaLabel}>{band.cta.label}</span>
          <ArrowRight />
        </Link>
        <p className={styles.bandKeywords}>{band.keywords.map((k) => <span key={k}>{k}</span>)}</p>
      </div>
    </div>
  );
}
