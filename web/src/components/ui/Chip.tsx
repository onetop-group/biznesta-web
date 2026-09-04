import Link from 'next/link';
import { cx } from '@/lib/utils';

/**
 * 필터 칩 — BN_PC_04 / BN_PC_07 / BN_MO_04 의 카테고리 필터.
 * 선택된 칩은 네이비 solid, 나머지는 흰 배경 + 얇은 선입니다.
 */
export function Chip({
  children,
  href,
  active = false,
  className,
}: {
  children: React.ReactNode;
  href?: string;
  active?: boolean;
  className?: string;
}) {
  const classes = cx(
    'inline-flex h-10 items-center rounded-pill px-5 text-[13px] font-medium',
    'transition-colors duration-200 whitespace-nowrap',
    active
      ? 'bg-navy text-white'
      : 'border border-line bg-paper text-ink-2 hover:border-line-gold hover:text-navy',
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-current={active ? 'page' : undefined}>
        {children}
      </Link>
    );
  }
  return <span className={classes}>{children}</span>;
}
