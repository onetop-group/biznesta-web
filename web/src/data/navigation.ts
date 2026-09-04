import type { NavItem } from '@/types';

/**
 * 메인 내비게이션 — 지시서 11항 · BN_PC 시안 16장 공통.
 * 시안대로 영문(위) + 국문(아래) 2줄로 표기합니다.
 */
export const mainNav: NavItem[] = [
  { labelEn: 'DESIGN', labelKo: '홈페이지 디자인', href: '/design' },
  { labelEn: 'SERVICE', labelKo: '제작 서비스', href: '/service' },
  { labelEn: 'SOLUTION', labelKo: '맞춤 솔루션', href: '/solution' },
  { labelEn: 'PRICE', labelKo: '제작 비용', href: '/price' },
  { labelEn: 'PORTFOLIO', labelKo: '제작 사례', href: '/portfolio' },
  { labelEn: 'ABOUT', labelKo: '회사소개', href: '/about' },
  { labelEn: 'CONTACT', labelKo: '제작 상담', href: '/contact' },
];

/** 메인 CTA — 시안 전 페이지에서 반복되는 골드 pill 버튼 */
export const mainCta = { label: '제작 상담하기', href: '/contact' } as const;

/** 푸터 하단 링크 */
export const footerLinks: NavItem[] = [
  { labelEn: 'PRIVACY', labelKo: '개인정보처리방침', href: '/privacy' },
  { labelEn: 'TERMS', labelKo: '이용약관', href: '/terms' },
];

/**
 * 푸터 밴드의 4아이콘 — 시안 전 페이지 하단에 반복되는 신뢰 바.
 * 문구는 시안(BN_PC_01·10·13·16)에서 그대로 가져왔습니다.
 */
export const trustPoints = [
  { key: 'consult', label: '빠른 상담' },
  { key: 'proposal', label: '맞춤 제안' },
  { key: 'expert', label: '전문가 1:1 상담' },
] as const;
