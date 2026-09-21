/** Line icons for BN_PC_06, redrawn from the artwork. */
type P = { className?: string };

const stroke = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function CapIcon({ className }: P) {
  return (
    <svg viewBox="0 0 26 26" className={className} aria-hidden {...stroke}>
      <path d="M1.6 8.8 13 3.4l11.4 5.4L13 14.2Z" />
      <path d="M6.2 11v6.2c0 2.3 3 4.2 6.8 4.2s6.8-1.9 6.8-4.2V11" />
      <path d="M23.2 9.4v6.4" />
    </svg>
  );
}

export function DocIcon({ className }: P) {
  return (
    <svg viewBox="0 0 26 26" className={className} aria-hidden {...stroke}>
      <path d="M4.4 2.6h11l6.2 6.2v14.6H4.4Z" />
      <path d="M15.4 2.6v6.2h6.2" />
      <path d="M8.2 13h9.6M8.2 17h9.6M8.2 20.6h6" />
    </svg>
  );
}

export function BadgeIcon({ className }: P) {
  return (
    <svg viewBox="0 0 26 26" className={className} aria-hidden {...stroke}>
      <circle cx="13" cy="10" r="7.2" />
      <path d="M13 6.4 14.2 9l2.8.3-2.1 1.9.6 2.8-2.5-1.4-2.5 1.4.6-2.8-2.1-1.9L9.8 9Z" />
      <path d="m8.6 17.2-2 6.6 6.4-2.8 6.4 2.8-2-6.6" />
    </svg>
  );
}

export function PeopleIcon({ className }: P) {
  return (
    <svg viewBox="0 0 26 26" className={className} aria-hidden {...stroke}>
      <circle cx="9.6" cy="8.4" r="4" />
      <path d="M2.4 22.2c0-4 3.2-7.2 7.2-7.2s7.2 3.2 7.2 7.2" />
      <path d="M17.4 5.2a4 4 0 0 1 0 7.6" />
      <path d="M19.2 15.6c2.6.9 4.4 3.4 4.4 6.6" />
    </svg>
  );
}

export function BuildingIcon({ className }: P) {
  return (
    <svg viewBox="0 0 26 26" className={className} aria-hidden {...stroke}>
      <path d="M3.4 23.4V4.2h11.2v19.2" />
      <path d="M14.6 10h8v13.4" />
      <path d="M1.6 23.4h22.8" />
      <path d="M6.6 8h2M11 8h2M6.6 12.4h2M11 12.4h2M6.6 16.8h2M11 16.8h2M17.6 14h2M17.6 18.4h2" />
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

export function CrownIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M2.6 7.4 6.8 12l5.2-6.6L17.2 12l4.2-4.6 1.4 11.2H1.2Z" />
    </svg>
  );
}
