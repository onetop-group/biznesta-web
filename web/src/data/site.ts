import type { SiteSettings } from '@/types';

/**
 * 사이트 전역 설정 — 폴백 값.
 *
 * ⚠️ 확정되지 않은 회사 정보를 임의로 만들지 않습니다 (지시서 60·64항).
 *    시안(BN_PC_16 / BN_MO_16)에 있던 전화번호 010-1234-5678,
 *    이메일 biznesta@naver.com · biznesta@biznesta.kr, 주소는
 *    전부 AI 가 생성한 임의 값이므로 사용하지 않습니다.
 *
 * ⚠️ 빈 문자열인 항목은 화면에 아예 렌더되지 않습니다.
 *    (없는 정보를 [추후 입력] 이라고 고객에게 보여주지 않기 위해서입니다.
 *     단, 개발 중에는 styleguide 페이지에서 미입력 상태를 확인할 수 있습니다.)
 *
 * Phase 8 에서 site_settings 테이블로 옮기며, 그 뒤에는 관리자에서
 * 이 값을 수정합니다. 그때 이 파일은 DB 미연결 시의 폴백만 담당합니다.
 */
export const site: SiteSettings = {
  brandName: '비즈네스타',
  brandNameEn: 'BIZNESTA',
  tagline: 'BUSINESS TOTAL SOLUTION',

  contact: {
    phone: '', // [추후 입력]
    email: '', // [추후 입력]
    kakao: '', // [추후 입력]
    consultHours: '', // [추후 입력]
  },
  business: {
    companyName: '', // [추후 입력]
    owner: '', // [추후 입력]
    registrationNo: '', // [추후 입력]
    address: '', // [추후 입력]
  },
  social: {
    instagram: '', // [추후 입력]
    blog: '', // [추후 입력]
    youtube: '', // [추후 입력]
  },
};

/** 브랜드 메시지 — 지시서 4항의 확정 문구입니다. */
export const brandMessage = {
  main: ['당신의 비즈니스가', '오늘보다 내일 더 빛나도록.'],
  question: ['홈페이지가 필요하신가요?', '아니면 고객이 들어오는 시스템이 필요하신가요?'],
  positioning: '무엇을 만들지부터 함께 설계합니다.',
  service: '당신의 비즈니스에 필요한 홈페이지를 만듭니다.',
  promise: '세상에서 가장 효율적인 맞춤 제작 솔루션.',
  /** 관리자 시스템 핵심 철학 (지시서 추가 원칙 67) */
  adminPhilosophy: ['예쁜 홈페이지에서 끝나지 않습니다.', '운영할 수 있는 홈페이지를 만듭니다.'],
} as const;
