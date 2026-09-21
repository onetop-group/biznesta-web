/**
 * BIZNESTA — 사이트 공통 메타데이터 값.
 *
 * PRODUCTION READINESS PHASE 3 에서 만들었다. 공개 여부는 배포 환경으로만
 * 갈린다: Vercel Production 에서만 색인을 허용하고, Preview · 로컬은 계속
 * noindex 다. 사람이 실수로 여는 일이 없도록 기본값이 "공개 안 함" 이다.
 */

/** Vercel Production 배포일 때만 true. Preview / 로컬은 false. */
export const IS_PRODUCTION = process.env.VERCEL_ENV === 'production';

/**
 * 공식 도메인은 **biznesta.com** 으로 확보되어 있다(2026-09-08 확인).
 * 다만 아직 **연결 전**이다 — Vercel 도메인 연결과 `SITE_URL` 등록은
 * Production 작업이므로 사용자의 지시가 있을 때 한다. 그때까지는 값을
 * 넣지 않고 Vercel 이 주는 배포 주소를 쓴다(코드는 그대로 두어도 된다).
 */
export const SITE_URL =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');

export const SITE_NAME = 'BIZNESTA';

/** 검색 결과에 그대로 보이는 문장. 과장된 보장 표현은 쓰지 않는다. */
export const SITE_DESCRIPTION =
  '비즈네스타는 디자인과 시스템, 운영까지 함께 설계하는 홈페이지 제작 브랜드입니다. 업종과 목표에 맞는 홈페이지와 온라인 운영 방식을 상담부터 함께 만듭니다.';

/** 색인 정책. Production 이 아니면 무조건 막는다. */
export const ROBOTS = IS_PRODUCTION
  ? { index: true, follow: true }
  : { index: false, follow: false };

/** 검색에 노출할 실제 사용자 route. /review/* 와 내부 QA 경로는 넣지 않는다.
 *  /design/new 는 태그 · 필터 기능이 끝날 때까지 공개 동선에서 빼 둔다.
 *  화면은 그대로 두고 주소를 아는 사람만 볼 수 있게 한다(noindex). */
export const PUBLIC_ROUTES = [
  '/', '/about', '/design', '/category', '/service',
  '/solution', '/admin-system', '/content', '/portfolio', '/price',
  '/process', '/contact', '/privacy', '/brand', '/journal',
] as const;

/**
 * 카카오톡 상담 주소. 2026-09-10 — 사용자가 직접 만들어 전달한 실제 주소다.
 * 임의로 만들지 않았다.
 *
 * 브랜드 이름이 그대로 들어가는 오픈프로필 주소를 쓴다. 같은 방으로 이어지는
 * 방 고유 주소(open.kakao.com/o/sctf5SMi)도 함께 적어 둔다 — 오픈프로필 쪽을
 * 닫게 되면 아래 값을 그 주소로 바꾸면 된다.
 * 카카오톡 채널(pf.kakao.com/_XXXXX)이 따로 열리면 그때 다시 바꾼다.
 */
export const KAKAO_OPENCHAT_URL = 'https://open.kakao.com/me/biznesta';

/**
 * 네이버 서치어드바이저 사이트 소유 확인 값.
 * 2026-09-10 — 사용자가 네이버에서 직접 발급받아 전달한 값이다. 비밀 값이
 * 아니라 페이지 머리말에 그대로 드러나는 확인용 표식이다.
 *
 * 이 값이 하는 일은 "이 사이트가 내 것"임을 네이버에 증명하는 것뿐이다.
 * 검색 노출을 켜지는 않는다 — 노출은 ROBOTS 와, 네이버에서 따로 넣는
 * 수집 요청이 정한다.
 */
export const NAVER_SITE_VERIFICATION = '11515cd7c87e1ef40af99ce61b9bdde85c49b844';

/**
 * 구글 서치 콘솔 사이트 소유 확인 값. 네이버 값과 마찬가지로 비밀 값이 아니다.
 * 2026-09-10 — 사용자가 HTML 태그 형태로 전달한 값이다.
 *
 * 구글은 DNS(TXT 레코드) 방식에서도 같은 값을 안내한다. 만약 소유확인이
 * 통과하지 않으면 서치 콘솔의 「URL 접두어」 속성 > 「HTML 태그」 화면에서
 * 다시 받은 값으로 이 줄만 바꾸면 된다.
 */
export const GOOGLE_SITE_VERIFICATION = '2pOYQcZiR42iFTHpeM7QnRpS93g2fgLjKTCzBGQdJGE';
