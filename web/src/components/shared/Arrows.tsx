/**
 * Arrow glyphs shared by the PC_04+ screens.
 *
 * PC_01, PC_02 and PC_03 are approved and locked — they keep their own
 * icon files and are deliberately not refactored onto this module.
 */
type P = { className?: string };

const stroke = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function ArrowRight({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M4 12h15M13.5 6.4 19.6 12l-6.1 5.6" />
    </svg>
  );
}

export function ArrowLeft({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M20 12H5M10.5 6.4 4.4 12l6.1 5.6" />
    </svg>
  );
}

export function ArrowDown({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M12 4.6v14.4M6.6 13.2 12 19.4l5.4-6.2" />
    </svg>
  );
}
