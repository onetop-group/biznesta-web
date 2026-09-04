import { cx } from '@/lib/utils';

/**
 * 뱃지 — NEW · BEST · 디자인 등급 표시.
 * 시안 BN_PC_07(NEW), BN_PC_13(추천), BN_PC_06(SIGNATURE) 기준.
 */
type Tone = 'new' | 'best' | 'level' | 'muted';

const TONES: Record<Tone, string> = {
  new: 'bg-gradient-to-r from-gold-soft to-gold text-navy',
  best: 'bg-navy text-gold',
  level: 'border border-line-gold bg-gold-pale text-gold-deep',
  muted: 'border border-line bg-ivory text-muted',
};

export function Badge({
  children,
  tone = 'new',
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-pill px-3 py-1 text-[11px] font-bold tracking-wider',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
