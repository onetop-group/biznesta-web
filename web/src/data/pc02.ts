/**
 * BN_PC_02_BRAND_MESSAGE — content.
 *
 * As with PC_01 every string, image slot and ordering is Admin-replaceable.
 * No figures, client names or testimonials appear on this screen.
 */

export type Pc02Segment = { text: string; tone?: 'light' | 'gold' };

export const pc02 = {
  header: {
    logo: {
      src: '/assets/pc02/logo-lockup-white.png',
      alt: 'BIZNESTA — Business Total Solution',
      width: 185,
      height: 46,
    },
    nav: [
      { en: 'DESIGN', ko: '홈페이지 디자인', href: '/design' },
      { en: 'SERVICE', ko: '제작 서비스', href: '/service' },
      { en: 'SOLUTION', ko: '맞춤 솔루션', href: '/solution' },
      { en: 'PRICE', ko: '제작 비용', href: '/price' },
      { en: 'PORTFOLIO', ko: '제작 사례', href: '/portfolio' },
      { en: 'ABOUT', ko: '회사소개', href: '/about' },
      { en: 'CONTACT', ko: '제작 상담', href: '/contact' },
    ],
    cta: { label: '제작 상담하기', href: '/contact?source=brand' },
  },

  stage: {
    webp: '/assets/pc02/plate.webp',
    jpg: '/assets/pc02/plate.jpg',
    alt:
      'BIZNESTA 전시 공간. 새벽빛이 들어오는 콘크리트 홀 벽면에 BIZNESTA 사인이 있고, ' +
      '서로 다른 업종의 홈페이지 디자인 일곱 점이 깊이를 달리해 전시되어 있다.',
  },

  message: {
    eyebrow: 'BRAND MESSAGE',
    headline: [
      [{ text: '당신의 비즈니스가' }],
      [{ text: '오늘보다 내일 더 빛나도록.', tone: 'gold' as const }],
    ] as Pc02Segment[][],
    sub: [
      '홈페이지는 단순한 웹사이트가 아닙니다.',
      '당신의 비즈니스를 더 크게 성장시키는',
      '가장 강력한 비즈니스 자산입니다.',
    ],
    smallEn: 'YOUR BUSINESS, A BRIGHTER TOMORROW',
    desc: [
      'BIZNESTA는 디자인, 콘텐츠, 시스템을 연결하여',
      '당신의 비즈니스에 필요한 홈페이지를 맞춤 제작합니다.',
    ],
    script: {
      src: '/assets/pc02/script-more-tomorrow.png',
      text: 'More Tomorrow',
      width: 236,
      height: 112,
    },
  },

  /** Signage printed on the dark wall panel between the copy and the exhibition. */
  wall: {
    lines: ['좋은 시작이', '더 큰 성장을', '만듭니다.'],
    keywords: [
      'WEBSITE',
      'DESIGN',
      'CONTENT',
      'SYSTEM',
      'MARKETING',
      'FOR A',
      'BRIGHTER',
      'TOMORROW',
    ],
  },

  /** Caption sitting under the exhibition wall on the right. */
  exhibitionCaption: [
    '당신의 브랜드가',
    '더 멋지게 빛날 수 있도록,',
    'BIZNESTA가 함께합니다.',
  ],

  band: {
    items: [
      {
        icon: 'gem' as const,
        label: 'DESIGN',
        sub: ['당신의 브랜드를 가장', '잘 보여주는 디자인'],
      },
      {
        icon: 'doc' as const,
        label: 'CONTENT',
        sub: ['고객이 찾아오는', '콘텐츠 구조'],
      },
      {
        icon: 'stack' as const,
        label: 'SYSTEM',
        sub: ['문의, 예약, 회원 등', '필요한 기능과 관리자 시스템'],
      },
      {
        icon: 'growth' as const,
        label: 'GROWTH',
        sub: ['지속적인 성장을 위한', '온라인 비즈니스 기반'],
      },
    ],
    stack: ['BRAND', 'BUSINESS', 'SOLUTION'],
    stackBrand: 'BIZNESTA',
  },

  util: {
    logo: {
      src: '/assets/pc01/logo-wordmark-white.png',
      alt: 'BIZNESTA',
      width: 76,
      height: 16,
    },
    tagline: 'BUSINESS TOTAL SOLUTION',
    line: '당신의 비즈니스가 오늘보다 내일 더 빛나도록.',
    scrollLabel: 'SCROLL DOWN',
  },
};
