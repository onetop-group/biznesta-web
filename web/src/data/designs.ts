import type { DesignDetail, DesignLevel, DesignSummary, FilterOption } from '@/types';
import { categories } from './categories';

/**
 * 디자인 쇼룸 데이터 — Phase 3-A Placeholder.
 *
 * ⚠️ 여기 있는 항목은 전부 자리표시자입니다 (isPlaceholder: true).
 *    실제 제작 사례나 고객 이름을 만들어 넣지 않았습니다.
 *    · 제목은 카테고리 + 일련번호 형식의 중립적인 이름입니다.
 *    · 미리보기는 사진이 아니라 CSS 로 그린 추상 와이어프레임입니다.
 *    · 실적 · 후기 · 고객사명은 일절 없습니다.
 *
 * ⚠️ Phase 6 에서 designs / design_images 테이블로 이관됩니다.
 *    이 배열의 타입이 곧 DB 조회 결과의 타입이므로,
 *    화면 컴포넌트는 데이터 출처가 바뀌어도 그대로 동작합니다.
 *
 * 정렬 · 필터 · 페이지네이션은 전부 이 배열이 아니라
 * 아래 조회 함수를 통해서만 합니다. Phase 6 에서 이 함수들의
 * 내부만 Supabase 쿼리로 교체하면 화면은 수정할 필요가 없습니다.
 */

function palette(slug: string) {
  const found = categories.find((category) => category.slug === slug);
  return found ? found.palette : { main: '#0D2340', point: '#C9A77A', sub: '#F6F2EB', text: '#333333' };
}

const RAW: Array<Omit<DesignDetail, 'id' | 'isPlaceholder'>> = [
  {
    slug: 'corporate-001',
    title: '기업 · 브랜드형 #001',
    titleEn: 'CORPORATE WEBSITE 001',
    categorySlug: 'corporate',
    industry: '제조 · 기술',
    level: 'STANDARD',
    shortDescription: '신뢰를 먼저 전달하는 정통 기업 홈페이지 구성입니다.',
    tags: ['#신뢰감', '#정통', '#모던', '#기업소개'],
    palette: palette('corporate'),
    previewLayout: 'corporate',
    isNew: true,
    isFeatured: true,
    createdAt: '2026-09-05',
    sortOrder: 1,
    concept: [
      '기업의 규모와 안정감이 첫 화면에서 전달되도록',
      '넓은 여백과 절제된 색으로 구성한 레이아웃입니다.',
    ],
    recommendedFor: ['브랜드 신뢰도를 높이고 싶은 기업', '사업 영역이 여러 개인 회사', '오래 사용할 안정적인 홈페이지가 필요한 곳'],
    features: ['회사 소개 · 연혁', '사업 영역 안내', '뉴스 · 보도자료', '문의 폼 · 자동 알림', '기본 SEO 세팅', '모바일 최적화'],
    pages: ['메인', '회사소개', '사업영역', '뉴스', '문의하기'],
  },
  {
    slug: 'corporate-002',
    title: '기업 · 브랜드형 #002',
    titleEn: 'CORPORATE WEBSITE 002',
    categorySlug: 'corporate',
    industry: '건설 · 부동산',
    level: 'CUSTOM',
    shortDescription: '대형 비주얼로 규모감을 강조한 기업 홈페이지입니다.',
    tags: ['#대형비주얼', '#프리미엄', '#기업'],
    palette: palette('corporate'),
    previewLayout: 'gallery',
    isNew: true,
    isFeatured: false,
    createdAt: '2026-09-04',
    sortOrder: 2,
    concept: ['프로젝트 이미지를 크게 배치해', '실적과 규모가 자연스럽게 느껴지도록 설계했습니다.'],
    recommendedFor: ['프로젝트 실적을 보여줘야 하는 기업', '시각적 임팩트가 필요한 브랜드'],
    features: ['프로젝트 갤러리', '사업 영역 안내', '문의 폼', '이미지 최적화', '모바일 최적화'],
    pages: ['메인', '회사소개', '프로젝트', '문의하기'],
  },
  {
    slug: 'store-001',
    title: '소상공인 · 매장형 #001',
    titleEn: 'STORE WEBSITE 001',
    categorySlug: 'store',
    industry: '카페 · 음식점',
    level: 'STANDARD',
    shortDescription: '공간의 분위기를 그대로 전하는 매장 홈페이지입니다.',
    tags: ['#감성디자인', '#예약시스템', '#메뉴관리'],
    palette: palette('store'),
    previewLayout: 'store',
    isNew: true,
    isFeatured: true,
    createdAt: '2026-09-04',
    sortOrder: 3,
    concept: ['따뜻한 톤과 큰 이미지로', '방문하고 싶은 공간이라는 인상을 만듭니다.'],
    recommendedFor: ['공간의 매력을 보여주고 싶은 매장', '예약과 문의를 함께 받고 싶은 곳'],
    features: ['메뉴 · 상품 소개', '예약 / 주문 기능', '지도 · 위치 안내', '영업시간 안내', 'SNS 연동', '모바일 최적화'],
    pages: ['메인', '메뉴', '공간소개', '오시는 길', '예약하기'],
  },
  {
    slug: 'store-002',
    title: '소상공인 · 매장형 #002',
    titleEn: 'STORE WEBSITE 002',
    categorySlug: 'store',
    industry: '뷰티 · 미용',
    level: 'CUSTOM',
    shortDescription: '시술 안내와 예약을 한 흐름으로 묶은 구성입니다.',
    tags: ['#브랜드이미지', '#상담예약', '#시술안내'],
    palette: { main: '#3A2B33', point: '#C99CA0', sub: '#F9F2F2', text: '#3B3033' },
    previewLayout: 'landing',
    isNew: false,
    isFeatured: false,
    createdAt: '2026-09-03',
    sortOrder: 4,
    concept: ['부드러운 색과 정돈된 정보 구조로', '전문성과 편안함을 동시에 전달합니다.'],
    recommendedFor: ['시술 · 프로그램이 여러 개인 매장', '상담 예약이 중요한 업종'],
    features: ['시술 · 프로그램 안내', '상담 예약 폼', '전후 갤러리', '이벤트 관리', '모바일 최적화'],
    pages: ['메인', '프로그램', '갤러리', '예약 · 상담'],
  },
  {
    slug: 'education-001',
    title: '교육형 #001',
    titleEn: 'EDUCATION WEBSITE 001',
    categorySlug: 'education',
    industry: '학원 · 아카데미',
    level: 'SIGNATURE',
    shortDescription: '커리큘럼과 수강신청을 한 화면에서 연결한 구성입니다.',
    tags: ['#커리큘럼', '#수강신청', '#상담문의', '#신뢰감'],
    palette: palette('education'),
    previewLayout: 'corporate',
    isNew: true,
    isFeatured: true,
    createdAt: '2026-09-03',
    sortOrder: 5,
    concept: [
      '무엇을 배우는지, 누가 가르치는지, 어떻게 신청하는지가',
      '한 흐름으로 이어지도록 정보 구조를 설계했습니다.',
    ],
    recommendedFor: ['커리큘럼이 여러 개인 교육기관', '수강생 후기와 커뮤니티가 필요한 곳', '상담 문의를 체계적으로 받고 싶은 곳'],
    features: ['강의 소개 및 커리큘럼', '수강신청 및 결제 연동', '수강생 후기 · 커뮤니티', '상담 신청 폼 및 자동 알림', '공지사항 · 이벤트 관리', '모바일 최적화'],
    pages: ['메인', '강의 소개', '강사진', '수강 후기', '수강신청'],
  },
  {
    slug: 'education-002',
    title: '교육형 #002',
    titleEn: 'EDUCATION WEBSITE 002',
    categorySlug: 'education',
    industry: '온라인 클래스',
    level: 'CUSTOM',
    shortDescription: '온라인 강의 목록과 학습 흐름에 맞춘 구조입니다.',
    tags: ['#온라인클래스', '#강의목록', '#결제연동'],
    palette: palette('education'),
    previewLayout: 'commerce',
    isNew: false,
    isFeatured: false,
    createdAt: '2026-09-02',
    sortOrder: 6,
    concept: ['강의를 상품처럼 탐색할 수 있게 정리하고', '결제까지 이어지는 동선을 짧게 만들었습니다.'],
    recommendedFor: ['온라인 강의를 판매하는 곳', '강의 수가 계속 늘어나는 곳'],
    features: ['강의 목록 · 필터', '결제 연동', '수강 관리', '후기 · 문의', '모바일 최적화'],
    pages: ['메인', '전체 강의', '강의 상세', '마이페이지'],
  },
  {
    slug: 'expert-001',
    title: '전문가 개인형 #001',
    titleEn: 'EXPERT WEBSITE 001',
    categorySlug: 'expert',
    industry: '법률 · 세무',
    level: 'STANDARD',
    shortDescription: '경력과 전문 분야를 신뢰감 있게 정리한 구성입니다.',
    tags: ['#전문성', '#상담신청', '#개인브랜딩'],
    palette: palette('expert'),
    previewLayout: 'corporate',
    isNew: false,
    isFeatured: true,
    createdAt: '2026-09-02',
    sortOrder: 7,
    concept: ['정보의 위계를 분명히 해', '처음 방문한 사람도 전문성을 빠르게 판단할 수 있게 합니다.'],
    recommendedFor: ['전문성을 신뢰로 연결해야 하는 분', '상담 신청을 받는 전문가'],
    features: ['프로필 · 경력 소개', '전문 분야 안내', '상담 신청 폼', '칼럼 · 인사이트', '모바일 최적화'],
    pages: ['메인', '프로필', '업무 분야', '칼럼', '상담 신청'],
  },
  {
    slug: 'portfolio-001',
    title: '포트폴리오형 #001',
    titleEn: 'PORTFOLIO WEBSITE 001',
    categorySlug: 'portfolio',
    industry: '디자인 · 아트',
    level: 'SIGNATURE',
    shortDescription: '작업물이 주인공이 되도록 여백을 크게 둔 구성입니다.',
    tags: ['#여백', '#갤러리', '#크리에이터'],
    palette: palette('portfolio'),
    previewLayout: 'gallery',
    isNew: true,
    isFeatured: true,
    createdAt: '2026-09-01',
    sortOrder: 8,
    concept: ['장식을 최소화하고 이미지에 집중시켜', '작업의 완성도가 그대로 전달되도록 했습니다.'],
    recommendedFor: ['작업물이 곧 경쟁력인 분', '이미지 중심의 브랜드'],
    features: ['프로젝트 갤러리', '카테고리 · 태그 분류', '작업 상세 페이지', '의뢰 문의 폼', '이미지 최적화'],
    pages: ['메인', '작업', '작업 상세', '프로필', '문의'],
  },
  {
    slug: 'shop-001',
    title: '쇼핑 · 판매형 #001',
    titleEn: 'SHOPPING WEBSITE 001',
    categorySlug: 'shop',
    industry: '뷰티 · 코스메틱',
    level: 'CUSTOM',
    shortDescription: '제품의 가치를 먼저 보여주고 구매로 잇는 구성입니다.',
    tags: ['#상품진열', '#결제연동', '#리뷰'],
    palette: palette('shop'),
    previewLayout: 'commerce',
    isNew: true,
    isFeatured: false,
    createdAt: '2026-09-01',
    sortOrder: 9,
    concept: ['상품 이미지를 크게 쓰되 정보는 정돈해', '고민 없이 구매까지 이어지도록 설계했습니다.'],
    recommendedFor: ['브랜드 이미지가 중요한 판매자', '상품 수가 계속 늘어나는 곳'],
    features: ['상품 등록 · 진열', '장바구니 · 결제 연동', '주문 · 배송 관리', '리뷰 · 문의', '쿠폰 · 프로모션'],
    pages: ['메인', '전체 상품', '상품 상세', '장바구니', '마이페이지'],
  },
  {
    slug: 'booking-001',
    title: '예약형 #001',
    titleEn: 'BOOKING WEBSITE 001',
    categorySlug: 'booking',
    industry: '병원 · 의료',
    level: 'STANDARD',
    shortDescription: '진료 안내와 예약을 가장 짧은 동선으로 묶었습니다.',
    tags: ['#예약', '#신뢰감', '#진료안내'],
    palette: palette('booking'),
    previewLayout: 'landing',
    isNew: false,
    isFeatured: false,
    createdAt: '2026-08-31',
    sortOrder: 10,
    concept: ['불안한 마음으로 찾아오는 방문자를 고려해', '정보를 차분하고 명확하게 배치했습니다.'],
    recommendedFor: ['예약이 핵심인 의료기관', '진료 항목이 여러 개인 곳'],
    features: ['진료 안내', '예약 캘린더', '의료진 소개', '오시는 길', '알림 발송'],
    pages: ['메인', '진료 안내', '의료진', '예약하기', '오시는 길'],
  },
  {
    slug: 'landing-001',
    title: '랜딩페이지형 #001',
    titleEn: 'LANDING PAGE 001',
    categorySlug: 'landing',
    industry: '이벤트 · 프로모션',
    level: 'STANDARD',
    shortDescription: '하나의 목적에 집중해 전환까지 밀어주는 구성입니다.',
    tags: ['#단일목적', '#전환중심', '#빠른제작'],
    palette: palette('landing'),
    previewLayout: 'landing',
    isNew: false,
    isFeatured: false,
    createdAt: '2026-08-30',
    sortOrder: 11,
    concept: ['메시지를 하나로 좁히고 반복해', '방문자가 다른 곳으로 새지 않게 합니다.'],
    recommendedFor: ['이벤트 · 모집 페이지가 필요한 곳', '광고와 연결할 페이지가 필요한 곳'],
    features: ['핵심 메시지 구성', '신청 · 문의 폼', '광고 채널 연동', '전환 추적 세팅'],
    pages: ['랜딩 페이지', '신청 완료'],
  },
  {
    slug: 'admin-001',
    title: '관리자 시스템 포함형 #001',
    titleEn: 'ADMIN SYSTEM WEBSITE 001',
    categorySlug: 'admin',
    industry: '전 업종',
    level: 'SIGNATURE',
    shortDescription: '보이는 화면과 운영 화면을 함께 설계한 구성입니다.',
    tags: ['#관리자시스템', '#운영편의', '#고객DB'],
    palette: palette('admin'),
    previewLayout: 'dashboard',
    isNew: true,
    isFeatured: true,
    createdAt: '2026-08-30',
    sortOrder: 12,
    concept: [
      '홈페이지 오픈이 끝이 아니라 운영의 시작이라는 전제로',
      '관리자 화면까지 하나의 제품으로 설계했습니다.',
    ],
    recommendedFor: ['직접 운영해야 하는 사업자', '문의와 고객을 관리해야 하는 곳', '콘텐츠를 계속 쌓아야 하는 곳'],
    features: ['콘텐츠 등록 · 수정', '이미지 교체 · 자료실', '노출 / 비노출 관리', '문의 확인 · 상태 관리', '고객 DB 조회', '모바일 관리자'],
    pages: ['메인', '서비스', '문의하기', '관리자 대시보드', '관리자 문의관리'],
  },
];

export const designs: DesignDetail[] = RAW.map((item, index) => ({
  ...item,
  id: `design-${String(index + 1).padStart(3, '0')}`,
  /** Phase 7 에서 관리자가 실제 이미지를 등록하면 false 가 됩니다. */
  isPlaceholder: true,
}));

/* ------------------------------------------------------------------ */
/* 조회 함수 — Phase 6 에서 내부만 Supabase 쿼리로 교체합니다           */
/* ------------------------------------------------------------------ */

export interface DesignQuery {
  category?: string;
  level?: DesignLevel;
  tag?: string;
  onlyNew?: boolean;
  onlyFeatured?: boolean;
  page?: number;
  perPage?: number;
  exclude?: string;
}

export interface DesignPage {
  items: DesignSummary[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

/**
 * 목록 조회.
 * ⚠️ 화면에서 designs 배열을 직접 쓰지 않고 반드시 이 함수를 씁니다.
 *    디자인이 수백 개로 늘어나도 화면 코드는 그대로 두고
 *    이 함수 안에서 서버 페이지네이션으로 바꿀 수 있게 하기 위해서입니다.
 */
export function queryDesigns(query: DesignQuery = {}): DesignPage {
  const { category, level, tag, onlyNew, onlyFeatured, exclude, page = 1, perPage = 12 } = query;

  const filtered = designs
    .filter((design) => (category ? design.categorySlug === category : true))
    .filter((design) => (level ? design.level === level : true))
    .filter((design) => (tag ? design.tags.includes(tag) : true))
    .filter((design) => (onlyNew ? design.isNew : true))
    .filter((design) => (onlyFeatured ? design.isFeatured : true))
    .filter((design) => (exclude ? design.slug !== exclude : true))
    .sort((a, b) => {
      if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? 1 : -1;
      return a.sortOrder - b.sortOrder;
    });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * perPage;

  return {
    items: filtered.slice(start, start + perPage),
    total,
    page: current,
    perPage,
    totalPages,
  };
}

export function getDesign(slug: string): DesignDetail | undefined {
  return designs.find((design) => design.slug === slug);
}

/** 상세 페이지 하단의 "이런 디자인도 함께 살펴보세요" */
export function getRelatedDesigns(design: DesignDetail, limit = 4): DesignSummary[] {
  const sameCategory = queryDesigns({ category: design.categorySlug, exclude: design.slug }).items;
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const others = queryDesigns({ exclude: design.slug }).items.filter(
    (item) => item.categorySlug !== design.categorySlug,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

/** 실제 DB 값만 사용하는 카운트 — 허위 수치를 쓰지 않기 위한 함수입니다 */
export function countDesigns(): number {
  return designs.length;
}

/* ------------------------------------------------------------------ */
/* 디자인 등급                                                          */
/* ------------------------------------------------------------------ */

export const designLevels: Array<{
  key: DesignLevel;
  label: string;
  description: string[];
}> = [
  {
    key: 'STANDARD',
    label: 'STANDARD',
    description: ['기본형 템플릿으로', '빠르고 합리적인 제작'],
  },
  {
    key: 'CUSTOM',
    label: 'CUSTOM',
    description: ['브랜드에 맞춘', '맞춤 디자인'],
  },
  {
    key: 'SIGNATURE',
    label: 'SIGNATURE',
    description: ['브랜드의 가치를 높이는', '프리미엄 맞춤 제작'],
  },
];

/* ------------------------------------------------------------------ */
/* 갤러리 필터 (BN_PC_07 의 속성 칩)                                    */
/* ------------------------------------------------------------------ */

export const designTagFilters: FilterOption[] = [
  { key: 'all', label: '전체' },
  { key: 'new', label: '신규 디자인' },
  { key: 'featured', label: '추천 디자인' },
  { key: 'STANDARD', label: 'STANDARD' },
  { key: 'CUSTOM', label: 'CUSTOM' },
  { key: 'SIGNATURE', label: 'SIGNATURE' },
];
