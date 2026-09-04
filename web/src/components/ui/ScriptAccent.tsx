import { cx } from '@/lib/utils';

/**
 * 필기체 영문 악센트 — 시안 32장 중 30장에 등장하는 브랜드 시그니처입니다.
 * 예: "Your Business Our Solution", "More Than a Website"
 *
 * ⚠️ 장식 요소이므로 스크린리더에서 숨깁니다.
 *    의미 있는 문장은 반드시 본문 텍스트로 별도 제공합니다.
 */
export function ScriptAccent({
  lines,
  size = 'md',
  className,
}: {
  lines: readonly string[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const scale = {
    sm: 'text-[20px] lg:text-[26px]',
    md: 'text-[24px] lg:text-[34px]',
    lg: 'text-[30px] lg:text-[44px]',
  }[size];

  return (
    <p
      aria-hidden="true"
      className={cx(
        'font-script leading-[1.35] text-gold-deep [.on-navy_&]:text-gold-soft',
        scale,
        className,
      )}
    >
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </p>
  );
}
