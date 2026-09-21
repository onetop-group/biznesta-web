/**
 * BIZNESTA — 지도 · 외부 지도 링크가 쓰는 값.
 *
 * 주소는 `src/data/business.ts` 의 VISIT_ADDRESS 하나만 쓴다. 좌표는 이 파일에
 * 적지 않는다 — 임의의 좌표를 만들지 않고, 카카오 지도 SDK 가 이 주소를 찾아준
 * 결과만 쓴다.
 *
 * 지도를 실제로 그리려면 카카오 개발자 사이트에서 발급한 JavaScript 키가
 * 필요하다(도메인 등록 포함). 키가 없으면 지도를 켜지 않는다. 대신 아래
 * 카카오맵 검색 링크로 실제 위치를 열 수 있게 한다.
 */

/* 지도가 쓰는 주소는 방문 안내 표기(VISIT_ADDRESS)다 — src/data/business.ts 참고. */

/** 길찾기 링크에 붙는 도착지 이름. */
export const OFFICE_PLACE_NAME = 'BIZNESTA';

/** 카카오 지도 JavaScript 키. 없으면 지도를 그리지 않는다. */
export const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? '';

/**
 * 카카오맵 검색 링크. 실제로 열어 주소가 잡히는 것을 확인한 형식이다
 * (결과 화면에 길찾기 버튼이 함께 있다).
 */
export const kakaoSearchUrl = (query: string) =>
  `https://map.kakao.com/link/search/${encodeURIComponent(query)}`;

/** 좌표를 알아낸 경우에만 쓰는 길찾기 링크. */
export const kakaoRouteUrl = (name: string, lat: number, lng: number) =>
  `https://map.kakao.com/link/to/${encodeURIComponent(name)},${lat},${lng}`;

/**
 * 키 없이 쓰는 지도 임베드 주소.
 *
 * 카카오 지도 JavaScript 키가 등록되기 전까지 화면 안에서 실제 위치를 바로
 * 보여주기 위한 것이다. 좌표를 직접 적지 않고 확정된 주소만 넘긴다 —
 * 임의의 위치를 만들지 않기 위해서다. iframe 안에서만 동작한다.
 */
export const embedMapUrl = (query: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed&hl=ko&z=17`;
