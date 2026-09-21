/**
 * BIZNESTA — 사이트 네비게이션과 route map.
 *
 * NAVIGATION / CTA / LINK / INQUIRY FLOW — PHASE 1 에서 만들었다.
 * 여기 있는 7개 메뉴는 PC01~16 각 화면 데이터의 header.nav 와 같은 항목이며,
 * 새로 만든 메뉴가 아니다. 모바일 시안에는 메뉴 항목 목록이 없어서(햄버거
 * 버튼만 있다) 모바일 드로어도 이 목록을 그대로 쓴다.
 *
 * ROUTE MAP — 32개 공식 화면(PC/MO 각 16개)이 어떤 URL 로 열리는지.
 *   /                01 HERO              PC01 / MO01
 *   /brand           02 BRAND MESSAGE     PC02 / MO02
 *   /category        03 CATEGORY          PC03 / MO03
 *   /design          04 DESIGN SHOWROOM   PC04 / MO04
 *   /category/[slug] 05 CATEGORY DETAIL   PC05 / MO05
 *   /design/[slug]   06 DESIGN DETAIL     PC06 / MO06
 *   /design/new      07 NEW DESIGN        PC07 / MO07
 *   /portfolio       08 SIGNATURE         PC08 / MO08
 *   /content         09 CONTENT GROWTH    PC09 / MO09
 *   /admin-system    10 ADMIN SYSTEM      PC10 / MO10
 *   /solution        11 CUSTOM SOLUTION   PC11 / MO11
 *   /service         12 SERVICE SELECT    PC12 / MO12
 *   /price           13 PRICE             PC13 / MO13
 *   /process         14 PROCESS           PC14 / MO14
 *   /about           15 ABOUT             PC15 / MO15
 *   /contact         16 CONTACT           PC16 / MO16
 *   /privacy         개인정보처리방침 (본문은 아직 등록 전)
 *
 * 화면 구성은 바꾸지 않는다. 이 파일은 "어디를 누르면 어디로 가는가"만 정한다.
 */

export type NavItem = { en: string; ko: string; href: string };

export const NAV: NavItem[] = [
  { en: 'DESIGN', ko: '홈페이지 디자인', href: '/design' },
  { en: 'SERVICE', ko: '제작 서비스', href: '/service' },
  { en: 'CONTENT', ko: '콘텐츠 기획', href: '/content' },
  { en: 'ADMIN', ko: '운영 관리자 시스템', href: '/admin-system' },
  { en: 'SOLUTION', ko: '맞춤 솔루션', href: '/solution' },
  { en: 'PRICE', ko: '제작 비용', href: '/price' },
  { en: 'PORTFOLIO', ko: '제작 사례', href: '/portfolio' },
  { en: 'JOURNAL', ko: '저널', href: '/journal' },
  { en: 'ABOUT', ko: '회사소개', href: '/about' },
  { en: 'CONTACT', ko: '제작 상담', href: '/contact' },
];

/** 상담 진입 시 "어디에서 왔는지" 를 유지하기 위한 값. 아직 저장하지 않는다. */
export type ConsultationSource =
  | 'home' | 'brand' | 'category' | 'design' | 'design-detail' | 'design-new'
  | 'portfolio' | 'content' | 'admin' | 'solution' | 'service' | 'price'
  | 'process' | 'about' | 'contact' | 'journal';

export type ConsultationContext = {
  source?: ConsultationSource;
  category?: string;
  design?: string;
  service?: string;
  plan?: string;
};

/**
 * /contact 로 가는 링크를 만든다. 값이 있는 항목만 붙어서 URL 이 길어지지 않는다.
 * 예: consultHref('design-detail', { design: 'lumiere' })
 *     -> /contact?source=design-detail&design=lumiere
 */
export function consultHref(source: ConsultationSource, extra: Omit<ConsultationContext, 'source'> = {}) {
  const q = new URLSearchParams({ source });
  for (const [k, v] of Object.entries(extra)) if (v) q.set(k, v);
  return `/contact?${q.toString()}`;
}

/** 폼에 실어 둘 상담 맥락. 다음 단계에서 inquiry 저장에 그대로 쓴다. */
export function readContext(sp: Record<string, string | string[] | undefined> = {}): ConsultationContext {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;
  return {
    source: one(sp.source) as ConsultationSource | undefined,
    category: one(sp.category),
    design: one(sp.design),
    service: one(sp.service),
    plan: one(sp.plan),
  };
}

/**
 * SERVICE SELECT(12) 의 서비스 카드가 가리키는 곳.
 * 서비스별 상세 화면은 공식 시안에 없으므로, 해당 서비스를 실제로 설명하는
 * 화면이 있으면 그 화면으로, 없으면 상담 진입으로 보낸다.
 */
export const SERVICE_ROUTE: Record<string, string> = {
  website: '/design',
  'brand-design': '/design',
  sns: '/content',
  content: '/content',
  contents: '/content',
  channel: '/content',
  marketing: '/content',
  system: '/admin-system',
  management: '/admin-system',
  store: '/design',
  consulting: '/solution',
};
