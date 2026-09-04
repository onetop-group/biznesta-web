import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { Icon, type IconName } from '@/components/ui/Icon';
import { cx } from '@/lib/utils';

/**
 * 페이지 하단 CTA 밴드.
 *
 * BN_PC 시안 대부분의 맨 아래에 있는 구조입니다.
 *   [ " 인용구 " ]      [아이콘 3~4]      [골드 CTA]
 *
 * tone
 *   navy  — 딥네이비 배경 (BN_PC_04 · 05 · 08 · 10)
 *   cream — 밝은 배경 (BN_PC_07 처럼 앞 섹션이 어두울 때)
 *
 * ⚠️ 페이지마다 리듬이 달라야 하므로 tone 을 번갈아 씁니다.
 *    같은 밴드를 같은 색으로 반복하면 시안의 리듬이 사라집니다.
 */
export function BandCta({
  quote,
  points,
  ctaLabel,
  ctaHref,
  note,
  tone = 'navy',
}: {
  quote: readonly string[];
  points: ReadonlyArray<{ icon: IconName; label: string }>;
  ctaLabel: string;
  ctaHref: string;
  note?: string;
  tone?: 'navy' | 'cream';
}) {
  const isNavy = tone === 'navy';

  return (
    <section
      aria-label="상담 안내"
      className={cx(isNavy ? 'on-navy bg-navy text-white' : 'bg-cream text-ink')}
    >
      <Container>
        <div className="flex flex-col gap-8 py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:py-12">
          <p
            className={cx(
              'max-w-[420px] text-[17px] font-semibold leading-[1.6] lg:text-[19px]',
              isNavy ? 'text-white' : 'text-navy',
            )}
          >
            {quote.map((line, index) => (
              <span key={line} className={cx('block', index > 0 && isNavy && 'text-gold')}>
                {index === 0 ? `“ ${line}` : `${line} ”`}
              </span>
            ))}
          </p>

          <ul className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:gap-x-10">
            {points.map((point) => (
              <li key={point.label} className="flex items-center gap-2.5">
                <Icon
                  name={point.icon}
                  size={22}
                  className={isNavy ? 'text-gold' : 'text-gold-deep'}
                />
                <span
                  className={cx('text-[13px]', isNavy ? 'text-white/75' : 'text-ink-2')}
                >
                  {point.label}
                </span>
              </li>
            ))}
          </ul>

          <div className="shrink-0">
            <Button href={ctaHref} size="lg" arrow variant={isNavy ? 'gold' : 'navy'}>
              {ctaLabel}
            </Button>
            {note && (
              <p
                className={cx(
                  'mt-2.5 text-center text-[12px]',
                  isNavy ? 'text-white/45' : 'text-muted',
                )}
              >
                {note}
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
