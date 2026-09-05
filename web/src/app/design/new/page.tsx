import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { BandCta } from '@/components/blocks/BandCta';
import { PlaceholderNotice } from '@/components/blocks/PlaceholderNotice';
import { VerticalKeywords } from '@/components/blocks/VerticalKeywords';
import { DesignGrid } from '@/components/design/DesignGrid';
import { FilterBar, type FilterItem } from '@/components/design/FilterBar';
import { DeviceMockup } from '@/components/ui/DeviceMockup';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ScriptAccent } from '@/components/ui/ScriptAccent';
import { designTagFilters, queryDesigns } from '@/data/designs';
import type { DesignLevel } from '@/types';

/** BN_PC_07_NEW_DESIGN */
export const metadata: Metadata = {
  title: '새로운 디자인',
  description:
    '트렌드를 반영한 새로운 홈페이지 디자인을 만나보세요. 비즈네스타는 새로운 디자인을 꾸준히 등록합니다.',
};

const POINTS: Array<{ icon: IconName; label: string }> = [
  { icon: 'diamond', label: '트렌디한 디자인' },
  { icon: 'users', label: '업종별 맞춤 구성' },
  { icon: 'monitor', label: 'PC · 모바일 최적화' },
  { icon: 'chart', label: '브랜드 성장 전략' },
];

const LEVEL_KEYS: DesignLevel[] = ['STANDARD', 'CUSTOM', 'SIGNATURE'];

export default async function NewDesignPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const activeFilter = params.filter ?? 'all';

  /**
   * ⚠️ 지시서 16 · 19항
   *    운영자가 매일 등록하는 디자인이 자동으로 이 화면에 올라와야 합니다.
   *    그래서 목록을 고정하지 않고 "최근 등록순"으로만 뽑습니다.
   *    Phase 6 에서 이 호출이 Supabase 쿼리로 바뀌면
   *    관리자에서 등록하는 즉시 여기에 반영됩니다.
   */
  const result = queryDesigns({
    onlyNew: activeFilter === 'new' ? true : undefined,
    onlyFeatured: activeFilter === 'featured' ? true : undefined,
    level: LEVEL_KEYS.includes(activeFilter as DesignLevel)
      ? (activeFilter as DesignLevel)
      : undefined,
    perPage: 8,
  });

  const filters: FilterItem[] = designTagFilters.map((option) => ({
    key: option.key,
    label: option.label,
    href: option.key === 'all' ? '/design/new' : `/design/new?filter=${option.key}`,
  }));

  const heroDesign = result.items[0] ?? queryDesigns().items[0];

  return (
    <>
      {/* ══ 히어로 ════════════════════════════════════════════════ */}
      <section aria-label="새로운 디자인 소개" className="relative overflow-hidden bg-ivory-soft">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-[12%] top-[-25%] size-[55%] rounded-full opacity-45 blur-[110px]"
          style={{ background: 'radial-gradient(circle, #EFE7DA 0%, rgba(239,231,218,0) 70%)' }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-[6%] top-[10%] size-[45%] rounded-full opacity-50 blur-[110px]"
          style={{ background: 'radial-gradient(circle, #E4CDA9 0%, rgba(228,205,169,0) 70%)' }}
        />

        <Container>
          <div className="relative grid items-center gap-10 pb-14 pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12 lg:pb-18 lg:pt-18 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)_auto] xl:gap-14">
            <div className="max-w-[560px]">
              <p className="u-eyebrow text-[11px] font-semibold text-gold-deep lg:text-[13px]">
                New Design
              </p>
              <h1 className="mt-6 text-[32px] font-bold leading-[1.26] tracking-[-0.03em] sm:text-[40px] lg:mt-7 lg:text-[50px]">
                <span className="block">새로운 시작을 위한</span>
                <span className="block text-gold-deep">새로운 디자인.</span>
              </h1>
              <p className="mt-6 text-[15px] leading-[1.85] text-ink-2 lg:mt-7 lg:text-[16px]">
                트렌드를 반영한 감각적인 디자인으로
                <br />
                당신의 브랜드를 더 특별하게 만들어드립니다.
              </p>

              <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:mt-10">
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
                lines={['New Design', 'New Possibility']}
                size="md"
                className="mb-5 lg:mb-6 lg:text-right"
              />
              <DeviceMockup source={{ design: heroDesign }} variant="duo" className="w-full" />
            </div>

            <VerticalKeywords
              words={['Brand', 'Design', 'Content', 'Marketing', 'Solution']}
              className="border-l border-line pl-8"
            />
          </div>
        </Container>
      </section>

      {/* ══ 필터 + 큰 카드 그리드 ═════════════════════════════════ */}
      <Section tone="paper" padding="md" ariaLabel="새로운 디자인 목록">
        <FilterBar items={filters} activeKey={activeFilter} ariaLabel="디자인 속성 필터" />

        <div className="mt-6">
          <PlaceholderNotice>
            아래 디자인은 <strong className="font-semibold text-navy">레이아웃 확인용 자리표시자</strong>
            입니다. Phase 7 에서 관리자 디자인 등록 기능이 완성되면, 운영자가 등록한 최신 디자인이
            이 목록에 자동으로 올라옵니다.
          </PlaceholderNotice>
        </div>

        <div className="mt-10 lg:mt-12">
          <DesignGrid designs={result.items} columns={2} variant="device" showTags />
        </div>
      </Section>

      <BandCta
        quote={['좋은 디자인은', '좋은 비즈니스를 만듭니다.']}
        points={[
          { icon: 'bulb', label: '트렌드를 반영한 디자인 제안' },
          { icon: 'pencil', label: '브랜드에 맞춘 맞춤 기획' },
          { icon: 'gear', label: '지속적인 관리와 업데이트' },
        ]}
        ctaLabel="제작 상담하기"
        ctaHref="/contact"
        tone="cream"
      />
    </>
  );
}
