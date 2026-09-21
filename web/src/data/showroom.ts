/**
 * BIZNESTA DESIGN SHOWROOM — 공식 카테고리와 실제 디자인 자료.
 *
 * 이 파일이 카테고리의 유일한 출처다. 상단 카테고리 · 8개 대표 카드 · 목록 ·
 * 상세 · 관련 디자인이 모두 여기의 같은 category id 를 쓴다.
 *
 * 작품 데이터
 *   · id       = 이미지 파일 이름. 처음 받은 폴더 이름이 그대로 남아 있어
 *                카테고리와 다를 수 있다(예: corporate-01 은 병원 · 의료형).
 *                이미지를 다시 만들지 않으려고 id 는 그대로 둔다.
 *   · category = **실제 화면을 보고 정한** 공식 카테고리. 파일명 분류가 아니라
 *                홈페이지의 실제 업종 · 목적을 따른다.
 *   · title    = 고객에게 보이는 제목(업종 · 용도). 화면에 인쇄된 로고 · 메뉴 ·
 *                메인카피에서 확인한 것만 쓴다. 브랜드명은 쓰지 않는다 —
 *                실제 고객사 · 제작실적으로 오해될 수 있다.
 *   · desc     = 그 작품을 설명하는 한 줄. 성과 · 후기 · 수치는 쓰지 않는다.
 *   · pc / mo  = 한 작품의 두 화면. 따로 떼어 두 작품으로 세지 않는다.
 *
 * 새 작품은 이미지 3장(-pc / -mo / -thumb)과 이 배열의 한 줄만 더하면
 * 목록 · 상세 · 관련 디자인에 자동으로 들어간다.
 */

export type ShowroomCategoryId =
  | 'corporate' | 'local' | 'education' | 'expert'
  | 'beauty' | 'medical' | 'franchise' | 'shopping';

export type ShowroomCategory = {
  id: ShowroomCategoryId;
  /** 화면에 보이는 번호 (01~08) */
  no: number;
  name: string;
  label: string;
  desc: string;
  /** 대표 카드에 쓰는 실제 디자인 id */
  cover: string;
  /** 커버 위쪽이 밝으면 dark(진한 글자), 어두우면 light */
  coverTone: 'dark' | 'light';
};

export type ShowroomImage = { src: string; width: number; height: number };

export type ShowroomDesign = {
  /** 작품 id (= 이미지 파일 이름) */
  id: string;
  category: ShowroomCategoryId;
  /** 카테고리 안에서의 번호 */
  order: number;
  /** 고객에게 보이는 제목 — 업종 · 용도 */
  title: string;
  /** 한 줄 소개 */
  desc: string;
  pc: ShowroomImage;
  mo: ShowroomImage;
  thumb: ShowroomImage;
  /** 앞으로 채울 자리 — 확정 전에는 비워 둔다 */
  tags?: string[];
  purpose?: string[];
  functions?: string[];
};

const img = (name: string, width: number, height: number): ShowroomImage =>
  ({ src: `/portfolio/${name}.webp`, width, height });

export const SHOWROOM_CATEGORIES: ShowroomCategory[] = [
  { id: 'corporate', no: 1, name: '기업 · 브랜드형', label: 'CORPORATE',
    desc: '신뢰와 가치를 담은 프리미엄 홈페이지', cover: 'corporate-04', coverTone: 'dark' },
  { id: 'local', no: 2, name: '소상공인 · 매장형', label: 'LOCAL STORE',
    desc: '지역에서 돋보이는 매장 홈페이지', cover: 'local-05', coverTone: 'dark' },
  { id: 'education', no: 3, name: '교육형', label: 'EDUCATION',
    desc: '학원 · 아카데미 · 교육 프로그램 홈페이지', cover: 'education-03', coverTone: 'dark' },
  { id: 'expert', no: 4, name: '전문가 · 개인형', label: 'EXPERT',
    desc: '당신의 전문성을 더욱 빛나게', cover: 'expert-04', coverTone: 'dark' },
  { id: 'beauty', no: 5, name: '뷰티 · 미용형', label: 'BEAUTY',
    desc: '브랜드의 감각이 돋보이는 홈페이지', cover: 'beauty-01', coverTone: 'light' },
  { id: 'medical', no: 6, name: '병원 · 의료형', label: 'MEDICAL',
    desc: '신뢰를 전하는 의료기관 홈페이지', cover: 'medical-06', coverTone: 'dark' },
  { id: 'franchise', no: 7, name: '프랜차이즈형', label: 'FRANCHISE',
    desc: '가맹점 모집부터 브랜드 확장까지', cover: 'franchise-02', coverTone: 'dark' },
  { id: 'shopping', no: 8, name: '쇼핑 · 판매형', label: 'SHOPPING',
    desc: '제품의 가치를 높이는 쇼핑몰', cover: 'shopping-01', coverTone: 'dark' },
];

export const SHOWROOM_DESIGNS: ShowroomDesign[] = [
  { id: 'corporate-03', category: 'corporate', order: 1,
    title: '식품 브랜드 홈페이지', desc: '자연 그대로의 재료와 브랜드 철학을 함께 전하는 식품 브랜드 홈페이지입니다.',
    pc: img('corporate-03-pc', 1600, 900), mo: img('corporate-03-mo', 900, 1599), thumb: img('corporate-03-thumb', 800, 450) },
  { id: 'corporate-04', category: 'corporate', order: 2,
    title: 'IT · 솔루션 기업 홈페이지', desc: '사업 영역과 솔루션, 도입 흐름을 명확한 구조로 정리한 기업 홈페이지입니다.',
    pc: img('corporate-04-pc', 1600, 900), mo: img('corporate-04-mo', 900, 1599), thumb: img('corporate-04-thumb', 800, 450) },
  { id: 'corporate-05', category: 'corporate', order: 3,
    title: '화장품 제조기업 홈페이지', desc: '연구 · 기술과 생산 역량을 중심으로 신뢰를 전하는 제조기업 홈페이지입니다.',
    pc: img('corporate-05-pc', 1600, 900), mo: img('corporate-05-mo', 853, 1844), thumb: img('corporate-05-thumb', 800, 450) },
  { id: 'local-01', category: 'local', order: 1,
    title: '반려동물 매장 홈페이지', desc: '매장 공간과 서비스, 예약 안내를 함께 담은 반려동물 매장 홈페이지입니다.',
    pc: img('local-01-pc', 1536, 1024), mo: img('local-01-mo', 900, 1599), thumb: img('local-01-thumb', 800, 533) },
  { id: 'local-02', category: 'local', order: 2,
    title: '한식당 홈페이지', desc: '메뉴와 공간의 분위기를 차분하게 전하는 한식당 홈페이지입니다.',
    pc: img('local-02-pc', 1536, 1024), mo: img('local-02-mo', 900, 1599), thumb: img('local-02-thumb', 800, 533) },
  { id: 'local-04', category: 'local', order: 3,
    title: '플라워샵 홈페이지', desc: '상품과 클래스, 주문 문의가 한 흐름으로 이어지는 플라워샵 홈페이지입니다.',
    pc: img('local-04-pc', 1536, 1024), mo: img('local-04-mo', 900, 1599), thumb: img('local-04-thumb', 800, 533) },
  { id: 'local-05', category: 'local', order: 4,
    title: '카페 · 베이커리 홈페이지', desc: '매장의 분위기와 메뉴를 감각적으로 보여주는 카페 홈페이지 디자인입니다.',
    pc: img('local-05-pc', 1536, 1024), mo: img('local-05-mo', 900, 1599), thumb: img('local-05-thumb', 800, 533) },
  { id: 'education-01', category: 'education', order: 1,
    title: '미술학원 홈페이지', desc: '아이의 활동과 작품을 중심으로 학부모의 신뢰를 얻는 미술학원 홈페이지입니다.',
    pc: img('education-01-pc', 1536, 1024), mo: img('education-01-mo', 860, 1828), thumb: img('education-01-thumb', 800, 533) },
  { id: 'education-02', category: 'education', order: 2,
    title: '원데이 클래스 홈페이지', desc: '클래스 일정과 신청 흐름을 쉽게 따라갈 수 있는 요리 · 베이킹 클래스 홈페이지입니다.',
    pc: img('education-02-pc', 1536, 1024), mo: img('education-02-mo', 860, 1828), thumb: img('education-02-thumb', 800, 533) },
  { id: 'education-03', category: 'education', order: 3,
    title: '입시학원 홈페이지', desc: '교육과정과 강사진, 상담 신청까지 한 번에 안내하는 입시학원 홈페이지입니다.',
    pc: img('education-03-pc', 1536, 1024), mo: img('education-03-mo', 823, 1912), thumb: img('education-03-thumb', 800, 533) },
  { id: 'education-04', category: 'education', order: 4,
    title: '어린이 영어학원 홈페이지', desc: '밝은 색감으로 아이 눈높이를 담아낸 어린이 영어학원 홈페이지입니다.',
    pc: img('education-04-pc', 1536, 1024), mo: img('education-04-mo', 900, 1599), thumb: img('education-04-thumb', 800, 533) },
  { id: 'education-05', category: 'education', order: 5,
    title: '온라인 교육 아카데미 홈페이지', desc: '커리큘럼과 수강 후기를 정리해 수강 신청으로 이어지는 온라인 교육 홈페이지입니다.',
    pc: img('education-05-pc', 1536, 1024), mo: img('education-05-mo', 878, 1791), thumb: img('education-05-thumb', 800, 533) },
  { id: 'corporate-02', category: 'education', order: 6,
    title: '학원 홈페이지', desc: '학습 관리와 입시 정보를 체계적으로 보여주는 교육 브랜드 홈페이지입니다.',
    pc: img('corporate-02-pc', 1600, 900), mo: img('corporate-02-mo', 900, 1599), thumb: img('corporate-02-thumb', 800, 450) },
  { id: 'expert-01', category: 'expert', order: 1,
    title: '퍼스널 트레이닝 홈페이지', desc: '프로그램과 트레이너, 시설 안내를 함께 담은 퍼스널 트레이닝 홈페이지입니다.',
    pc: img('expert-01-pc', 1536, 1024), mo: img('expert-01-mo', 876, 1796), thumb: img('expert-01-thumb', 800, 533) },
  { id: 'expert-02', category: 'expert', order: 2,
    title: '강사 · 강연 홈페이지', desc: '강의 분야와 활동 이력을 정리해 섭외 문의로 이어지는 강사 홈페이지입니다.',
    pc: img('expert-02-pc', 1536, 1024), mo: img('expert-02-mo', 809, 1942), thumb: img('expert-02-thumb', 800, 533) },
  { id: 'expert-03', category: 'expert', order: 3,
    title: '심리상담센터 홈페이지', desc: '상담 분야와 진행 방식을 편안한 톤으로 안내하는 심리상담센터 홈페이지입니다.',
    pc: img('expert-03-pc', 1536, 1024), mo: img('expert-03-mo', 860, 1828), thumb: img('expert-03-thumb', 800, 533) },
  { id: 'expert-04', category: 'expert', order: 4,
    title: '브랜딩 컨설턴트 홈페이지', desc: '전문성과 프로그램을 개인 브랜드로 정리한 컨설턴트 홈페이지입니다.',
    pc: img('expert-04-pc', 1536, 1024), mo: img('expert-04-mo', 860, 1828), thumb: img('expert-04-thumb', 800, 533) },
  { id: 'expert-05', category: 'expert', order: 5,
    title: '세무회계 사무소 홈페이지', desc: '전문 분야와 상담 절차를 신뢰감 있게 안내하는 세무회계 사무소 홈페이지입니다.',
    pc: img('expert-05-pc', 1536, 1024), mo: img('expert-05-mo', 852, 1846), thumb: img('expert-05-thumb', 800, 533) },
  { id: 'beauty-01', category: 'beauty', order: 1,
    title: '메이크업 스튜디오 홈페이지', desc: '시술 사진과 예약 안내를 중심으로 구성한 메이크업 스튜디오 홈페이지입니다.',
    pc: img('beauty-01-pc', 1536, 1024), mo: img('beauty-01-mo', 900, 1350), thumb: img('beauty-01-thumb', 800, 533) },
  { id: 'beauty-02', category: 'beauty', order: 2,
    title: '네일숍 홈페이지', desc: '디자인 갤러리와 가격 안내를 경쾌한 감각으로 담은 네일숍 홈페이지입니다.',
    pc: img('beauty-02-pc', 1536, 1024), mo: img('beauty-02-mo', 854, 1842), thumb: img('beauty-02-thumb', 800, 533) },
  { id: 'beauty-03', category: 'beauty', order: 3,
    title: '피부관리샵 홈페이지', desc: '관리 프로그램과 전후 사진을 정돈해 상담 예약으로 잇는 피부관리샵 홈페이지입니다.',
    pc: img('beauty-03-pc', 1536, 1024), mo: img('beauty-03-mo', 887, 1774), thumb: img('beauty-03-thumb', 800, 533) },
  { id: 'beauty-05', category: 'beauty', order: 4,
    title: '헤어살롱 홈페이지', desc: '디자이너와 스타일 갤러리를 앞세운 프리미엄 헤어살롱 홈페이지입니다.',
    pc: img('beauty-05-pc', 1536, 1024), mo: img('beauty-05-mo', 876, 1796), thumb: img('beauty-05-thumb', 800, 533) },
  { id: 'local-03', category: 'beauty', order: 5,
    title: '헤어살롱 홈페이지', desc: '매장 분위기와 스타일을 함께 보여주는 헤어살롱 홈페이지 디자인입니다.',
    pc: img('local-03-pc', 1536, 1024), mo: img('local-03-mo', 900, 1599), thumb: img('local-03-thumb', 800, 533) },
  { id: 'medical-01', category: 'medical', order: 1,
    title: '정형외과 홈페이지', desc: '진료 분야와 치료 과정을 알기 쉽게 정리한 정형외과 홈페이지입니다.',
    pc: img('medical-01-pc', 1536, 1024), mo: img('medical-01-mo', 897, 1752), thumb: img('medical-01-thumb', 800, 533) },
  { id: 'medical-02', category: 'medical', order: 2,
    title: '한의원 홈페이지', desc: '한방 치료와 진료 안내를 차분한 톤으로 전하는 한의원 홈페이지입니다.',
    pc: img('medical-02-pc', 1536, 1024), mo: img('medical-02-mo', 848, 1855), thumb: img('medical-02-thumb', 800, 533) },
  { id: 'medical-03', category: 'medical', order: 3,
    title: '소아청소년과 홈페이지', desc: '아이와 보호자가 함께 보기 편한 밝은 톤의 소아청소년과 홈페이지입니다.',
    pc: img('medical-03-pc', 1536, 1024), mo: img('medical-03-mo', 850, 1850), thumb: img('medical-03-thumb', 800, 533) },
  { id: 'medical-04', category: 'medical', order: 4,
    title: '여성의원 홈페이지', desc: '진료 항목과 상담 예약을 부드러운 톤으로 안내하는 여성의원 홈페이지입니다.',
    pc: img('medical-04-pc', 1448, 1086), mo: img('medical-04-mo', 822, 1913), thumb: img('medical-04-thumb', 800, 600) },
  { id: 'medical-05', category: 'medical', order: 5,
    title: '치과 홈페이지', desc: '치료 사례와 진료 환경 안내로 신뢰를 전하는 치과 홈페이지입니다.',
    pc: img('medical-05-pc', 1536, 1024), mo: img('medical-05-mo', 823, 1912), thumb: img('medical-05-thumb', 800, 533) },
  { id: 'medical-06', category: 'medical', order: 6,
    title: '클리닉 홈페이지', desc: '진료과목과 의료진, 건강검진 안내를 한눈에 정리한 클리닉 홈페이지입니다.',
    pc: img('medical-06-pc', 1536, 1024), mo: img('medical-06-mo', 789, 1994), thumb: img('medical-06-thumb', 800, 533) },
  { id: 'corporate-01', category: 'medical', order: 7,
    title: '치과 홈페이지', desc: '정직한 진료와 따뜻한 인상을 함께 담은 치과 브랜드 홈페이지입니다.',
    pc: img('corporate-01-pc', 1600, 900), mo: img('corporate-01-mo', 900, 1599), thumb: img('corporate-01-thumb', 800, 450) },
  { id: 'franchise-02', category: 'franchise', order: 1,
    title: '카페 프랜차이즈 홈페이지', desc: '브랜드 소개와 창업 · 가맹 안내를 함께 담은 카페 프랜차이즈 홈페이지입니다.',
    pc: img('franchise-02-pc', 1536, 1024), mo: img('franchise-02-mo', 809, 1944), thumb: img('franchise-02-thumb', 800, 533) },
  { id: 'franchise-03', category: 'franchise', order: 2,
    title: '치킨 프랜차이즈 홈페이지', desc: '메뉴와 매장, 가맹 상담이 한 흐름으로 이어지는 치킨 프랜차이즈 홈페이지입니다.',
    pc: img('franchise-03-pc', 1536, 1024), mo: img('franchise-03-mo', 864, 1821), thumb: img('franchise-03-thumb', 800, 533) },
  { id: 'franchise-04', category: 'franchise', order: 3,
    title: '피자 프랜차이즈 홈페이지', desc: '브랜드 감각과 가맹 정보를 함께 전하는 피자 프랜차이즈 홈페이지입니다.',
    pc: img('franchise-04-pc', 1536, 1024), mo: img('franchise-04-mo', 822, 1913), thumb: img('franchise-04-thumb', 800, 533) },
  { id: 'franchise-05', category: 'franchise', order: 4,
    title: '무인 매장 프랜차이즈 홈페이지', desc: '24시간 무인 매장의 이용 방법과 창업 안내를 정리한 프랜차이즈 홈페이지입니다.',
    pc: img('franchise-05-pc', 1536, 1024), mo: img('franchise-05-mo', 858, 1834), thumb: img('franchise-05-thumb', 800, 533) },
  { id: 'shopping-01', category: 'shopping', order: 1,
    title: '리빙 · 인테리어 쇼핑몰 홈페이지', desc: '공간의 분위기를 살린 이미지 중심의 리빙 · 인테리어 쇼핑몰입니다.',
    pc: img('shopping-01-pc', 1536, 1024), mo: img('shopping-01-mo', 860, 1828), thumb: img('shopping-01-thumb', 800, 533) },
  { id: 'shopping-02', category: 'shopping', order: 2,
    title: '슈즈 쇼핑몰 홈페이지', desc: '카테고리별 상품 탐색이 편한 구조의 슈즈 쇼핑몰 홈페이지입니다.',
    pc: img('shopping-02-pc', 1536, 1024), mo: img('shopping-02-mo', 860, 1828), thumb: img('shopping-02-thumb', 800, 533) },
  { id: 'shopping-03', category: 'shopping', order: 3,
    title: '패션 쇼핑몰 홈페이지', desc: '룩북과 신상품을 앞세운 감각적인 패션 쇼핑몰 홈페이지입니다.',
    pc: img('shopping-03-pc', 1536, 1024), mo: img('shopping-03-mo', 814, 1932), thumb: img('shopping-03-thumb', 800, 533) },
  { id: 'shopping-04', category: 'shopping', order: 4,
    title: '웨딩드레스 부티크 홈페이지', desc: '컬렉션과 피팅 예약을 함께 안내하는 웨딩드레스 부티크 홈페이지입니다.',
    pc: img('shopping-04-pc', 1536, 1024), mo: img('shopping-04-mo', 826, 1904), thumb: img('shopping-04-thumb', 800, 533) },
  { id: 'shopping-05', category: 'shopping', order: 5,
    title: '한복 쇼핑몰 홈페이지', desc: '전통의 결을 살린 이미지와 상품 구성을 담은 한복 쇼핑몰 홈페이지입니다.',
    pc: img('shopping-05-pc', 1536, 1024), mo: img('shopping-05-mo', 835, 1884), thumb: img('shopping-05-thumb', 800, 533) },
  { id: 'shopping-06', category: 'shopping', order: 6,
    title: '디저트 쇼핑몰 홈페이지', desc: '선물 수요까지 고려해 구성한 디저트 쇼핑몰 홈페이지입니다.',
    pc: img('shopping-06-pc', 1536, 1024), mo: img('shopping-06-mo', 809, 1942), thumb: img('shopping-06-thumb', 800, 533) },
  { id: 'shopping-07', category: 'shopping', order: 7,
    title: '건강식품 쇼핑몰 홈페이지', desc: '제품군과 프로그램을 함께 안내하는 건강 · 다이어트 식품 쇼핑몰입니다.',
    pc: img('shopping-07-pc', 1536, 1024), mo: img('shopping-07-mo', 822, 1914), thumb: img('shopping-07-thumb', 800, 533) },
  { id: 'franchise-01', category: 'shopping', order: 8,
    title: '반려동물 용품 쇼핑몰 홈페이지', desc: '카테고리와 기획전을 갖춘 반려동물 용품 쇼핑몰 홈페이지입니다.',
    pc: img('franchise-01-pc', 1536, 1024), mo: img('franchise-01-mo', 864, 1821), thumb: img('franchise-01-thumb', 800, 533) },
  { id: 'beauty-04', category: 'shopping', order: 9,
    title: '여성 패션 쇼핑몰 홈페이지', desc: '룩북과 시즌 상품을 중심으로 구성한 여성 패션 쇼핑몰 홈페이지입니다.',
    pc: img('beauty-04-pc', 1536, 1024), mo: img('beauty-04-mo', 876, 1795), thumb: img('beauty-04-thumb', 800, 533) },
];

/** 전체 보기. 9번째 카테고리가 아니라 8개를 모두 보는 필터다. */
export const ALL_FILTER = { id: 'all', name: '전체 보기' } as const;

export const isShowroomCategory = (id: string): id is ShowroomCategoryId =>
  SHOWROOM_CATEGORIES.some((c) => c.id === id);

export const getCategory = (id: string) => SHOWROOM_CATEGORIES.find((c) => c.id === id);

export const getDesign = (id: string) => SHOWROOM_DESIGNS.find((d) => d.id === id);

/** id 가 'all' 이면 43개 전부. */
export const designsIn = (categoryId: string) =>
  categoryId === ALL_FILTER.id
    ? SHOWROOM_DESIGNS
    : SHOWROOM_DESIGNS.filter((d) => d.category === categoryId);

/** 같은 카테고리의 다른 디자인 (상세 화면 아래에 쓴다). */
export const relatedDesigns = (design: ShowroomDesign, limit = 4) =>
  SHOWROOM_DESIGNS.filter((d) => d.category === design.category && d.id !== design.id).slice(0, limit);

/* 승인된 /design/[slug] (PC06 · MO06 시안) 을 건드리지 않으려고 실제 작품
   상세는 별도 route 로 분리했다. */
export const designHref = (id: string) => `/design/portfolio/${id}`;
export const categoryHref = (id: string) => `/design/category/${id}`;

export const TOTAL_DESIGNS = SHOWROOM_DESIGNS.length;

/**
 * 예전 분류 slug → 공식 카테고리.
 *
 * 랜딩페이지 · DB수집 · 채용 · 포트폴리오처럼 "구성 · 목적 · 기능" 에 해당하는
 * 값은 공식 카테고리가 아니다. 그런 링크는 전체 보기로 보낸다 — 없애는 것이
 * 아니라, 카테고리가 아니라 태그로 다루기 때문이다.
 */
const LEGACY_TO_SHOWROOM: Record<string, ShowroomCategoryId> = {
  corporate: 'corporate',
  'corporate-brand': 'corporate',
  store: 'local',
  'local-store': 'local',
  food: 'local',
  education: 'education',
  expert: 'expert',
  professional: 'expert',
  freelancer: 'expert',
  beauty: 'beauty',
  medical: 'medical',
  franchise: 'franchise',
  commerce: 'shopping',
  shopping: 'shopping',
  shop: 'shopping',
};

/** 예전 slug 로 걸린 링크를 쇼룸 주소로 옮긴다. 맞는 카테고리가 없으면 전체. */
export const showroomHrefFor = (slug: string) =>
  categoryHref(LEGACY_TO_SHOWROOM[slug] ?? ALL_FILTER.id);
