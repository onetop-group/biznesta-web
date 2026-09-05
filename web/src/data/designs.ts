import type { DesignDetail, DesignLevel, DesignSummary, FilterOption } from '@/types';

/**
 * BIZNESTA 샘플 디자인 12종.
 *
 * ⚠️ 이것은 가짜 고객 사례가 아닙니다 (지시서 4 · 19항).
 *    BIZNESTA 가 직접 만든 CONCEPT / SAMPLE 디자인이며,
 *    화면의 모든 카드와 상세 페이지에 그 사실을 표기합니다.
 *    실제 고객 프로젝트가 생기면 origin: 'CLIENT' 로 등록해 구분합니다.
 *
 * ⚠️ 12개가 서로 완전히 달라야 합니다 (지시서 5항).
 *    그래서 palette · sample.hero · sample.type · art.motif 를
 *    의도적으로 겹치지 않게 배분했습니다. 작은 썸네일만 봐도
 *    "다른 홈페이지"로 읽히는 것이 목표입니다.
 *
 * ⚠️ Phase 6 에서 designs / design_images 테이블로 이관됩니다.
 *    조회는 반드시 아래 함수를 통해서만 합니다.
 */

const RAW: Array<Omit<DesignDetail, 'id' | 'isPlaceholder'>> = [
  /* 01 ─ 정통 프리미엄 기업 ─ 딥네이비 + 세리프 + 건축 모티프 ─────── */
  {
    slug: 'corporate-001',
    title: '기업 · 브랜드형 #001',
    titleEn: 'CORPORATE WEBSITE 001',
    categorySlug: 'corporate',
    industry: '제조 · 기술',
    level: 'SIGNATURE',
    origin: 'CONCEPT',
    shortDescription: '규모와 신뢰가 첫 화면에서 전달되는 정통 기업 홈페이지.',
    tags: ['#신뢰감', '#정통', '#세리프', '#기업소개'],
    palette: { main: '#0E2440', point: '#C9A77A', sub: '#F7F4EE', text: '#1F2A38' },
    previewLayout: 'corporate',
    sample: {
      hero: 'split',
      type: 'serif',
      canvas: '#F7F4EE',
      copy: {
        mark: 'CORPORATE',
        nav: ['ABOUT', 'BUSINESS', 'NEWS', 'CONTACT'],
        eyebrow: 'Building Trust',
        title: ['A More Valuable', 'Tomorrow'],
        sub: '사람과 가치를 잇는 기술로 더 나은 내일을 만듭니다.',
        cta: 'DISCOVER',
        sections: ['회사소개', '사업영역', '뉴스룸'],
      },
      art: { from: '#1B3A5C', via: '#264B72', to: '#0E2440', motif: 'tower', ink: '#E4CDA9' },
    },
    isNew: true,
    isFeatured: true,
    createdAt: '2026-09-05',
    sortOrder: 1,
    concept: [
      '규모와 안정감이 첫 화면에서 전달되도록',
      '세리프 타이포와 넓은 여백으로 구성했습니다.',
    ],
    recommendedFor: [
      '브랜드 신뢰도를 높이고 싶은 기업',
      '사업 영역이 여러 개인 회사',
      '오래 사용할 안정적인 홈페이지가 필요한 곳',
    ],
    features: ['회사 소개 · 연혁', '사업 영역 안내', '뉴스 · 보도자료', '문의 폼 · 자동 알림', '기본 SEO 세팅', '모바일 최적화'],
    pages: ['메인', '회사소개', '사업영역', '뉴스', '문의하기'],
  },

  /* 02 ─ 건축적 기업 ─ 차콜 + 컨덴스드 + 풀블리드 ────────────────── */
  {
    slug: 'corporate-002',
    title: '기업 · 브랜드형 #002',
    titleEn: 'CORPORATE WEBSITE 002',
    categorySlug: 'corporate',
    industry: '건설 · 부동산',
    level: 'CUSTOM',
    origin: 'CONCEPT',
    shortDescription: '대형 비주얼이 화면을 가득 채우는 건축적 구성.',
    tags: ['#대형비주얼', '#풀스크린', '#건축적'],
    palette: { main: '#1A1E24', point: '#9FB4C7', sub: '#EDEFF2', text: '#232830' },
    previewLayout: 'gallery',
    sample: {
      hero: 'fullbleed',
      type: 'condensed',
      canvas: '#12161B',
      dark: true,
      copy: {
        mark: 'STRUCTURE',
        nav: ['WORKS', 'PROCESS', 'STUDIO'],
        eyebrow: 'Space & Structure',
        title: ['우리가 만드는', '공간의 기준'],
        sub: '설계부터 시공까지, 하나의 기준으로 완성합니다.',
        cta: 'VIEW WORKS',
        sections: ['PROJECT', 'PROCESS', 'PARTNERS'],
      },
      art: { from: '#2A3138', via: '#455260', to: '#131820', motif: 'diagonal', ink: '#C7D4E0' },
    },
    isNew: true,
    isFeatured: false,
    createdAt: '2026-09-04',
    sortOrder: 2,
    concept: ['프로젝트 이미지를 화면 전체로 써서', '실적과 규모가 즉시 느껴지도록 설계했습니다.'],
    recommendedFor: ['프로젝트 실적을 보여줘야 하는 기업', '시각적 임팩트가 필요한 브랜드'],
    features: ['프로젝트 갤러리', '사업 영역 안내', '문의 폼', '이미지 최적화', '모바일 최적화'],
    pages: ['메인', '회사소개', '프로젝트', '문의하기'],
  },

  /* 03 ─ 감성 카페 ─ 에스프레소 + 오버레이 + 다크 ───────────────── */
  {
    slug: 'store-001',
    title: '소상공인 · 매장형 #001',
    titleEn: 'STORE WEBSITE 001',
    categorySlug: 'store',
    industry: '카페 · 음식점',
    level: 'STANDARD',
    origin: 'CONCEPT',
    shortDescription: '공간의 온도가 그대로 전해지는 감성 매장 홈페이지.',
    tags: ['#감성', '#공간', '#예약'],
    palette: { main: '#2E211A', point: '#D9A566', sub: '#F7F0E6', text: '#33261E' },
    previewLayout: 'store',
    sample: {
      hero: 'overlay',
      type: 'serif',
      canvas: '#211711',
      dark: true,
      copy: {
        mark: 'CAFÉ',
        nav: ['MENU', 'SPACE', 'VISIT'],
        eyebrow: 'Good Coffee',
        title: ['Better Days', 'Begin Here'],
        sub: '좋은 커피가 만드는 특별한 하루.',
        cta: 'RESERVE',
        sections: ['MENU', 'SPACE', 'EVENT'],
      },
      art: { from: '#4A3428', via: '#7A5436', to: '#1C130E', motif: 'arc', ink: '#E8C89A' },
    },
    isNew: true,
    isFeatured: true,
    createdAt: '2026-09-04',
    sortOrder: 3,
    concept: ['따뜻한 톤과 큰 이미지로', '방문하고 싶은 공간이라는 인상을 만듭니다.'],
    recommendedFor: ['공간의 매력을 보여주고 싶은 매장', '예약과 문의를 함께 받고 싶은 곳'],
    features: ['메뉴 · 상품 소개', '예약 / 주문 기능', '지도 · 위치 안내', '영업시간 안내', 'SNS 연동', '모바일 최적화'],
    pages: ['메인', '메뉴', '공간소개', '오시는 길', '예약하기'],
  },

  /* 04 ─ 뷰티 ─ 블러시 + 중앙정렬 + 부드러운 여백 ─────────────────── */
  {
    slug: 'store-002',
    title: '소상공인 · 매장형 #002',
    titleEn: 'STORE WEBSITE 002',
    categorySlug: 'store',
    industry: '뷰티 · 미용',
    level: 'CUSTOM',
    origin: 'CONCEPT',
    shortDescription: '부드러운 여백으로 전문성과 편안함을 함께 전하는 구성.',
    tags: ['#브랜드이미지', '#상담예약', '#여백'],
    palette: { main: '#6B4550', point: '#D79AA4', sub: '#FBF4F4', text: '#4A373C' },
    previewLayout: 'landing',
    sample: {
      hero: 'centered',
      type: 'sans',
      canvas: '#FBF4F4',
      copy: {
        mark: 'BEAUTY',
        nav: ['PROGRAM', 'GALLERY', 'BOOKING'],
        eyebrow: 'For a Better You',
        title: ['아름다움이', '일상이 되는 순간'],
        sub: '당신에게 가장 잘 맞는 방법을 함께 찾습니다.',
        cta: '상담 예약',
        sections: ['프로그램', '갤러리', '후기'],
      },
      art: { from: '#F2CBD1', via: '#E3A9B4', to: '#C98E9C', motif: 'bloom', ink: '#7A4A55' },
    },
    isNew: false,
    isFeatured: false,
    createdAt: '2026-09-03',
    sortOrder: 4,
    concept: ['부드러운 색과 정돈된 정보 구조로', '전문성과 편안함을 동시에 전달합니다.'],
    recommendedFor: ['시술 · 프로그램이 여러 개인 매장', '상담 예약이 중요한 업종'],
    features: ['시술 · 프로그램 안내', '상담 예약 폼', '전후 갤러리', '이벤트 관리', '모바일 최적화'],
    pages: ['메인', '프로그램', '갤러리', '예약 · 상담'],
  },

  /* 05 ─ 아카데미 ─ 인디고 + 앰버 + 스플릿 + 그리드 ───────────────── */
  {
    slug: 'education-001',
    title: '교육형 #001',
    titleEn: 'EDUCATION WEBSITE 001',
    categorySlug: 'education',
    industry: '학원 · 아카데미',
    level: 'SIGNATURE',
    origin: 'SAMPLE',
    shortDescription: '커리큘럼과 수강신청이 한 흐름으로 이어지는 구성.',
    tags: ['#커리큘럼', '#수강신청', '#신뢰감'],
    palette: { main: '#1E3A6E', point: '#E0A83C', sub: '#F4F6FB', text: '#26303F' },
    previewLayout: 'corporate',
    sample: {
      hero: 'split',
      type: 'sans',
      canvas: '#F4F6FB',
      copy: {
        mark: 'ACADEMY',
        nav: ['커리큘럼', '강사진', '후기', '수강신청'],
        eyebrow: 'Learn · Grow · Shine',
        title: ['오늘의 배움이', '내일의 가능성이 됩니다'],
        sub: '실무 중심 커리큘럼과 현직 전문가 강사진.',
        cta: '수강신청',
        sections: ['커리큘럼', '강사진', '수강후기'],
      },
      art: { from: '#2C4E8C', via: '#4A6FA8', to: '#172C55', motif: 'grid', ink: '#F0C167' },
    },
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

  /* 06 ─ 온라인 클래스 ─ 청록 + 에디토리얼 + 웨이브 ────────────────── */
  {
    slug: 'education-002',
    title: '교육형 #002',
    titleEn: 'EDUCATION WEBSITE 002',
    categorySlug: 'education',
    industry: '온라인 클래스',
    level: 'CUSTOM',
    origin: 'CONCEPT',
    shortDescription: '강의를 탐색하고 결제까지 짧게 잇는 온라인 클래스 구성.',
    tags: ['#온라인클래스', '#탐색', '#결제연동'],
    palette: { main: '#12554F', point: '#4FB3A3', sub: '#F1F7F5', text: '#1F3B38' },
    previewLayout: 'commerce',
    sample: {
      hero: 'editorial',
      type: 'sans',
      canvas: '#F1F7F5',
      copy: {
        mark: 'CLASS',
        nav: ['전체 강의', '멤버십', '커뮤니티'],
        eyebrow: 'Anywhere, Anytime',
        title: ['배우고 싶은 순간,', '바로 시작하세요'],
        sub: '원하는 강의를 골라 오늘부터 바로 수강할 수 있습니다.',
        cta: '강의 둘러보기',
        sections: ['신규 강의', '인기 강의', '무료 체험'],
      },
      art: { from: '#2E7E74', via: '#5CBFAF', to: '#0E4A45', motif: 'wave', ink: '#EAF6F3' },
    },
    isNew: false,
    isFeatured: false,
    createdAt: '2026-09-02',
    sortOrder: 6,
    concept: ['강의를 상품처럼 탐색할 수 있게 정리하고', '결제까지 이어지는 동선을 짧게 만들었습니다.'],
    recommendedFor: ['온라인 강의를 판매하는 곳', '강의 수가 계속 늘어나는 곳'],
    features: ['강의 목록 · 필터', '결제 연동', '수강 관리', '후기 · 문의', '모바일 최적화'],
    pages: ['메인', '전체 강의', '강의 상세', '마이페이지'],
  },

  /* 07 ─ 전문가 개인 ─ 잉크 + 브론즈 + 비대칭 ─────────────────────── */
  {
    slug: 'expert-001',
    title: '전문가 개인형 #001',
    titleEn: 'EXPERT WEBSITE 001',
    categorySlug: 'expert',
    industry: '법률 · 세무',
    level: 'STANDARD',
    origin: 'CONCEPT',
    shortDescription: '경력과 전문 분야를 신뢰감 있게 정리한 개인 브랜딩.',
    tags: ['#전문성', '#개인브랜딩', '#비대칭'],
    palette: { main: '#22252B', point: '#B08654', sub: '#F5F3EF', text: '#2B2F36' },
    previewLayout: 'corporate',
    sample: {
      hero: 'asymmetric',
      type: 'serif',
      canvas: '#F5F3EF',
      copy: {
        mark: 'EXPERT',
        nav: ['PROFILE', 'PRACTICE', 'COLUMN'],
        eyebrow: 'Your Specialist Partner',
        title: ['경험이 다르면', '결과가 다릅니다'],
        sub: '한 분야에 집중해온 시간이 답을 만듭니다.',
        cta: '상담 신청',
        sections: ['PROFILE', 'PRACTICE', 'COLUMN'],
      },
      art: { from: '#3A3F48', via: '#6E624F', to: '#1D2026', motif: 'orb', ink: '#D8BC92' },
    },
    isNew: false,
    isFeatured: true,
    createdAt: '2026-09-02',
    sortOrder: 7,
    concept: ['정보의 위계를 분명히 해', '처음 방문한 사람도 전문성을 빠르게 판단할 수 있게 합니다.'],
    recommendedFor: ['전문성을 신뢰로 연결해야 하는 분', '상담 신청을 받는 전문가'],
    features: ['프로필 · 경력 소개', '전문 분야 안내', '상담 신청 폼', '칼럼 · 인사이트', '모바일 최적화'],
    pages: ['메인', '프로필', '업무 분야', '칼럼', '상담 신청'],
  },

  /* 08 ─ 크리에이티브 스튜디오 ─ 무채색 + 메이슨리 ────────────────── */
  {
    slug: 'portfolio-001',
    title: '포트폴리오형 #001',
    titleEn: 'PORTFOLIO WEBSITE 001',
    categorySlug: 'portfolio',
    industry: '디자인 · 아트',
    level: 'SIGNATURE',
    origin: 'SAMPLE',
    shortDescription: '작업물이 주인공이 되도록 장식을 걷어낸 갤러리 구성.',
    tags: ['#갤러리', '#무채색', '#크리에이터'],
    palette: { main: '#141414', point: '#B9975B', sub: '#FFFFFF', text: '#1C1C1C' },
    previewLayout: 'gallery',
    sample: {
      hero: 'masonry',
      type: 'condensed',
      canvas: '#FFFFFF',
      copy: {
        mark: 'STUDIO',
        nav: ['WORKS', 'ABOUT', 'CONTACT'],
        eyebrow: 'Selected Works',
        title: ['Work', 'Speaks First'],
        sub: '2024 — 2026',
        cta: 'CONTACT',
        sections: ['BRANDING', 'EDITORIAL', 'SPACE'],
      },
      art: { from: '#2B2B2B', via: '#5C5C5C', to: '#101010', motif: 'bars', ink: '#D8C9A8' },
    },
    isNew: true,
    isFeatured: true,
    createdAt: '2026-09-01',
    sortOrder: 8,
    concept: ['장식을 최소화하고 이미지에 집중시켜', '작업의 완성도가 그대로 전달되도록 했습니다.'],
    recommendedFor: ['작업물이 곧 경쟁력인 분', '이미지 중심의 브랜드'],
    features: ['프로젝트 갤러리', '카테고리 · 태그 분류', '작업 상세 페이지', '의뢰 문의 폼', '이미지 최적화'],
    pages: ['메인', '작업', '작업 상세', '프로필', '문의'],
  },

  /* 09 ─ 커머스 ─ 테라코타 + 샌드 + 중앙정렬 ──────────────────────── */
  {
    slug: 'shop-001',
    title: '쇼핑 · 판매형 #001',
    titleEn: 'SHOPPING WEBSITE 001',
    categorySlug: 'shop',
    industry: '뷰티 · 코스메틱',
    level: 'CUSTOM',
    origin: 'CONCEPT',
    shortDescription: '제품의 가치를 먼저 보여주고 구매로 잇는 스토어 구성.',
    tags: ['#상품진열', '#브랜드커머스', '#결제연동'],
    palette: { main: '#7A3F2C', point: '#D98E5F', sub: '#FAF3EC', text: '#3E2A22' },
    previewLayout: 'commerce',
    sample: {
      hero: 'centered',
      type: 'serif',
      canvas: '#FAF3EC',
      copy: {
        mark: 'STORE',
        nav: ['SHOP', 'STORY', 'JOURNAL'],
        eyebrow: 'A Better Daily Life',
        title: ['매일 쓰는 것부터,', '더 좋은 선택으로'],
        sub: '오래 쓸수록 좋아지는 것들을 소개합니다.',
        cta: 'SHOP NOW',
        sections: ['BEST', 'NEW', 'SET'],
      },
      art: { from: '#C97A4E', via: '#E0A87C', to: '#8A4A2E', motif: 'bloom', ink: '#FBEEE2' },
    },
    isNew: true,
    isFeatured: false,
    createdAt: '2026-09-01',
    sortOrder: 9,
    concept: ['상품 이미지를 크게 쓰되 정보는 정돈해', '고민 없이 구매까지 이어지도록 설계했습니다.'],
    recommendedFor: ['브랜드 이미지가 중요한 판매자', '상품 수가 계속 늘어나는 곳'],
    features: ['상품 등록 · 진열', '장바구니 · 결제 연동', '주문 · 배송 관리', '리뷰 · 문의', '쿠폰 · 프로모션'],
    pages: ['메인', '전체 상품', '상품 상세', '장바구니', '마이페이지'],
  },

  /* 10 ─ 의료 예약 ─ 민트 + 화이트 + 스플릿 ───────────────────────── */
  {
    slug: 'booking-001',
    title: '예약형 #001',
    titleEn: 'BOOKING WEBSITE 001',
    categorySlug: 'booking',
    industry: '병원 · 의료',
    level: 'STANDARD',
    origin: 'CONCEPT',
    shortDescription: '진료 안내와 예약을 가장 짧은 동선으로 묶은 구성.',
    tags: ['#예약', '#신뢰감', '#정돈'],
    palette: { main: '#14506B', point: '#5FBFC9', sub: '#F2F8FA', text: '#223B45' },
    previewLayout: 'landing',
    sample: {
      hero: 'split',
      type: 'sans',
      canvas: '#F2F8FA',
      copy: {
        mark: 'CLINIC',
        nav: ['진료안내', '의료진', '오시는 길', '예약'],
        eyebrow: 'For Your Healthy Day',
        title: ['건강한 오늘,', '편안한 내일'],
        sub: '사람을 먼저 생각하는 진료를 약속합니다.',
        cta: '예약하기',
        sections: ['진료안내', '의료진', '검진'],
      },
      art: { from: '#2E8FA3', via: '#7FCBD3', to: '#12495F', motif: 'wave', ink: '#EAF7F9' },
    },
    isNew: false,
    isFeatured: false,
    createdAt: '2026-08-31',
    sortOrder: 10,
    concept: ['불안한 마음으로 찾아오는 방문자를 고려해', '정보를 차분하고 명확하게 배치했습니다.'],
    recommendedFor: ['예약이 핵심인 의료기관', '진료 항목이 여러 개인 곳'],
    features: ['진료 안내', '예약 캘린더', '의료진 소개', '오시는 길', '알림 발송'],
    pages: ['메인', '진료 안내', '의료진', '예약하기', '오시는 길'],
  },

  /* 11 ─ 랜딩 ─ 강한 대비 + 오버레이 + 사선 ──────────────────────── */
  {
    slug: 'landing-001',
    title: '랜딩페이지형 #001',
    titleEn: 'LANDING PAGE 001',
    categorySlug: 'landing',
    industry: '이벤트 · 프로모션',
    level: 'STANDARD',
    origin: 'CONCEPT',
    shortDescription: '하나의 목적에 집중해 신청까지 밀어주는 단일 페이지.',
    tags: ['#단일목적', '#전환중심', '#강한대비'],
    palette: { main: '#241B3D', point: '#E5B45C', sub: '#F6F3FA', text: '#2B2440' },
    previewLayout: 'landing',
    sample: {
      hero: 'overlay',
      type: 'condensed',
      canvas: '#1A1430',
      dark: true,
      copy: {
        mark: 'EVENT',
        nav: ['혜택', '일정', '신청'],
        eyebrow: 'Limited Opening',
        title: ['지금이', '가장 좋은 시작'],
        sub: '선착순 마감 · 신청 후 24시간 내 연락드립니다.',
        cta: '지금 신청',
        sections: ['혜택', '일정', 'FAQ'],
      },
      art: { from: '#4A3573', via: '#7B5FA8', to: '#1A1430', motif: 'diagonal', ink: '#F2D79B' },
    },
    isNew: false,
    isFeatured: false,
    createdAt: '2026-08-30',
    sortOrder: 11,
    concept: ['메시지를 하나로 좁히고 반복해', '방문자가 다른 곳으로 새지 않게 합니다.'],
    recommendedFor: ['이벤트 · 모집 페이지가 필요한 곳', '광고와 연결할 페이지가 필요한 곳'],
    features: ['핵심 메시지 구성', '신청 · 문의 폼', '광고 채널 연동', '전환 추적 세팅'],
    pages: ['랜딩 페이지', '신청 완료'],
  },

  /* 12 ─ 관리자 시스템 ─ 슬레이트 + 골드 + 콘솔 ───────────────────── */
  {
    slug: 'admin-001',
    title: '관리자 시스템 포함형 #001',
    titleEn: 'ADMIN SYSTEM 001',
    categorySlug: 'admin',
    industry: '전 업종',
    level: 'SIGNATURE',
    origin: 'SAMPLE',
    shortDescription: '보이는 화면과 운영 화면을 하나의 제품으로 설계한 구성.',
    tags: ['#관리자시스템', '#운영편의', '#고객DB'],
    palette: { main: '#132B45', point: '#C9A05F', sub: '#F4F6F8', text: '#25313D' },
    previewLayout: 'dashboard',
    sample: {
      hero: 'console',
      type: 'sans',
      canvas: '#F4F6F8',
      copy: {
        mark: 'ADMIN',
        nav: ['대시보드', '문의관리', '고객관리', '콘텐츠', '설정'],
        eyebrow: 'Manage · Grow',
        title: ['대시보드'],
        sub: '오늘 확인할 일 3건',
        cta: '저장',
        sections: ['문의 접수', '상담 진행', '제작 진행', '완료'],
      },
      art: { from: '#1E3E5E', via: '#33608A', to: '#0F2438', motif: 'grid', ink: '#D9BE86' },
    },
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
  /**
   * ⚠️ 아직 design_images 에 실제 이미지 파일이 없다는 뜻입니다.
   *    화면은 SampleScreen 이 그린 BIZNESTA 자체 디자인을 보여줍니다.
   *    Phase 7 에서 이미지를 등록하면 false 가 되고 같은 자리에
   *    등록된 이미지가 렌더됩니다.
   */
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

export function getRelatedDesigns(design: DesignDetail, limit = 4): DesignSummary[] {
  const sameCategory = queryDesigns({ category: design.categorySlug, exclude: design.slug }).items;
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const others = queryDesigns({ exclude: design.slug }).items.filter(
    (item) => item.categorySlug !== design.categorySlug,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

/** 카테고리를 대표할 디자인 — 유형 카드에 실제 화면을 보여주기 위해 씁니다 */
export function getDesignForCategory(categorySlug: string): DesignSummary | undefined {
  return queryDesigns({ category: categorySlug, perPage: 1 }).items[0];
}

/** 실제 DB 값만 사용하는 카운트 — 허위 수치를 쓰지 않기 위한 함수입니다 */
export function countDesigns(): number {
  return designs.length;
}

/* ------------------------------------------------------------------ */
/* 디자인 등급 · 출처                                                   */
/* ------------------------------------------------------------------ */

export const designLevels: Array<{
  key: DesignLevel;
  label: string;
  description: string[];
}> = [
  { key: 'STANDARD', label: 'STANDARD', description: ['기본형 템플릿으로', '빠르고 합리적인 제작'] },
  { key: 'CUSTOM', label: 'CUSTOM', description: ['브랜드에 맞춘', '맞춤 디자인'] },
  { key: 'SIGNATURE', label: 'SIGNATURE', description: ['브랜드의 가치를 높이는', '프리미엄 맞춤 제작'] },
];

/** 화면에 표기할 출처 라벨 — 고객 사례와 자체 샘플을 구분합니다 */
export const originLabel = {
  CONCEPT: 'BIZNESTA CONCEPT DESIGN',
  SAMPLE: 'BIZNESTA SAMPLE DESIGN',
  CLIENT: 'CLIENT PROJECT',
} as const;

export const originShort = {
  CONCEPT: 'CONCEPT',
  SAMPLE: 'SAMPLE',
  CLIENT: 'CLIENT',
} as const;

/* ------------------------------------------------------------------ */
/* 갤러리 필터                                                          */
/* ------------------------------------------------------------------ */

export const designTagFilters: FilterOption[] = [
  { key: 'all', label: '전체' },
  { key: 'new', label: '신규 디자인' },
  { key: 'featured', label: '추천 디자인' },
  { key: 'STANDARD', label: 'STANDARD' },
  { key: 'CUSTOM', label: 'CUSTOM' },
  { key: 'SIGNATURE', label: 'SIGNATURE' },
];
