import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { BandCta } from '@/components/blocks/BandCta';
import { PlaceholderNotice } from '@/components/blocks/PlaceholderNotice';
import { VerticalKeywords } from '@/components/blocks/VerticalKeywords';
import { DesignGrid, DesignPagination } from '@/components/design/DesignGrid';
import { FilterBar, type FilterItem } from '@/components/design/FilterBar';
import { ScriptAccent } from '@/components/ui/ScriptAccent';
import { visibleCategories } from '@/data/categories';
import { queryDesigns } from '@/data/designs';

/** BN_PC_04_DESIGN_SHOWROOM */
export const metadata: Metadata = {
  title: '홈페이지 디자인',
  description:
    '다양한 업종의 홈페이지 디자인을 한눈에 만나보세요. 업종의 특성과 목적에 맞는 최적의 디자인을 제안합니다.',
};

const PER_PAGE = 12;

export default async function DesignShowroomPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category ?? 'all';
  const page = Number(params.page ?? '1') || 1;

  const result = queryDesigns({
    category: activeCategory === 'all' ? undefined : activeCategory,
    page,
    perPage: PER_PAGE,
  });

  const buildHref = (categoryKey: string) =>
    categoryKey === 'all' ? '/design' : `/design?category=${categoryKey}`;

  const filters: FilterItem[] = [
    { key: 'all', label: '전체 보기', href: buildHref('all') },
    ...visibleCategories.map((category) => ({
      key: category.slug,
      label: category.name,
      href: buildHref(category.slug),
    })),
  ];

  const activeCategoryName =
    activeCategory === 'all'
      ? '전체'
      : (visibleCategories.find((c) => c.slug === activeCategory)?.name ?? '전체');

  return (
    <>
      {/* ══ 다크 히어로 — 전시장 입구 같은 인상 ═══════════════════ */}
      <section
        aria-label="디자인 쇼룸 소개"
        className="on-navy relative overflow-hidden bg-navy text-white"
        style={{
          backgroundImage:
            'radial-gradient(85% 70% at 74% 26%, rgba(201,167,122,0.2) 0%, rgba(27,58,92,0.4) 34%, #0D2340 66%, #061220 100%)',
        }}
      >
        {/* 전시 공간의 세로 광원 */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-[24%] top-[-20%] h-[140%] w-[9%] -rotate-6 rounded-full opacity-45 blur-3xl"
          style={{
            background:
              'linear-gradient(180deg, rgba(228,205,169,0) 0%, rgba(228,205,169,0.5) 50%, rgba(228,205,169,0) 100%)',
          }}
        />

        <Container>
          <div className="relative grid gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:py-20">
            <div className="max-w-[640px]">
              <p className="u-eyebrow text-[11px] font-semibold text-gold lg:text-[13px]">
                Design Showroom
              </p>
              <h1 className="mt-6 text-[32px] font-bold leading-[1.26] tracking-[-0.03em] sm:text-[40px] lg:mt-7 lg:text-[50px]">
                <span className="block">당신의 스타일을</span>
                <span className="block text-gold">찾아보세요.</span>
              </h1>
              <p className="mt-6 text-[15px] leading-[1.85] text-white/70 lg:mt-7 lg:text-[16px]">
                다양한 업종의 홈페이지 디자인을 한눈에 만나보세요.
                <br />
                비즈네스타는 업종의 특성과 목적에 맞는 최적의 디자인을 제안합니다.
              </p>
              <ScriptAccent
                lines={['Good Design, Better Business']}
                size="sm"
                className="mt-8 lg:mt-10"
              />
            </div>

            <VerticalKeywords
              words={['Website', 'Design', 'For a', 'Better', 'Tomorrow']}
              tone="dark"
              align="right"
              className="self-end border-r border-navy-line pr-8 text-right"
            />
          </div>
        </Container>
      </section>

      {/* ══ 필터 + 그리드 ═════════════════════════════════════════ */}
      <Section tone="ivory" padding="md" ariaLabel="디자인 목록">
        <FilterBar items={filters} activeKey={activeCategory} ariaLabel="유형별 디자인 필터" />

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-[17px] font-bold text-navy">
            {activeCategoryName}
            <span className="ml-2.5 text-[13px] font-medium text-muted">
              {result.total}개 디자인
            </span>
          </h2>
          <Link
            href="/design/new"
            className="u-eyebrow-tight text-[12px] font-semibold text-gold-deep transition-colors hover:text-navy"
          >
            새로 등록된 디자인 보기 →
          </Link>
        </div>

        <div className="mt-6">
          <PlaceholderNotice />
        </div>

        <div className="mt-10 lg:mt-12">
          <DesignGrid
            designs={result.items}
            columns={4}
            startIndex={(result.page - 1) * result.perPage + 1}
          />
        </div>

        <div className="mt-12 border-t border-line pt-8">
          <DesignPagination
            page={result.page}
            totalPages={result.totalPages}
            basePath="/design"
            query={{ category: activeCategory === 'all' ? undefined : activeCategory }}
          />
        </div>
      </Section>

      <BandCta
        quote={['당신의 비즈니스도,', '이렇게 멋질 수 있습니다.']}
        points={[
          { icon: 'monitor', label: '홈페이지 제작' },
          { icon: 'pencil', label: '맞춤 디자인' },
          { icon: 'gear', label: '지속적인 관리' },
        ]}
        ctaLabel="제작 상담하기"
        ctaHref="/contact"
        tone="navy"
      />
    </>
  );
}
