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
import { getDesign } from '@/data/designs';

/** BN_PC_03_CATEGORY — CURATED DESIGN INDEX */
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

/**
 * 15개를 균일한 카드로 늘어놓지 않기 위한 편집 구성.
 * 3개 묶음으로 나누고 각 묶음의 첫 유형을 크게 씁니다.
 */
const GROUPS: Array<{ label: string; caption: string; slugs: string[] }> = [
  {
    label: 'Business',
    caption: '브랜드와 신뢰를 만드는 홈페이지',
    slugs: ['corporate', 'store', 'expert', 'franchise', 'recruit'],
  },
  {
    label: 'Conversion',
    caption: '고객이 들어오고 남는 홈페이지',
    slugs: ['landing', 'lead', 'booking', 'shop', 'membership'],
  },
  {
    label: 'System & Content',
    caption: '운영하고 쌓아가는 홈페이지',
    slugs: ['admin', 'webapp', 'education', 'portfolio', 'content'],
  },
];

export default function CategoryIndexPage() {
  const heroDesign = getDesign('corporate-001');
  const bySlug = new Map(visibleCategories.map((category) => [category.slug, category]));

  return (
    <>
      {/* ══ 히어로 ════════════════════════════════════════════════ */}
      <section aria-label="홈페이지 유형 소개" className="relative overflow-hidden bg-ivory-soft">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-[6%] -top-[40%] size-[70%] rounded-full opacity-55 blur-[130px]"
          style={{ background: 'radial-gradient(circle, #E9D4B2 0%, rgba(233,212,178,0) 68%)' }}
        />

        <Container>
          <div className="relative grid items-center gap-12 pb-16 pt-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 lg:pb-20 lg:pt-18 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.1fr)_auto] xl:gap-14">
            <div className="max-w-[560px]">
              <p className="u-eyebrow text-[11px] font-semibold text-gold-deep lg:text-[12px]">
                Website Category
              </p>
              <h1 className="mt-7 text-[32px] font-bold leading-[1.28] tracking-[-0.035em] sm:text-[38px] lg:mt-8 lg:text-[46px]">
                <span className="block">어떤 홈페이지를</span>
                <span className="block text-gold-deep">찾고 계신가요?</span>
              </h1>
              <p className="mt-7 text-[15px] leading-[1.9] text-ink-2 lg:text-[16px]">
                업종도, 목적도, 스타일도 다르니까.
                <br />
                비즈네스타가 가장 잘 맞는 홈페이지를 제안합니다.
              </p>

              <ul className="mt-9 flex flex-wrap gap-x-8 gap-y-4 lg:mt-11">
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
                className="mb-6 lg:mb-8 lg:text-right"
              />
              {heroDesign && (
                <DeviceMockup source={{ design: heroDesign }} variant="duo" className="w-full" />
              )}
            </div>

            <VerticalKeywords
              words={['Website', 'Design', 'For a', 'Better', 'Tomorrow']}
              className="border-l border-line pl-8"
            />
          </div>
        </Container>
      </section>

      {/* ══ 큐레이션된 유형 인덱스 ════════════════════════════════ */}
      <Section tone="ivory" padding="lg" ariaLabel="홈페이지 유형 목록">
        <div className="flex flex-col gap-4 border-t border-line pt-10 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-[22px] font-bold text-navy lg:text-[26px]">
            {visibleCategories.length}가지 홈페이지 유형
          </h2>
          <p className="text-[13px] text-ink-2">
            원하는 유형을 선택하면 추천 디자인과 필요한 기능을 함께 보실 수 있습니다.
          </p>
        </div>

        <div className="mt-4 space-y-16 lg:mt-6 lg:space-y-20">
          {GROUPS.map((group, groupIndex) => {
            const [featureSlug, ...restSlugs] = group.slugs;
            const feature = bySlug.get(featureSlug);
            const rest = restSlugs.map((slug) => bySlug.get(slug)).filter(Boolean);

            return (
              <div key={group.label}>
                <div className="flex items-baseline gap-5 border-b border-line pb-4">
                  <span className="font-display text-[22px] font-bold text-gold-deep lg:text-[26px]">
                    {String(groupIndex + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="u-eyebrow text-[10px] font-semibold text-navy lg:text-[11px]">
                      {group.label}
                    </p>
                    <p className="mt-1 text-[14px] text-ink-2">{group.caption}</p>
                  </div>
                </div>

                {/* 첫 유형은 크게, 나머지는 작게 — 균일 그리드를 피합니다 */}
                <div className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-12">
                  {feature && (
                    <div className="lg:col-span-6 xl:col-span-5">
                      <CategoryCard category={feature} size="feature" />
                    </div>
                  )}
                  <div className="grid gap-5 sm:grid-cols-2 lg:col-span-6 lg:grid-cols-2 xl:col-span-7 xl:grid-cols-4">
                    {rest.map((category) => (
                      <div key={category!.slug}>
                        <CategoryCard category={category!} size="compact" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
