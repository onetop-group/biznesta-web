import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { DeviceMockup } from '@/components/ui/DeviceMockup';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ScriptAccent } from '@/components/ui/ScriptAccent';
import { VerticalKeywords } from '@/components/blocks/VerticalKeywords';
import { ShowroomStage } from '@/components/blocks/ShowroomStage';
import { CategoryCard } from '@/components/category/CategoryCard';
import { brandMessage } from '@/data/site';
import { visibleCategories } from '@/data/categories';
import { getDesign } from '@/data/designs';

/**
 * 메인 — Phase 3-A 범위
 *   BN_PC_01_HERO          → CINEMATIC INTRO
 *   BN_PC_02_BRAND_MESSAGE → ARCHITECTURAL SHOWROOM
 *   유형 미리보기 (전체는 /category)
 *
 * PC 09~16 은 Phase 3-B 에서 붙입니다.
 */

const HERO_POINTS: Array<{ icon: IconName; value?: string; label: string; sub: string }> = [
  {
    icon: 'monitor',
    /* categories 실제 개수에서 계산합니다 — 임의 수치가 아닙니다 */
    value: String(visibleCategories.length),
    label: '홈페이지 유형',
    sub: '업종과 목적에 맞는 유형',
  },
  { icon: 'diamond', label: '맞춤 솔루션', sub: '당신의 사업에 꼭 맞는 설계' },
  { icon: 'gear', label: '운영까지 함께', sub: '관리자 시스템을 함께 설계' },
  { icon: 'chart', label: '성장하는 파트너', sub: '제작 이후에도 계속 지원' },
];

const PILLARS: Array<{ icon: IconName; title: string; body: string[] }> = [
  { icon: 'diamond', title: 'DESIGN', body: ['당신의 브랜드를', '가장 잘 보여주는 디자인'] },
  { icon: 'doc', title: 'CONTENT', body: ['고객이 찾아오는', '콘텐츠 구조'] },
  { icon: 'gear', title: 'SYSTEM', body: ['문의 · 예약 · 회원 등', '필요한 기능과 관리자 시스템'] },
  { icon: 'chart', title: 'GROWTH', body: ['지속적인 성장을 위한', '온라인 비즈니스 기반'] },
];

export default function HomePage() {
  /* Phase 7 이후 designs.is_featured 로 관리자가 직접 고릅니다 */
  const heroDesign = getDesign('corporate-001');
  const heroBehind = getDesign('education-001');
  const previewCategories = visibleCategories.slice(0, 5);

  return (
    <>
      {/* ══ BN_PC_01 · HERO — CINEMATIC INTRO ═════════════════════ */}
      <section aria-label="비즈네스타 소개" className="relative overflow-hidden bg-ivory-soft">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-[8%] -top-[38%] size-[76%] rounded-full opacity-60 blur-[130px]"
          style={{ background: 'radial-gradient(circle, #E9D4B2 0%, rgba(233,212,178,0) 68%)' }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-[16%] bottom-[-24%] size-[50%] rounded-full opacity-45 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #E4E9EF 0%, rgba(228,233,239,0) 70%)' }}
        />

        <Container>
          <div className="relative grid items-center gap-14 pb-20 pt-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 lg:pb-28 lg:pt-20 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.1fr)_auto] xl:gap-14">
            <div className="max-w-[600px]">
              <p className="u-eyebrow text-[11px] font-semibold text-gold-deep lg:text-[12px]">
                Your Business, A Brighter Tomorrow
              </p>

              <h1 className="mt-7 text-[32px] font-bold leading-[1.28] tracking-[-0.035em] sm:text-[38px] lg:mt-8 lg:text-[42px] xl:text-[46px]">
                <span className="block whitespace-nowrap">홈페이지가 필요하신가요?</span>
                <span className="mt-2 block whitespace-nowrap text-gold-deep">
                  아니면 고객이 들어오는
                </span>
                <span className="block whitespace-nowrap text-gold-deep">
                  시스템이 필요하신가요?
                </span>
              </h1>

              <div className="mt-8 max-w-[440px] lg:mt-10">
                <p className="text-[17px] font-semibold leading-[1.6] text-navy lg:text-[19px]">
                  {brandMessage.positioning}
                </p>
                <p className="mt-3.5 text-[15px] leading-[1.9] text-ink-2">
                  비즈네스타는 디자인 · 콘텐츠 · 시스템을 연결해
                  <br />
                  당신의 비즈니스에 필요한 홈페이지를 맞춤 제작합니다.
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row lg:mt-12">
                <Button href="/design" size="lg" arrow>
                  홈페이지 디자인 보기
                </Button>
                <Button href="/contact" variant="outline" size="lg" arrow>
                  맞춤 제작 상담
                </Button>
              </div>

              <div className="mt-14 hidden items-center gap-4 lg:flex">
                <span className="u-eyebrow text-[10px] font-semibold text-muted">Scroll</span>
                <span className="h-px w-16 bg-line-gold" />
                <span
                  aria-hidden="true"
                  className="flex size-9 items-center justify-center rounded-full border border-line-gold text-[13px] text-gold-deep"
                >
                  ↓
                </span>
              </div>
            </div>

            {/* 3단 깊이의 목업 — 앞/중간/뒤 */}
            <div className="relative">
              <ScriptAccent lines={['More Than a Website']} size="sm" className="mb-6 lg:mb-8" />
              {heroDesign && (
                <DeviceMockup
                  source={{ design: heroDesign }}
                  behind={heroBehind}
                  variant="stack"
                  className="w-full"
                  phoneScale={0.235}
                />
              )}
            </div>

            <VerticalKeywords
              words={['Website', 'Design', 'Content', 'System', 'For a', 'Better', 'Tomorrow']}
              className="border-l border-line pl-8"
            />
          </div>
        </Container>

        <div className="on-navy relative bg-navy text-white">
          <Container>
            <div className="grid gap-8 py-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:py-11">
              {HERO_POINTS.map((point) => (
                <div key={point.label} className="flex items-start gap-4">
                  <Icon name={point.icon} size={26} className="mt-0.5 shrink-0 text-gold" />
                  <div>
                    <p className="flex items-baseline gap-1.5">
                      {point.value && (
                        <span className="font-display text-[26px] font-bold leading-none">
                          {point.value}
                        </span>
                      )}
                      <span className="text-[15px] font-semibold">{point.label}</span>
                    </p>
                    <p className="mt-1.5 text-[13px] leading-[1.6] text-white/60">{point.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </section>

      {/* ══ BN_PC_02 · BRAND MESSAGE — ARCHITECTURAL SHOWROOM ═════ */}
      <section
        aria-label="브랜드 메시지"
        className="on-navy relative overflow-hidden bg-navy text-white"
        style={{
          backgroundImage:
            'radial-gradient(100% 78% at 66% 36%, rgba(48,82,120,0.55) 0%, rgba(15,38,66,0.7) 34%, #0B1D33 64%, #050F1B 100%)',
        }}
      >
        <Container>
          <div className="grid gap-10 py-16 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center lg:gap-12 lg:py-24 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)_auto] xl:gap-12">
            <div className="max-w-[500px]">
              <p className="u-eyebrow text-[11px] font-semibold text-gold lg:text-[12px]">
                Brand Message
              </p>

              <h2 className="mt-7 text-[30px] font-bold leading-[1.28] tracking-[-0.035em] sm:text-[36px] lg:mt-8 lg:text-[44px]">
                <span className="block">{brandMessage.main[0]}</span>
                <span className="block text-gold">{brandMessage.main[1]}</span>
              </h2>

              <p className="mt-8 text-[15px] leading-[1.95] text-white/65 lg:mt-9">
                홈페이지는 단순한 웹사이트가 아닙니다.
                <br />
                당신의 비즈니스를 더 크게 성장시키는
                <br />
                가장 강력한 비즈니스 자산입니다.
              </p>

              <p className="mt-7 border-l border-gold/45 pl-6 text-[15px] leading-[1.9] text-white/85">
                비즈네스타는 디자인 · 콘텐츠 · 시스템을 연결하여
                <br />
                당신의 비즈니스에 필요한 홈페이지를 맞춤 제작합니다.
              </p>

              <ScriptAccent lines={['More', 'Tomorrow']} size="lg" className="mt-12" />
            </div>

            <ShowroomStage />

            <VerticalKeywords
              words={['Design', 'Content', 'System', 'Marketing', 'For a', 'Brighter', 'Tomorrow']}
              tone="dark"
              className="self-center border-l border-navy-line/70 pl-8"
            />
          </div>
        </Container>

        <div className="border-t border-navy-line/60 bg-[#050F1B]/60">
          <Container>
            <ul className="grid gap-x-10 gap-y-8 py-11 sm:grid-cols-2 lg:grid-cols-4 lg:py-14">
              {PILLARS.map((pillar, index) => (
                <li
                  key={pillar.title}
                  className={index > 0 ? 'lg:border-l lg:border-navy-line/70 lg:pl-10' : undefined}
                >
                  <Icon name={pillar.icon} size={28} className="text-gold" />
                  <p className="u-eyebrow-tight mt-5 text-[14px] font-bold">{pillar.title}</p>
                  <p className="mt-2.5 text-[13px] leading-[1.75] text-white/55">
                    {pillar.body.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </div>
      </section>

      {/* ══ 유형 미리보기 ═════════════════════════════════════════ */}
      <Section tone="ivory" padding="lg" ariaLabel="홈페이지 유형 미리보기">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-[520px]">
            <p className="u-eyebrow text-[11px] font-semibold text-gold-deep lg:text-[12px]">
              Website Category
            </p>
            <h2 className="mt-5 text-[28px] font-bold leading-[1.3] tracking-[-0.03em] lg:text-[38px]">
              <span className="block">어떤 홈페이지를</span>
              <span className="block text-gold-deep">찾고 계신가요?</span>
            </h2>
            <p className="mt-6 text-[15px] leading-[1.85] text-ink-2">
              업종도, 목적도, 스타일도 다르니까.
              <br />
              비즈네스타가 가장 잘 맞는 홈페이지를 제안합니다.
            </p>
          </div>

          <Link
            href="/category"
            className="u-eyebrow-tight group inline-flex shrink-0 items-center gap-3 text-[12px] font-semibold text-navy"
          >
            {visibleCategories.length}개 유형 전체 보기
            <span
              aria-hidden="true"
              className="flex size-10 items-center justify-center rounded-full border border-line-gold text-gold-deep transition-all group-hover:bg-gold group-hover:text-navy"
            >
              →
            </span>
          </Link>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {previewCategories.map((category) => (
            <li key={category.slug}>
              <CategoryCard category={category} />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
