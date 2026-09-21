/** Line icons for BN_PC_05, redrawn from the artwork. */
type P = { className?: string };

const stroke = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function HomeIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke} strokeWidth={1.4}>
      <path d="M3.6 10.4 12 3.4l8.4 7" />
      <path d="M5.6 9.2v10.4h12.8V9.2" />
      <path d="M9.8 19.6v-5.4h4.4v5.4" />
    </svg>
  );
}

export function CupIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M3.4 8.6h13.2v6.2a5 5 0 0 1-5 5H8.4a5 5 0 0 1-5-5Z" />
      <path d="M16.6 10.2h1.9a2.6 2.6 0 0 1 0 5.2h-1.9" />
      <path d="M2.2 22.4h16.2" />
      <path d="M7 2.2c-.9 1.2-.9 2.4 0 3.6M11.4 2.2c-.9 1.2-.9 2.4 0 3.6" />
    </svg>
  );
}

export function CalendarIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <rect x="2.6" y="4.4" width="18.8" height="17" rx="2.2" />
      <path d="M2.6 9.6h18.8" />
      <path d="M7.6 2.2v4.4M16.4 2.2v4.4" />
      <path d="M6.8 13.4h2M11 13.4h2M15.2 13.4h2M6.8 17.2h2M11 17.2h2" />
    </svg>
  );
}

export function PinIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M12 22.2s7.4-6.6 7.4-12A7.4 7.4 0 0 0 4.6 10.2c0 5.4 7.4 12 7.4 12Z" />
      <circle cx="12" cy="10" r="2.9" />
    </svg>
  );
}

export function ShareIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <circle cx="18.4" cy="5.4" r="2.9" />
      <circle cx="5.6" cy="12" r="2.9" />
      <circle cx="18.4" cy="18.6" r="2.9" />
      <path d="m8.2 10.6 7.6-3.9M8.2 13.4l7.6 3.9" />
    </svg>
  );
}

export function CheckIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke} strokeWidth={2.6}>
      <path d="m4.6 12.4 5 5 9.8-10.4" />
    </svg>
  );
}
