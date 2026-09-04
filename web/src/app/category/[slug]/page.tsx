import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { BandCta } from '@/components/blocks/BandCta';
import { Breadcrumb } from '@/components/blocks/Breadcrumb';
import { CategorySideNav } from '@/components/category/CategorySideNav';
import { CheckList } from '@/components/design/DesignFacts';
import { DesignCard } from '@/components/design/DesignCard';
import { Button } from '@/components/ui/Button';
import { DeviceMockup } from '@/components/ui/DeviceMockup';
import { Icon } from '@/components/ui/Icon';
import { ScriptAccent } from '@/components/ui/ScriptAccent';
import { categories, getCategory } from '@/data/categories';
import { queryDesigns } from '@/data/designs';

/** BN_PC_05_CATEGORY_DETAIL */

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: '홈페이지 유형' };

  return {
    title: `${category.name} 홈페이지`,
    description: `${category.tagline} — ${category.description.join(' ')}`,
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const recommended = queryDesigns({ category: category.slug, perPage: 3 });
  const heroPreview = recommended.items[0];

  return (
    <>
      {/* ══ 다크 히어로 ═══════════════════════════════════════════ */}
      <section
        aria-label={`${category.name} 소개`}
        className="on-navy relative overflow-hidden text-white"
        style={{
          backgroundImage: `radial-gradient(80% 70% at 72% 30%, ${category.palette.point}33 0%, rgba(27,58,92,0.4) 34%, #0D2340 66%, #061220 100%)`,
        }}
      >
        <Container>
          <div className="relative grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14 lg:py-16">
            <div className="max-w-[560px]">
              <Breadcrumb
                tone="dark"
                items={[
                  { label: 'HOME', href: '/' },
                  { label: '홈페이지 디자인', href: '/category' },
                  { label: category.name },
                ]}
              />

              <p className="u-eyebrow mt-7 text-[11px] font-semibold text-gold lg:text-[13px]">
                Category Detail
                <span className="ml-3 text-white/40">
                  {String(category.no).padStart(2, '0')}
                </span>
              </p>

              <h1 className="mt-5 text-[30px] font-bold leading-[1.26] tracking-[-0.03em] sm:text-[38px] lg:text-[46px]">
                {category.name}
              </h1>
              <p className="mt-3 text-[17px] font-semibold text-gold lg:text-[20px]">
                {category.tagline}
              </p>

              <p className="mt-6 text-[15px] leading-[1.85] text-white/70">
                {category.description.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>

              <ul className="mt-9 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:mt-11">
                {category.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-2.5">
                    <Icon name="check" size={18} className="shrink-0 text-gold" />
                    <span className="text-[13px] text-white/80">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <ScriptAccent
                lines={['Your Business,', 'Our Solution']}
                size="sm"
                className="mb-5 lg:mb-6 lg:text-right"
              />
              {heroPreview ? (
                <DeviceMockup
                  source={{ palette: heroPreview.palette, layout: heroPreview.previewLayout }}
                  variant="duo"
                  className="w-full"
                />
              ) : (
                <DeviceMockup
                  source={{ palette: category.palette, layout: 'corporate' }}
                  variant="duo"
                  className="w-full"
                />
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ══ 3분할 본문 ════════════════════════════════════════════ */}
      <Section tone="ivory" padding="md" ariaLabel={`${category.name} 추천 디자인과 기능`}>
        <div className="grid gap-10 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_300px] xl:gap-12">
          {/* 좌 — 카테고리 내비게이션 */}
          <CategorySideNav activeSlug={category.slug} />

          {/* 중 — 추천 디자인 시안 */}
          <div className="min-w-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-[20px] font-bold text-navy lg:text-[24px]">추천 디자인 시안</h2>
                <p className="mt-2 text-[14px] text-ink-2">
                  다양한 스타일의 {category.name} 홈페이지를 만나보세요.
                </p>
              </div>
              <Link
                href={`/design?category=${category.slug}`}
                className="u-eyebrow-tight group inline-flex shrink-0 items-center gap-2.5 text-[12px] font-semibold text-navy"
              >
                More Design
                <span
                  aria-hidden="true"
                  className="flex size-8 items-center justify-center rounded-full border border-line-gold text-gold-deep transition-all group-hover:bg-gold group-hover:text-navy"
                >
                  →
                </span>
              </Link>
            </div>

            {recommended.items.length > 0 ? (
              <ul className="mt-8 grid gap-x-5 gap-y-9 sm:grid-cols-2 xl:grid-cols-3">
                {recommended.items.map((design, index) => (
                  <li key={design.id}>
                    <DesignCard design={design} size="sm" index={index + 1} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-8 rounded-card border border-dashed border-line-gold bg-ivory-soft px-8 py-14 text-center">
                <p className="text-[15px] font-semibold text-navy">
                  이 유형의 디자인 시안을 준비하고 있습니다.
                </p>
                <p className="mt-2.5 text-[13px] leading-[1.7] text-ink-2">
                  원하시는 스타일을 알려주시면 그에 맞는 시안을 먼저 제안해드립니다.
                </p>
                <div className="mt-6 flex justify-center">
                  <Button href="/contact" size="md" arrow>
                    원하는 스타일 상담하기
                  </Button>
                </div>
              </div>
            )}

            {/* 업종 축 — 카테고리와 분리된 두 번째 탐색 축 */}
            <div className="mt-12 rounded-card border border-line bg-paper p-6 lg:p-7">
              <p className="u-eyebrow text-[10px] font-semibold text-gold-deep">Industry</p>
              <p className="mt-3 text-[15px] font-bold text-navy">
                이 유형은 이런 업종에서 많이 찾습니다
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {category.industries.map((industry) => (
                  <li
                    key={industry}
                    className="rounded-pill border border-line bg-ivory px-3.5 py-1.5 text-[12px] text-ink-2"
                  >
                    {industry}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 우 — 추천 기능 + CTA */}
          <aside className="xl:sticky xl:top-[calc(var(--spacing-header)+2rem)] xl:self-start">
            <div className="rounded-card border border-line bg-paper p-6 lg:p-7">
              <h2 className="text-[16px] font-bold text-navy">이런 기능을 추천합니다.</h2>
              <div className="mt-5">
                <CheckList items={category.recommendedFeatures} />
              </div>
            </div>

            <div className="on-navy mt-4 rounded-card bg-navy p-6 text-white lg:p-7">
              <p className="text-[15px] font-semibold leading-[1.6]">
                당신의 사업에 꼭 맞는 홈페이지,
                <br />
                <span className="text-gold">비즈네스타가 함께합니다.</span>
              </p>
              <div className="mt-5">
                <Button href={`/contact?category=${category.slug}`} size="md" arrow fullWidth>
                  맞춤 상담하기
                </Button>
              </div>
              <p className="mt-3 text-center text-[12px] text-white/45">
                선택하신 유형이 상담 내용에 함께 전달됩니다.
              </p>
            </div>
          </aside>
        </div>
      </Section>

      <BandCta
        quote={['좋은 선택이', '더 큰 비즈니스를 만듭니다.']}
        points={[
          { icon: 'chat', label: '빠른 상담' },
          { icon: 'doc', label: '맞춤 제안' },
          { icon: 'headset', label: '전문가 1:1 상담' },
        ]}
        ctaLabel="제작 상담하기"
        ctaHref="/contact"
        tone="navy"
      />
    </>
  );
}
