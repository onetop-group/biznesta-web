import { cx } from '@/lib/utils';

/**
 * 섹션 머리말 — 시안 32장 전체에서 반복되는 형태입니다.
 *
 *   BRAND MESSAGE          ← eyebrow (영문 대문자 + 넓은 자간)
 *   당신의 비즈니스가        ← title 1행
 *   오늘보다 내일 더 빛나도록. ← title 2행 (골드)
 *   설명 문장...            ← description
 *
 * title 배열의 마지막 줄이 자동으로 골드가 됩니다.
 * (시안의 대제목이 예외 없이 이 규칙을 따릅니다.)
 */
interface SectionHeaderProps {
  eyebrow?: string;
  title: readonly string[];
  description?: readonly string[];
  align?: 'left' | 'center';
  /** 마지막 줄을 골드로 강조할지 — 기본 true */
  accentLastLine?: boolean;
  className?: string;
  /** 문서 구조상 h1 이어야 하는 경우 */
  as?: 'h1' | 'h2';
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  accentLastLine = true,
  className,
  as: Heading = 'h2',
}: SectionHeaderProps) {
  const isCenter = align === 'center';

  return (
    <div className={cx(isCenter && 'text-center', className)}>
      {eyebrow && (
        <p className="u-eyebrow mb-4 text-[11px] font-semibold text-gold-deep lg:mb-5 lg:text-[13px] [.on-navy_&]:text-gold">
          {eyebrow}
        </p>
      )}

      <Heading className="text-[30px] font-bold leading-[1.28] sm:text-[38px] lg:text-[52px]">
        {title.map((line, index) => {
          const isLast = index === title.length - 1;
          return (
            <span
              key={line}
              className={cx(
                'block',
                accentLastLine && isLast && title.length > 1 && 'text-gold-deep [.on-navy_&]:text-gold',
              )}
            >
              {line}
            </span>
          );
        })}
      </Heading>

      {description && description.length > 0 && (
        <div
          className={cx(
            'mt-5 text-[15px] leading-[1.8] text-ink-2 lg:mt-7 lg:text-base',
            '[.on-navy_&]:text-white/75',
          )}
        >
          {description.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
