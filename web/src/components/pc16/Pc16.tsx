import Link from 'next/link';
import { pc16 } from '@/data/pc16';
import { ArrowRight } from '@/components/shared/Arrows';
import Pc16Form from './Pc16Form';
import LocationMap from '@/components/shared/LocationMap';
import {
  BarsIcon, CarIcon, ChatIcon, ClockIcon, GearIcon, KakaoIcon, MailIcon,
  MonitorIcon, PeopleIcon, PhoneIcon, PinIcon, ShareIcon, TrainIcon,
} from '@/components/shared/LineIcons';
import type { ConsultationContext } from '@/data/navigation';
import styles from './Pc16.module.css';

/** Measured off BN_PC_16_CONTACT.png, in 1536-wide artwork coordinates. */
const NAV_CENTER_X = [408, 537, 657, 775.5, 896, 1012, 1124.5];
const CARD_X = [60, 403, 773, 1137];
const CARD_W = [328, 355, 349, 339];
const BAND_CX = [605, 719.5, 836, 952.5, 1084];

const CARD_ICONS = { phone: PhoneIcon, kakao: KakaoIcon, mail: MailIcon, chat: ChatIcon };
const LOC_ICONS = { pin: PinIcon, train: TrainIcon, car: CarIcon, clock: ClockIcon };
const PANEL_ICONS = { monitor: MonitorIcon, gear: GearIcon, people: PeopleIcon, bars: BarsIcon };
const BAND_ICONS = { monitor: MonitorIcon, share: ShareIcon, gear: GearIcon, people: PeopleIcon, bars: BarsIcon };
const u = (n: number) => `calc(${n} * var(--s))`;


/** 확정된 연락처만 누를 수 있게 만든다. 안내 문구는 그대로 글자로 둔다. */
function contactHref(value: string) {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return `mailto:${value}`;
  if (/^[0-9][0-9-]{7,}$/.test(value)) return `tel:${value.replace(/-/g, '')}`;
  return null;
}

export default function Pc16({ context = {} }: { context?: ConsultationContext }) {
  const { header, hero, cards, form, location, panel, band } = pc16;
  const contactCards = cards.filter((c) => c.visible).sort((a, b) => a.order - b.order);
  const f = form.fields;

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1536} height={401} fetchPriority="high" />
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
        <span className={styles.engRule} aria-hidden />
        <p className={styles.engQuote}>{hero.englishQuote.map((q) => <span key={q}>{q}</span>)}</p>
        <p className={styles.heroPanelQuote}>{hero.panel.quote.map((q) => <span key={q}>{q}</span>)}</p>
        <p className={styles.heroPanelKeywords}>{hero.panel.keywords.map((k) => <span key={k}>{k}</span>)}</p>

        {/* ---------------------- contact cards ---------------------- */}
        <section aria-label="상담 채널 안내">
          {contactCards.map((c, i) => {
            const Icon = CARD_ICONS[c.icon];
            return (
              <article key={c.id} className={styles.card}
                       style={{ left: u(CARD_X[i]), width: u(CARD_W[i]) }}>
                <span className={styles.cardIcon} aria-hidden><Icon /></span>
                <h2 className={styles.cardTitle}>{c.title}</h2>
                {/* value slot — unconfirmed details are labelled, never invented */}
                {(() => {
                  /* 확정된 바깥 주소가 있으면 그것을 쓰고, 없을 때만 값에서 찾는다 */
                  const href = c.href ?? contactHref(c.value);
                  if (!href) return <p className={styles.cardValue}>{c.value}</p>;
                  /* 사이트 밖으로 나가는 링크는 새 탭으로 연다. 글자색은 원래
                     값 줄과 똑같이 두기 위해 .cardValueKeep 을 함께 건다. */
                  if (c.external) return (
                    <a className={`${styles.cardValue} ${styles.cardValueKeep}`} href={href}
                       target="_blank" rel="noopener noreferrer">{c.value}</a>
                  );
                  return <a className={styles.cardValue} href={href}>{c.value}</a>;
                })()}
                <p className={styles.cardNote}>{c.note}</p>
              </article>
            );
          })}
        </section>

        {/* --------------------- consultation form ------------------- */}
        <section aria-label="온라인 상담 신청">
          <span className={styles.formPanel} aria-hidden />
          <p className={styles.formEyebrow}>{form.eyebrow}</p>
          <h2 id="form" className={styles.formTitle}>{form.title}</h2>
          <p className={styles.formDesc}>{form.desc.map((d) => <span key={d}>{d}</span>)}</p>

          <Pc16Form context={context} />

          <picture>
            <source srcSet={form.script.webp} type="image/webp" />
            <img className={styles.formScript} src={form.script.jpg} alt={form.script.alt}
                 width={215} height={120} loading="lazy" />
          </picture>
          <span className={styles.formAsideDash} aria-hidden />
          <p className={styles.formAside}>{form.aside.map((a) => <span key={a}>{a}</span>)}</p>
        </section>

        {/* -------------------------- location ----------------------- */}
        <section aria-label="방문 상담 안내">
          <p className={styles.locEyebrow}>{location.eyebrow}</p>
          <h2 className={styles.locTitle}>{location.title}</h2>
          <p className={styles.locNote}>{location.note}</p>
          {/* 확정된 주소로 지도를 그린다. 카카오 지도 키가 등록되기 전까지는
              지도를 켜지 않고 자리와 카카오맵 링크만 둔다. */}
          <LocationMap className={styles.mapPlaceholder} label={location.mapPlaceholder} />
          <span className={styles.locPanel} aria-hidden />
          <ul className={styles.locList}>
            {location.rows.map((r) => {
              const Icon = LOC_ICONS[r.icon];
              return (
                <li key={r.text} className={styles.locRow}>
                  <span className={styles.locIcon} aria-hidden><Icon /></span>
                  <span className={styles.locText}>{r.text}</span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ------------------------ navy panel ----------------------- */}
        <section aria-label="비즈네스타 상담 안내">
          <span className={styles.panel} aria-hidden />
          <p className={styles.panelEyebrow}>{panel.eyebrow}</p>
          <h2 className={styles.panelTitle}>{panel.title.map((t) => <span key={t}>{t}</span>)}</h2>
          <p className={styles.panelDesc}>{panel.desc.map((d) => <span key={d}>{d}</span>)}</p>
          <ul className={styles.panelList}>
            {panel.items.map((p, i) => {
              const Icon = PANEL_ICONS[p.icon];
              return (
                <li key={p.ko} className={styles.panelRow} style={{ top: u(i * 30.7) }}>
                  <span className={styles.panelIcon} aria-hidden><Icon /></span>
                  <span>{p.ko}</span>
                </li>
              );
            })}
          </ul>
          <picture>
            <source srcSet={panel.script.webp} type="image/webp" />
            <img className={styles.panelScript} src={panel.script.jpg} alt={panel.script.alt}
                 width={175} height={60} loading="lazy" />
          </picture>
        </section>

        {/* -------------------------- band --------------------------- */}
        <picture>
          <source srcSet={band.image.webp} type="image/webp" />
          <img className={styles.band} src={band.image.jpg} alt="" width={1536} height={95} loading="lazy" />
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
        <p className={styles.bandCtaNote}>{band.ctaNote}</p>
      </div>
    </div>
  );
}
