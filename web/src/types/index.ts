/* ==================================================================
   BIZNESTA — 공용 타입
   Phase 6(Supabase) 에서 DB 스키마와 대응시킬 예정입니다.
   ================================================================== */

/** 사이트 전역 설정 — Phase 8 에서 site_settings 테이블로 이관됩니다. */
export interface SiteSettings {
  /** 브랜드 표기 (고정값 — 설정 대상 아님) */
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
