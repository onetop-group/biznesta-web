import type { DesignLevel, Palette } from '@/types';
import { designLevels } from '@/data/designs';
import { Icon } from '@/components/ui/Icon';
import { cx } from '@/lib/utils';

/**
 * 디자인 상세의 정보 블록들 — BN_PC_06 중간 밴드.
 * 컬러 팔레트 · 체크리스트 · 디자인 등급 세 가지를 한 파일에 모았습니다.
 */

/* ------------------------------------------------------------------ */

/**
 * 대표 4색 — 시안이 MAIN / POINT / SUB / TEXT 로 표기한 그대로입니다.
 * Phase 6 이후 관리자에서 디자인마다 입력합니다 (designs.palette).
 */
export function ColorSwatches({ palette }: { palette: Palette }) {
  const swatches: Array<{ role: string; hex: string }> = [
    { role: 'MAIN', hex: palette.main },
    { role: 'POINT', hex: palette.point },
    { role: 'SUB', hex: palette.sub },
    { role: 'TEXT', hex: palette.text },
  ];

  return (
    <ul className="flex gap-5">
      {swatches.map((swatch) => (
        <li key={swatch.role}>
          <span
            className="block size-11 rounded-full ring-1 ring-inset ring-black/10"
            style={{ backgroundColor: swatch.hex }}
          />
          <span className="u-eyebrow-tight mt-2.5 block text-[10px] font-bold text-navy">
            {swatch.role}
          </span>
          <span className="mt-0.5 block font-mono text-[10px] uppercase text-muted">
            {swatch.hex}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */

/** 체크리스트 — 추천 업종 · 적용 가능한 기능 · 추천 대상에 공통으로 씁니다 */
export function CheckList({
  items,
  tone = 'light',
  columns = 1,
}: {
  items: readonly string[];
  tone?: 'light' | 'dark';
  columns?: 1 | 2;
}) {
  return (
    <ul className={cx('grid gap-2.5', columns === 2 && 'sm:grid-cols-2 sm:gap-x-6')}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span
            aria-hidden="true"
            className={cx(
              'mt-[3px] flex size-[18px] shrink-0 items-center justify-center rounded-full',
              tone === 'dark' ? 'bg-gold/20 text-gold' : 'bg-gold-pale text-gold-deep',
            )}
          >
            <Icon name="check" size={11} />
          </span>
          <span
            className={cx(
              'text-[14px] leading-[1.6]',
              tone === 'dark' ? 'text-white/80' : 'text-ink-2',
            )}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */

/**
 * 디자인 등급 3카드 — 현재 디자인의 등급만 딥네이비로 강조합니다.
 *
 * ⚠️ 지시서 18항의 SIGNATURE(등급)이며,
 *    /signature 페이지(BIZNESTA 제작 방식)와는 다른 개념입니다.
 */
export function LevelCards({ active }: { active: DesignLevel }) {
  return (
    /* 좁은 열 안에 들어가므로 자간을 풀고 글자 크기를 줄여 넘침을 막습니다 */
    <ul className="grid grid-cols-3 gap-2">
      {designLevels.map((level) => {
        const isActive = level.key === active;
        return (
          <li
            key={level.key}
            className={cx(
              'min-w-0 rounded-tile border px-2 py-4 text-center transition-colors',
              isActive
                ? 'border-navy bg-navy text-white shadow-[var(--shadow-card)]'
                : 'border-line bg-paper',
            )}
          >
            <span
              aria-hidden="true"
              className={cx('mb-1 block text-[12px]', isActive ? 'text-gold' : 'text-transparent')}
            >
              ♛
            </span>
            <p
              className={cx(
                'text-[11px] font-bold tracking-[0.04em]',
                isActive ? 'text-white' : 'text-navy',
              )}
            >
              {level.label}
            </p>
            <p
              className={cx(
                'mt-2 text-[11px] leading-[1.55]',
                isActive ? 'text-gold-soft' : 'text-muted',
              )}
            >
              {level.description.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            {isActive && <span className="u-sr-only">현재 디자인의 등급입니다</span>}
          </li>
        );
      })}
    </ul>
  );
}
