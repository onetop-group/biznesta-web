import Link from 'next/link';
import { mo01 } from '@/data/mo01';
import { ArrowRight } from '@/components/shared/Arrows';
import { BarsIcon, MonitorIcon, PenIcon, ShareIcon } from '@/components/shared/LineIcons';
import styles from './Mo01.module.css';
import MobileMenu from '@/components/site/MobileMenu';

/** Measured off BN_MO_01_HERO.png, in 1024-wide artwork coordinates. */
const SERVICE_CX = [158, 394, 630, 866];
const SERVICE_DIV = [276, 512, 748];
const STANDARD_DIV = [313, 620];

const SERVICE_ICONS = { monitor: MonitorIcon, pen: PenIcon, share: ShareIcon, bars: BarsIcon };
const u = (n: number) => `calc(${n} * var(--s))`;

/**
 * 2026-09-09 — /about(MO15)에서 승인된 방식으로 구조만 안전화했다.
 * 네 면(히어로 사진 · 서비스 4열 · 메시지 밴드 · 기준 패널)의 순서 · 비율 ·
 * 사진 위 편집은 그대로다. 글이 들어가는 기둥만 흐름으로 바꿔, 안드로이드에서
 * 글자가 커지면 아래가 스스로 밀려나고 겹치지 않는다.
 */
export default function Mo01() {
  const { header, hero, services, band, standard, closing } = mo01;
  const items = services.filter((s) => s.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={styles.stage}>
      <div className={styles.inner}>
        {/* --------------------------- 히어로 --------------------------- */}
        <section className={styles.hero}>
          {/* 사진 — 폰 목업 · 책상 · 화분 · 금색 필기체는 전부 사진이다 */}
          <picture>
            <source srcSet={hero.image.webp} type="image/webp" />
            <img className={styles.heroImg} src={hero.image.jpg} alt={hero.image.alt}
                 width={1024} height={862} fetchPriority="high" />
          </picture>

          <Link href="/" className={styles.logo} aria-label="BIZNESTA 홈으로">
            <img src={header.logo.src} alt={header.logo.alt} width={258} height={64} />
          </Link>
          <MobileMenu
            cls={{ btn: styles.menuBtn, burger: styles.burger, label: styles.menuLabel }}
            label={header.menuLabel}
          />

          {/* 사진 위 한 기둥 — 제목이 늘면 본문과 버튼이 함께 내려간다 */}
          <div className={styles.heroCap}>
            <h1 className={styles.headline}>
              {hero.headline.map((l) => (
                <span key={l.text} className={l.tone === 'gold' ? styles.gold : undefined}>{l.text}</span>
              ))}
            </h1>
            <p className={styles.body}>{hero.body.map((b) => <span key={b}>{b}</span>)}</p>
          </div>

          {/* 사진 아래 아이보리로 내려온 버튼 — 사진 속 아이콘과 겹치지 않는다 */}
          <Link href={hero.cta.href} className={styles.heroCta}>
            <span className={styles.ctaLabel}>{hero.cta.label}</span>
            <ArrowRight />
          </Link>
        </section>

        {/* ------------------------- 서비스 4열 -------------------------- */}
        <section className={styles.services} aria-label="비즈네스타 서비스">
          {SERVICE_DIV.map((x) => (
            <span key={x} className={styles.svcDiv} style={{ left: u(x) }} aria-hidden />
          ))}
          {items.map((s, i) => {
            const Icon = SERVICE_ICONS[s.icon];
            return (
              <div key={s.id} className={styles.svc} style={{ left: u(SERVICE_CX[i]) }}>
                <span className={styles.svcIcon} aria-hidden><Icon /></span>
                <h2 className={styles.svcTitle}>{s.title}</h2>
                <p className={styles.svcSub}>{s.sub.map((t) => <span key={t}>{t}</span>)}</p>
              </div>
            );
          })}
        </section>

        {/* -------------------------- 메시지 밴드 ------------------------- */}
        <section className={styles.msg} aria-label="비즈네스타 메시지">
          <div className={styles.msgBox}>
            <picture>
              <source srcSet={band.image.webp} type="image/webp" />
              <img className={styles.bandImg} src={band.image.jpg} alt={band.image.alt}
                   width={926} height={197} loading="lazy" />
            </picture>
            <div className={styles.msgCol}>
            <p className={styles.bandQuote}>{band.quote.map((q) => <span key={q}>{q}</span>)}</p>
              <p className={styles.bandBrand}>{band.brand.map((b) => <span key={b}>{b}</span>)}</p>
            </div>
          </div>
        </section>

        {/* --------------------- 기준 패널 + 마무리 CTA -------------------- */}
        <section className={styles.close} aria-label="비즈네스타 기준">
          {/* 패널이 세 칸을 감싸므로 글자가 커지면 패널이 함께 자란다 */}
          <div className={styles.stdBox}>
            {STANDARD_DIV.map((x) => (
              <span key={x} className={styles.stdDiv} style={{ left: u(x) }} aria-hidden />
            ))}
            {standard.map((s) => (
              <div key={s.value} className={styles.std}>
                {/* 시안에 있던 미확인 수치는 쓰지 않는다 — src/data/mo01.ts 참조 */}
                <p className={styles.stdValue}>{s.value}</p>
                <p className={styles.stdLabel}>{s.label}</p>
              </div>
            ))}
          </div>
          <Link href={closing.href} className={styles.closeCta}>
            <span className={styles.ctaLabel}>{closing.label}</span>
            <ArrowRight />
          </Link>
        </section>
      </div>
    </div>
  );
}
