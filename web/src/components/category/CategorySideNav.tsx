import Link from 'next/link';
import { visibleCategories } from '@/data/categories';
import { cx } from '@/lib/utils';

/**
 * 좌측 카테고리 내비게이션 — BN_PC_05 의 3분할 중 왼쪽 영역.
 *
 * 시안에서는 목록이 그냥 나열돼 있지만, 15개가 되면 현재 위치를 잃기 쉬워
 * 활성 항목에 골드 화살표와 배경을 주고 sticky 로 고정했습니다.
 */
export function CategorySideNav({ activeSlug }: { activeSlug: string }) {
  return (
    <nav aria-label="홈페이지 유형" className="lg:sticky lg:top-[calc(var(--spacing-header)+2rem)]">
      <p className="u-eyebrow mb-5 text-[11px] font-semibold text-gold-deep">Website Category</p>
      <p className="mb-5 text-[17px] font-bold text-navy">홈페이지 유형</p>

      <ul className="space-y-0.5">
        {visibleCategories.map((category) => {
          const isActive = category.slug === activeSlug;
          return (
            <li key={category.slug}>
              <Link
                href={`/category/${category.slug}`}
                aria-current={isActive ? 'page' : undefined}
                className={cx(
                  'flex items-center justify-between gap-3 rounded-tile px-4 py-2.5 text-[14px] transition-colors duration-200',
                  isActive
                    ? 'bg-navy font-semibold text-white'
                    : 'text-ink-2 hover:bg-cream hover:text-navy',
                )}
              >
                <span className="min-w-0 truncate">{category.name}</span>
                <span
                  aria-hidden="true"
                  className={cx('shrink-0 text-[13px]', isActive ? 'text-gold' : 'text-transparent')}
                >
                  →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
