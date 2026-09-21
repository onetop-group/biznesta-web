/**
 * BN_PC_01_HERO — content.
 *
 * Every string, image slot and ordering below is intended to be replaced by
 * Admin-managed data later (Site Setting / Navigation / Page Content / Image
 * Slot). Nothing here is baked into the markup, so swapping the source from
 * this file to a CMS query does not touch the layout.
 *
 * NOTE ON NUMBERS: the original artwork shows "15+" and "100+" in the navy
 * band. Those figures are not confirmed, so per direction they are replaced
 * with descriptive copy instead of being presented as fact.
 */

export type Tone = 'ink' | 'gold';
export type Segment = { text: string; tone?: Tone };

export const pc01 = {
  header: {
    logo: {
      src: '/assets/pc01/logo-lockup.png',
      alt: 'BIZNESTA — Business Total Solution',
      width: 190,
      height: 47,
    },
    nav: [
      { en: 'DESIGN',    ko: '홈페이지 디자인', href: '/design' },
      { en: 'SERVICE',   ko: '제작 서비스',     href: '/service' },
      { en: 'SOLUTION',  ko: '맞춤 솔루션',     href: '/solution' },
      { en: 'PRICE',     ko: '제작 비용',       href: '/price' },
      { en: 'PORTFOLIO', ko: '제작 사례',       href: '/portfolio' },
      { en: 'ABOUT',     ko: '회사소개',        href: '/about' },
      { en: 'CONTACT',   ko: '제작 상담',       href: '/contact' },
    ],
    search: { label: '검색' },
    cta: { label: '제작 상담하기', href: '/contact?source=home' },
  },

  hero: {
    background: {
      webp: '/assets/pc01/hero-plate.webp',
      jpg: '/assets/pc01/hero-plate.jpg',
      alt: 'BIZNESTA가 제작한 홈페이지가 노트북과 모바일 화면에 표시된 사무 공간',
    },
    eyebrow: 'YOUR BUSINESS, A BRIGHTER TOMORROW',
    headline: <Segment[][]>[
      [{ text: '당신의 비즈니스가' }],
      [{ text: '오늘보다 ' }, { text: '내일 더 빛나도록', tone: 'gold' as Tone }],
    ],
    sub: <Segment[][]>[
      [{ text: '홈페이지는 단순한 웹사이트가 아닙니다.' }],
      [
        { text: '당신의 ' },
        { text: '비즈니스', tone: 'gold' as Tone },
        { text: '를 더 ' },
        { text: '크게', tone: 'gold' as Tone },
        { text: ' 성장시키는 시작입니다.' },
      ],
    ],
    body: [
      'BIZNESTA는 디자인, 콘텐츠, 시스템까지',
      '당신의 비즈니스에 필요한 홈페이지를 맞춤 제작합니다.',
    ],
    ctas: [
      { label: '홈페이지 디자인 보기', href: '/design', variant: 'primary' as const },
      { label: '맞춤 제작 상담',       href: '/contact?source=home', variant: 'outline' as const },
    ],
    scrollLabel: 'SCROLL DOWN',
    verticalKeywords: ['WEBSITE', 'DESIGN', 'FOR A', 'BETTER', 'TOMORROW'],
  },

  band: {
    items: [
      {
        icon: 'monitor' as const,
        label: '다양한 홈페이지 유형',
        sub: ['업종별 맞춤 디자인'],
      },
      {
        icon: 'palette' as const,
        label: '지속적으로 업데이트',
        sub: ['새로운 디자인'],
      },
      {
        icon: 'gear' as const,
        label: '맞춤 솔루션',
        sub: ['당신의 사업에 꼭 맞는 설계'],
      },
      {
        icon: 'chart' as const,
        label: '함께 성장하는 파트너',
        sub: ['당신의 비즈니스가', '오늘보다 내일 더 빛나도록'],
      },
    ],
    brand: {
      logo: {
        src: '/assets/pc01/logo-wordmark-white.png',
        alt: 'BIZNESTA',
        width: 110,
        height: 21,
      },
      lines: ['DESIGN', 'CONNECT', 'GROW'],
    },
  },
};
