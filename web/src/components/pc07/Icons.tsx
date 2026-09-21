/** Line icons for BN_PC_07, redrawn from the artwork. */
type P = { className?: string };

const stroke = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function GemIcon({ className }: P) {
  return (
    <svg viewBox="0 0 34 30" className={className} aria-hidden {...stroke} strokeWidth={1.3}>
      <path d="M8 1.4h18l6.6 8.8L17 28.6 1.4 10.2Z" />
      <path d="M1.4 10.2h31.2" />
      <path d="M8 1.4 11.6 10.2 17 28.6l5.4-18.4L26 1.4" />
    </svg>
  );
}

export function PeopleIcon({ className }: P) {
  return (
    <svg viewBox="0 0 32 30" className={className} aria-hidden {...stroke} strokeWidth={1.3}>
      <circle cx="12.4" cy="9.4" r="4.8" />
      <path d="M2.2 27.2c0-4.9 4.1-8.8 10.2-8.8s10.2 3.9 10.2 8.8" />
      <path d="M22.4 5.2a4.8 4.8 0 0 1 0 8.6" />
      <path d="M24.6 17.4c3.2 1 5.4 4 5.4 7.6" />
    </svg>
  );
}

export function MonitorIcon({ className }: P) {
  return (
    <svg viewBox="0 0 34 30" className={className} aria-hidden {...stroke} strokeWidth={1.3}>
      <rect x="1.4" y="2.2" width="24.4" height="17.4" rx="1.8" />
      <path d="M13.6 19.6v5M8.2 27h10.8" />
      <rect x="24.6" y="10.6" width="8" height="16.6" rx="1.6" />
      <path d="M27.4 24.6h2.4" />
    </svg>
  );
}

export function GrowthIcon({ className }: P) {
  return (
    <svg viewBox="0 0 32 30" className={className} aria-hidden {...stroke} strokeWidth={1.3}>
      <path d="M1.6 28.4h29" />
      <rect x="2" y="20" width="5.4" height="8.4" rx="1" />
      <rect x="10" y="15" width="5.4" height="13.4" rx="1" />
      <rect x="18" y="10" width="5.4" height="18.4" rx="1" />
      <path d="M6 12.4 13.4 6l4.8 4 10.4-8" />
      <path d="M22.6 1.6h6.6v6.2" />
    </svg>
  );
}

export function BulbIcon({ className }: P) {
  return (
    <svg viewBox="0 0 34 34" className={className} aria-hidden {...stroke} strokeWidth={1.4}>
      <path d="M17 2.4a10 10 0 0 0-6 18c1.2.9 1.9 2.2 1.9 3.6v1.2h8.2v-1.2c0-1.4.7-2.7 1.9-3.6a10 10 0 0 0-6-18Z" />
      <path d="M13.4 29h7.2M14.6 32h4.8" />
    </svg>
  );
}

export function PenIcon({ className }: P) {
  return (
    <svg viewBox="0 0 34 34" className={className} aria-hidden {...stroke} strokeWidth={1.4}>
      <path d="M23 2.4a3.2 3.2 0 0 1 4.5 0l4 4a3.2 3.2 0 0 1 0 4.5L11.6 30.8 2 33.4l2.6-9.6Z" />
      <path d="m20.4 5 8.6 8.6" />
    </svg>
  );
}

export function GearIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke} strokeWidth={1.15}>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}
