/**
 * BN_PC_06_DESIGN_DETAIL — content.
 *
 * One design shown in full. `kind: 'sample'` marks it as BIZNESTA sample
 * work — the screen never presents it as a commissioned client project.
 * The palette values are the ones printed on the artwork itself.
 */

export type SimilarDesign = {
  id: number;
  slug: string;
  title: string;
  artwork: { webp: string; jpg: string; alt: string };
};

const sim = (n: number, alt: string) => ({
  webp: `/assets/pc06/sim-0${n}.webp`,
  jpg: `/assets/pc06/sim-0${n}.jpg`,
  alt,
});

export const pc06 = {
  header: {
    wordmark: { src: '/assets/pc06/logo-wordmark-navy.png', alt: 'BIZNESTA', width: 192, height: 36 },
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
    cta: { label: '제작 상담하기', href: '/contact?source=design-detail' },
  },

  design: {
    kind: 'sample' as const,
    slug: 'academy-website-001',
    image: {
      webp: '/assets/pc06/hero.webp',
      jpg: '/assets/pc06/hero.jpg',
      /* 실제 고객 작업이 아니라 BIZNESTA 디자인 샘플이다. 특정 업체의 제작
         사례를 주장하는 표현은 쓰지 않는다 (사실성 정책). */
      alt:
        'BIZNESTA 교육 브랜드 홈페이지 디자인 샘플이 노트북과 모바일에 표시된 밝은 작업 공간. ' +
        '오른쪽에 Your Next Stage 라는 손글씨가 놓여 있다.',
    },
    breadcrumb: ['HOME', 'PORTFOLIO', 'ACADEMY WEBSITE #001'],
    eyebrow: 'DESIGN DETAIL',
    title: 'ACADEMY WEBSITE #001',
    sub: '사람의 성장을 디자인하는 교육 브랜드 홈페이지',
    desc: ['브랜드의 가치를 효과적으로 전달하고,', '수강생과의 신뢰를 만드는 프리미엄 교육 홈페이지입니다.'],
    tags: ['#교육/아카데미', '#신뢰감', '#프리미엄', '#모던 & 감성', '#수강신청'],
    aside: {
      quote: ['배움이', '더 큰 내일을 만듭니다.'],
      keywords: ['BIZNESTA', 'CREATES A BETTER', 'TOMORROW.'],
    },
  },

  concept: {
    eyebrow: 'DESIGN CONCEPT',
    title: ['신뢰와 감성을 담은', '프리미엄 교육 브랜드 디자인'],
    desc: ['전문성과 따뜻한 감성을 동시에 담아,', '수강생이 ‘믿고 배우고 싶은’ 브랜드 이미지를', '완성합니다.'],
    palette: [
      { role: 'MAIN', hex: '#0D2340' },
      { role: 'POINT', hex: '#C9A77A' },
      { role: 'SUB', hex: '#F6F2EB' },
      { role: 'TEXT', hex: '#333333' },
    ],
  },

  industries: {
    title: '추천 업종',
    items: [
      { icon: 'cap' as const, label: '온라인 강의 / 교육 아카데미' },
      { icon: 'doc' as const, label: '교육 컨설팅' },
      { icon: 'badge' as const, label: '자격증 / 스킬 교육' },
      { icon: 'people' as const, label: '코칭 / 멘토링' },
      { icon: 'building' as const, label: '기업 교육 / 출강 서비스' },
    ],
  },

  features: {
    title: '적용 가능한 주요 기능',
    items: [
      '강의 소개 및 커리큘럼 안내',
      '수강신청 및 결제 연동',
      '수강생 후기 / 커뮤니티',
      '상담 신청 폼 및 자동 알림',
      '공지사항 / 이벤트 관리',
      '모바일 최적화 (반응형)',
    ],
  },

  grades: {
    title: '디자인 등급',
    items: [
      { name: 'STANDARD', desc: ['기본형 템플릿으로', '빠르고 합리적인 제작'], featured: false },
      { name: 'CUSTOM', desc: ['브랜드에 맞춘', '맞춤 디자인'], featured: false },
      { name: 'SIGNATURE', desc: ['브랜드의 가치를 높이는', '프리미엄 맞춤 제작'], featured: true },
    ],
    ctaPrimary: { label: '이 디자인으로 제작하기', href: '/contact?source=design-detail' },
    ctaSecondary: { label: '내 브랜드에 맞게 변경 상담하기', href: '/contact?source=design-detail' },
    note: '※ 모든 디자인은 고객님의 업종과 요구사항에 맞춰 커스터마이징 가능합니다.',
  },

  similar: {
    eyebrow: 'SIMILAR DESIGN',
    title: '이런 디자인도 함께 살펴보세요.',
    items: <SimilarDesign[]>[
      { id: 1, slug: 'academy-website-002', title: '교육 아카데미 #002', artwork: sim(1, '교육 아카데미 홈페이지 디자인 목업') },
      { id: 2, slug: 'online-class-001', title: '온라인 클래스 #001', artwork: sim(2, '온라인 클래스 홈페이지 디자인 목업') },
      { id: 3, slug: 'coaching-mentoring-001', title: '코칭 & 멘토링 #001', artwork: sim(3, '코칭 멘토링 홈페이지 디자인 목업') },
      { id: 4, slug: 'corporate-education-001', title: '기업 교육 #001', artwork: sim(4, '기업 교육 홈페이지 디자인 목업') },
    ],
  },

  cta: {
    eyebrow: 'BIZNESTA',
    title: ['당신의 비즈니스에', '맞는 단 하나의 디자인.'],
    sub: '홈페이지 그 이상의 가치를 만듭니다.',
    button: { label: '무료 상담 신청하기', href: '/contact?source=design-detail' },
  },
};
