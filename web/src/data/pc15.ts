/**
 * BN_PC_15_ABOUT — content.
 *
 * FACTUALITY POLICY — READ BEFORE EDITING
 * ---------------------------------------
 * The original artwork carried a "BIZNESTA IN NUMBERS" panel with
 * "+100 제작 프로젝트 / +50 다양한 업종 경험 / 98% 고객 만족도 / +70% 평균 문의 증가율".
 * None of those figures is a verified BIZNESTA result, so none of them is
 * published. The panel keeps its exact position, size and two-column rhythm,
 * but every row now states how BIZNESTA works rather than a measured number,
 * and the panel label is 'BIZNESTA STANDARD' instead of 'IN NUMBERS'.
 *
 * The artwork's "다양한 업종의 성공 사례와 노하우" line claimed an existing client
 * track record; it is replaced with "다양한 업종을 고려한 설계 노하우".
 *
 * Nothing on this screen states a team, a headcount, an office, a company
 * size, a customer count, a project count, an award or a partner list.
 * `founder` is the account owner's own name and role — no other person,
 * title or career is asserted.
 */

export const pc15 = {
  header: {
    wordmark: { src: '/assets/pc15/logo-wordmark-navy.png', alt: 'BIZNESTA', width: 191, height: 35.6 },
    tagline: 'BUSINESS TOTAL SOLUTION',
    nav: [
      { en: 'DESIGN', ko: '홈페이지 디자인', href: '/design' },
      { en: 'SERVICE', ko: '제작 서비스', href: '/service' },
      { en: 'SOLUTION', ko: '맞춤 솔루션', href: '/solution' },
      { en: 'PRICE', ko: '제작 비용', href: '/price' },
      { en: 'PORTFOLIO', ko: '제작 사례', href: '/portfolio' },
      { en: 'ABOUT', ko: '회사소개', href: '/about' },
      { en: 'CONTACT', ko: '제작 상담', href: '/contact' },
    ],
    cta: { label: '제작 상담하기', href: '/contact?source=about' },
  },

  hero: {
    image: {
      webp: '/assets/pc15/hero.webp',
      jpg: '/assets/pc15/hero.jpg',
      alt: '햇빛 드는 작업 공간의 노트북과 BIZNESTA 머그, 브랜드 서적이 놓인 책상',
    },
    eyebrow: 'ABOUT BIZNESTA',
    headline: ['좋은 비즈니스가', '더 좋은 세상을 만듭니다.'],
    sub: [
      'BIZNESTA는 단순한 홈페이지 제작을 넘어,',
      '고객의 비즈니스가 실제로 성장할 수 있는 온라인 시스템을',
      '함께 설계하고 만들어가는 파트너입니다.',
    ],
    englishQuote: ['GOOD BUSINESS', 'A BRIGHTER TOMORROW.'],
    panel: {
      quote: ['당신의 가능성이', '더 멀리, 더 크게', '빛날 수 있도록.'],
      brand: ['BIZNESTA', 'BUSINESS TOTAL SOLUTION'],
      keywords: ['DESIGN', 'MARKETING', 'SYSTEM', 'GROWTH'],
    },
  },

  mission: {
    eyebrow: 'OUR MISSION',
    title: ['비즈네스타가', '지향하는 가치'],
    desc: ['고객의 비즈니스에 진심으로', '공감하고, 함께 성장하는', '솔루션을 제공합니다.'],
    items: [
      { id: 1, order: 1, visible: true, icon: 'diamond' as const, title: '고객 중심',
        desc: ['고객의 목표와 필요를', '가장 먼저 생각합니다.'] as [string, string] },
      { id: 2, order: 2, visible: true, icon: 'bulb' as const, title: '실용적인 솔루션',
        desc: ['현실에 꼭 맞는', '실행 가능한 해답을 제시합니다.'] as [string, string] },
      { id: 3, order: 3, visible: true, icon: 'bars' as const, title: '지속적인 성장',
        desc: ['제작 이후에도', '함께 성장하고 지원합니다.'] as [string, string] },
      { id: 4, order: 4, visible: true, icon: 'people' as const, title: '신뢰와 파트너십',
        desc: ['한 번의 제작이 아닌', '오래가는 파트너가 됩니다.'] as [string, string] },
    ],
  },

  /** replaces the artwork's unverified "IN NUMBERS" panel — see the file header */
  standard: {
    eyebrow: 'BIZNESTA STANDARD',
    rows: [
      { value: '업종 맞춤', label: '비즈니스에 맞춘 설계' },
      { value: '통합 제작', label: '디자인 · 콘텐츠 · 시스템' },
      { value: '직접 운영', label: '고객이 직접 관리' },
      { value: '지속 지원', label: '제작 이후에도 함께' },
    ],
    tagline: ['SMALL STEPS', 'BIG CHANGES'],
  },

  founder: {
    /* IMAGE ASSET ONLY REPLACEMENT — the artwork's photo was an AI-generated
       stock portrait of someone who is not BIZNESTA's 대표. It is replaced with
       the account owner's own photograph, framed to the artwork's composition:
       same slot, same 386x263 crop ratio, same seated pose with a hand at the
       chin and a pen in the other hand, same warm ivory room, same laptop
       position — a Samsung laptop instead of the artwork's Apple one.
       Source: 사진 2.png, crop (40,32) 1360x927 -> 772x526 (2x of the slot).
       Nothing else on this screen changed: layout, section heights, stage
       height, message copy, WHY list and closing band are the artwork's.
       The room is a styled brand-portrait setting, not a photograph of a
       BIZNESTA office, so the alt text does not claim one. */
    image: {
      webp: '/assets/pc15/founder-won-mihee.webp',
      jpg: '/assets/pc15/founder-won-mihee.jpg',
      alt: 'BIZNESTA 대표 원미희 — 책상에서 노트북과 함께 있는 인물 사진',
    },
    eyebrow: "FOUNDER'S MESSAGE",
    quote: ['당신의 비즈니스 이야기에', '진심으로 함께하겠습니다.'],
    body: [
      'BIZNESTA는 단순히 예쁜 홈페이지가 아니라,',
      '고객이 찾아오는 구조, 지속적으로 성장하는 온라인 시스템을 만드는 것을',
      '목표로 합니다. 작은 시작도 괜찮습니다. 당신의 가능성이 더 멀리, 더 크게',
      '빛날 수 있도록, 비즈네스타가 함께하겠습니다.',
    ],
    signature: ['원미희', 'BIZNESTA 대표', '브랜딩 설계자'],
  },

  why: {
    eyebrow: 'WHY BIZNESTA',
    title: ['비즈네스타가', '다른 이유'],
    items: [
      '비즈니스 목적에 맞는 맞춤 설계',
      '디자인 + 콘텐츠 + 운영까지 통합 지원',
      '초보자도 쉽게 관리할 수 있는 시스템',
      '제작 후에도 지속적인 유지보수와 상담',
      /* the artwork claimed "다양한 업종의 성공 사례와 노하우" — an unverified track
         record, replaced with a statement about how the work is designed */
      '다양한 업종을 고려한 설계 노하우',
      '빠르고 정확한 커뮤니케이션',
    ],
  },

  goldCard: {
    image: { webp: '/assets/pc15/gold.webp', jpg: '/assets/pc15/gold.jpg', alt: '' },
    lines: ['Your', 'Success', 'is Our', 'Success'],
    brand: ['BIZNESTA', 'BUSINESS TOTAL SOLUTION'],
  },

  band: {
    image: { webp: '/assets/pc15/band.webp', jpg: '/assets/pc15/band.jpg', alt: '' },
    wordmark: { src: '/assets/pc15/logo-wordmark-white.png', alt: 'BIZNESTA', width: 157, height: 29.2 },
    tagline: 'BUSINESS TOTAL SOLUTION',
    quote: ['비즈니스의 시작부터 성장까지,', '비즈네스타가 함께합니다.'],
    points: [
      { icon: 'monitor' as const, ko: '전문적인 제작' },
      { icon: 'gear' as const, ko: '체계적인 시스템' },
      { icon: 'people' as const, ko: '지속적인 파트너십' },
      { icon: 'bars' as const, ko: '성공을 만드는 솔루션' },
    ],
    cta: { label: '제작 상담하기', href: '/contact?source=about' },
    ctaNote: '지금, 당신의 비즈니스를 시작하세요.',
  },
};
