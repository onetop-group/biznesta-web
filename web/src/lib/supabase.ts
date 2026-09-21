import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase 서버 클라이언트.
 *
 * 브라우저에서 직접 Supabase 를 호출하지 않는다. 문의 저장은 Server Action 이
 * 이 클라이언트로만 수행한다(검증 · 스팸 방어 · 로그를 한 곳에 모으기 위해).
 * 'server-only' 때문에 client 컴포넌트에서 실수로 import 하면 빌드가 깨진다.
 *
 * 키가 없으면 null 을 돌려준다. 그러면 Server Action 이 실패 결과를 반환하고
 * 화면에는 일반적인 오류 안내만 나온다 — 접수된 것처럼 보이지 않는다.
 */
let cached: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  /* 서버에서만 쓰므로 NEXT_PUBLIC_ 접두사가 없는 이름을 우선한다.
     (접두사가 붙은 값은 클라이언트 번들에 인라인될 수 있다) */
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  /* 익명 키만 쓴다. service role 키는 이 기능에 필요하지 않다. */
  const key = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    cached = null;
    return cached;
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'x-application-name': 'biznesta-web' } },
  });
  return cached;
}

export function supabaseConfigured() {
  return Boolean((process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)
    && (process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
}
