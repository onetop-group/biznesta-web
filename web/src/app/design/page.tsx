import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { BandCta } from '@/components/blocks/BandCta';
import { PlaceholderNotice } from '@/components/blocks/PlaceholderNotice';
import { VerticalKeywords } from '@/components/blocks/VerticalKeywords';
import { DesignCard } from '@/components/design/DesignCard';
import { DesignPagination } from '@/components/design/DesignGrid';
import { FilterBar, type FilterItem } from '@/components/design/FilterBar';
import { DeviceMockup } from '@/components/ui/DeviceMockup';
import { ScriptAccent } from '@/components/ui/ScriptAccent';
import { visibleCategories } from '@/data/categories';
import { queryDesigns } from '@/data/designs';

/**
 * BN_PC_04_DESIGN_SHOWROOM — EDITORIAL GALLERY
 *
 * ⚠️ 같은 크기 카드 4열 반복을 쓰지 않습니다 (지시서 9항).
 *    아래로 내려갈수록 다른 전시 공간으로 이동하도록
 *    밴드마다 배경 · 비율 · 열 수 · 카드 형태를 바꿉니다.
 *
 *      ① 대표작 1 + 보조 2      (아이보리 · 큰 작품)
 *      ② 와이드 프레젠테이션 1   (네이비 전시실 · 목업 구도)
 *      ③ 서로 다른 비율 3       (페이퍼 갤러리)
 *      ④ 나머지 격자            (아이보리 · 아카이브)
 *
 *    데이터 구조와 페이지네이션은 그대로 유지합니다.
 */
export const metadata: Metadata = {
  title: '홈페이지 디자인',
  description:
    '다양한 업종의 홈페이지 디자인을 한눈에 만나보세요. 업종의 특성과 목적에 맞는 최적의 디자인을 제안합니다.',
};

const PER_PAGE = 12;

function BandHead({
  index,
  label,
  title,
  tone = 'light',
  href,
  hrefLabel,
}: {
  index: string;
  label: string;
  title: string;
  tone?: 'light' | 'dark';
  href?: string;
  hrefLabel?: string;
}) {
  const muted = tone === 'dark' ? 'text-white/50' : 'text-muted';
  const ink = tone === 'dark' ? 'text-white' : 'text-navy';

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-baseline gap-5">
        <span className="font-display text-[22px] font-bold text-gold-deep lg:text-[26px]">
          {index}
        </span>
        <div>
          <p className={`u-eyebrow text-[10px] font-semibold ${tone === 'dark' ? 'text-gold' : 'text-gold-deep'}`}>
            {label}
          </p>
          <h2 className={`mt-1.5 text-[19px] font-bold lg:text-[22px] ${ink}`}>{title}</h2>
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className={`u-eyebrow-tight group inline-flex items-center gap-2.5 text-[11px] font-semibold ${muted}`}
        >
          {hrefLabel}
          <span
            aria-hidden="true"
            className={`flex size-8 items-center justify-center rounded-full border transition-all ${
              tone === 'dark'
                ? 'border-white/25 text-gold group-hover:bg-gold group-hover:text-navy'
                : 'border-line-gold text-gold-deep group-hover:bg-gold group-hover:text-navy'
            }`}
          >
            →
          </span>
        </Link>
      )}
    </div>
  );
}

export default async function DesignShowroomPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category ?? 'all';
  const page = Number(params.page ?? '1') || 1;
  const isFiltered = activeCategory !== 'all' || page > 1;

  const result = queryDesigns({
    category: activeCategory === 'all' ? undefined : activeCategory,
    page,
    perPage: PER_PAGE,
  });

  /* 편집 배치 — 필터가 걸리지 않은 기본 화면에서만 씁니다 */
  const items = result.items;
  const lead = items[0];
  const leadSide = items.slice(1, 3);
  const wide = items[3];
  const trio = items.slice(4, 7);
  const archive = items.slice(7);

  const heroDesign = queryDesigns({ onlyFeatured: true, perPage: 1 }).items[0];

  const buildHref = (key: string) => (key === 'all' ? '/design' : `/design?category=${key}`);
  const filters: FilterItem[] = [
    { key: 'all', label: '전체 보기', href: buildHref('all') },
    ...visibleCategories.map((category) => ({
      key: category.slug,
      label: category.name,
      href: buildHref(category.slug),
    })),
  ];

  const activeName =
    activeCategory === 'all'
      ? '전체'
      : (visibleCategories.find((c) => c.slug === activeCategory)?.name ?? '전체');

  return (
    <>
      {/* ══ 전시장 입구 ═══════════════════════════════════════════ */}
      <section
        aria-label="디자인 쇼룸 소개"
        className="on-navy relative overflow-hidden text-white"
        style={{
          backgroundImage:
            'radial-gradient(92% 76% at 70% 30%, rgba(52,88,128,0.55) 0%, rgba(15,38,66,0.7) 34%, #0B1D33 64%, #050F1B 100%)',
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-[30%] top-[-24%] h-[150%] w-[9%] opacity-45 blur-[42px]"
          style={{
            transform: 'rotate(8deg)',
            background:
              'linear-gradient(180deg, rgba(236,218,188,0) 0%, rgba(236,218,188,0.55) 46%, rgba(236,218,188,0) 100%)',
          }}
        />

        <Container>
          <div className="relative grid gap-12 py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12 lg:py-20 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)_auto]">
            <div className="max-w-[560px]">
              <p className="u-eyebrow text-[11px] font-semibold text-gold lg:text-[12px]">
                Design Showroom
              </p>
              <h1 className="mt-7 text-[32px] font-bold leading-[1.28] tracking-[-0.035em] sm:text-[38px] lg:mt-8 lg:text-[46px]">
                <span className="block">당신의 스타일을</span>
                <span className="block text-gold">찾아보세요.</span>
              </h1>
              <p className="mt-7 text-[15px] leading-[1.9] text-white/65 lg:text-[16px]">
                다양한 업종의 홈페이지 디자인을 한눈에 만나보세요.
                <br />
                비즈네스타는 업종의 특성과 목적에 맞는 최적의 디자인을 제안합니다.
              </p>
              <ScriptAccent lines={['Good Design, Better Business']} size="sm" className="mt-9" />
            </div>

            {heroDesign && (
              <div className="relative">
                <DeviceMockup
                  source={{ design: heroDesign }}
                  variant="browser"
                  className="w-full rotate-[-1.5deg]"
                />
              </div>
            )}

            <VerticalKeywords
              words={['Website', 'Design', 'For a', 'Better', 'Tomorrow']}
              tone="dark"
              align="right"
              className="self-center border-l border-navy-line/70 pl-8"
            />
          </div>
        </Container>
      </section>

      {/* ══ 필터 ══════════════════════════════════════════════════ */}
      <Section tone="ivory" padding="sm" ariaLabel="디자인 필터">
        <FilterBar items={filters} activeKey={activeCategory} ariaLabel="유형별 디자인 필터" />
        <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-[17px] font-bold text-navy">
            {activeName}
            <span className="ml-2.5 text-[13px] font-medium text-muted">{result.total}개 디자인</span>
          </h2>
          <Link
            href="/design/new"
            className="u-eyebrow-tight text-[11px] font-semibold text-gold-deep transition-colors hover:text-navy"
          >
            새로 등록된 디자인 보기 →
          </Link>
        </div>
        <div className="mt-6">
          <PlaceholderNotice />
        </div>
      </Section>

      {items.length === 0 ? (
        <Section tone="ivory" padding="lg">
          <div className="rounded-card border border-dashed border-line-gold bg-ivory-soft px-8 py-20 text-center">
            <p className="text-[16px] font-semibold text-navy">
              해당 유형의 디자인을 준비하고 있습니다.
            </p>
            <p className="mt-3 text-[14px] text-ink-2">
              원하시는 스타일을 알려주시면 그에 맞는 시안을 먼저 제안해드립니다.
            </p>
          </div>
        </Section>
      ) : isFiltered ? (
        /* 필터 · 2페이지 이상 — 아카이브 격자로 단순화합니다 */
        <Section tone="ivory" padding="lg" ariaLabel="디자인 목록">
          <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((design, i) => (
              <li key={design.id}>
                <DesignCard
                  design={design}
                  variant="plate"
                  index={(result.page - 1) * result.perPage + i + 1}
                />
              </li>
            ))}
          </ul>
        </Section>
      ) : (
        <>
          {/* ① 대표작 + 보조 2 ─────────────────────────────────── */}
          <Section tone="ivory" padding="lg" ariaLabel="대표 디자인">
            <BandHead index="01" label="Featured" title="이번 달의 대표 디자인" />
            <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-12 lg:gap-7">
              {lead && (
                <div className="lg:col-span-7">
                  <DesignCard design={lead} variant="wide" ratio="16 / 10" eager />
                </div>
              )}
              <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-8">
                {leadSide.map((design) => (
                  <DesignCard key={design.id} design={design} variant="plate" ratio="16 / 10" />
                ))}
              </div>
            </div>
          </Section>

          {/* ② 네이비 전시실 — 와이드 프레젠테이션 ────────────── */}
          {wide && (
            <section
              aria-label="와이드 프레젠테이션"
              className="on-navy relative overflow-hidden text-white"
              style={{
                backgroundImage:
                  'radial-gradient(90% 80% at 30% 24%, rgba(48,82,120,0.5) 0%, rgba(13,32,56,0.72) 38%, #08182B 100%)',
              }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-[6%] top-[10%] size-[46%] rounded-full opacity-40 blur-[110px]"
                style={{ background: 'radial-gradient(circle, #C9A77A 0%, rgba(201,167,122,0) 70%)' }}
              />
              <Container>
                <div className="relative py-16 lg:py-20">
                  <BandHead
                    index="02"
                    label="Presentation"
                    title="PC와 모바일을 함께 설계합니다"
                    tone="dark"
                    href={`/design/${wide.slug}`}
                    hrefLabel="이 디자인 자세히 보기"
                  />

                  <div className="mt-12 grid items-center gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-14">
                    <Link href={`/design/${wide.slug}`} className="group block">
                      <DeviceMockup
                        source={{ design: wide }}
                        variant="duo"
                        phoneScale={0.2}
                        className="w-full transition-transform duration-500 group-hover:-translate-y-1.5"
                      />
                    </Link>

                    <div>
                      <p className="u-eyebrow-tight text-[10px] font-semibold text-white/45">
                        {wide.industry} · {wide.level}
                      </p>
                      <h3 className="mt-4 text-[24px] font-bold lg:text-[28px]">{wide.title}</h3>
                      <p className="mt-4 text-[15px] leading-[1.85] text-white/65">
                        {wide.shortDescription}
                      </p>
                      <ul className="mt-7 flex flex-wrap gap-2">
                        {wide.tags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-pill border border-white/18 px-3 py-1.5 text-[12px] text-white/70"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Container>
            </section>
          )}

          {/* ③ 서로 다른 비율 3 ────────────────────────────────── */}
          {trio.length > 0 && (
            <Section tone="paper" padding="lg" ariaLabel="스타일별 디자인">
              <BandHead index="03" label="Studies" title="서로 다른 세 가지 접근" />
              <div className="mt-10 grid gap-x-6 gap-y-12 lg:mt-12 lg:grid-cols-3 lg:items-start">
                {trio.map((design, i) => (
                  <div key={design.id} className={i === 1 ? 'lg:pt-14' : i === 2 ? 'lg:pt-7' : ''}>
                    <DesignCard
                      design={design}
                      variant="plate"
                      ratio={i === 0 ? '3 / 4' : i === 1 ? '4 / 3' : '1 / 1'}
                    />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ④ 아카이브 ────────────────────────────────────────── */}
          {archive.length > 0 && (
            <Section tone="ivory" padding="lg" ariaLabel="전체 디자인">
              <BandHead index="04" label="Archive" title="전체 디자인" />
              <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 xl:grid-cols-4">
                {archive.map((design, i) => (
                  <li key={design.id}>
                    <DesignCard design={design} variant="plate" index={i + 8} />
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </>
      )}

      <Section tone="ivory" padding="sm">
        <div className="border-t border-line pt-8">
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
