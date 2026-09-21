import Link from 'next/link';
import { mo16 } from '@/data/mo16';
import { ArrowRight } from '@/components/shared/Arrows';
import {
  ChatIcon, DocIcon, KakaoIcon, MailIcon, PeopleIcon, PhoneIcon, PinIcon,
} from '@/components/shared/LineIcons';
import type { ConsultationContext } from '@/data/navigation';
import styles from './Mo16.module.css';
import MobileMenu from '@/components/site/MobileMenu';

/** Measured off BN_MO_16_CONTACT.png, in 1024-wide artwork coordinates. */
const CARD_X = [35, 277, 519, 761];
const SUP_X = [153, 423, 685];
/** hairlines the artwork draws between the three support items */
const SEP_X = [365, 625];

const CARD_ICONS = { phone: PhoneIcon, kakao: KakaoIcon, mail: MailIcon, pin: PinIcon };
const SUP_ICONS = { chat: ChatIcon, doc: DocIcon, people: PeopleIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

/**
 * slice — CONTACT route 에서만 쓴다.
 *   'full'   지금까지와 같은 한 장짜리 화면 (/review/mo-16 포함 기본값)
 *   'top'    hero + 상담 채널 카드 (아트워크 0~778 unit)
 *   'bottom' 마무리 밴드 + support (아트워크 1160~1536 unit)
 * 사이에 real-size 상담 폼이 들어간다. 화면 구성 자체는 바뀌지 않는다.
 */
export type Mo16Slice = 'full' | 'top' | 'bottom';


/** 확정된 연락처만 누를 수 있게 만든다. 안내 문구는 그대로 글자로 둔다. */
function contactHref(value: string) {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return `mailto:${value}`;
  if (/^[0-9][0-9-]{7,}$/.test(value)) return `tel:${value.replace(/-/g, '')}`;
  return null;
}

export default function Mo16({
  context = {},
  slice = 'full',
}: { context?: ConsultationContext; slice?: Mo16Slice }) {
  const { header, hero, cards, form, band, support } = mo16;
  const items = cards.filter((c) => c.visible).sort((a, b) => a.order - b.order);

  const showTop = slice !== 'bottom';
  const showForm = slice === 'full';
  const showBottom = slice !== 'top';

  const content = (
    <>
        {/* the photographs and the gold script are the artwork; every word over
            them is markup, and no contact value is published — see data/mo16 */}
        {/* --------------------------- 히어로 --------------------------- */}
        <section className={styles.hero}>
        <picture>
          <source srcSet={hero.image.webp} type="image/webp" />
          <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
               width={1024} height={508} fetchPriority="high" />
        </picture>

        <span className={styles.menuPanel} aria-hidden />
        <Link href="/" className={styles.logo} aria-label="BIZNESTA 홈으로">
          <img src={header.logo.src} alt={header.logo.alt} width={226} height={56} />
        </Link>
        <MobileMenu
          cls={{ btn: styles.menuBtn, burger: styles.burger, label: styles.menuLabel }}
          label={header.menuLabel}
        />

        <div className={styles.heroCap}>
        <p className={styles.eyebrow}>{hero.eyebrow}</p>
        <h1 className={styles.headline}>
          <span>{hero.headline[0]}</span>
          <span className={styles.gold}>{hero.headline[1]}</span>
        </h1>
        <p className={styles.body}>{hero.body.map((b) => <span key={b}>{b}</span>)}</p>
        <div className={styles.heroTag}>
          <span className={styles.heroRule} aria-hidden />
          <p className={styles.heroLabel}>{hero.label.map((l) => <span key={l}>{l}</span>)}</p>
        </div>
        </div>
        </section>

        {/* --------------------------- 상담 채널 ---------------------- */}
        <section className={styles.cards} aria-label="상담 채널 안내">
          {items.map((c, i) => {
            const Icon = CARD_ICONS[c.icon];
            return (
              <article key={c.cardId} className={styles.card} style={{ left: u(CARD_X[i]) }}>
                <span className={styles.disc} aria-hidden />
                <span className={styles.cardIcon} aria-hidden><Icon /></span>
                <h2 className={styles.cardTitle}>{c.title}</h2>
                {/* not a real number until BIZNESTA confirms one — see data/mo16 */}
                {c.value && (() => {
                  const href = contactHref(c.value);
                  /* 이메일처럼 긴 값은 카드 폭을 넘기므로 그 값에만 크기를 맞춘다 */
                  const cls = [styles.cardValue, c.value.length > 16 ? styles.cardValueLong : '']
                    .filter(Boolean).join(' ');
                  return href
                    ? <a className={cls} href={href}>{c.value}</a>
                    : <p className={cls}>{c.value}</p>;
                })()}
                {c.lines && (
                  <p className={[styles.cardLines,
                    c.lines.some((l) => l.length > 12) ? styles.cardLinesLong : '']
                    .filter(Boolean).join(' ')}>
                    {c.lines.map((l) => <span key={l}>{l}</span>)}
                  </p>
                )}
                {c.notes && (
                  <p className={styles.cardNotes}>
                    {c.notes.map((n) => <span key={n}>{n}</span>)}
                  </p>
                )}
                {c.button && (() => {
                  const btnCls = [styles.cardBtn,
                    c.button.tone === 'solid' ? styles.solid : styles.outline].join(' ');
                  /* 카카오맵처럼 사이트 밖으로 나가는 링크는 새 탭으로 연다 */
                  if (c.button.external) return (
                    <a className={btnCls} href={c.button.href}
                       target="_blank" rel="noopener noreferrer">
                      <span>{c.button.label}</span>
                      <ArrowRight />
                    </a>
                  );
                  return (
                  <Link href={c.button.href} className={btnCls}>
                    <span>{c.button.label}</span>
                    <ArrowRight />
                  </Link>
                  );
                })()}
              </article>
            );
          })}
        </section>

    </>
  );

  const formSection = (
    <section className={styles.form} aria-label="1:1 맞춤 상담 신청">
          <span className={styles.formPanel} aria-hidden />
          <picture>
            <source srcSet={form.image.webp} type="image/webp" />
            <img className={styles.formImg} src={form.image.jpg} alt={form.image.alt}
                 width={400} height={385} loading="lazy" />
          </picture>
          <h2 id="form" className={styles.formTitle}>{form.title}</h2>
          <p className={styles.formSub}>{form.sub.map((s) => <span key={s}>{s}</span>)}</p>

          {/* UI only — no submit handler, no storage, no mail. See data/mo16. */}
          <div className={styles.formFields}>
            {/* 상담 맥락 — 어디에서 들어왔는지. 화면에 보이지 않으며 아직
                저장하지 않는다. 다음 단계 inquiry 구현에서 그대로 쓴다. */}
            {Object.entries(context).map(([k, v]) =>
              v ? <input key={k} type="hidden" name={k} value={v} readOnly /> : null)}
            <input className={`${styles.field} ${styles.half} ${styles.f1}`} type="text"
                   placeholder={form.fields.name} aria-label={form.fields.name} />
            <input className={`${styles.field} ${styles.half} ${styles.f2}`} type="text"
                   placeholder={form.fields.contact} aria-label={form.fields.contact} />
            <select className={`${styles.field} ${styles.f3}`} defaultValue=""
                    aria-label={form.fields.kind}>
              <option value="" disabled>{form.fields.kind}</option>
              {form.fields.kindOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <textarea className={`${styles.field} ${styles.f4}`}
                      placeholder={form.fields.message} aria-label={form.fields.message} />
            <span className={styles.counter} aria-hidden>{form.fields.counter}</span>
            <label className={styles.consent}>
              <input type="checkbox" />
              <span className={styles.consentLabel}>
                {form.consent.label} <em>{form.consent.required}</em>
              </span>
            </label>
            <Link href={form.consent.more.href} className={styles.consentMore}>
              {form.consent.more.label} &rsaquo;
            </Link>
            <button type="button" className={styles.submit}>
              <span>{form.submit}</span>
              <ArrowRight />
            </button>
          </div>
        </section>

  );

  const bottom = (
    <>
      {/* --------------------------- band -------------------------- */}
      <section className={styles.bandSec} aria-label="비즈네스타와 시작하기">
          <picture>
            <source srcSet={band.image.webp} type="image/webp" />
            <img className={styles.bandImg} src={band.image.jpg} alt={band.image.alt}
                 width={1024} height={224} loading="lazy" />
          </picture>
          <h2 className={styles.bandHead}>{band.headline.map((h) => <span key={h}>{h}</span>)}</h2>
          <p className={styles.bandSub}>{band.sub}</p>
          <p className={styles.bandLabel}>{band.label.map((l) => <span key={l}>{l}</span>)}</p>
        </section>

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
    </>
  );

  const body = (
    <>
      {showTop && content}
      {showForm && formSection}
      {showBottom && bottom}
    </>
  );

  const innerCls = [styles.inner,
    slice === 'top' ? styles.sliceTop : '',
    slice === 'bottom' ? styles.sliceBottom : ''].filter(Boolean).join(' ');

  return (
    <div className={styles.stage}>
      <div className={innerCls}>
        {slice === 'bottom' ? <div className={styles.plane}>{body}</div> : body}
      </div>
    </div>
  );
}
