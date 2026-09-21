/** Line icons traced off BN_PC_08_SIGNATURE.png. Stroke colour comes from `currentColor`. */

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function TargetIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <circle cx="14.5" cy="17.5" r="11" />
        <circle cx="14.5" cy="17.5" r="6.5" />
        <circle cx="14.5" cy="17.5" r="2" />
        <path d="M14.5 17.5 27 5" />
        <path d="M23 4.2 27 5l.8 4" />
      </g>
    </svg>
  );
}

export function DiamondIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <path d="M3 12 16 27.5 29 12 24 5H8z" />
        <path d="M3 12h26" />
        <path d="M9 12 16 27.5 23 12" />
        <path d="m8 5-5 7m18-7 5 7" />
      </g>
    </svg>
  );
}

export function LayersIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <path d="M16 4 27 10.5 16 17 5 10.5z" />
        <path d="M5 16 16 22.5 27 16" />
        <path d="M5 21.5 16 28 27 21.5" />
      </g>
    </svg>
  );
}

export function SupportIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <path d="M7 20v-4a9 9 0 0 1 18 0v4" />
        <rect x="5" y="18.5" width="5.5" height="9" rx="2.5" />
        <rect x="21.5" y="18.5" width="5.5" height="9" rx="2.5" />
      </g>
    </svg>
  );
}

export function CrownIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <path d="M4 10.5 8.5 21h15L28 10.5 21.5 15 16 6.5 10.5 15z" />
        <path d="M8.5 24.5h15" />
      </g>
    </svg>
  );
}

export function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <circle cx="16" cy="16" r="12" />
        <path d="m10.5 16.5 4 4 7.5-9" />
      </g>
    </svg>
  );
}

export function BulbIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <path d="M16 4a9 9 0 0 1 5.5 16.1V23h-11v-2.9A9 9 0 0 1 16 4z" />
        <path d="M12.5 26h7M13.5 28.5h5" />
      </g>
    </svg>
  );
}

export function PenIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <path d="M23 3.5 28.5 9 11 26.5 4 28.5 6 21.5z" />
        <path d="m19.5 7 5.5 5.5M6 21.5 10.5 26" />
      </g>
    </svg>
  );
}

export function GearIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <circle cx="16" cy="16" r="4.5" />
        <path d="M16 2.5v4M16 25.5v4M29.5 16h-4M6.5 16h-4M25.5 6.5l-2.8 2.8M9.3 22.7l-2.8 2.8M25.5 25.5l-2.8-2.8M9.3 9.3 6.5 6.5" />
      </g>
    </svg>
  );
}

export function GrowthIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <path d="M4 28h24" />
        <rect x="5.5" y="19" width="4.5" height="8" />
        <rect x="13" y="14" width="4.5" height="13" />
        <rect x="20.5" y="8.5" width="4.5" height="18.5" />
        <path d="M6 12.5 13 7l5 3.5L27 3" />
        <path d="M22.5 3H27v4.5" />
      </g>
    </svg>
  );
}
