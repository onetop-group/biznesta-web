/**
 * BN_MO_11_CUSTOM_SOLUTION — content.
 *
 * Authored from BN_MO_11_CUSTOM_SOLUTION.png (1024 x 1536), not from PC 11.
 * The screen argues BIZNESTA's core position: it does not sell a fixed
 * package — it works out what to build, for whom, with which pages,
 * functions and running structure, and then designs that. It is therefore
 * a designed process, never a SaaS feature table or a package price list,
 * and no price appears anywhere on it.
 *
 * TESTIMONIAL REMOVED
 * -------------------
 * The artwork closed with a customer quote attributed to "— 실제 고객 후기 —".
 * BIZNESTA has no verified customer review, so the block keeps its exact
 * slot, ivory panel, photograph, quote marks, arrows and type scale, and now
 * carries BIZNESTA's own design principle, attributed to BIZNESTA.
 * The photograph was a handwritten "Thank You" card, which still read as a
 * customer review next to the panel arrows, so it was replaced with a neutral
 * consultation-space photograph cropped from BN_PC_16_CONTACT.png — a space
 * distinct from every other mobile screen, with no person and no text in frame.
 *
 * The four "이런 분들께 추천합니다" quotes are the needs a prospective customer
 * brings, not statements by an existing one — no person or company is named.
 */

export type Solution = {
  solutionId: number;
  order: number;
  visible: boolean;
  num: string;
  title: string;
  icon: 'chat' | 'search' | 'pen' | 'monitor' | 'gear';
  description: [string, string];
};

export const mo11 = {
  header: { logo: { src: '/assets/mo11/logo-lockup.png', alt: 'BIZNESTA' }, menuLabel: '메뉴' },

  hero: {
    image: {
      webp: '/assets/mo11/hero.webp', jpg: '/assets/mo11/hero.jpg',
      alt: 'BIZNESTA 맞춤 솔루션 체크리스트가 열린 태블릿과 스타일러스',
    },
    eyebrow: 'CUSTOM SOLUTION',
    headline: ['당신의 비즈니스에', '딱 맞는', '맞춤 솔루션'],
    /* 2026-09-09 줄바꿈만 다시 잡았다 — 문장은 그대로다 */
    body: [
      '비즈네스타는',
      '업종, 규모, 목표에 맞춰',
      '가장 효과적인 홈페이지와',
      'SNS 운영 전략을',
      '함께 설계합니다.',
    ],
    aside: { lines: ['당신의', '가능성을', '현실로 만드는', '든든한 파트너,', '비즈네스타'], label: ['BIZNESTA', 'CUSTOM'] },
  },

  process: {
    title: '맞춤 솔루션 진행 과정',
    more: { label: '자세히 보기', href: '#process' },
    steps: [
      { solutionId: 1, order: 1, visible: true, num: '01.', title: '상담하기', icon: 'chat' as const,
        description: ['업종과 목표를', '함께 이야기합니다.'] as [string, string] },
      { solutionId: 2, order: 2, visible: true, num: '02.', title: '전략 설계', icon: 'search' as const,
        description: ['시장과 타겟을 분석해', '맞춤 전략을 제안합니다.'] as [string, string] },
      { solutionId: 3, order: 3, visible: true, num: '03.', title: '디자인 기획', icon: 'pen' as const,
        description: ['브랜드에 맞는', '디자인을 기획합니다.'] as [string, string] },
      { solutionId: 4, order: 4, visible: true, num: '04.', title: '제작 및 연동', icon: 'monitor' as const,
        description: ['홈페이지와 SNS를', '구축하고 연동합니다.'] as [string, string] },
      { solutionId: 5, order: 5, visible: true, num: '05.', title: '사후 관리', icon: 'gear' as const,
        description: ['운영까지 지속적으로', '지원합니다.'] as [string, string] },
    ] as Solution[],
  },

  recommend: {
    title: '이런 분들께 추천합니다!',
    more: { label: '맞춤 상담하기', href: '/contact?source=solution' },
    items: [
      { id: 1, order: 1, visible: true, title: ['특별한 브랜드가 필요한', '소상공인'],
        want: ['“우리 가게만의 매력을', '온라인에서도 보여주고 싶어요.”'],
        image: { webp: '/assets/mo11/rec-01.webp', jpg: '/assets/mo11/rec-01.jpg', alt: '따뜻한 조명의 소규모 매장 내부' } },
      { id: 2, order: 2, visible: true, title: ['신뢰가 중요한', '병원 · 의료기관'],
        want: ['“전문성과 신뢰가 느껴지는', '홈페이지가 필요해요.”'],
        image: { webp: '/assets/mo11/rec-02.webp', jpg: '/assets/mo11/rec-02.jpg', alt: '밝고 정돈된 의료기관 리셉션' } },
      { id: 3, order: 3, visible: true, title: ['온라인 확장이 필요한', '교육 · 강의업'],
        want: ['“수강생이 꾸준히 찾는', '시스템이 필요해요.”'],
        image: { webp: '/assets/mo11/rec-03.webp', jpg: '/assets/mo11/rec-03.jpg', alt: '강의실 공간' } },
      { id: 4, order: 4, visible: true, title: ['브랜드가 중요한', '쇼핑몰 · 온라인 비즈니스'],
        want: ['“감각적인 디자인으로', '브랜드 가치를 높이고 싶어요.”'],
        image: { webp: '/assets/mo11/rec-04.webp', jpg: '/assets/mo11/rec-04.jpg', alt: '브랜드 제품이 놓인 연출 컷' } },
    ],
  },

  /* replaces the artwork's customer testimonial — see the file header.
     The artwork's photograph was a handwritten "Thank You" card, which read
     as a customer review even under BIZNESTA's own words, so the visual is a
     neutral consultation-space photograph from the BIZNESTA artwork set. */
  principle: {
    image: { webp: '/assets/mo11/consult.webp', jpg: '/assets/mo11/consult.jpg',
             alt: '밝고 따뜻한 상담 공간' },
    quote: [
      '“무엇을 만들지부터 함께 설계합니다.',
      '홈페이지가 아니라, 고객이 들어오는 구조를',
      '당신의 사업에 맞게 만들어 드립니다.”',
    ],
    by: '— 비즈네스타의 맞춤 설계 원칙 —',
  },

  cta: { label: '지금, 나만의 맞춤 솔루션을 만나보세요', href: '/contact?source=solution' },

  support: [
    { icon: 'chat' as const, label: '빠른 상담' },
    { icon: 'doc' as const, label: '맞춤 제안' },
    { icon: 'people' as const, label: '전문가 1:1 상담' },
  ],
};
