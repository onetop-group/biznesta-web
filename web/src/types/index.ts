/* ==================================================================
   BIZNESTA — 공용 타입
   Phase 6(Supabase) 에서 DB 스키마와 1:1 로 대응시킬 예정입니다.
   지금의 Placeholder 데이터도 이 타입을 그대로 씁니다.
   ================================================================== */

/** 사이트 전역 설정 — Phase 8 에서 site_settings 테이블로 이관됩니다. */
export interface SiteSettings {
  brandName: string;
  brandNameEn: string;
  tagline: string;

  /** 아래 값은 전부 [추후 입력] 대상입니다. 빈 문자열이면 화면에 렌더되지 않습니다. */
  contact: {
    phone: string;
    email: string;
    kakao: string;
    consultHours: string;
  };
  business: {
    companyName: string;
    owner: string;
    registrationNo: string;
    address: string;
  };
  social: {
    instagram: string;
    blog: string;
    youtube: string;
  };
}

/** 내비게이션 항목 — 시안의 영문/국문 2줄 표기를 그대로 담습니다. */
export interface NavItem {
  labelEn: string;
  labelKo: string;
  href: string;
}

/** 섹션 배경 톤 — 밴드 리듬 규칙을 타입으로 강제합니다. */
export type SectionTone = 'ivory' | 'ivory-soft' | 'cream' | 'paper' | 'navy';

/* ------------------------------------------------------------------ */
/* 디자인 쇼룸                                                          */
/* ------------------------------------------------------------------ */

/** 디자인 등급 (지시서 18항). 페이지 /signature 와는 다른 개념입니다. */
export type DesignLevel = 'STANDARD' | 'CUSTOM' | 'SIGNATURE';

/**
 * 디자인의 대표 4색.
 * BN_PC_06 시안이 MAIN / POINT / SUB / TEXT 로 표기한 구조 그대로입니다.
 * Phase 6 에서 designs.palette (jsonb) 로 저장됩니다.
 */
export interface Palette {
  main: string;
  point: string;
  sub: string;
  text: string;
}

/** 홈페이지 유형 — Phase 6 에서 categories 테이블 */
export interface Category {
  id: string;
  /** 시안 BN_PC_03 의 01~15 번호 */
  no: number;
  slug: string;
  name: string;
  nameEn: string;
  /** 카드 한 줄 요약 */
  tagline: string;
  /** 카테고리 상세 페이지의 설명 */
  description: string[];
  /** 이 유형에 어울리는 핵심 특징 4개 (BN_PC_05 상단 아이콘) */
  highlights: string[];
  /** 추천 기능 체크리스트 (BN_PC_05 우측) */
  recommendedFeatures: string[];
  /** 이 유형에 속하는 업종 축 — 카테고리와 별개 (승인된 M-8) */
  industries: string[];
  palette: Palette;
  sortOrder: number;
  isVisible: boolean;
}

/** 디자인 목록용 요약 — Phase 6 에서 designs 테이블 */
export interface DesignSummary {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  categorySlug: string;
  industry: string;
  level: DesignLevel;
  shortDescription: string;
  tags: string[];
  palette: Palette;
  /** 시안 미리보기의 레이아웃 종류 — 실제 이미지 등록 전까지 사용 */
  previewLayout: PreviewLayout;
  isNew: boolean;
  isFeatured: boolean;
  /**
   * ⚠️ true 면 아직 실제 시안 이미지가 없는 자리표시자입니다.
   *    Phase 7 에서 관리자가 이미지를 등록하면 false 가 되고
   *    design_images 의 실제 이미지가 대신 렌더됩니다.
   */
  isPlaceholder: boolean;
  createdAt: string;
  sortOrder: number;
}

/** 디자인 상세 — Phase 6 에서 designs 의 나머지 컬럼 */
export interface DesignDetail extends DesignSummary {
  concept: string[];
  recommendedFor: string[];
  features: string[];
  /** 상세 페이지 하단 "페이지 미리보기" 에 쓸 화면 이름 */
  pages: string[];
}

/**
 * Placeholder 미리보기의 레이아웃 종류.
 * 실제 이미지가 없을 때 DeviceMockup 안에 그릴 추상 와이어프레임을 고릅니다.
 * 사진이나 가짜 브랜드명을 쓰지 않고 구조만 표현합니다.
 */
export type PreviewLayout = 'corporate' | 'store' | 'gallery' | 'landing' | 'commerce' | 'dashboard';

/** 디자인 갤러리 필터 (BN_PC_07 의 속성 칩) */
export interface FilterOption {
  key: string;
  label: string;
}
