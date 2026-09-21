import Link from 'next/link';
import { ArrowRight } from '@/components/shared/Arrows';
import { consultHref } from '@/data/navigation';
import { mo12 } from '@/data/mo12';
import { JOURNAL_CATEGORIES, JOURNAL_COPY, JOURNAL_STORIES, categoryLabel } from '@/data/journal';
import MobileMenu from '@/components/site/MobileMenu';
import styles from './JournalMo.module.css';

/**
 * BN_MO_JOURNAL — 공식 MOBILE VISUAL MASTER · **FINAL LOCK** (2026-09-08 승인).
 *
 * 레이아웃 · 좌표 · 이미지 · 크롭 · 타이포 · 색 · 여백 · 밀도를 바꾸지 않는다.
 * 앞으로 기능을 붙일 때도 **연결만** 하고 이 화면의 생김새는 그대로 둔다.
 *
 * PC 를 줄인 것이 아니라 따로 짠 지면이다. 1024 폭 기준으로 좌표를 적고 `--s`
 * 로 함께 줄인다(다른 모바일 화면과 같은 방식).
 *   히어로에서 BIZNESTA · JOURNAL 이 가장 먼저 읽히고, 사진은 오른쪽 배경으로
 *   물러선다. 저널 목록은 카드가 아니라 사진 + 글의 촘촘한 목록이다.
 *
 * 머리줄은 시안 속 메뉴가 아니라 이미 쓰고 있는 공식 모바일 머리줄이다
 * (로고 자물쇠 · 메뉴 버튼 · 좌표 그대로).
 */
const ROW_Y = [806, 990, 1210, 1394];
const u = (n: number) => `calc(${n} * var(--s))`;

export default function JournalMo() {
  const c = JOURNAL_COPY;

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        {/* ------------------------- 공식 머리줄 ------------------------- */}
        <div className={styles.headBand} aria-hidden />
        <Link href="/" className={styles.logo} aria-label="BIZNESTA 홈으로">
          <img src={mo12.header.logo.src} alt={mo12.header.logo.alt} width={225} height={56} />
        </Link>
        <MobileMenu
          cls={{ btn: styles.menuBtn, burger: styles.burger, label: styles.menuLabel }}
          label={mo12.header.menuLabel}
        />

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
        <p className={styles.headline}>
          {c.headline.map((line) => <span key={line}>{line}</span>)}
        </p>
        <p className={styles.body}>
          {c.body.map((line) => <span key={line}>{line}</span>)}
        </p>
        <span className={styles.smallRule} aria-hidden />
        <p className={styles.small}>
          {c.small.map((line) => <span key={line}>{line}</span>)}
        </p>

        {/* --------------------------- 분류 줄 --------------------------- */}
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

        {/* ------------------------ LATEST JOURNAL ----------------------- */}
        <p className={styles.listEyebrow}>{c.listEyebrow}</p>
        <h2 className={styles.listTitle}>{c.listTitle}</h2>
        <span className={styles.viewAll}>
          {c.viewAllShort}
          <ArrowRight />
        </span>

        {JOURNAL_STORIES.map((s, i) => (
          <article key={s.id} className={styles.row} style={{ top: u(ROW_Y[i]) }}>
            <span className={styles.rowShot}>
              <picture>
                <source srcSet={s.cover.webp} type="image/webp" />
                <img src={s.cover.jpg} alt={s.cover.alt}
                     style={{ objectPosition: s.cover.position }}
                     width={1536} height={470} loading={i < 2 ? undefined : 'lazy'} />
              </picture>
            </span>
            <span className={styles.rowText}>
              <span className={styles.rowCat}>{categoryLabel(s.category)}</span>
              <h3 className={styles.rowTitle}>
                {s.title.map((line) => <span key={line}>{line}</span>)}
              </h3>
              <span className={styles.rowMore}>
                {c.readMore}
                <ArrowRight />
              </span>
            </span>
            {i < JOURNAL_STORIES.length - 1 && <span className={styles.rowRule} aria-hidden />}
          </article>
        ))}

        {/* ---------------------------- 네이비 --------------------------- */}
        <div className={styles.band} />
        <p className={styles.bandLabel}>{c.band.label}</p>
        <p className={styles.bandTitle}>
          {c.band.title.map((line) => <span key={line}>{line}</span>)}
        </p>
        <p className={styles.bandNote}>{c.band.note.join(' ')}</p>
        <Link href={consultHref('journal')} className={styles.bandCta}>
          <span className={styles.ctaLabel}>{c.band.cta}</span>
          <ArrowRight />
        </Link>

      </div>
    </div>
  );
}
