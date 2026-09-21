/** Line icons for BN_PC_03, redrawn from the artwork. */
type P = { className?: string };

const stroke = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/* ---- hero points ---- */

export function GemIcon({ className }: P) {
  return (
    <svg viewBox="0 0 28 26" className={className} aria-hidden {...stroke} strokeWidth={1.3}>
      <path d="M6.6 1.4h14.8l5.4 7.6L14 24.6 1.2 9Z" />
      <path d="M1.2 9h25.6" />
      <path d="M6.6 1.4 9.7 9 14 24.6 18.3 9l3.1-7.6" />
    </svg>
  );
}

export function StackIcon({ className }: P) {
  return (
    <svg viewBox="0 0 26 26" className={className} aria-hidden {...stroke} strokeWidth={1.3}>
      <ellipse cx="13" cy="5" rx="11.6" ry="3.9" />
      <path d="M1.4 5v7.9c0 2.2 5.2 3.9 11.6 3.9s11.6-1.7 11.6-3.9V5" />
      <path d="M1.4 12.9v7.8c0 2.2 5.2 3.9 11.6 3.9s11.6-1.7 11.6-3.9v-7.8" />
    </svg>
  );
}

export function GrowthIcon({ className }: P) {
  return (
    <svg viewBox="0 0 29 26" className={className} aria-hidden {...stroke} strokeWidth={1.3}>
      <path d="M1.2 24.6h26.4" />
      <rect x="1.6" y="17.4" width="4.9" height="7.2" rx="0.9" />
      <rect x="8.8" y="13" width="4.9" height="11.6" rx="0.9" />
      <rect x="16" y="8.8" width="4.9" height="15.8" rx="0.9" />
      <path d="M5.4 10.6 12 5.2l4.4 3.6 9.6-7" />
      <path d="M20.2 1.4h6v5.6" />
    </svg>
  );
}

/* ---- band points ---- */

export function DocIcon({ className }: P) {
  return (
    <svg viewBox="0 0 34 40" className={className} aria-hidden {...stroke} strokeWidth={1.4}>
      <path d="M1.8 3.2A1.5 1.5 0 0 1 3.3 1.7h16.1l13 12.9v22.2a1.5 1.5 0 0 1-1.5 1.5H3.3a1.5 1.5 0 0 1-1.5-1.5Z" />
      <path d="M19.4 1.7v13.1h12.9" />
      <path d="M7.6 21.4h12" />
      <path d="M7.6 26.8h18.4" />
      <path d="M7.6 32.2h14.6" />
    </svg>
  );
}

export function PenIcon({ className }: P) {
  return (
    <svg viewBox="0 0 34 40" className={className} aria-hidden {...stroke} strokeWidth={1.4}>
      <path d="M24.2 1.9a3.4 3.4 0 0 1 4.8 0l3.1 3.1a3.4 3.4 0 0 1 0 4.8L11.6 30.3 1.7 33.4l3.1-9.9Z" />
      <path d="m21.4 4.7 7.9 7.9" />
      <path d="M1.7 38.2h30.6" />
    </svg>
  );
}

export function GearIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke} strokeWidth={1.05}>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

export function ArrowRight({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke} strokeWidth={1.6}>
      <path d="M4 12h15M13.5 6.4 19.6 12l-6.1 5.6" />
    </svg>
  );
}

export const HERO_ICONS = { gem: GemIcon, stack: StackIcon, growth: GrowthIcon };
export const BAND_ICONS = { doc: DocIcon, pen: PenIcon, gear: GearIcon };
