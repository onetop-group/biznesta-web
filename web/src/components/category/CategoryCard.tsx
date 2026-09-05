import Link from 'next/link';
import type { Category } from '@/types';
import { DeviceMockup } from '@/components/ui/DeviceMockup';
import { WireframePreview } from '@/components/ui/WireframePreview';
import { getDesignForCategory } from '@/data/designs';
import { cx } from '@/lib/utils';

/**
 * 홈페이지 유형 카드 — BN_PC_03.
 *
 * ▸ 아이콘 카드 15개 나열을 피하는 방법
 *   각 카드가 그 유형을 대표하는 실제 BIZNESTA 샘플 화면을 보여줍니다.
 *   유형마다 색 · 타이포 · 구조가 전부 달라 그리드 자체에 리듬이 생깁니다.
 *
 * ▸ size — Curated Design Index 의 시각 위계
 *   feature  2칸을 차지하는 대표 유형
 *   medium   기본
 *   compact  화면을 작게 쓰고 텍스트 위주
 *
 * Phase 6 에서 categories 와 연결되고, 대표 디자인은
 * designs 에서 카테고리별로 자동으로 뽑습니다.
 */
export function CategoryCard({
  category,
  size = 'medium',
}: {
  category: Category;
  size?: 'feature' | 'medium' | 'compact';
}) {
  const design = getDesignForCategory(category.slug);

  const ratio = size === 'feature' ? '16 / 9' : size === 'compact' ? '16 / 10' : '4 / 3';

  return (
    <article className="group h-full">
      <Link
        href={`/category/${category.slug}`}
        className={cx(
          'flex h-full flex-col overflow-hidden rounded-card bg-paper ring-1 ring-line',
          'shadow-[0_2px_10px_-4px_rgba(13,35,64,0.08)] transition-all duration-500 ease-out',
          'hover:-translate-y-1.5 hover:shadow-[0_26px_54px_-22px_rgba(13,35,64,0.3)] hover:ring-line-gold',
        )}
      >
        {/* 실제 샘플 화면 */}
        <div className="relative overflow-hidden" style={{ aspectRatio: ratio }}>
          <div className="absolute inset-0 origin-top transition-transform duration-700 ease-out group-hover:scale-[1.035]">
            {design ? (
              <DeviceMockup source={{ design }} variant="frame" ratio="16 / 10" className="size-full" />
            ) : (
              <WireframePreview palette={category.palette} layout="corporate" />
            )}
          </div>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: 'linear-gradient(to top, rgba(13,35,64,0.24), transparent 52%)' }}
          />

          <span className="u-eyebrow-tight absolute left-3.5 top-3.5 rounded-full bg-navy/85 px-2.5 py-1 text-[10px] font-bold text-gold backdrop-blur-sm">
            {String(category.no).padStart(2, '0')}
          </span>
        </div>

        {/* 본문 */}
        <div
          className={cx(
            'flex flex-1 flex-col border-t border-line',
            size === 'feature' ? 'px-6 pb-6 pt-5 lg:px-7 lg:pb-7' : 'px-5 pb-5 pt-4',
          )}
        >
          <p className="u-eyebrow-tight text-[10px] font-semibold text-gold-deep">
            {category.nameEn}
          </p>
          <h3
            className={cx(
              'mt-2 font-bold text-navy transition-colors group-hover:text-gold-deep',
              size === 'feature' ? 'text-[21px] lg:text-[23px]' : 'text-[16px]',
            )}
          >
            {category.name}
          </h3>
          <p
            className={cx(
              'mt-2 flex-1 leading-[1.65] text-ink-2',
              size === 'feature' ? 'text-[14px]' : 'text-[13px]',
            )}
          >
            {category.tagline}
          </p>

          <span
            aria-hidden="true"
            className={cx(
              'mt-4 inline-flex items-center justify-center self-end rounded-full border border-line text-gold-deep',
              'transition-all duration-300 group-hover:border-gold-deep group-hover:bg-gold group-hover:text-navy',
              size === 'feature' ? 'size-10 text-[15px]' : 'size-8 text-[13px]',
            )}
          >
            →
          </span>
        </div>
      </Link>
    </article>
  );
}
