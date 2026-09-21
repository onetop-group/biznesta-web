/**
 * BN_MO_02_BRAND_MESSAGE — content.
 *
 * Authored from BN_MO_02_BRAND_MESSAGE.png (1024 x 1536), not from PC 02.
 * The artwork's architectural scene — the easel card, the stacked
 * IDEA / DESIGN / GROWTH books, the plants and the depth of field — stays as
 * a photograph, and so do the two gold script lines ("A Better Tomorrow",
 * "Small Steps Big Changes"), which are brand typography. Everything a
 * reader acts on is real markup.
 *
 * No customer count, project count, satisfaction score or growth figure
 * appears on this screen, in the artwork or in the copy.
 */

export const mo02 = {
  header: {
    logo: { src: '/assets/mo02/logo-lockup.png', alt: 'BIZNESTA' },
    menuLabel: '메뉴',
  },

  hero: {
    image: {
      webp: '/assets/mo02/hero.webp',
      jpg: '/assets/mo02/hero.jpg',
      alt: 'BIZNESTA 메시지 카드와 IDEA · DESIGN · GROWTH 서적이 놓인 밝은 작업 공간',
    },
    eyebrow: 'BRAND MESSAGE',
    headline: ['좋은 홈페이지는', '좋은 비즈니스를', '만듭니다.'],
    body: [
      '비즈네스타는 단순한 제작업체가 아닙니다.',
      '당신의 사업을 깊이 이해하고,',
      '온라인에서 실제로 성장할 수 있는',
      '솔루션을 함께 만들어가는 파트너입니다.',
    ],
  },

  values: [
    { id: 1, order: 1, visible: true, icon: 'diamond' as const, title: '전략적인 기획',
      sub: ['당신의 사업에', '꼭 맞는 방향을', '함께 설계합니다.'] },
    { id: 2, order: 2, visible: true, icon: 'bulb' as const, title: '감각적인 디자인',
      sub: ['브랜드의 가치를', '높이는 특별한', '디자인을 제공합니다.'] },
    { id: 3, order: 3, visible: true, icon: 'bars' as const, title: '실질적인 성장',
      sub: ['홈페이지를 넘어', '고객이 들어오는', '시스템을 만듭니다.'] },
    { id: 4, order: 4, visible: true, icon: 'people' as const, title: '지속적인 파트너십',
      sub: ['제작 후에도', '함께 성장하는', '파트너가 되겠습니다.'] },
  ],

  vision: {
    image: { webp: '/assets/mo02/panel.webp', jpg: '/assets/mo02/panel.jpg', alt: '' },
    eyebrow: 'OUR VISION',
    headline: ['작은 시작도,', '더 큰 가능성으로.'],
    body: ['비즈네스타는 당신의 오늘이', '더 나은 내일로 이어지도록, 언제나 함께합니다.'],
    brand: ['BIZNESTA', 'BUSINESS', 'TOTAL', 'SOLUTION'],
  },

  closing: {
    leaf: { src: '/assets/mo02/leaf.jpg', alt: '' },
    lines: ['당신의 비즈니스에', '날개를 달아드리겠습니다.'],
    cta: { label: '제작 상담하기', href: '/contact?source=brand' },
  },

  footer: { brand: 'BIZNESTA', tagline: 'YOUR GROWTH PARTNER' },
};
