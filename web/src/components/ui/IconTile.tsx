import { cx } from '@/lib/utils';
import { Icon, type IconName } from './Icon';

/**
 * 원형 아이콘 타일 — 시안의 카드 상단에 반복되는 요소입니다.
 * 밝은 배경에서는 크림색 원 + 골드 아이콘,
 * 네이비 밴드 안에서는 배경 없이 골드 아이콘만 씁니다 (시안 BN_PC_11 기준).
 */
export function IconTile({
  name,
  size = 'md',
  className,
}: {
  name: IconName;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const box = { sm: 'size-11', md: 'size-14', lg: 'size-16' }[size];
  const icon = { sm: 20, md: 24, lg: 28 }[size];

  return (
    <span
      className={cx(
        'inline-flex items-center justify-center rounded-full text-gold-deep',
        'bg-gold-pale [.on-navy_&]:bg-transparent [.on-navy_&]:text-gold',
        box,
        className,
      )}
    >
      <Icon name={name} size={icon} />
    </span>
  );
}
