import Link from 'next/link';
import { cx } from '@/lib/utils';

/**
 * 빵부스러기 — BN_PC_05 · BN_PC_06 상단에 등장합니다.
 * 디자인 상세가 독립 URL 이자 SEO 자산이 되므로,
 * Phase 10 에서 여기에 BreadcrumbList JSON-LD 를 붙입니다.
 */
export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({
  items,
  tone = 'light',
  className,
}: {
  items: Crumb[];
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <nav aria-label="현재 위치" className={className}>
      <ol
        className={cx(
          'u-eyebrow-tight flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]',
          tone === 'dark' ? 'text-white/55' : 'text-muted',
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cx(
                    'transition-colors',
                    tone === 'dark' ? 'hover:text-gold' : 'hover:text-gold-deep',
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={tone === 'dark' ? 'text-gold' : 'text-gold-deep'}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <span aria-hidden="true">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
