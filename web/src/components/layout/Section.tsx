import { cx } from '@/lib/utils';
import { Container } from './Container';
import type { SectionTone } from '@/types';

/**
 * 섹션 밴드.
 *
 * ⚠️ 밴드 리듬 규칙 (시안 32장 실측: 밝은 68% / 네이비 32%)
 *    · 네이비 밴드를 연속으로 두지 않습니다.
 *    · 한 페이지에서 네이비 면적이 35% 를 넘지 않도록 합니다.
 *    이 규칙을 지키기 위해 배경색을 tone 으로만 지정하고,
 *    화면 파일에서 bg-* 클래스를 직접 쓰지 않습니다.
 *
 * tone="navy" 인 밴드에는 .on-navy 클래스가 함께 붙습니다.
 * 하위 컴포넌트(Button outline 등)가 이 클래스를 보고 색을 뒤집습니다.
 */

const TONES: Record<SectionTone, string> = {
  ivory: 'bg-ivory text-ink',
  'ivory-soft': 'bg-ivory-soft text-ink',
  cream: 'bg-cream text-ink',
  paper: 'bg-paper text-ink',
  navy: 'on-navy bg-navy text-white',
};

const PADDING = {
  sm: 'py-12 lg:py-16',
  md: 'py-16 lg:py-24',
  lg: 'py-20 lg:py-32',
} as const;

interface SectionProps {
  children: React.ReactNode;
  tone?: SectionTone;
  padding?: keyof typeof PADDING;
  /** Container 를 쓰지 않고 전체 폭을 직접 다뤄야 할 때 */
  bare?: boolean;
  wide?: boolean;
  id?: string;
  className?: string;
  /** 스크린리더용 섹션 이름 */
  ariaLabel?: string;
}

export function Section({
  children,
  tone = 'ivory',
  padding = 'md',
  bare = false,
  wide = false,
  id,
  className,
  ariaLabel,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cx(TONES[tone], PADDING[padding], className)}
    >
      {bare ? children : <Container wide={wide}>{children}</Container>}
    </section>
  );
}
