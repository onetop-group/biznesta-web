import Link from 'next/link';
import { cx } from '@/lib/utils';

/**
 * 필터 칩 줄 — BN_PC_04 · BN_PC_07 상단.
 *
 * ⚠️ 클라이언트 상태가 아니라 URL 쿼리로 동작합니다.
 *    · 필터된 목록도 각각 주소를 가져 공유 · 색인이 됩니다.
 *    · JS 없이도 동작합니다.
 *    · Phase 6 에서 서버 필터링으로 바꿔도 화면은 그대로입니다.
 *
 * 칩이 15개를 넘으면 가로 스크롤됩니다 (카테고리 전체 노출 시).
 */
export interface FilterItem {
  key: string;
  label: string;
  href: string;
}

export function FilterBar({
  items,
  activeKey,
  tone = 'light',
  className,
  ariaLabel = '디자인 필터',
}: {
  items: FilterItem[];
  activeKey: string;
  tone?: 'light' | 'dark';
  className?: string;
  ariaLabel?: string;
}) {
  return (
    /**
     * 칩이 화면 폭을 넘으면 가로 스크롤됩니다.
     * 오른쪽 끝을 페이드 처리해 "더 있다"는 것을 눈으로 알 수 있게 합니다
     * (스크롤바를 숨겼기 때문에 이 단서가 없으면 잘린 것처럼 보입니다).
     */
    <nav aria-label={ariaLabel} className={cx('relative', className)}>
      <ul
        className={cx(
          'flex gap-2 overflow-x-auto pb-2 pr-10',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        )}
        style={{
          maskImage: 'linear-gradient(to right, black calc(100% - 40px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black calc(100% - 40px), transparent 100%)',
        }}
      >
        {items.map((item) => {
          const isActive = item.key === activeKey;
          return (
            <li key={item.key} className="shrink-0">
              <Link
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cx(
                  'inline-flex h-10 items-center whitespace-nowrap rounded-pill px-5 text-[13px] font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-navy text-white'
                    : tone === 'dark'
                      ? 'border border-white/20 bg-white/5 text-white/70 hover:border-gold/60 hover:text-white'
                      : 'border border-line bg-paper text-ink-2 hover:border-line-gold hover:text-navy',
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
