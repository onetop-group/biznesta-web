import Link from 'next/link';
import type { DesignSummary } from '@/types';
import { getCategory } from '@/data/categories';
import { Badge } from '@/components/ui/Badge';
import { DeviceMockup } from '@/components/ui/DeviceMockup';
import { cx } from '@/lib/utils';

/**
 * 디자인 카드 — 쇼룸 · 카테고리 상세 · 신규 디자인 · 관련 디자인에서 공통으로 씁니다.
 *
 * ⚠️ 카드 안의 화면은 시안 이미지를 자른 것이 아니라
 *    DeviceMockup + WireframePreview 로 그린 것입니다.
 *    design_images 가 연결되면 같은 자리에 실제 이미지가 들어갑니다.
 *
 * size
 *   md — 4열 그리드 (BN_PC_04 쇼룸)
 *   lg — 2열 그리드 (BN_PC_07 신규 디자인)
 *   sm — 3~4열 좁은 카드 (BN_PC_05 추천 시안 · BN_PC_06 관련 디자인)
 */
export function DesignCard({
  design,
  size = 'md',
  index,
  showTags = false,
}: {
  design: DesignSummary;
  size?: 'sm' | 'md' | 'lg';
  /** 시안의 01 · 02 · 03 번호 표기 */
  index?: number;
  showTags?: boolean;
}) {
  const category = getCategory(design.categorySlug);

  return (
    <article className="group relative">
      <Link href={`/design/${design.slug}`} className="block">
        {/* 미리보기 영역 */}
        <div
          className={cx(
            'relative overflow-hidden rounded-card',
            'transition-all duration-500 ease-out',
            'shadow-[var(--shadow-card)] group-hover:-translate-y-1.5 group-hover:shadow-[var(--shadow-card-hover)]',
          )}
          style={{
            aspectRatio: size === 'lg' ? '16 / 10' : '4 / 3',
            background: `linear-gradient(150deg, ${design.palette.sub} 0%, #ffffff 55%, ${design.palette.sub} 100%)`,
          }}
        >
          {/* 은은한 광원 — 시안의 "빛과 공간감" */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-1/4 -top-1/3 size-[70%] rounded-full opacity-45 blur-3xl"
            style={{ backgroundColor: design.palette.point }}
          />

          {/*
            카드 크기에 따라 목업 여백과 폰 비율을 다르게 둡니다.
            lg 카드에서 폰 비율을 그대로 두면 폰이 노트북 화면을 절반 가까이 덮습니다.
          */}
          <div
            className={cx(
              'absolute inset-0 flex items-end justify-center',
              size === 'sm' && 'px-5 pt-6',
              size === 'md' && 'px-7 pt-8 lg:px-9 lg:pt-10',
              size === 'lg' && 'px-10 pt-10 lg:px-14 lg:pt-12',
            )}
          >
            <DeviceMockup
              source={{ palette: design.palette, layout: design.previewLayout }}
              variant="duo"
              className={cx(
                'w-full transition-transform duration-500 ease-out',
                size === 'lg'
                  ? 'translate-y-[5%] group-hover:translate-y-[2%]'
                  : 'translate-y-[8%] group-hover:translate-y-[5%]',
              )}
              phoneScale={size === 'sm' ? 0.24 : size === 'lg' ? 0.2 : 0.26}
            />
          </div>

          {/* 좌상단 번호 · NEW */}
          <div className="absolute left-4 top-4 flex items-center gap-2 lg:left-5 lg:top-5">
            {design.isNew && <Badge tone="new">NEW</Badge>}
            {typeof index === 'number' && !design.isNew && (
              <span className="u-eyebrow-tight text-[12px] font-bold text-navy/45">
                {String(index).padStart(2, '0')}
              </span>
            )}
          </div>

          {/* 우상단 카테고리 */}
          {category && (
            <span className="u-eyebrow-tight absolute right-4 top-4 text-[10px] font-semibold text-navy/40 lg:right-5 lg:top-5">
              {category.nameEn}
            </span>
          )}
        </div>
      </Link>

      {/* 카드 하단 정보 */}
      <div className={cx('flex items-start justify-between gap-4', size === 'sm' ? 'pt-4' : 'pt-5')}>
        <div className="min-w-0">
          <h3
            className={cx(
              'font-bold text-navy transition-colors group-hover:text-gold-deep',
              size === 'lg' ? 'text-[19px]' : 'text-[16px]',
            )}
          >
            <Link href={`/design/${design.slug}`}>{design.title}</Link>
          </h3>
          <p className="mt-1.5 text-[13px] leading-[1.65] text-ink-2">{design.shortDescription}</p>

          <p className="u-eyebrow-tight mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-muted">
            <span>{category?.name}</span>
            <span aria-hidden="true">·</span>
            <span>{design.industry}</span>
            <span aria-hidden="true">·</span>
            <span className="text-gold-deep">{design.level}</span>
          </p>

          {showTags && design.tags.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {design.tags.slice(0, 3).map((tag) => (
                <li
                  key={tag}
                  className="rounded-pill border border-line bg-ivory-soft px-2.5 py-1 text-[11px] text-ink-2"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>

        <span
          aria-hidden="true"
          className={cx(
            'mt-0.5 flex shrink-0 items-center justify-center rounded-full border border-line-gold text-gold-deep',
            'transition-all duration-300 group-hover:border-gold-deep group-hover:bg-gold group-hover:text-navy',
            size === 'sm' ? 'size-8 text-[13px]' : 'size-10 text-[15px]',
          )}
        >
          →
        </span>
      </div>
    </article>
  );
}
