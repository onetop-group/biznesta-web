import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { BandCta } from '@/components/blocks/BandCta';
import { VerticalKeywords } from '@/components/blocks/VerticalKeywords';
import { CategoryCard } from '@/components/category/CategoryCard';
import { DeviceMockup } from '@/components/ui/DeviceMockup';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ScriptAccent } from '@/components/ui/ScriptAccent';
import { visibleCategories } from '@/data/categories';
import { designs } from '@/data/designs';

/** BN_PC_03_CATEGORY */
export const metadata: Metadata = {
  title: '홈페이지 유형',
  description:
    '기업 · 매장 · 교육 · 쇼핑 · 예약까지, 업종과 목적에 맞는 15가지 홈페이지 유형을 제안합니다.',
};

const POINTS: Array<{ icon: IconName; label: string }> = [
  { icon: 'diamond', label: '업종별 맞춤 디자인' },
  { icon: 'gear', label: '필요한 기능만 정확하게' },
  { icon: 'chart', label: '비즈니스 성장을 함께' },
];

export default function CategoryIndexPage() {
  const heroDesign = designs.find((design) => design.categorySlug === 'corporate') ?? designs[0];

  return (
    <>
      {/* ══ 히어로 ════════════════════════════════════════════════ */}
      <section aria-label="홈페이지 유형 소개" className="relative overflow-hidden bg-ivory-soft">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-[8%] -top-[35%] size-[65%] rounded-full opacity-55 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #E4CDA9 0%, rgba(228,205,169,0) 70%)' }}
        />

        <Container>
          <div className="relative grid items-center gap-10 pb-14 pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12 lg:pb-20 lg:pt-18 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_auto] xl:gap-14">
            <div className="max-w-[560px]">
              <p className="u-eyebrow text-[11px] font-semibold text-gold-deep lg:text-[13px]">
                Website Category
              </p>
              <h1 className="mt-6 text-[32px] font-bold leading-[1.26] tracking-[-0.03em] sm:text-[40px] lg:mt-7 lg:text-[50px]">
                <span className="block">어떤 홈페이지를</span>
                <span className="block text-gold-deep">찾고 계신가요?</span>
              </h1>
              <p className="mt-6 text-[15px] leading-[1.85] text-ink-2 lg:mt-7 lg:text-[16px]">
                업종도, 목적도, 스타일도 다르니까.
                <br />
                비즈네스타가 가장 잘 맞는 홈페이지를 제안합니다.
              </p>

              <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-4 lg:mt-10">
                {POINTS.map((point) => (
                  <li key={point.label} className="flex items-center gap-2.5">
                    <Icon name={point.icon} size={22} className="text-gold-deep" />
                    <span className="text-[13px] text-ink-2">{point.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <ScriptAccent
                lines={['Your Business,', 'A Brighter Tomorrow']}
                size="sm"
                className="mb-5 lg:mb-6 lg:text-right"
              />
              <DeviceMockup
                source={{ palette: heroDesign.palette, layout: heroDesign.previewLayout }}
                variant="duo"
                className="w-full"
              />
            </div>

            <VerticalKeywords
              words={['Website', 'Design', 'For a', 'Better', 'Tomorrow']}
              className="border-l border-line pl-8"
            />
          </div>
        </Container>
      </section>

      {/* ══ 15개 유형 ═════════════════════════════════════════════ */}
      <Section tone="ivory" padding="lg" ariaLabel="홈페이지 유형 목록">
        <div className="flex flex-col gap-4 border-t border-line pt-10 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-[20px] font-bold text-navy lg:text-[24px]">
            {visibleCategories.length}가지 홈페이지 유형
          </h2>
          <p className="text-[13px] text-ink-2">
            원하는 유형을 선택하면 추천 디자인과 필요한 기능을 함께 보실 수 있습니다.
          </p>
        </div>

        <ul className="mt-9 grid gap-5 sm:grid-cols-2 lg:mt-11 lg:grid-cols-3 xl:grid-cols-5">
          {visibleCategories.map((category) => (
            <li key={category.slug}>
              <CategoryCard category={category} />
            </li>
          ))}
        </ul>
      </Section>

      <BandCta
        quote={['당신의 업종에도,', '더 좋은 홈페이지가 있습니다.']}
        points={[
          { icon: 'chat', label: '빠른 상담' },
          { icon: 'doc', label: '맞춤 제안' },
          { icon: 'headset', label: '친절한 안내' },
        ]}
        ctaLabel="제작 상담하기"
        ctaHref="/contact"
        tone="navy"
      />
    </>
  );
}
