import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';

/**
 * 전자책 다운로드 — 서버에서만 일어나는 일.
 *
 * 흐름은 언제나 이 순서다. 순서를 바꾸면 안 된다.
 *   ① 브라우저가 우리 서버에 요청한다 (Storage 주소를 직접 조합하지 않는다)
 *   ② 서버가 구매 권한을 **DB 에게** 다시 묻는다 (biz_download_authorize)
 *   ③ 통과한 경우에만 짧은 만료의 Signed URL 을 만든다
 *   ④ 그 URL 로 보낸다. 저장하지 않는다 — 다음 요청 때 다시 만든다.
 *
 * ★ 판정은 화면도, 이 파일도 하지 않는다. DB 의 security definer 함수가 한다.
 *   여기서 하는 일은 "물어보고, 통과하면 서명한다" 뿐이다.
 *
 * ★ service_role 키가 필요한 이유
 *   비공개 버킷의 Signed URL 은 Storage API 로만 만들 수 있고, 그 API 는
 *   해당 객체를 읽을 권한이 있는 키를 요구한다. anon 키로 되게 하려면
 *   storage.objects 를 anon 에게 열어야 하는데 그러면 비공개가 아니게 된다.
 *   그래서 service_role 을 쓰되 **서버 밖으로 절대 내보내지 않는다**.
 *   'server-only' 가 맨 위에 있어 Client Component 가 import 하면 빌드가 깨진다.
 */

const SERVICE_KEY_ENV = 'SUPABASE_SERVICE_ROLE_KEY';

/**
 * 이 앱이 실제로 부르는 DB 함수 둘만 적는다.
 * 전체 스키마 타입을 생성해 두면 DB 가 바뀔 때마다 어긋나므로, 쓰는 만큼만 적는다.
 */
type AuthorizedRow = {
  order_id: string;
  product_ref: string;
  bucket: string;
  object_path: string;
  content_type: string;
};
type BookDb = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
    Functions: {
      biz_download_authorize: { Args: { p_token_hash: string }; Returns: AuthorizedRow[] };
      biz_product_file_ready: { Args: { p_product_ref: string }; Returns: boolean };
    };
  };
};

/** 기본 만료. 짧게 잡되, 느린 회선에서 내려받다 끊기지 않을 만큼은 준다. */
export const SIGNED_URL_TTL_SECONDS = 600;   // 10분

export type DownloadResult =
  | { ok: true; url: string; productRef: string; expiresIn: number }
  | { ok: false; reason: 'not_configured' | 'denied' | 'file_missing' | 'error' };

function env() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env[SERVICE_KEY_ENV];
  if (!url || !key) return null;
  return { url, key };
}

/** 값은 돌려주지 않는다. 준비됐는지만 말한다. */
export const downloadConfigured = () => env() !== null;

/**
 * service_role 클라이언트. 이 파일 안에서만 만들고 밖으로 내보내지 않는다.
 * 세션을 남기지 않는다 — 서버에서 한 번 쓰고 마는 연결이다.
 */
let cached: ReturnType<typeof createClient<BookDb>> | null | undefined;
function admin() {
  if (cached !== undefined) return cached;
  const e = env();
  cached = e
    ? createClient<BookDb>(e.url, e.key, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { 'x-application-name': 'biznesta-book-download' } },
      })
    : null;
  return cached;
}

export const hashAccessToken = (token: string) =>
  createHash('sha256').update(token, 'utf8').digest('hex');

/**
 * 접근 토큰 하나로 다운로드 URL 을 얻는다.
 * 권한이 없으면 'denied' 다 — 왜 거부됐는지는 밖으로 알려 주지 않는다
 * (없는 권한인지, 환불된 권한인지 구별해 주면 탐색의 실마리가 된다).
 */
export async function createDownloadUrl(accessToken: string): Promise<DownloadResult> {
  const db = admin();
  if (!db) return { ok: false, reason: 'not_configured' };
  if (typeof accessToken !== 'string' || !accessToken) return { ok: false, reason: 'denied' };

  /* ② DB 에게 묻는다. 네 조건을 전부 통과한 행만 돌아온다. */
  const { data, error } = await db.rpc('biz_download_authorize', {
    p_token_hash: hashAccessToken(accessToken),
  });
  if (error) {
    console.error('[book/download] 인가 조회 실패:', error.code);
    return { ok: false, reason: 'error' };
  }
  const row = Array.isArray(data) ? data[0] : null;
  if (!row) return { ok: false, reason: 'denied' };

  /* ③ 통과했을 때만 서명한다. */
  const { data: signed, error: signError } = await db.storage
    .from(String(row.bucket))
    .createSignedUrl(String(row.object_path), SIGNED_URL_TTL_SECONDS, { download: true });

  if (signError || !signed?.signedUrl) {
    /* 연결된 경로에 파일이 실제로 없는 경우가 여기다 */
    console.error('[book/download] 서명 실패:', signError?.message?.slice(0, 80) ?? 'no url');
    return { ok: false, reason: 'file_missing' };
  }

  /* ④ 돌려주고 끝. 저장하지 않는다. */
  return {
    ok: true,
    url: signed.signedUrl,
    productRef: String(row.product_ref),
    expiresIn: SIGNED_URL_TTL_SECONDS,
  };
}

/**
 * 그 상품에 파일이 연결돼 있는가. 경로는 돌려주지 않는다.
 * 결제 완료 화면이 "다운로드 버튼을 켜도 되는가" 를 물을 때 쓴다.
 */
export async function productFileReady(productRef: string): Promise<boolean> {
  const db = admin();
  if (!db) return false;
  const { data, error } = await db.rpc('biz_product_file_ready', { p_product_ref: productRef });
  if (error) return false;
  return data === true;
}
