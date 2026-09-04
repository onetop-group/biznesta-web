import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Button } from '@/components/ui/Button';
import { DeviceMockup } from '@/components/ui/DeviceMockup';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ScriptAccent } from '@/components/ui/ScriptAccent';
import { VerticalKeywords } from '@/components/blocks/VerticalKeywords';
import { FloatingMockupWall } from '@/components/blocks/FloatingMockupWall';
import { CategoryCard } from '@/components/category/CategoryCard';
import { brandMessage } from '@/data/site';
import { visibleCategories } from '@/data/categories';
import { designs } from '@/data/designs';

/**
 * 메인 — Phase 3-A 구현 범위
 *   · BN_PC_01_HERO
 *   · BN_PC_02_BRAND_MESSAGE
 *   · (유형 미리보기 — 전체는 /category)
 *
 * 나머지 홈 섹션(ADMIN SYSTEM · CONTENT GROWTH · SERVICE · PRICE 등)은
 * Phase 3-B 에서 BN_PC_09~16 과 함께 붙입니다.
 */

/** BN_PC_01 하단 네이비 스트립 */
const HERO_POINTS: Array<{ icon: IconName; value: string; label: string; sub: string }> = [
  {
    icon: 'monitor',
    /* 실제 categories 개수에서 계산합니다 — 임의 수치가 아닙니다 */
    value: `${visibleCategories.length}`,
    label: '홈페이지 유형',
    sub: '업종과 목적에 맞는 유형',
  },
  { icon: 'diamond', value: '', label: '맞춤 솔루션', sub: '당신의 사업에 꼭 맞는 설계' },
  { icon: 'gear', value: '', label: '운영까지 함께', sub: '관리자 시스템을 함께 설계' },
  { icon: 'chart', value: '', label: '성장하는 파트너', sub: '제작 이후에도 계속 지원' },
];

const PILLARS: Array<{ icon: IconName; title: string; body: string[] }> = [
  { icon: 'diamond', title: 'DESIGN', body: ['당신의 브랜드를', '가장 잘 보여주는 디자인'] },
  { icon: 'doc', title: 'CONTENT', body: ['고객이 찾아오는', '콘텐츠 구조'] },
  { icon: 'gear', title: 'SYSTEM', body: ['문의 · 예약 · 회원 등', '필요한 기능과 관리자 시스템'] },
  { icon: 'chart', title: 'GROWTH', body: ['지속적인 성장을 위한', '온라인 비즈니스 기반'] },
];

export default function HomePage() {
  const heroDesign = designs[0];
  const previewCategories = visibleCategories.slice(0, 5);

  return (
    <>
      {/* ══ BN_PC_01 · HERO ═══════════════════════════════════════ */}
      <section aria-label="비즈네스타 소개" className="relative overflow-hidden bg-ivory-soft">
        {/* 공간의 빛 — 우상단에서 들어오는 은은한 광원 */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-[10%] -top-[30%] size-[70%] rounded-full opacity-50 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #E4CDA9 0%, rgba(228,205,169,0) 70%)' }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[-15%] bottom-[-20%] size-[45%] rounded-full opacity-40 blur-[110px]"
          style={{ background: 'radial-gradient(circle, #EFE7DA 0%, rgba(239,231,218,0) 70%)' }}
        />

        <Container>
          <div className="relative grid items-center gap-12 pb-16 pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 lg:pb-20 lg:pt-16 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_auto] xl:gap-12">
            {/* 좌 — 카피 */}
            <div className="max-w-[640px]">
              <p className="u-eyebrow text-[11px] font-semibold text-gold-deep lg:text-[13px]">
                Your Business, A Brighter Tomorrow
              </p>

              <h1 className="mt-6 text-[32px] font-bold leading-[1.26] tracking-[-0.035em] sm:text-[38px] lg:mt-7 lg:text-[40px] xl:text-[44px]">
                <span className="block whitespace-nowrap">홈페이지가 필요하신가요?</span>
                <span className="mt-1.5 block whitespace-nowrap text-gold-deep">
                  아니면 고객이 들어오는
                </span>
                <span className="block whitespace-nowrap text-gold-deep">
                  시스템이 필요하신가요?
                </span>
              </h1>

              <p className="mt-7 text-[15px] leading-[1.85] text-ink-2 lg:mt-8 lg:text-[17px]">
                <span className="block font-semibold text-navy">{brandMessage.positioning}</span>
                <span className="mt-2 block">
                  비즈네스타는 디자인 · 콘텐츠 · 시스템까지 연결해
                </span>
                <span className="block">당신의 비즈니스에 필요한 홈페이지를 맞춤 제작합니다.</span>
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row lg:mt-11">
                <Button href="/design" size="lg" arrow>
                  홈페이지 디자인 보기
                </Button>
                <Button href="/contact" variant="outline" size="lg" arrow>
                  맞춤 제작 상담
                </Button>
              </div>

              {/* SCROLL DOWN — 시안 좌하단 */}
              <div className="mt-12 hidden items-center gap-4 lg:flex">
                <span className="u-eyebrow text-[10px] font-semibold text-muted">Scroll Down</span>
                <span className="h-px w-14 bg-line-gold" />
                <span
                  aria-hidden="true"
                  className="flex size-9 items-center justify-center rounded-full border border-line-gold text-[13px] text-gold-deep"
                >
                  ↓
                </span>
              </div>
            </div>

            {/* 중 — 디바이스 목업 */}
            <div className="relative">
              <ScriptAccent
                lines={['More Than a Website']}
                size="sm"
                className="mb-5 lg:mb-6"
              />
              <DeviceMockup
                source={{ palette: heroDesign.palette, layout: heroDesign.previewLayout }}
                variant="duo"
                className="w-full"
                phoneScale={0.27}
              />
            </div>

            {/* 우 — 세로 키워드 */}
            <VerticalKeywords
              words={['Website', 'Design', 'For a', 'Better', 'Tomorrow']}
              className="border-l border-line pl-8"
            />
          </div>
        </Container>

        {/* 하단 네이비 스트립 */}
        <div className="on-navy relative bg-navy text-white">
          <Container>
            <div className="grid gap-8 py-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:py-11">
              {HERO_POINTS.map((point) => (
                <div key={point.label} className="flex items-start gap-4">
                  <Icon name={point.icon} size={26} className="mt-0.5 shrink-0 text-gold" />
                  <div>
                    <p className="flex items-baseline gap-1.5">
                      {point.value && (
                        <span className="font-display text-[26px] font-bold leading-none text-white">
                          {point.value}
                        </span>
                      )}
                      <span className="text-[15px] font-semibold text-white">{point.label}</span>
                    </p>
                    <p className="mt-1.5 text-[13px] leading-[1.6] text-white/60">{point.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </section>

      {/* ══ BN_PC_02 · BRAND MESSAGE ══════════════════════════════ */}
      <section
        aria-label="브랜드 메시지"
        className="on-navy relative overflow-hidden bg-navy text-white"
        style={{
          backgroundImage:
            'radial-gradient(90% 70% at 62% 34%, rgba(201,167,122,0.22) 0%, rgba(27,58,92,0.35) 32%, #0D2340 62%, #050F1B 100%)',
        }}
      >
        <Container>
          <div className="grid gap-12 py-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14 lg:py-24 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)_auto] xl:gap-12">
            <div className="max-w-[560px] self-center">
              <p className="u-eyebrow text-[11px] font-semibold text-gold lg:text-[13px]">
                Brand Message
              </p>

              <h2 className="mt-6 text-[32px] font-bold leading-[1.26] tracking-[-0.03em] sm:text-[40px] lg:mt-7 lg:text-[52px]">
                <span className="block">{brandMessage.main[0]}</span>
                <span className="block text-gold">{brandMessage.main[1]}</span>
              </h2>

              <div className="mt-7 space-y-4 text-[15px] leading-[1.85] text-white/70 lg:mt-9 lg:text-[16px]">
                <p>
                  홈페이지는 단순한 웹사이트가 아닙니다.
                  <br />
                  당신의 비즈니스를 더 크게 성장시키는
                  <br />
                  가장 강력한 비즈니스 자산입니다.
                </p>
                <p className="border-l border-gold/40 pl-5 text-white/85">
                  비즈네스타는 디자인 · 콘텐츠 · 시스템을 연결하여
                  <br />
                  당신의 비즈니스에 필요한 홈페이지를 맞춤 제작합니다.
                </p>
              </div>

              <ScriptAccent lines={['More', 'Tomorrow']} size="lg" className="mt-10" />
            </div>

            <FloatingMockupWall />

            <VerticalKeywords
              words={['Website', 'Design', 'Content', 'System', 'Marketing', 'For a', 'Brighter', 'Tomorrow']}
              tone="dark"
              className="self-center border-l border-navy-line pl-8"
            />
          </div>
        </Container>

        {/* DESIGN / CONTENT / SYSTEM / GROWTH */}
        <div className="border-t border-navy-line bg-navy-deep/45">
          <Container>
            <ul className="grid gap-x-10 gap-y-8 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:py-12">
              {PILLARS.map((pillar, index) => (
                <li
                  key={pillar.title}
                  className={index > 0 ? 'lg:border-l lg:border-navy-line lg:pl-10' : undefined}
                >
                  <Icon name={pillar.icon} size={28} className="text-gold" />
                  <p className="u-eyebrow-tight mt-4 text-[14px] font-bold text-white">
                    {pillar.title}
                  </p>
                  <p className="mt-2 text-[13px] leading-[1.7] text-white/60">
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

      {/* ══ 유형 미리보기 — 전체는 /category ═══════════════════════ */}
      <Section tone="ivory" padding="lg" ariaLabel="홈페이지 유형 미리보기">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <SectionHeader
            eyebrow="Website Category"
            title={['어떤 홈페이지를', '찾고 계신가요?']}
            description={[
              '업종도, 목적도, 스타일도 다르니까.',
              '비즈네스타가 가장 잘 맞는 홈페이지를 제안합니다.',
            ]}
          />
          <Link
            href="/category"
            className="u-eyebrow-tight group inline-flex shrink-0 items-center gap-3 text-[12px] font-semibold text-navy"
          >
            {visibleCategories.length}개 유형 전체 보기
            <span
              aria-hidden="true"
              className="flex size-9 items-center justify-center rounded-full border border-line-gold text-gold-deep transition-all group-hover:bg-gold group-hover:text-navy"
            >
              →
            </span>
          </Link>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 xl:grid-cols-5">
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
