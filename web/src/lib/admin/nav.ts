/**
 * ADMIN CENTER 메뉴. 순서 · 이름은 대표 확정안(STEP 1-B) 그대로다.
 *
 * state 가 화면에 배지로 나온다. 실제로 동작하는 것만 'live' 다 —
 * 준비 중인 메뉴를 동작하는 것처럼 보이게 하지 않는다.
 *   live      운영 중      실제 데이터로 동작
 *   readonly  읽기 전용    (V1 에는 없음 — 자리만)
 *   soon      준비 중      화면은 있으나 기능 없음
 *   later     연결 예정    외부 시스템 · 다음 STEP 에서 연결
 */
export type NavState = 'live' | 'readonly' | 'soon' | 'later';

export type AdminNavItem = {
  no: string;
  label: string;
  href: string;
  state: NavState;
  /** 준비 중 화면에 보여줄 한 줄 설명 */
  note: string;
};

export const NAV_STATE_LABEL: Record<NavState, string> = {
  live: '운영 중',
  readonly: '읽기 전용',
  soon: '준비 중',
  later: '연결 예정',
};

export const ADMIN_NAV: AdminNavItem[] = [
  { no: '01', label: '오늘의 운영',        href: '/admin',                state: 'live',
    note: '문의 현황과 지금 확인할 일을 보여줍니다.' },
  { no: '02', label: '문의함',             href: '/admin/inquiries',      state: 'live',
    note: '홈페이지 상담폼으로 들어온 문의를 확인하고 처리합니다.' },
  { no: '03', label: '프로젝트',           href: '/admin/projects',       state: 'soon',
    note: '문의가 계약으로 이어지면 프로젝트로 관리하는 화면입니다. 다음 단계에서 설계합니다.' },
  { no: '04', label: '디자인 · 포트폴리오', href: '/admin/designs',        state: 'later',
    note: '홈페이지의 디자인 쇼룸(43작품)을 열람하는 화면입니다. 다음 단계에서 연결됩니다.' },
  { no: '05', label: 'JOURNAL · 콘텐츠',   href: '/admin/journal',        state: 'later',
    note: '저널 글을 작성 · 발행하는 CMS 입니다. STEP 3 에서 연결됩니다.' },
  { no: '06', label: '콘텐츠 운영실',      href: '/admin/content-studio', state: 'later',
    note: '콘텐츠 자동 생성 엔진과 연결되는 검수 · 승인 화면입니다. 이후 단계에서 연결됩니다.' },
  { no: '07', label: '서비스 · 상품',      href: '/admin/services',       state: 'soon',
    note: '제작 서비스와 플랜을 관리하는 화면입니다. 가격 확정 후 준비합니다.' },
  /* 2026-09-22 대표 결정: 주문·결제는 잠정 보류. 다른 프로젝트(PURPLE SAJU)의 결제 검증이
     끝난 뒤 검증된 구조를 참고해 적용 범위를 정한다. 그때까지 DB · API · UI · PG 연동을
     설계하지 않는다. 배지와 자리는 그대로 둔다. */
  { no: '08', label: '주문 · 결제',        href: '/admin/orders',         state: 'later',
    note: '결제 시스템과 연결되는 주문 관리 화면입니다. 현재는 잠정 보류 상태이며, 별도 결제 시스템 검증이 끝난 뒤 연결 범위를 정합니다.' },
  { no: '09', label: '운영 설정',          href: '/admin/settings',       state: 'soon',
    note: '관리자 계정 · 알림 · 사업자정보를 관리하는 화면입니다. 다음 단계에서 준비합니다.' },
  { no: '10', label: '시스템 상태',        href: '/admin/system',         state: 'soon',
    note: '데이터베이스 연결과 배포 상태를 확인하는 화면입니다. 다음 단계에서 준비합니다.' },
];

export const navItemFor = (href: string) => ADMIN_NAV.find((n) => n.href === href);
