import { cx } from '@/lib/utils';

/**
 * 우측 세로 영문 키워드 컬럼.
 *
 * BN_PC 시안 16장 중 10장에 등장하는 BIZNESTA 의 가장 강한 시각 서명입니다.
 * 의미 전달보다 화면의 리듬을 만드는 장치이므로 스크린리더에서는 숨깁니다.
 *
 * 1279px 이하에서는 가로 공간이 부족해 자동으로 사라집니다.
 * (Phase 4 모바일에서는 다른 방식으로 대체합니다.)
 */
export function VerticalKeywords({
  words,
  tone = 'light',
  align = 'left',
  className,
}: {
  words: readonly string[];
  tone?: 'light' | 'dark';
  align?: 'left' | 'right';
  className?: string;
}) {
  return (
    <p
      aria-hidden="true"
      className={cx(
        'u-eyebrow-tight hidden shrink-0 text-[11px] leading-[2.4] xl:block',
        tone === 'dark' ? 'text-white/45' : 'text-muted',
        align === 'right' ? 'text-right' : 'text-left',
        className,
      )}
    >
      {words.map((word) => (
        <span key={word} className="block whitespace-nowrap">
          {word}
        </span>
      ))}
    </p>
  );
}
