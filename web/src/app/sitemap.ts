import type { MetadataRoute } from 'next';
import { PUBLIC_ROUTES, SITE_URL } from '@/lib/site';

/**
 * 실제로 존재하는 공개 route 만 넣는다.
 *
 * - `/review/*` (Visual Master 검수용 내부 경로) 는 넣지 않는다.
 * - `/category/[slug]` · `/design/[slug]` 는 카테고리·디자인별 실제 콘텐츠
 *   데이터가 아직 없다. 가짜 slug 를 만들지 않으므로 지금은 넣지 않고,
 *   Design Library 단계에서 실제 목록으로 채운다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const priority: Record<string, number> = {
    '/': 1, '/contact': 0.9, '/design': 0.8, '/price': 0.8,
    '/service': 0.7, '/solution': 0.7, '/portfolio': 0.7,
    '/privacy': 0.2, '/brand': 0.3,
  };
  return PUBLIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: priority[path] ?? 0.6,
  }));
}
