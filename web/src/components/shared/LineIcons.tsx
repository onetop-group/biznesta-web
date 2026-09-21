/**
 * Line icon set shared by the PC 12–16 screens.
 * PC 01–11 keep their own per-screen icon files so those approved screens
 * cannot be disturbed by anything added here.
 * Stroke colour always comes from `currentColor`.
 */

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const box = (children: React.ReactNode) => (
  <svg viewBox="0 0 32 32" aria-hidden><g {...S}>{children}</g></svg>
);

export const MonitorIcon = () => box(<>
  <rect x="2.5" y="5" width="27" height="18" rx="2.5" />
  <path d="M12 27h8M16 23v4" />
</>);

export const PenIcon = () => box(<>
  <path d="M23 3.5 28.5 9 11 26.5 4 28.5 6 21.5z" />
  <path d="m19.5 7 5.5 5.5M6 21.5 10.5 26" />
</>);

export const ShareIcon = () => box(<>
  <circle cx="24" cy="6.5" r="4" />
  <circle cx="7" cy="16" r="4" />
  <circle cx="24" cy="25.5" r="4" />
  <path d="m10.5 14 10-5.5M10.5 18l10 5.5" />
</>);

export const GearIcon = () => box(<>
  <circle cx="16" cy="16" r="4.8" />
  <path d="M26 16c0-.7-.07-1.4-.2-2l3.1-2.3-2.7-4.7-3.6 1.4a10 10 0 0 0-3.5-2L18.6 2.5h-5.2l-.5 3.9a10 10 0 0 0-3.5 2L5.8 7 3.1 11.7l3.1 2.3a10 10 0 0 0 0 4L3.1 20.3 5.8 25l3.6-1.4a10 10 0 0 0 3.5 2l.5 3.9h5.2l.5-3.9a10 10 0 0 0 3.5-2l3.6 1.4 2.7-4.7-3.1-2.3c.13-.6.2-1.3.2-2z" />
</>);

export const BarsIcon = () => box(<>
  <rect x="3.5" y="19" width="6" height="9.5" />
  <rect x="13" y="11" width="6" height="17.5" />
  <rect x="22.5" y="3.5" width="6" height="25" />
</>);

export const BulbIcon = () => box(<>
  <path d="M16 3.5a9.5 9.5 0 0 1 5.8 17V23h-11.6v-2.5A9.5 9.5 0 0 1 16 3.5z" />
  <path d="M12.2 26h7.6M13.2 28.5h5.6" />
</>);

export const DiamondIcon = () => box(<>
  <path d="M3 12 16 27.5 29 12 24 5H8z" />
  <path d="M3 12h26" />
  <path d="M9 12 16 27.5 23 12" />
  <path d="m8 5-5 7m18-7 5 7" />
</>);

export const PeopleIcon = () => box(<>
  <circle cx="12.5" cy="11" r="5.5" />
  <path d="M2.5 26.5c0-5 4.5-8 10-8s10 3 10 8" />
  <path d="M22 7.5a5 5 0 0 1 0 9.5" />
  <path d="M24.5 19.5c3 1.2 5 3.6 5 7" />
</>);

export const DocIcon = () => box(<>
  <path d="M7 3.5h12L25 10v18.5H7z" />
  <path d="M18.5 3.5V10H25" />
  <path d="M11.5 16h9M11.5 20.5h9M11.5 25h5.5" />
</>);

export const PlayIcon = () => box(<>
  <circle cx="16" cy="16" r="12.5" />
  <path d="M13 10.5 22 16l-9 5.5z" />
</>);

export const HeadsetIcon = () => box(<>
  <path d="M7 20v-4a9 9 0 0 1 18 0v4" />
  <rect x="5" y="18.5" width="5.5" height="9" rx="2.5" />
  <rect x="21.5" y="18.5" width="5.5" height="9" rx="2.5" />
</>);

export const CheckCircleIcon = () => box(<>
  <circle cx="16" cy="16" r="12.5" />
  <path d="m10 16.5 4.2 4.2L22.5 11" />
</>);

export const ClockIcon = () => box(<>
  <circle cx="16" cy="16" r="12.5" />
  <path d="M16 8v8.5l5.5 3.5" />
</>);

export const MailIcon = () => box(<>
  <rect x="2.5" y="6.5" width="27" height="19" rx="2.5" />
  <path d="m3.5 8.5 12.5 9 12.5-9" />
</>);

export const PinIcon = () => box(<>
  <path d="M16 29c6-7.5 10-12.4 10-17A10 10 0 0 0 6 12c0 4.6 4 9.5 10 17z" />
  <circle cx="16" cy="12" r="4" />
</>);

export const ChatIcon = () => box(<>
  <path d="M16 5c7.2 0 13 4.3 13 9.5S23.2 24 16 24c-1.3 0-2.6-.14-3.8-.4L5 27l2-5.4C4.5 19.9 3 17.4 3 14.5 3 9.3 8.8 5 16 5z" />
  <path d="M11 14.5h.01M16 14.5h.01M21 14.5h.01" strokeWidth="2.6" />
</>);

export const SearchIcon = () => box(<>
  <circle cx="14" cy="13.5" r="9.5" />
  <path d="m21 20.5 7 7" />
</>);

export const RocketIcon = () => box(<>
  <path d="M16 2.5c5 4 7.5 9 7.5 14.5L20 21h-8l-3.5-4C8.5 11.5 11 6.5 16 2.5z" />
  <circle cx="16" cy="13" r="3" />
  <path d="M12 21c-2.5 1.5-3.5 4-3.5 7 3 0 5.5-1 7-3.5M20 21c2.5 1.5 3.5 4 3.5 7-3 0-5.5-1-7-3.5" />
</>);

export const ShieldIcon = () => box(<>
  <path d="M16 3 27 7v9c0 6.6-4.5 11.4-11 13.5C9.5 27.4 5 22.6 5 16V7z" />
  <path d="m11 16 3.5 3.5L22 12" />
</>);

export const GrowthIcon = () => box(<>
  <path d="M3.5 28.5h25" />
  <path d="M5 22.5 12.5 15l5 4.5L28 7" />
  <path d="M22.5 6.5H28.5V12.5" />
</>);

export const CrownIcon = () => box(<>
  <path d="M4 10.5 8.5 21h15L28 10.5 21.5 15 16 6.5 10.5 15z" />
  <path d="M8.5 24.5h15" />
</>);

export const ChevronIcon = () => (
  <svg viewBox="0 0 12 24" aria-hidden>
    <path d="m3 4 7 8-7 8" fill="none" stroke="currentColor" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MegaphoneIcon = () => box(<>
  <path d="M4 12.5v6a2.5 2.5 0 0 0 2.5 2.5H10l12 6.5V6L10 12.5H6.5A2.5 2.5 0 0 0 4 15z" />
  <path d="M22 6 29 3v26l-7-3" />
  <path d="M10 21v6.5h4.5" />
</>);

export const HandshakeIcon = () => box(<>
  <path d="M2.5 12.5 8 8l5 3.5 4-1.5 4 1.5 5.5-4.5" />
  <path d="M13 11.5 8.5 16a2.5 2.5 0 0 0 3.5 3.5l1.5-1.5 2.5 2.5a2.3 2.3 0 0 0 3.3-3.3l2 2a2.3 2.3 0 0 0 3.2-3.2" />
  <path d="M2.5 12.5 6 20M29.5 12.5 26 20" />
</>);

export const CodeIcon = () => box(<>
  <path d="m11 9-8 7 8 7M21 9l8 7-8 7" />
  <path d="m18.5 5-5 22" />
</>);

export const ClipboardIcon = () => box(<>
  <path d="M11 5H7.5v23.5h17V5H21" />
  <rect x="11" y="2.5" width="10" height="5.5" rx="1.5" />
  <path d="m11.5 15 2.5 2.5 5-5M11.5 22l2.5 2.5 5-5" />
</>);

export const CloudIcon = () => box(<>
  <path d="M9 24.5a6 6 0 0 1-.5-12 8.5 8.5 0 0 1 16.2 2.2A5.6 5.6 0 0 1 24 24.5z" />
  <path d="M16 27V15m0 0-3.5 3.5M16 15l3.5 3.5" />
</>);

export const HeartIcon = () => box(<>
  <path d="M16 27.5C8 22 3.5 17.8 3.5 12.8A7.3 7.3 0 0 1 16 8a7.3 7.3 0 0 1 12.5 4.8c0 5-4.5 9.2-12.5 14.7z" />
</>);

export const PhoneIcon = () => box(<>
  <path d="M11 4.5 14 10l-3 3c1.5 3.2 4.3 6 7.5 7.5l3-3 5.5 3v5a2 2 0 0 1-2.2 2C13.5 26.6 5.4 18.5 4.5 6.7A2 2 0 0 1 6.5 4.5z" />
</>);

export const KakaoIcon = () => box(<>
  <path d="M16 5c6.6 0 12 3.9 12 8.8s-5.4 8.8-12 8.8c-.9 0-1.8-.07-2.6-.2L7 26l1.6-4.6C6 19.8 4 16.9 4 13.8 4 8.9 9.4 5 16 5z" />
</>);

export const TrainIcon = () => box(<>
  <rect x="7" y="3.5" width="18" height="18" rx="3" />
  <path d="M7 13h18" />
  <circle cx="11.5" cy="17.5" r="1.4" strokeWidth="1.4" />
  <circle cx="20.5" cy="17.5" r="1.4" strokeWidth="1.4" />
  <path d="m10 21.5-3 7M22 21.5l3 7" />
</>);

export const CarIcon = () => box(<>
  <path d="M4 20v-4l3-7h18l3 7v4" />
  <rect x="3" y="20" width="26" height="5" rx="1.6" />
  <path d="M7 25v2.5M25 25v2.5" />
  <circle cx="9" cy="22.5" r="1.3" strokeWidth="1.3" />
  <circle cx="23" cy="22.5" r="1.3" strokeWidth="1.3" />
</>);
