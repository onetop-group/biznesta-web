import { cx } from '@/lib/utils';

/**
 * 카드 — 시안의 카드 그리드 기본형.
 * 밝은 배경 위 흰 카드 + 얇은 선 + 넓게 퍼지는 낮은 그림자.
 */
export function Card({
  children,
  as: Tag = 'div',
  hover = false,
  className,
}: {
  children: React.ReactNode;
  as?: 'div' | 'article' | 'li';
  /** 링크 카드처럼 마우스 반응이 필요할 때 */
  hover?: boolean;
  className?: string;
}) {
  return (
    <Tag
      className={cx(
        'rounded-card border border-line bg-ivory-soft p-6 lg:p-8',
        'shadow-[var(--shadow-card)]',
        '[.on-navy_&]:border-navy-line [.on-navy_&]:bg-navy-soft [.on-navy_&]:shadow-none',
        hover &&
          'transition-all duration-300 hover:-translate-y-1 hover:border-line-gold hover:shadow-[var(--shadow-card-hover)]',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
