/**
 * BN_MO_01_HERO — content.
 *
 * Mobile is authored from its own artwork, not from the PC screen: every
 * value below is measured off BN_MO_01_HERO.png (1024 x 1536 canvas).
 *
 * NOTE ON NUMBERS: the artwork's bottom panel shows "100+ 제작 프로젝트" and
 * "98% 고객 만족도". Neither figure is a verified BIZNESTA result, so — as on
 * PC 01 and PC 15 — they are not published. The panel keeps its exact slot,
 * type scale and three-column rhythm; the two rows now state how BIZNESTA
 * works instead of quoting a number. "지속적인 사후 지원" is the artwork's own
 * wording and is kept.
 */

export const mo01 = {
  header: {
    logo: { src: '/assets/mo01/logo-lockup.png', alt: 'BIZNESTA', width: 256, height: 63 },
    menuLabel: '메뉴',
  },

  hero: {
    image: {
      webp: '/assets/mo01/hero.webp',
      jpg: '/assets/mo01/hero.jpg',
      alt: 'BIZNESTA 홈페이지가 열린 스마트폰이 놓인 밝은 작업 공간',
    },
    /* the gold script line and the rule under it are brand typography and stay
       in the photograph itself, exactly as on the PC screens */
    scriptText: ['좋은 선택이', '더 큰 비즈니스를 만듭니다.'],
    headline: [
      { text: '홈페이지가', tone: 'ink' as const },
      { text: '필요하신가요?', tone: 'ink' as const },
      { text: '아니면 고객이', tone: 'gold' as const },
      { text: '들어오는 시스템이', tone: 'gold' as const },
      { text: '필요하신가요?', tone: 'ink' as const },
    ],
    /* 2026-09-09 줄바꿈만 다시 잡았다 — 문장은 그대로다 */
    body: [
      '비즈네스타는',
      '단순한 홈페이지 제작이 아닌,',
      '당신의 비즈니스가 성장하는',
      '온라인 시스템을 함께 설계합니다.',
    ],
    cta: { label: '제작 상담하기', href: '/contact?source=home' },
  },

  services: [
    { id: 1, order: 1, visible: true, slug: 'website', icon: 'monitor' as const,
      title: '홈페이지 제작', sub: ['브랜드에 맞는', '맞춤형 홈페이지'] as [string, string] },
    { id: 2, order: 2, visible: true, slug: 'brand-design', icon: 'pen' as const,
      title: '브랜드 & 디자인', sub: ['당신만의', '차별화된 디자인'] as [string, string] },
    { id: 3, order: 3, visible: true, slug: 'sns', icon: 'share' as const,
      title: 'SNS 연계 & 운영', sub: ['블로그, 인스타 등', '통합 운영 지원'] as [string, string] },
    { id: 4, order: 4, visible: true, slug: 'system', icon: 'bars' as const,
      title: '운영 시스템 구축', sub: ['문의, 예약, 회원관리', '자동화'] as [string, string] },
  ],

  band: {
    image: { webp: '/assets/mo01/band.webp', jpg: '/assets/mo01/band.jpg', alt: '' },
    quote: ['당신의 비즈니스,', '비즈네스타가 함께 성장시킵니다.'],
    brand: ['BIZNESTA', 'BUSINESS TOTAL SOLUTION'],
  },

  /** replaces the artwork's unverified figures — see the file header */
  standard: [
    { value: '업종 맞춤', label: '목적에 맞는 설계' },
    { value: '통합 제작', label: '디자인 · 운영' },
    { value: '지속적인', label: '사후 지원' },
  ],

  closing: { label: '지금 무료 상담 신청하기', href: '/contact?source=home' },
};
