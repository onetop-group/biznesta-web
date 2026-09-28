import { cookies } from 'next/headers';
import { ACCESS_COOKIE } from '@/lib/book/access-cookie';
import { createDownloadUrl } from '@/lib/book/download';

/**
 * 전자책 다운로드.
 *
 *   브라우저 → 이 주소 → (서버에서 권한 재검증) → 짧은 만료의 Signed URL 로 이동
 *
 * 브라우저는 Storage 주소를 직접 조합하지 않는다. 언제나 우리 서버를 거친다.
 * 그래야 환불된 구매자가 새 URL 을 받아 가는 일이 생기지 않는다.
 *
 * ★ Signed URL 을 저장하지 않는다. 누를 때마다 새로 만든다.
 *   만료된 URL 은 다시 쓸 수 없고, 새 URL 을 받으려면 여기를 다시 지나야 한다.
 */

export const dynamic = 'force-dynamic';

function back(slug: string, reason: string) {
  const to = `/book/${encodeURIComponent(slug)}/complete?dl=${reason}`;
  return new Response(null, { status: 303, headers: { Location: to } });
}

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;

  const jar = await cookies();
  const token = jar.get(ACCESS_COOKIE)?.value ?? '';
  if (!token) return back(slug, 'no_access');

  const r = await createDownloadUrl(token);

  if (!r.ok) {
    /* 왜 거부됐는지는 화면에 자세히 알려 주지 않는다 —
       없는 권한인지 환불된 권한인지 구별해 주면 탐색의 실마리가 된다.
       다만 '파일이 아직 없다' 와 '설정 전' 은 구매자 잘못이 아니라 따로 알린다. */
    if (r.reason === 'file_missing') return back(slug, 'file_missing');
    if (r.reason === 'not_configured') return back(slug, 'not_ready');
    return back(slug, 'denied');
  }

  /* 이 권한이 정말 '이 책' 의 것인가. 다른 책 주소로 받아 가지 못하게 한다. */
  if (r.productRef !== slug) return back(slug, 'denied');

  return new Response(null, {
    status: 303,
    headers: {
      Location: r.url,
      /* 중간 어디에도 남지 않게 한다 */
      'Cache-Control': 'no-store, max-age=0',
      'Referrer-Policy': 'no-referrer',
    },
  });
}
