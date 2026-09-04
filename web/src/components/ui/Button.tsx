import Link from 'next/link';
import { cx } from '@/lib/utils';

/**
 * 버튼 — 시안에서 반복되는 3가지 형태만 정의합니다.
 *
 *   gold    골드 그라디언트 pill. 페이지의 주 CTA. 한 화면에 1~2개.
 *   navy    딥네이비 solid pill. 밝은 배경 위의 보조 강조.
 *   outline 테두리만. 밝은 배경 · 어두운 배경 모두에서 동작합니다.
 *
 * href 가 있으면 <Link>, 없으면 <button> 으로 렌더됩니다.
 */

type Variant = 'gold' | 'navy' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  gold: 'bg-gradient-to-r from-gold-soft to-gold text-navy shadow-[var(--shadow-pill)] hover:from-gold hover:to-gold-deep hover:text-white',
  navy: 'bg-navy text-white hover:bg-navy-soft',
  outline:
    'border border-current text-navy hover:bg-navy hover:text-white hover:border-navy [.on-navy_&]:text-white [.on-navy_&]:hover:bg-white [.on-navy_&]:hover:text-navy',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-6 text-[14px]',
  lg: 'h-14 px-8 text-[15px] lg:h-15 lg:px-10 lg:text-base',
};

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  /** 화살표(→)를 자동으로 붙입니다 — 시안의 CTA 대부분이 이 형태입니다 */
  arrow?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export function Button({
  children,
  href,
  variant = 'gold',
  size = 'md',
  arrow = false,
  fullWidth = false,
  className,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const classes = cx(
    'inline-flex items-center justify-center gap-2 rounded-pill font-semibold',
    'transition-all duration-200 whitespace-nowrap',
    'disabled:opacity-45 disabled:pointer-events-none',
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    className,
  );

  const content = (
    <>
      {children}
      {arrow && (
        <span aria-hidden="true" className="translate-y-px">
          →
        </span>
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled}>
      {content}
    </button>
  );
}
