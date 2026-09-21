/**
 * BN_MO_14_PROCESS — content.
 *
 * Authored from BN_MO_14_PROCESS.png (1024 x 1536), not from PC 14.
 * Six production steps drawn as the artwork's own connected disc row, a navy
 * "Why BIZNESTA?" band and a closing principle panel.
 *
 * NO SCHEDULE
 * -----------
 * No step states a duration. BIZNESTA has not fixed a delivery schedule, so
 * nothing on this screen reads "약 2주 / 약 4주" or similar. If a schedule is
 * ever published it belongs in a slot labelled "제작 일정 : 상담 후 안내".
 *
 * TESTIMONIAL REMOVED
 * -------------------
 * The artwork closed with "고객이 말하는 비즈네스타" and a customer quote signed
 * "— 실제 고객 후기". BIZNESTA has no verified customer review, so the panel
 * keeps its exact slot, card, quote marks, dots, photography and type scale,
 * and now carries BIZNESTA's own production principle, attributed to BIZNESTA.
 *
 * No price, headcount, project count, customer count or satisfaction figure
 * appears anywhere on this screen.
 */

export type ProcessStep = {
  stepId: number;
  order: number;
  visible: boolean;
  num: string;
  title: string;
  icon: 'chat' | 'doc' | 'pen' | 'code' | 'search' | 'growth';
  desc: string[];
};

export const mo14 = {
  header: { logo: { src: '/assets/mo14/logo-lockup.png', alt: 'BIZNESTA' }, menuLabel: '메뉴' },

  hero: {
    image: {
      webp: '/assets/mo14/hero.webp', jpg: '/assets/mo14/hero.jpg',
      alt: 'BIZNESTA 홈페이지가 표시된 노트북과 스마트폰',
    },
    eyebrow: 'PROCESS',
    headline: ['처음부터 끝까지,', '함께 만드는', '성공의 과정'],
    body: ['비즈네스타는 단순히 홈페이지를 만드는 것이', '아니라, 당신의 비즈니스가 실제로 성장하는',
           '과정을 함께합니다.'],
    label: ['GOOD BUSINESS', 'BETTER TOMORROW'],
  },

  process: {
    title: '제작 진행 과정',
    sub: '상담부터 사후관리까지, 체계적인 프로세스로 진행됩니다.',
    more: { label: '지금, 시작해보세요', href: '/contact?source=process' },
    steps: [
      { stepId: 1, order: 1, visible: true, num: '01', title: '상담 & 이해', icon: 'chat' as const,
        desc: ['업종, 목표, 예산,', '필요한 기능을', '함께 이야기합니다.'] },
      { stepId: 2, order: 2, visible: true, num: '02', title: '전략 기획', icon: 'doc' as const,
        desc: ['시장과 타깃을 분석해', '가장 효과적인', '홈페이지와 운영 전략을', '제안합니다.'] },
      { stepId: 3, order: 3, visible: true, num: '03', title: '디자인 시안', icon: 'pen' as const,
        desc: ['브랜드에 맞는', '세련된 디자인 시안을', '제작하고 함께', '검토합니다.'] },
      { stepId: 4, order: 4, visible: true, num: '04', title: '제작 & 개발', icon: 'code' as const,
        desc: ['확정된 디자인을 기반으로', '홈페이지를 제작하고', '필요한 기능을', '구현합니다.'] },
      { stepId: 5, order: 5, visible: true, num: '05', title: '검수 & 오픈', icon: 'search' as const,
        desc: ['세부 테스트와', '최종 검수를 진행하고,', '안정적으로', '오픈합니다.'] },
      { stepId: 6, order: 6, visible: true, num: '06', title: '운영 & 성장지원', icon: 'growth' as const,
        desc: ['오픈 후에도', '꾸준한 관리와', '추가 개선으로', '비즈니스 성장을', '함께합니다.'] },
    ] as ProcessStep[],
  },

  band: {
    image: { webp: '/assets/mo14/band.webp', jpg: '/assets/mo14/band.jpg', alt: '' },
    items: [
      ['처음부터 끝까지', '전담 파트너'],
      ['업종에 맞춘', '맞춤 전략'],
      ['디자인과 기능의', '완성도'],
      ['오픈 후에도', '지속적인 성장 지원'],
    ] as [string, string][],
    quote: ['당신의', '가능성이', '더 멀리,', '더 높이.'],
    brand: 'BIZNESTA',
  },

  /* replaces the artwork's customer testimonial — see the file header */
  principle: {
    image: { webp: '/assets/mo14/tes.webp', jpg: '/assets/mo14/tes.jpg', alt: '' },
    title: ['비즈네스타가', '지키는 것'],
    quote: ['처음 상담부터 오픈까지', '각 단계를 함께 확인하고', '진행 상황을 공유합니다.',
            '만드는 것에서 끝나지 않고, 운영까지 함께합니다.'],
    by: '— 비즈네스타의 제작 원칙 —',
  },

  cta: { label: '지금, 비즈네스타와 시작하기', href: '/contact?source=process' },

  support: [
    { icon: 'chat' as const, label: '빠른 상담' },
    { icon: 'doc' as const, label: '맞춤 제안' },
    { icon: 'people' as const, label: '전문가 1:1 상담' },
  ],
};
