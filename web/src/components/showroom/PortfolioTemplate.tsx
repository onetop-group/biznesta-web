import Link from 'next/link';
import { ArrowRight } from '@/components/shared/Arrows';
import {
  ALL_FILTER, SHOWROOM_CATEGORIES, categoryHref, designsIn, getCategory,
} from '@/data/showroom';
import { consultHref } from '@/data/navigation';
import ZoomImage from './ZoomImage';
import styles from './Portfolio.module.css';

/**
 * BIZNESTA WEB PORTFOLIO — 카테고리 안쪽 화면.
 *
 * 첨부된 포트폴리오 시안과 승인된 PC05 CATEGORY DETAIL 의 디자인 언어를 따른다:
 *   짙은 네이비 히어로(BIZNESTA 공간 사진) → PORTFOLIO 섹션 → 아이보리 배경
 *   2열 작품(번호 · 제목 · PC + 모바일 · 소개문 · VIEW MORE) → 마무리 상담 패널.
 *
 * 8개 카테고리(+ 전체 보기)가 모두 이 하나의 파일을 쓴다. 카테고리마다 화면을
 * 따로 두지 않으므로, 작품이 늘어도 showroom.ts 한 줄만 더하면 반영된다.
 *
 * 작품 자료 · 제목 · 소개문 · 짝 · 크게 보기는 앞서 완성한 그대로 쓴다.
 * 이미지는 자르지 않는다 — PC 와 모바일 모두 원본 비율 그대로 들어가고,
 * flex-grow 를 가로세로비로 주어 두 화면의 높이가 저절로 같아진다.
 */
export const PER_PAGE = 12;

/* 히어로에 쓰는 BIZNESTA 공간 사진 · 흰 워드마크 — 이미 승인된 자산이다.
   벽면에 BIZNESTA 로고가 걸린 리셉션 사진(16 CONTACT 히어로)을 그대로 쓴다. */
const HERO_IMG = '/assets/pc16/hero.jpg';
const HERO_IMG_WEBP = '/assets/pc16/hero.webp';
const WORDMARK = '/assets/pc05/logo-wordmark-white.png';

const KEYS = [
  { name: 'BRAND', note: 'Identity' },
  { name: 'DESIGN', note: 'Creative' },
  { name: 'BUSINESS', note: 'Growth' },
];

export default function PortfolioTemplate({ categoryId, page }: { categoryId: string; page: number }) {
  const all = designsIn(categoryId);
  const isAll = categoryId === ALL_FILTER.id;
  const category = getCategory(categoryId);
  const pages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const current = Math.min(Math.max(1, page), pages);
  const shown = all.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const title = isAll ? '전체 디자인' : (category?.name ?? '디자인');
  const sub = isAll ? '업종별로 모은 BIZNESTA 홈페이지 디자인' : category?.desc;
  /* 8개 카테고리가 같은 문장을 쓰고 카테고리명만 바뀐다. */
  const portfolioNote = isAll
    ? 'BIZNESTA가 제안하는 홈페이지 디자인 샘플을 만나보세요.'
    : `BIZNESTA가 제안하는 ${title} 홈페이지 디자인 샘플을 만나보세요.`;

  return (
    <main className={styles.page}>
      {/* ----------------------------- 히어로 ----------------------------- */}
      <section className={styles.hero} aria-label={`${title} 포트폴리오`}>
        <picture>
          <source srcSet={HERO_IMG_WEBP} type="image/webp" />
          <img className={styles.heroImg} src={HERO_IMG} alt=""
               width={1536} height={401} fetchPriority="high" />
        </picture>
        <span className={styles.heroVeil} aria-hidden />

        <div className={styles.heroInner}>
          <div className={styles.heroTop}>
            <Link href="/" className={styles.heroBrand} aria-label="BIZNESTA 홈으로">
              <img src={WORDMARK} alt="BIZNESTA" width={180} height={33} />
            </Link>
            <Link href={consultHref('design', isAll ? {} : { category: categoryId })}
                  className={styles.heroCta}>
              제작 상담하기
              <ArrowRight />
            </Link>
          </div>

          <nav className={styles.crumb} aria-label="현재 위치">
            <Link href="/">홈</Link>
            <span aria-hidden>·</span>
            <Link href="/design">홈페이지 디자인</Link>
            <span aria-hidden>·</span>
            <span>{title}</span>
          </nav>

          <p className={styles.heroEyebrow}>WEB PORTFOLIO</p>
          <h1 className={styles.heroTitle}>{title}</h1>
          {sub && <p className={styles.heroSub}>{sub}</p>}
          <p className={styles.heroDesc}>
            BIZNESTA가 제작한 홈페이지 디자인을 PC와 모바일 화면 그대로 보여드립니다.
          </p>

          <div className={styles.heroKeys}>
            {KEYS.map((k) => (
              <span key={k.name} className={styles.heroKey}>
                <span className={styles.heroKeyName}>{k.name}</span>
                <span className={styles.heroKeyNote}>{k.note}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------- 카테고리 이동 --------------------------
          히어로와 작품 사이. 지금 보고 있는 카테고리는 짙은 네이비다. */}
      <nav className={styles.catNav} aria-label="디자인 카테고리">
        <div className={styles.catNavInner}>
          <Link href={categoryHref(ALL_FILTER.id)}
                className={`${styles.catLink} ${isAll ? styles.catOn : ''}`}
                aria-current={isAll ? 'page' : undefined}>
            {ALL_FILTER.name}
          </Link>
          {[...SHOWROOM_CATEGORIES].sort((a, b) => a.no - b.no).map((c) => (
            <Link key={c.id} href={categoryHref(c.id)}
                  className={`${styles.catLink} ${c.id === categoryId ? styles.catOn : ''}`}
                  aria-current={c.id === categoryId ? 'page' : undefined}>
              {c.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* ---------------------------- PORTFOLIO --------------------------- */}
      <div className={styles.wrap}>
        <header className={styles.sectionHead}>
          <div>
            <p className={styles.sectionEyebrow}>PORTFOLIO</p>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <p className={styles.sectionNote}>{portfolioNote}</p>
          </div>
          <div className={styles.sectionCount}>
            <span className={styles.countNum}>{String(all.length).padStart(2, '0')}</span>
            <span className={styles.countLabel}>
              WEBSITE<br />PORTFOLIO
            </span>
          </div>
        </header>

        <div className={styles.grid}>
          {shown.map((d, i) => {
            const pcRatio = d.pc.width / d.pc.height;
            const moRatio = d.mo.width / d.mo.height;
            const cat = getCategory(d.category);
            return (
              <article key={d.id} className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.cardNo}>{String(d.order).padStart(2, '0')}</span>
                  <h3 className={styles.cardName}>
                    <Link href={`/design/portfolio/${d.id}`}>{d.title}</Link>
                  </h3>
                  <span className={styles.cardLabel}>{cat?.label}</span>
                </div>

                <div className={styles.shots}>
                  <ZoomImage image={d.pc} alt={`${d.title} PC 화면`}
                             caption={`${d.title} — PC DESIGN`}
                             className={styles.shotPc} style={{ flex: `${pcRatio} 1 0` }}
                             variant="pc" eager={i < 2} />
                  <ZoomImage image={d.mo} alt={`${d.title} 모바일 화면`}
                             caption={`${d.title} — MOBILE DESIGN`}
                             className={styles.shotMo} style={{ flex: `${moRatio} 1 0` }}
                             variant="mo" eager={i < 2} />
                </div>

                <p className={styles.cardDesc}>{d.desc}</p>
                <div className={styles.cardFoot}>
                  <span className={styles.cardMeta}>PC + MOBILE DESIGN</span>
                  <Link href={`/design/portfolio/${d.id}`} className={styles.viewMore}>
                    VIEW MORE
                    <span className={styles.viewMoreDisc} aria-hidden><ArrowRight /></span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {pages > 1 && (
          <nav className={styles.pager} aria-label="포트폴리오 페이지">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Link key={n}
                    href={n === 1 ? categoryHref(categoryId) : `${categoryHref(categoryId)}?page=${n}`}
                    className={`${styles.pageLink} ${n === current ? styles.pageOn : ''}`}
                    aria-current={n === current ? 'page' : undefined}>
                {String(n).padStart(2, '0')}
              </Link>
            ))}
          </nav>
        )}

        {/* ------------------------- 마무리 상담 패널 ------------------------ */}
        <section className={styles.panel} aria-label="제작 상담 안내">
          <div className={styles.panelText}>
            <p className={styles.panelBrand}>BIZNESTA DESIGN PORTFOLIO</p>
            <p className={styles.panelTitle}>
              좋은 디자인은{' '}<br />좋은 비즈니스를 만듭니다.
            </p>
            <p className={styles.panelNote}>
              다양한 업종과 비즈니스 목적을 바탕으로{' '}<br />
              BIZNESTA가 기획·구성한 홈페이지 디자인 샘플입니다.{' '}<br />
              새로운 디자인과 구성은 지속적으로 업데이트되며,{' '}<br />
              실제 제작 시에는 고객의 브랜드와 사업 목적, 필요한 기능에 맞춰{' '}<br />
              하나의 비즈니스에 맞는 홈페이지로 새롭게 설계하여 제작합니다.
            </p>
          </div>
          <Link href={consultHref('design', isAll ? {} : { category: categoryId })}
                className={styles.panelCta}>
            제작 상담하기
            <ArrowRight />
          </Link>
        </section>
      </div>
    </main>
  );
}
