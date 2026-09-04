import Link from 'next/link';
import type { Category } from '@/types';
import { WireframePreview } from '@/components/ui/WireframePreview';
import type { PreviewLayout } from '@/types';
import { cx } from '@/lib/utils';

/**
 * 홈페이지 유형 카드 — BN_PC_03.
 *
 * ⚠️ "아이콘 + 제목" 카드 15개를 똑같이 나열하지 않기 위해
 *    각 카드가 그 유형의 실제 화면 구조를 축소해 보여줍니다.
 *    유형마다 레이아웃과 색이 달라 그리드에 리듬이 생깁니다.
 *
 * Phase 6 에서 categories 테이블과 연결되며,
 * 썸네일이 등록되면 WireframePreview 자리에 실제 이미지가 들어갑니다.
 */

/** 유형별로 어울리는 미리보기 레이아웃 */
const LAYOUT_BY_SLUG: Record<string, PreviewLayout> = {
  corporate: 'corporate',
  store: 'store',
  expert: 'corporate',
  landing: 'landing',
  lead: 'landing',
  education: 'corporate',
  recruit: 'corporate',
  franchise: 'store',
  portfolio: 'gallery',
  shop: 'commerce',
  booking: 'landing',
  membership: 'dashboard',
  webapp: 'dashboard',
  admin: 'dashboard',
  content: 'gallery',
};

export function CategoryCard({ category, featured = false }: { category: Category; featured?: boolean }) {
  const layout = LAYOUT_BY_SLUG[category.slug] ?? 'corporate';

  return (
    <article className="group h-full">
      <Link
        href={`/category/${category.slug}`}
        className={cx(
          'flex h-full flex-col overflow-hidden rounded-card border border-line bg-paper',
          'shadow-[var(--shadow-card)] transition-all duration-400 ease-out',
          'hover:-translate-y-1.5 hover:border-line-gold hover:shadow-[var(--shadow-card-hover)]',
        )}
      >
        {/* 미리보기 */}
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: featured ? '16 / 9' : '16 / 10',
            backgroundColor: category.palette.sub,
          }}
        >
          <div className="absolute inset-x-4 top-4 bottom-0 overflow-hidden rounded-t-[6px] shadow-[0_12px_28px_-12px_rgba(13,35,64,0.45)] transition-transform duration-500 group-hover:-translate-y-1">
            <WireframePreview palette={category.palette} layout={layout} />
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
            style={{
              background: `linear-gradient(to top, ${category.palette.sub}, transparent)`,
            }}
          />
          {/* 번호 — 와이어프레임 위에 얹히므로 배지 형태로 대비를 확보합니다 */}
          <span className="u-eyebrow-tight absolute left-3 top-3 z-10 rounded-full bg-navy/85 px-2.5 py-1 text-[10px] font-bold text-gold">
            {String(category.no).padStart(2, '0')}
          </span>
        </div>

        {/* 본문 */}
        <div className={cx('flex flex-1 flex-col px-5 pb-5 pt-4', featured && 'lg:px-6 lg:pb-6')}>
          <p className="u-eyebrow-tight text-[10px] font-semibold text-gold-deep">
            {category.nameEn}
          </p>
          <h3
            className={cx(
              'mt-1.5 font-bold text-navy transition-colors group-hover:text-gold-deep',
              featured ? 'text-[19px]' : 'text-[16px]',
            )}
          >
            {category.name}
          </h3>
          <p className="mt-2 flex-1 text-[13px] leading-[1.6] text-ink-2">{category.tagline}</p>

          <span
            aria-hidden="true"
            className="mt-4 inline-flex size-8 items-center justify-center self-end rounded-full border border-line text-[13px] text-gold-deep transition-all duration-300 group-hover:border-gold-deep group-hover:bg-gold group-hover:text-navy"
          >
            →
          </span>
        </div>
      </Link>
    </article>
  );
}
