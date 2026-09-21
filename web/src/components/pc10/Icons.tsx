/** Line icons traced off BN_PC_10_ADMIN_SYSTEM.png. Stroke colour comes from `currentColor`. */

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <circle cx="16" cy="16" r="12.5" />
        <path d="m10 16.5 4.2 4.2L22.5 11" />
      </g>
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <rect x="2.5" y="6.5" width="27" height="19" rx="2.5" />
        <path d="m3.5 8.5 12.5 9 12.5-9" />
      </g>
    </svg>
  );
}

export function PeopleIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <circle cx="12.5" cy="11" r="5.5" />
        <path d="M2.5 26.5c0-5 4.5-8 10-8s10 3 10 8" />
        <path d="M22 7.5a5 5 0 0 1 0 9.5" />
        <path d="M24.5 19.5c3 1.2 5 3.6 5 7" />
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

export function ImageIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <rect x="3" y="5.5" width="26" height="21" rx="2.5" />
        <circle cx="11" cy="12.5" r="2.5" />
        <path d="m4.5 23.5 8-8 5.5 5.5 4.5-4 6 6.5" />
      </g>
    </svg>
  );
}

export function BarsIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <rect x="3.5" y="19" width="6" height="9.5" />
        <rect x="13" y="11" width="6" height="17.5" />
        <rect x="22.5" y="3.5" width="6" height="25" />
      </g>
    </svg>
  );
}

export function GearIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <circle cx="16" cy="16" r="4.8" />
        <path d="M26 16c0-.7-.07-1.4-.2-2l3.1-2.3-2.7-4.7-3.6 1.4a10 10 0 0 0-3.5-2L18.6 2.5h-5.2l-.5 3.9a10 10 0 0 0-3.5 2L5.8 7 3.1 11.7l3.1 2.3a10 10 0 0 0 0 4L3.1 20.3 5.8 25l3.6-1.4a10 10 0 0 0 3.5 2l.5 3.9h5.2l.5-3.9a10 10 0 0 0 3.5-2l3.6 1.4 2.7-4.7-3.1-2.3c.13-.6.2-1.3.2-2z" />
      </g>
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g {...S}>
        <circle cx="16" cy="16" r="12.5" />
        <path d="M16 8v8.5l5.5 3.5" />
      </g>
    </svg>
  );
}
