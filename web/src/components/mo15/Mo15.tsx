import Link from 'next/link';
import { ArrowRight } from '@/components/shared/Arrows';
import { ChatIcon, DocIcon, PeopleIcon } from '@/components/shared/LineIcons';
import { mo15 } from '@/data/mo15';
import MobileMenu from '@/components/site/MobileMenu';
import styles from './Mo15.module.css';

/**
 * BN_MO_15_ABOUT — 모바일 ABOUT.
 *
 * 시안(1024 x 1536)의 지면을 그대로 쓴다. 네 개의 면 — 히어로 사진 ·
 * 브랜드 사진 · 네이비 비전 밴드 · 마무리 패널 — 의 순서와 비율, 사진 위에
 * 라벨과 큰 제목을 얹는 편집 방식이 이 화면의 인상이므로 건드리지 않는다.
 *
 * 2026-09-09 손본 곳
 *   · 히어로 본문을 사진 아래 아이보리로 내렸다. 히어로의 짧은 금선이 함께
 *     내려가 별도 섹션이 아니라 히어로의 연장으로 읽힌다.
 *   · 본문을 짧게 줄였다(히어로 3줄→2줄, 브랜드 4줄→2줄). 브랜드 본문은
 *     사진 위 오버레이로 남는다 — 두 줄이면 노트북 · 책을 덮지 않는다.
 *   · 비전 밴드를 조금 키우고 우측의 세로 인용 · 라벨 묶음을 걷어냈다.
 *   · 마무리의 BIZNESTA 표기와 가로선을 걷어내고, 서브 문구가 사진 카드로
 *     넘어가지 않도록 폭을 묶었다.
 *
 * 구조
 *   네 개 섹션을 세로로 쌓고, 각 섹션 **안에서만** 시안 좌표를 쓴다.
 *   글이 들어가는 기둥(라벨 · 제목 · 본문 · 가치)은 흐름이라 실제 글 높이를
 *   그대로 차지하고, 섹션은 그만큼 자란다. 안드로이드에서 글자가 커지거나
 *   대체 글꼴이 쓰여도 다음 섹션이 스스로 아래로 밀려 겹치지 않는다.
 *   사진 · 메뉴 · 카드 · 구분선처럼 자리가 정해진 것은 그대로 절대 배치다.
 *
 * PC(Pc15)는 이 화면과 무관하며 FINAL LOCK 그대로다.
 */
const CARD_X = [411, 606, 805];
const CAP_CX = [501, 697, 894.5];
const SUP_X = [124, 391, 591];
const SEP_X = [333, 567];
const SUP_ICONS = { chat: ChatIcon, doc: DocIcon, people: PeopleIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

export default function Mo15() {
  const { header, hero, brand, vision, closing, cta, support } = mo15;
  const cards = closing.cards.filter((c) => c.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        {/* ---------------------------- 히어로 ---------------------------- */}
        <section className={styles.hero}>
          <div className={styles.heroTop}>
            <picture>
              <source srcSet={hero.image.webp} type="image/webp" />
              <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
                   width={1024} height={490} fetchPriority="high" />
            </picture>
            {/* 사진 위 글 뒤를 덮는 밝은 결 */}
            <span className={styles.heroWash} aria-hidden />
            <span className={styles.menuPanel} aria-hidden />
            <Link href="/" className={styles.logo} aria-label="BIZNESTA 홈으로">
              <img src={header.logo.src} alt={header.logo.alt} width={226} height={56} />
            </Link>
            <MobileMenu
              cls={{ btn: styles.menuBtn, burger: styles.burger, label: styles.menuLabel }}
              label={header.menuLabel}
            />
            {/* 사진 위에 남는 것은 라벨과 제목까지.
                둘은 한 기둥이라 라벨이 커지면 제목이 함께 내려간다. */}
            <div className={styles.heroCap}>
              <p className={styles.eyebrow}>{hero.eyebrow}</p>
              <h1 className={styles.headline}>
                {hero.headline.map((line, i) => (
                  <span key={line} className={i === hero.headline.length - 1 ? styles.gold : undefined}>
                    {line}
                  </span>
                ))}
              </h1>
              <span className={styles.heroRule} aria-hidden />
              <p className={styles.body}>
                {hero.body.map((line) => <span key={line}>{line}</span>)}
              </p>
            </div>
          </div>
        </section>

        {/* -------------------------- 브랜드 스토리 ------------------------- */}
        <section className={styles.brand}>
          <picture>
            <source srcSet={brand.image.webp} type="image/webp" />
            <img className={styles.brandImg} src={brand.image.jpg} alt={brand.image.alt}
                 width={1024} height={400} loading="lazy" />
          </picture>
          <div className={styles.brCol}>
            <p className={styles.brEyebrow}>{brand.eyebrow}</p>
            <h2 className={styles.brHead}>
              {brand.headline.map((line) => <span key={line}>{line}</span>)}
            </h2>
            <p className={styles.brBody}>
              {brand.body.map((line) => <span key={line}>{line}</span>)}
            </p>
            <ul className={styles.items}>
              {brand.items.map(([a, b]) => (
                <li key={a} className={styles.brItem}><span>{a}</span><span>{b}</span></li>
              ))}
            </ul>
          </div>
        </section>

        {/* ----------------------------- 비전 ----------------------------- */}
        <section className={styles.vision}>
          <picture>
            <source srcSet={vision.image.webp} type="image/webp" />
            <img className={styles.visImg} src={vision.image.jpg} alt={vision.image.alt}
                 width={1024} height={260} loading="lazy" />
          </picture>
          <div className={styles.vsCol}>
            <p className={styles.vsEyebrow}>{vision.eyebrow}</p>
            <h2 className={styles.vsHead}>
              {vision.headline.map((line) => <span key={line}>{line}</span>)}
            </h2>
            <p className={styles.vsBody}>
              {vision.body.map((line) => <span key={line}>{line}</span>)}
            </p>
          </div>
        </section>

        {/* ---------------------------- 마무리 ---------------------------- */}
        <section className={styles.ending}>
          <div className={styles.clRow}>
            <div className={styles.clPanel}>
              <span className={`${styles.mark} ${styles.markOpen}`} aria-hidden>“</span>
              {/* 닫는 따옴표는 글 끝에 붙는다 — 글 길이가 달라져도 겹치지 않는다 */}
              <p className={styles.clQuote}>
                {closing.quote.map((line, i) => (
                  <span key={line}>
                    {line}
                    {i === closing.quote.length - 1 && (
                      <em className={styles.markClose} aria-hidden>”</em>
                    )}
                  </span>
                ))}
              </p>
              <p className={styles.clSub}>
                {closing.sub.map((line) => <span key={line}>{line}</span>)}
              </p>
            </div>

            {cards.map((c, i) => (
              <picture key={c.id}>
                <source srcSet={c.image.webp} type="image/webp" />
                <img className={styles.card} src={c.image.jpg} alt={c.image.alt}
                     style={{ left: u(CARD_X[i]) }} width={179} height={158} loading="lazy" />
              </picture>
            ))}
            {cards.map((c, i) => (
              <p key={c.id} className={styles.caption} style={{ left: u(CAP_CX[i]) }}>{c.caption}</p>
            ))}
          </div>

          {/* 사용자 제공 시안 — 버튼과 상담 3종을 한 상자에 */}
          <div className={styles.ctaBox}>
          <Link href={cta.href} className={styles.cta}>
            <span className={styles.ctaLabel}>{cta.label}</span>
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
