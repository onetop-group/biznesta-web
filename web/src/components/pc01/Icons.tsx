/** Line icons for the BN_PC_01 navy band, redrawn from the artwork. */
type P = { className?: string };

const stroke = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function MonitorIcon({ className }: P) {
  return (
    <svg viewBox="0 0 35 34" className={className} aria-hidden {...stroke}>
      <rect x="0.9" y="0.9" width="33.2" height="21.8" rx="2.5" />
      <path d="M17.5 22.7v6.1M9.2 32.8h16.6" />
    </svg>
  );
}

export function PaletteIcon({ className }: P) {
  return (
    <svg viewBox="2.5 2.5 31 31.4" className={className} aria-hidden {...stroke}>
      <path d="M18 3.4c8.2 0 14.6 6 14.6 13.3 0 4.2-3.3 6.6-6.9 6.6h-2.5c-2 0-3.6 1.5-3.6 3.4 0 .9.3 1.6.8 2.2.5.7.8 1.4.8 2.2 0 1.8-1.6 3.3-3.5 3.3-8 0-14.4-7.4-14.4-16.2C3.3 9.9 9.7 3.4 18 3.4Z" />
      <circle cx="11.4" cy="14.6" r="1.55" />
      <circle cx="17.4" cy="9.9" r="1.55" />
      <circle cx="24" cy="12.6" r="1.55" />
      <circle cx="11.8" cy="22.2" r="1.55" />
    </svg>
  );
}

export function GearIcon({ className }: P) {
  return (
    <svg viewBox="0.5 0.5 23 23" className={className} aria-hidden {...stroke} strokeWidth={1.15}>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

export function ChartIcon({ className }: P) {
  return (
    <svg viewBox="2.4 4.4 31.4 28.6" className={className} aria-hidden fill="currentColor">
      <rect x="2.4"  y="25.2" width="5" height="7.8"  rx="1.2" />
      <rect x="11.2" y="19.4" width="5" height="13.6" rx="1.2" />
      <rect x="20"   y="13"   width="5" height="20"   rx="1.2" />
      <rect x="28.8" y="4.4"  width="5" height="28.6" rx="1.2" />
    </svg>
  );
}

export function ArrowRight({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke} strokeWidth={1.5}>
      <path d="M4 12h15M13.5 6.4 19.6 12l-6.1 5.6" />
    </svg>
  );
}

export function ArrowDown({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke} strokeWidth={1.5}>
      <path d="M12 4v15M6.4 12.9 12 19.4l5.6-6.5" />
    </svg>
  );
}

export function SearchIcon({ className }: P) {
  return (
    <svg viewBox="3.3 3.3 17.6 17.6" className={className} aria-hidden {...stroke} strokeWidth={1.6}>
      <circle cx="10.6" cy="10.6" r="6.9" />
      <path d="m15.8 15.8 4.6 4.6" />
    </svg>
  );
}

export function ChatIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke} strokeWidth={1.4}>
      <path d="M20.4 11.4c0 4-3.8 7.2-8.4 7.2-1 0-2-.15-2.9-.43L4 20l1.5-3.5A6.9 6.9 0 0 1 3.6 11.4c0-4 3.8-7.2 8.4-7.2s8.4 3.2 8.4 7.2Z" />
      <path d="M8.6 11.5h.01M12 11.5h.01M15.4 11.5h.01" strokeWidth={2.1} />
    </svg>
  );
}

export const BAND_ICONS = {
  monitor: MonitorIcon,
  palette: PaletteIcon,
  gear: GearIcon,
  chart: ChartIcon,
};
