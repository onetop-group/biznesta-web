/**
 * BN_PC_03_CATEGORY — content.
 *
 * The fifteen categories are modelled the way Admin will need them
 * (id / slug / name / english label / description / thumbnail / order /
 * visibility), so switching the source from this file to a CMS query does
 * not touch the layout. Nothing here states a figure, a client or a result.
 */

export type Category = {
  id: number;
  slug: string;
  /** display order — the grid renders in this order */
  order: number;
  visible: boolean;
  name: string;
  label: string;
  desc: [string, string];
  /** category photograph, cut from the artwork */
  thumbnail: { webp: string; jpg: string; alt: string };
};

const thumb = (n: number, alt: string) => ({
  webp: `/assets/pc03/card-${String(n).padStart(2, '0')}.webp`,
  jpg: `/assets/pc03/card-${String(n).padStart(2, '0')}.jpg`,
  alt,
});

export const pc03 = {
  header: {
    wordmark: { src: '/assets/pc03/logo-wordmark-navy.png', alt: 'BIZNESTA', width: 196, height: 37 },
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
    cta: { label: '제작 상담하기', href: '/contact?source=category' },
  },

  hero: {
    image: {
      webp: '/assets/pc03/hero.webp',
      jpg: '/assets/pc03/hero.jpg',
      alt:
        'BIZNESTA가 제작한 홈페이지가 데스크톱과 모바일 화면에 표시된 밝은 사무 공간. ' +
        '화면 가운데에 Your Business, A Brighter Tomorrow 라는 손글씨가 놓여 있다.',
    },
    eyebrow: 'WEBSITE CATEGORY',
    headline: [
      { text: '어떤 홈페이지를', tone: 'ink' as const },
      { text: '찾고 계신가요?', tone: 'gold' as const },
    ],
    sub: ['업종도, 목적도, 스타일도 다르니까.', 'BIZNESTA가 가장 잘 맞는 홈페이지를 제안합니다.'],
    points: [
      { icon: 'gem' as const, label: '업종별 맞춤 디자인' },
      { icon: 'stack' as const, label: '필요한 기능만 정확하게' },
      { icon: 'growth' as const, label: '비즈니스 성장을 함께' },
    ],
    keywords: ['WEBSITE', 'DESIGN', 'FOR A', 'BRIGHTER', 'TOMORROW'],
  },

  categories: <Category[]>[
    { id: 1, slug: 'corporate', order: 1, visible: true, name: '기업 · 브랜드형', label: 'CORPORATE',
      desc: ['신뢰와 가치를 담은', '기업 홈페이지'], thumbnail: thumb(1, '유리 커튼월 오피스 빌딩') },
    { id: 2, slug: 'store', order: 2, visible: true, name: '소상공인 · 매장형', label: 'STORE',
      desc: ['지역에서 더 사랑받는', '매장 홈페이지'], thumbnail: thumb(2, '저녁 무렵의 카페 외관') },
    { id: 3, slug: 'expert', order: 3, visible: true, name: '전문가 개인형', label: 'EXPERT',
      desc: ['당신의 전문성을', '더 특별하게'], thumbnail: thumb(3, '밝은 개인 집무 공간') },
    { id: 4, slug: 'landing', order: 4, visible: true, name: '랜딩페이지형', label: 'LANDING PAGE',
      desc: ['이벤트, 홍보, 단일 목적에', '최적화된 페이지'], thumbnail: thumb(4, '랜딩페이지가 표시된 모바일 화면') },
    { id: 5, slug: 'lead-generation', order: 5, visible: true, name: 'DB 수집형', label: 'LEAD GENERATION',
      desc: ['상담문의와 고객DB를', '성과로'], thumbnail: thumb(5, '상승하는 데이터 그래프') },
    { id: 6, slug: 'education', order: 6, visible: true, name: '교육형', label: 'EDUCATION',
      desc: ['학원, 아카데미, 강의', '온라인 교육 홈페이지'], thumbnail: thumb(6, '밝은 강의실') },
    { id: 7, slug: 'recruiting', order: 7, visible: true, name: '채용 · 리크루팅형', label: 'RECRUIT',
      desc: ['인재를 만나는', '채용 홈페이지'], thumbnail: thumb(7, '악수를 나누는 두 사람') },
    { id: 8, slug: 'franchise', order: 8, visible: true, name: '프랜차이즈형', label: 'FRANCHISE',
      desc: ['가맹점 모집과', '브랜드 확장'], thumbnail: thumb(8, '프랜차이즈 매장 외관') },
    { id: 9, slug: 'portfolio', order: 9, visible: true, name: '포트폴리오형', label: 'PORTFOLIO',
      desc: ['작가, 디자이너,', '크리에이터를 위한'], thumbnail: thumb(9, '포트폴리오 화면이 표시된 태블릿') },
    { id: 10, slug: 'commerce', order: 10, visible: true, name: '쇼핑 · 판매형', label: 'SHOPPING',
      desc: ['제품 판매부터', '온라인 스토어까지'], thumbnail: thumb(10, '제품과 쇼핑백 연출 컷') },
    { id: 11, slug: 'reservation', order: 11, visible: true, name: '예약형', label: 'BOOKING',
      desc: ['예약, 상담, 방문신청을', '한 번에'], thumbnail: thumb(11, '예약 일정이 적힌 노트') },
    { id: 12, slug: 'membership', order: 12, visible: true, name: '회원제 웹사이트', label: 'MEMBER',
      desc: ['회원 관리와', '커뮤니티 운영'], thumbnail: thumb(12, '멤버십 카드') },
    { id: 13, slug: 'webapp', order: 13, visible: true, name: '웹앱형', label: 'WEB APP',
      desc: ['맞춤 기능이 필요한', '비즈니스'], thumbnail: thumb(13, '웹앱 화면이 표시된 노트북') },
    { id: 14, slug: 'admin-system', order: 14, visible: true, name: '관리자 시스템 포함형', label: 'ADMIN SYSTEM',
      desc: ['운영까지 생각한', '통합 시스템'], thumbnail: thumb(14, '관리자 대시보드 화면') },
    { id: 15, slug: 'content', order: 15, visible: true, name: '콘텐츠 · 블로그형', label: 'CONTENT',
      desc: ['지속적인 노출과', '브랜딩'], thumbnail: thumb(15, '노트와 커피가 놓인 책상') },
  ],

  band: {
    image: { webp: '/assets/pc03/band.webp', jpg: '/assets/pc03/band.jpg', alt: '' },
    wordmark: { src: '/assets/pc03/logo-wordmark-white.png', alt: 'BIZNESTA', width: 156, height: 29 },
    tagline: 'BUSINESS TOTAL SOLUTION',
    quote: ['당신의 비즈니스에 가장 잘 맞는 홈페이지를,', 'BIZNESTA가 함께 만듭니다.'],
    points: [
      { icon: 'doc' as const, ko: '전략적인 기획', en: 'STRATEGY' },
      { icon: 'pen' as const, ko: '차별화된 디자인', en: 'DESIGN' },
      { icon: 'gear' as const, ko: '안정적인 운영', en: 'SYSTEM' },
    ],
    cta: { label: '제작 상담하기', href: '/contact?source=category' },
  },
};
