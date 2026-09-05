import Link from 'next/link';
import type { DesignSummary } from '@/types';
import { DesignCard } from './DesignCard';
import { cx } from '@/lib/utils';

/**
 * 디자인 그리드 + 페이지네이션.
 *
 * ⚠️ 확장성 (지시서 15 · 51항)
 *    디자인은 75개 → 수백 개로 늘어납니다. 그래서
 *      · 한 페이지에 12개만 렌더하고
 *      · 무한스크롤이 아니라 페이지네이션(?page=2)을 씁니다.
 *        무한스크롤은 뒷 페이지가 색인되지 않아 SEO 자산이 쌓이지 않습니다.
 *      · 목록에서는 원본 시안이 아니라 가벼운 미리보기만 그립니다.
 */
export function DesignGrid({
  designs,
  columns = 4,
  variant = 'plate',
  showTags = false,
  startIndex = 1,
}: {
  designs: DesignSummary[];
  columns?: 2 | 3 | 4;
  variant?: 'plate' | 'device' | 'wide';
  showTags?: boolean;
  startIndex?: number;
}) {
  if (designs.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line-gold bg-ivory-soft px-8 py-16 text-center">
        <p className="text-[15px] font-semibold text-navy">해당 조건의 디자인이 아직 없습니다.</p>
        <p className="mt-2 text-[13px] text-ink-2">
          다른 유형을 선택하시거나, 원하시는 스타일을 상담으로 알려주세요.
        </p>
      </div>
    );
  }

  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns];

  return (
    <ul className={cx('grid gap-x-6 gap-y-10 lg:gap-x-7 lg:gap-y-12', gridClass)}>
      {designs.map((design, i) => (
        <li key={design.id}>
          <DesignCard design={design} variant={variant} index={startIndex + i} showTags={showTags} />
        </li>
      ))}
    </ul>
  );
}

/**
 * 페이지네이션 — BN_PC_04 우하단의 "01 — 03 ← →" 표기를 재현합니다.
 */
export function DesignPagination({
  page,
  totalPages,
  basePath,
  query = {},
}: {
  page: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const buildHref = (target: number) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (target > 1) params.set('page', String(target));
    const search = params.toString();
    return search ? `${basePath}?${search}` : basePath;
  };

  const arrow = (direction: 'prev' | 'next') => {
    const target = direction === 'prev' ? page - 1 : page + 1;
    const disabled = direction === 'prev' ? page <= 1 : page >= totalPages;
    const label = direction === 'prev' ? '이전 페이지' : '다음 페이지';

    const classes = cx(
      'flex size-11 items-center justify-center rounded-full border text-[15px] transition-all',
      disabled
        ? 'cursor-not-allowed border-line text-muted/50'
        : 'border-line-gold text-navy hover:border-navy hover:bg-navy hover:text-white',
    );

    if (disabled) {
      return (
        <span aria-hidden="true" className={classes}>
          {direction === 'prev' ? '←' : '→'}
        </span>
      );
    }
    return (
      <Link href={buildHref(target)} aria-label={label} className={classes}>
        <span aria-hidden="true">{direction === 'prev' ? '←' : '→'}</span>
      </Link>
    );
  };

  return (
    <nav aria-label="디자인 목록 페이지" className="flex items-center justify-end gap-5">
      <p className="u-eyebrow-tight text-[12px] text-muted">
        <span className="font-bold text-navy">{String(page).padStart(2, '0')}</span>
        <span className="mx-2" aria-hidden="true">
          —
        </span>
        {String(totalPages).padStart(2, '0')}
      </p>
      <span className="flex gap-2">
        {arrow('prev')}
        {arrow('next')}
      </span>
    </nav>
  );
}
