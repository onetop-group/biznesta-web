/** Gold line icons for the BN_PC_02 bottom band, redrawn from the artwork. */
type P = { className?: string };

const stroke = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** DESIGN — faceted gem, wider than tall. */
export function GemIcon({ className }: P) {
  return (
    <svg viewBox="0 0 49 41" className={className} aria-hidden {...stroke}>
      <path d="M11.4 2.2h26.2l9.6 12.1L24.5 38.8 2.2 14.3Z" />
      <path d="M2.2 14.3h44.6" />
      <path d="M11.4 2.2 16.9 14.3 24.5 38.8 32.1 14.3 37.6 2.2" />
      <path d="M16.9 14.3h15.2" />
    </svg>
  );
}

/** CONTENT — document with a folded corner and text rules. */
export function DocIcon({ className }: P) {
  return (
    <svg viewBox="0 0 37 41" className={className} aria-hidden {...stroke}>
      <path d="M2 3.6A1.6 1.6 0 0 1 3.6 2h17.6L35 15.8v21.6A1.6 1.6 0 0 1 33.4 39H3.6A1.6 1.6 0 0 1 2 37.4Z" />
      <path d="M21.2 2v14h13.8" />
      <path d="M8.4 22.6h13" />
      <path d="M8.4 28.4h20" />
      <path d="M8.4 34h16" />
    </svg>
  );
}

/** SYSTEM — stacked data cylinders. */
export function StackIcon({ className }: P) {
  return (
    <svg viewBox="0 0 37 41" className={className} aria-hidden {...stroke}>
      <ellipse cx="18.5" cy="8.4" rx="16.3" ry="6.2" />
      <path d="M2.2 8.4v11.8c0 3.4 7.3 6.2 16.3 6.2s16.3-2.8 16.3-6.2V8.4" />
      <path d="M2.2 20.2v12.2c0 3.4 7.3 6.2 16.3 6.2s16.3-2.8 16.3-6.2V20.2" />
    </svg>
  );
}

/** GROWTH — ascending bars with a rising arrow. */
export function GrowthIcon({ className }: P) {
  return (
    <svg viewBox="0 0 43 41" className={className} aria-hidden {...stroke}>
      <path d="M2 38.8h39" />
      <rect x="2.6" y="28.4" width="7.4" height="10.4" rx="1.1" />
      <rect x="13.4" y="21.4" width="7.4" height="17.4" rx="1.1" />
      <rect x="24.2" y="14.6" width="7.4" height="24.2" rx="1.1" />
      <path d="M9 17.6 18.6 9.4l6.4 5.4L38.6 3" />
      <path d="M30.6 2.2h8.4v8" />
    </svg>
  );
}

/** Header CTA arrow. */
export function ArrowRight({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke} strokeWidth={1.6}>
      <path d="M4 12h15M13.5 6.4 19.6 12l-6.1 5.6" />
    </svg>
  );
}

/** Utility-bar scroll cue. */
export function ArrowDown({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke} strokeWidth={1.5}>
      <path d="M12 4.6v14.4M6.6 13.2 12 19.4l5.4-6.2" />
    </svg>
  );
}

export const BAND_ICONS = {
  gem: GemIcon,
  doc: DocIcon,
  stack: StackIcon,
  growth: GrowthIcon,
};
