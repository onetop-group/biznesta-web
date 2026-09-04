/* ==================================================================
   BIZNESTA — 사이트 URL · SEO 공용
   ------------------------------------------------------------------
   ⚠️ 도메인은 이 파일 한 곳에서만 결정됩니다 (지시서 M-5).
      canonical · sitemap · robots · OG 절대경로는 전부 여기를 씁니다.
      다른 파일에 도메인을 절대 하드코딩하지 마세요.

   확정 순서
     1) NEXT_PUBLIC_SITE_URL  — 실제 도메인이 정해지면 이 값만 채웁니다
     2) VERCEL_PROJECT_PRODUCTION_URL — Vercel Production 자동 주입
     3) VERCEL_URL            — Preview 배포마다 달라지는 주소
     4) http://localhost:3000 — 로컬 개발
   ================================================================== */

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, '');

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production.replace(/\/$/, '')}`;

  const preview = process.env.VERCEL_URL?.trim();
  if (preview) return `https://${preview.replace(/\/$/, '')}`;

  return 'http://localhost:3000';
}

export const SITE_URL = resolveSiteUrl();

/** 도메인이 확정되었는지 — 미확정이면 색인을 허용하지 않습니다. */
export const IS_DOMAIN_CONFIRMED = Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim());

/** 상대 경로를 절대 URL 로 바꿉니다. */
export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
