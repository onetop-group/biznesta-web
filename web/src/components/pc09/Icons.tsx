/** Line icons traced off BN_PC_09_CONTENT_GROWTH.png. Stroke colour comes from `currentColor`. */

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function SearchIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <circle cx="14" cy="13.5" r="9.5" />
        <path d="m21 20.5 7 7" />
      </g>
    </svg>
  );
}

export function DocIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <path d="M7 3.5h12L25 10v18.5H7z" />
        <path d="M18.5 3.5V10H25" />
        <path d="M11.5 16h9M11.5 20.5h9M11.5 25h5.5" />
      </g>
    </svg>
  );
}

export function ShareIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <circle cx="24" cy="6.5" r="4" />
        <circle cx="7" cy="16" r="4" />
        <circle cx="24" cy="25.5" r="4" />
        <path d="m10.5 14 10-5.5M10.5 18l10 5.5" />
      </g>
    </svg>
  );
}

export function BarsIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <rect x="3.5" y="20" width="5.5" height="8.5" />
        <rect x="13.5" y="12" width="5.5" height="16.5" />
        <rect x="23.5" y="4.5" width="5.5" height="24" />
      </g>
    </svg>
  );
}

export function GrowthIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <path d="M3.5 28.5h25" />
        <path d="M5 22.5 12.5 15l5 4.5L28 7" />
        <path d="M22.5 6.5H28.5V12.5" />
      </g>
    </svg>
  );
}

export function ImageIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <rect x="3.5" y="5.5" width="25" height="21" rx="2.5" />
        <circle cx="11" cy="12.5" r="2.5" />
        <path d="m5 23 7.5-7.5 5.5 5.5 4-4 5 5.5" />
      </g>
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <circle cx="16" cy="16" r="12.5" />
        <path d="M13 10.5 22 16l-9 5.5z" />
      </g>
    </svg>
  );
}

export function GearIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <circle cx="16" cy="16" r="4.5" />
        <path d="M25.5 16a9.5 9.5 0 0 0-.2-1.9l3-2.2-2.6-4.5-3.5 1.3a9.5 9.5 0 0 0-3.3-1.9L18.4 3h-4.8l-.5 3.8a9.5 9.5 0 0 0-3.3 1.9L6.3 7.4 3.7 11.9l3 2.2a9.5 9.5 0 0 0 0 3.8l-3 2.2 2.6 4.5 3.5-1.3a9.5 9.5 0 0 0 3.3 1.9l.5 3.8h4.8l.5-3.8a9.5 9.5 0 0 0 3.3-1.9l3.5 1.3 2.6-4.5-3-2.2c.13-.62.2-1.26.2-1.9z" />
      </g>
    </svg>
  );
}

export function ChevronIcon() {
  return (
    <svg viewBox="0 0 12 24" aria-hidden>
      <path d="m3 4 7 8-7 8" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
