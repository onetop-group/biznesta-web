import Link from 'next/link';
import { ArrowRight } from '@/components/shared/Arrows';
import { consultHref } from '@/data/navigation';
import { pc12 } from '@/data/pc12';
import { JOURNAL_CATEGORIES, JOURNAL_COPY, JOURNAL_STORIES, categoryLabel } from '@/data/journal';
import styles from './JournalPc.module.css';

/**
 * BN_PC_JOURNAL — 공식 PC VISUAL MASTER · **FINAL LOCK** (2026-09-08 승인).
 *
 * 레이아웃 · 좌표 · 이미지 · 크롭 · 타이포 · 색 · 여백 · 밀도를 바꾸지 않는다.
 * 앞으로 기능(글 데이터 · 분류 고르기 · 상세 이동)을 붙일 때도 **연결만** 하고
 * 이 화면의 생김새는 그대로 둔다.
 *
 * 1536 × 1024 한 장으로 끝난다. HEADER → JOURNAL HERO → CATEGORY →
 * LATEST JOURNAL → NAVY BAND 까지가 한 화면이고, 블로그처럼 아래로 길어지지
 * 않는다. 다른 PC 화면과 같은 방식으로 좌표를 1536 기준으로 적고 `--s` 로 함께
 * 줄인다.
 *
 * 머리줄은 시안 속 메뉴가 아니라 **이미 쓰고 있는 공식 Global Header** 다
 * (로고 · 7개 메뉴 · 제작 상담하기 · 좌표 · 타이포 그대로).
 *
 * 아직 이어붙이지 않은 것은 링크로 만들지 않는다 — 분류 · VIEW ALL JOURNAL ·
 * READ MORE 는 표시만 한다. 실제로 이어진 곳은 로고 · 공식 메뉴 · 상담 둘이다.
 */
const NAV_CENTER_X = [409.5, 537.5, 657, 777.5, 896.5, 1010, 1119];
/** 카드 4장의 왼쪽 좌표 (폭 278.75, 사이 22) */
const CARD_X = [281, 581.75, 882.5, 1183.25];
const BAND_KEY_Y = [920, 941, 962, 983];
const u = (n: number) => `calc(${n} * var(--s))`;

export default function JournalPc() {
  const { header } = pc12;
  const c = JOURNAL_COPY;

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        {/* ------------------------- 공식 머리줄 ------------------------- */}
        <div className={styles.headBand} aria-hidden />
        <Link href="/" className={styles.wordmark} aria-label="BIZNESTA 홈으로">
          <img src={header.wordmark.src} alt={header.wordmark.alt}
               width={header.wordmark.width} height={header.wordmark.height} />
        </Link>
        <span className={styles.headerTagline}>{header.tagline}</span>
        <nav aria-label="주 메뉴">
          {header.nav.map((item, i) => (
            <Link key={item.en} href={item.href} className={styles.navItem}
                  style={{ left: u(NAV_CENTER_X[i]) }}>
              <span className={styles.navEn}>{item.en}</span>
              <span className={styles.navKo}>{item.ko}</span>
            </Link>
          ))}
        </nav>
        <Link href={consultHref('journal')} className={styles.headerCta}>
          <span className={styles.ctaLabel}>{c.band.cta}</span>
          <ArrowRight />
        </Link>

        {/* ---------------------------- 히어로 --------------------------- */}
        <picture>
          <source srcSet="/assets/pc09/hero.webp" type="image/webp" />
          <img className={styles.heroImg} src="/assets/pc09/hero.jpg"
               alt="BIZNESTA 콘텐츠가 표시된 모니터와 태블릿이 놓인 업무 공간"
               width={1536} height={470} fetchPriority="high" />
        </picture>
        <span className={styles.heroVeil} aria-hidden />

        <p className={styles.brandLine}>{c.brandLine}</p>
        <h1 className={styles.journal}>
          <span className={styles.journalInk}>{c.wordmark}</span>
        </h1>

        <span className={styles.headRule} aria-hidden />
        <p className={styles.headline}>
          {c.headline.map((line) => <span key={line}>{line}</span>)}
        </p>
        <p className={styles.body}>
          {c.body.map((line) => <span key={line}>{line}</span>)}
        </p>
        <p className={styles.small}>
          {c.small.map((line) => <span key={line}>{line}</span>)}
        </p>

        {/* 오른쪽 네이비 판 */}
        <div className={styles.sidePanel}>
          <ul className={styles.sideKeys}>
            {c.keywords.map((k) => <li key={k}>{k}</li>)}
          </ul>
          <span className={styles.sideRule} aria-hidden />
          <p className={styles.sideQuote}>
            {c.quote.map((line) => <span key={line}>{line}</span>)}
          </p>
        </div>

        {/* --------------------------- 분류 줄 ---------------------------
            이번 단계에서는 고르는 기능을 붙이지 않는다. 모양만 세운다. */}
        <div className={styles.catBand} aria-hidden />
        <nav className={styles.cats} aria-label="저널 분류">
          {JOURNAL_CATEGORIES.map((k) => (
            <span key={k.id}
                  className={`${styles.cat} ${k.id === 'all' ? styles.catOn : ''}`}
                  aria-current={k.id === 'all' ? 'true' : undefined}>
              {k.label}
            </span>
          ))}
        </nav>
        <span className={styles.catDivider} aria-hidden />
        <p className={styles.catNote}>{c.catNote}</p>

        {/* ------------------------ LATEST JOURNAL ----------------------- */}
        <p className={styles.listEyebrow}>{c.listEyebrow}</p>
        <span className={styles.listRule} aria-hidden />
        <h2 className={styles.listTitle}>{c.listTitle}</h2>
        <span className={styles.viewAll}>
          {c.viewAll}
          <ArrowRight />
        </span>

        {JOURNAL_STORIES.map((s, i) => (
          <article key={s.id} className={styles.card} style={{ left: u(CARD_X[i]) }}>
            <span className={styles.cardShot}>
              <picture>
                <source srcSet={s.cover.webp} type="image/webp" />
                <img src={s.cover.jpg} alt={s.cover.alt}
                     style={{ objectPosition: s.cover.position }}
                     width={1536} height={470} loading={i < 2 ? undefined : 'lazy'} />
              </picture>
            </span>
            <span className={styles.cardCat}>{categoryLabel(s.category)}</span>
            <h3 className={styles.cardTitle}>
              {s.title.map((line) => <span key={line}>{line}</span>)}
            </h3>
            <span className={styles.cardMore}>
              {c.readMore}
              <ArrowRight />
            </span>
          </article>
        ))}

        {/* ---------------------------- 네이비 --------------------------- */}
        <div className={styles.band} />
        <span className={styles.bandLogo}>
          <img src="/assets/pc05/logo-wordmark-white.png" alt="BIZNESTA" width={152} height={28} />
        </span>
        <span className={styles.bandTagline}>{header.tagline}</span>

        <p className={styles.bandLabel}>{c.band.label}</p>
        <p className={styles.bandTitle}>
          {c.band.title.map((line) => <span key={line}>{line}</span>)}
        </p>
        <p className={styles.bandNote}>
          {c.band.note.map((line) => <span key={line}>{line}</span>)}
        </p>
        <Link href={consultHref('journal')} className={styles.bandCta}>
          <span className={styles.ctaLabel}>{c.band.cta}</span>
          <ArrowRight />
        </Link>
        {c.band.keywords.map((k, i) => (
          <span key={k} className={styles.bandKey} style={{ top: u(BAND_KEY_Y[i]) }}>{k}</span>
        ))}
      </div>
    </div>
  );
}
