import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Breadcrumb } from '@/components/blocks/Breadcrumb';
import { CheckList, ColorSwatches, LevelCards } from '@/components/design/DesignFacts';
import { DesignCard } from '@/components/design/DesignCard';
import { Button } from '@/components/ui/Button';
import { DeviceMockup } from '@/components/ui/DeviceMockup';
import { ScriptAccent } from '@/components/ui/ScriptAccent';
import { getCategory } from '@/data/categories';
import { designs, getDesign, getRelatedDesigns } from '@/data/designs';

/**
 * BN_PC_06_DESIGN_DETAIL
 *
 * ⚠️ 이 페이지는 디자인 하나마다 독립 URL 을 갖는 SEO 자산입니다 (지시서 17 · 52항).
 *    Phase 10 에서 여기에 BreadcrumbList · ImageObject JSON-LD 를 붙입니다.
 *
 * ⚠️ 전환 설계 (지시서 32항)
 *    "이 디자인으로 제작하기" 는 /contact?design={slug} 로 이동해
 *    선택한 디자인이 상담 DB(inquiries.ref_id)에 함께 저장됩니다.
 */

export function generateStaticParams() {
  return designs.map((design) => ({ slug: design.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const design = getDesign(slug);
  if (!design) return { title: '홈페이지 디자인' };

  return {
    title: design.title,
    description: design.shortDescription,
    alternates: { canonical: `/design/${design.slug}` },
    openGraph: {
      title: design.title,
      description: design.shortDescription,
      type: 'article',
    },
  };
}

export default async function DesignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const design = getDesign(slug);
  if (!design) notFound();

  const category = getCategory(design.categorySlug);
  const related = getRelatedDesigns(design, 4);

  /**
   * 추천 업종 — 디자인의 업종과 카테고리의 업종 축을 합칩니다.
   * 겹치는 값이 있으므로 반드시 중복을 제거합니다
   * (제거하지 않으면 같은 항목이 두 번 보이고 React key 도 충돌합니다).
   */
  const recommendedIndustries = Array.from(
    new Set([design.industry, ...(category?.industries ?? [])].filter(Boolean)),
  ).slice(0, 5);

  return (
    <>
      {/* ══ 히어로 ════════════════════════════════════════════════ */}
      <section
        aria-label={`${design.title} 소개`}
        className="relative overflow-hidden bg-ivory-soft"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-[6%] -top-[30%] size-[60%] rounded-full opacity-45 blur-[120px]"
          style={{ background: `radial-gradient(circle, ${design.palette.point} 0%, transparent 70%)` }}
        />

        <Container>
          <div className="relative grid gap-10 pb-14 pt-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-12 lg:pb-18 lg:pt-12 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.05fr)_auto] xl:gap-12">
            <div className="max-w-[560px]">
              <Breadcrumb
                items={[
                  { label: 'HOME', href: '/' },
                  { label: '홈페이지 디자인', href: '/design' },
                  { label: category?.name ?? '디자인', href: `/design?category=${design.categorySlug}` },
                  { label: design.title },
                ]}
              />

              <p className="u-eyebrow mt-7 text-[11px] font-semibold text-gold-deep lg:text-[13px]">
                Design Detail
              </p>

              <h1 className="mt-5 font-display text-[30px] font-bold leading-[1.16] tracking-[-0.01em] text-navy sm:text-[38px] lg:text-[46px]">
                {design.titleEn}
              </h1>
              <p className="mt-3 text-[18px] font-bold text-navy lg:text-[22px]">{design.title}</p>

              <p className="mt-6 text-[15px] leading-[1.85] text-ink-2">
                {design.shortDescription}
                <br />
                {design.concept[0]}
              </p>

              <ul className="mt-7 flex flex-wrap gap-2">
                {design.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-pill border border-line bg-paper px-3.5 py-1.5 text-[12px] text-ink-2"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <DeviceMockup
                source={{ design }}
                behind={related[0]}
                variant="stack"
                className="w-full"
                phoneScale={0.22}
              />
            </div>

            <div className="hidden self-center border-l border-line pl-8 xl:block">
              <ScriptAccent lines={['Your', 'Next Stage']} size="md" />
              <p className="mt-7 max-w-[190px] text-[13px] leading-[1.8] text-ink-2">
                “{category?.tagline ?? '당신의 비즈니스에 맞는 디자인'}”
              </p>
              <p className="u-eyebrow-tight mt-6 text-[10px] leading-[2.2] text-muted">
                BIZNESTA
                <br />
                CREATES A BETTER
                <br />
                TOMORROW.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ══ 정보 밴드 — 컨셉 · 업종 · 기능 · 등급 ═════════════════ */}
      <Section tone="paper" padding="md" ariaLabel="디자인 정보">
        {/* 등급 · CTA 열은 내용이 많아 조금 더 넓게 잡습니다 */}
        <div className="grid gap-10 border-t border-line pt-10 lg:grid-cols-2 lg:gap-12 xl:grid-cols-[1fr_0.8fr_0.95fr_1.25fr] xl:gap-9">
          {/* 컨셉 + 팔레트 */}
          <div>
            <p className="u-eyebrow text-[10px] font-semibold text-gold-deep">Design Concept</p>
            <h2 className="mt-4 text-[19px] font-bold leading-[1.45] text-navy">
              {design.concept.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <div className="mt-7">
              <ColorSwatches palette={design.palette} />
            </div>
          </div>

          {/* 추천 업종 */}
          <div className="xl:border-l xl:border-line xl:pl-10">
            <h2 className="text-[16px] font-bold text-navy">추천 업종</h2>
            <div className="mt-5">
              <CheckList items={recommendedIndustries} />
            </div>
          </div>

          {/* 적용 가능한 기능 */}
          <div className="xl:border-l xl:border-line xl:pl-10">
            <h2 className="text-[16px] font-bold text-navy">적용 가능한 주요 기능</h2>
            <div className="mt-5">
              <CheckList items={design.features} />
            </div>
          </div>

          {/* 등급 + CTA */}
          <div className="xl:border-l xl:border-line xl:pl-10">
            <h2 className="text-[16px] font-bold text-navy">디자인 등급</h2>
            <div className="mt-5">
              <LevelCards active={design.level} />
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button href={`/contact?design=${design.slug}`} size="lg" arrow fullWidth>
                이 디자인으로 제작하기
              </Button>
              <Button
                href={`/contact?design=${design.slug}&type=custom`}
                variant="outline"
                size="lg"
                arrow
                fullWidth
              >
                내 브랜드에 맞게 변경 상담
              </Button>
            </div>
            <p className="mt-4 text-[12px] leading-[1.7] text-muted">
              ※ 모든 디자인은 고객의 업종과 요구사항에 맞춰 커스터마이징 가능합니다.
            </p>
          </div>
        </div>

        {/* 구성 페이지 */}
        <div className="mt-14 rounded-card border border-line bg-ivory-soft p-6 lg:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="text-[16px] font-bold text-navy">이 디자인의 기본 구성</h2>
            <p className="text-[12px] text-muted">
              필요한 페이지는 상담 시 자유롭게 추가 · 조정할 수 있습니다.
            </p>
          </div>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {design.pages.map((page, index) => (
              <li
                key={page}
                className="flex items-center gap-2 rounded-pill border border-line bg-paper py-2 pl-3 pr-4 text-[13px] text-ink-2"
              >
                <span className="u-eyebrow-tight text-[10px] font-bold text-gold-deep">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {page}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ══ 관련 디자인 ═══════════════════════════════════════════ */}
      <Section tone="ivory" padding="md" ariaLabel="관련 디자인">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-12">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <p className="u-eyebrow text-[10px] font-semibold text-gold-deep">Similar Design</p>
              <h2 className="text-[20px] font-bold text-navy lg:text-[24px]">
                이런 디자인도 함께 살펴보세요.
              </h2>
            </div>

            <ul className="mt-8 grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <li key={item.id}>
                  <DesignCard design={item} variant="plate" />
                </li>
              ))}
            </ul>
          </div>

          <div className="on-navy flex flex-col justify-center rounded-card bg-navy p-7 text-white lg:p-8">
            <p className="u-eyebrow text-[10px] font-semibold text-gold">BIZNESTA</p>
            <p className="mt-4 text-[20px] font-bold leading-[1.45]">
              당신의 비즈니스에
              <br />
              맞는 단 하나의 디자인.
            </p>
            <p className="mt-3 text-[14px] leading-[1.7] text-white/65">
              홈페이지 그 이상의 가치를 만듭니다.
            </p>
            <div className="mt-6">
              <Button href="/contact" size="md" arrow fullWidth>
                무료 상담 신청하기
              </Button>
            </div>
            <Link
              href="/design"
              className="u-eyebrow-tight mt-5 text-center text-[11px] text-white/50 transition-colors hover:text-gold"
            >
              전체 디자인 보기 →
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
