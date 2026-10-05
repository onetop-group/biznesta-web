import 'server-only';

/**
 * 구매자의 접근 토큰을 담는 쿠키.
 *
 * 왜 URL 이 아니라 쿠키인가
 *   주소창에 토큰을 실으면 방문 기록, 공유된 링크, Referer 헤더를 타고 새어 나간다.
 *   httpOnly 쿠키는 브라우저가 보관하되 페이지 스크립트가 읽지 못한다.
 *
 * 왜 이 값이 곧 권한인가
 *   DB 에는 이 토큰의 sha256 만 있다(biz_entitlements.token_hash). 서버는 받은
 *   값을 해시해 대조할 뿐이고, 원문은 어디에도 저장하지 않는다.
 *
 * ★ 이 쿠키가 있다고 다운로드가 되는 것이 아니다. 매 요청마다 DB 가
 *   권한·회수·주문상태·파일연결을 다시 본다. 쿠키는 '누구인지' 를 말할 뿐이다.
 */

export const ACCESS_COOKIE = 'bn_book_access';

/** 같은 브라우저에서 다시 받아 갈 수 있는 기간. 권한 자체의 수명은 아니다. */
export const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;   // 30일

export const accessCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  /* BOOK 영역 밖으로 따라다니지 않게 한다 */
  path: '/book',
  maxAge: ACCESS_COOKIE_MAX_AGE,
};
