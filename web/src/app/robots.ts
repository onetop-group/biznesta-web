import type { MetadataRoute } from 'next';
import { IS_PRODUCTION, SITE_URL } from '@/lib/site';

/**
 * Production 에서만 크롤링을 허용한다. Preview · 로컬은 전면 차단이며,
 * 이 기본값은 사람이 값을 바꾸지 않는 한 절대 열리지 않는다.
 *
 * Production 이라도 `/review/*` (Visual Master 검수용) 는 막는다.
 */
export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/review', '/review/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
