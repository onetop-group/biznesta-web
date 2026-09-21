import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * ADMIN 전용 Supabase 클라이언트 — 로그인한 관리자의 세션(쿠키)으로 동작한다.
 *
 * 공개 상담폼이 쓰는 lib/supabase.ts 와 일부러 분리했다.
 *   · 공개 쪽: 세션 없음. anon 으로 INSERT 만. (그대로 둔다)
 *   · 관리자 쪽: 쿠키에 든 Supabase Auth 세션으로 요청한다. DB 가 그 사용자를
 *     authenticated 로 보고, RLS 정책(is_admin) 이 읽기 · 쓰기를 허용한다.
 *
 * 키는 공개 쪽과 같은 anon key 하나뿐이다. service_role 은 쓰지 않는다.
 * 브라우저에는 어떤 키도 내려가지 않는다 — 로그인 · 로그아웃 · 조회 · 수정이
 * 전부 서버(Server Action · Server Component · proxy)에서만 일어난다.
 */
function env() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export function adminSupabaseConfigured() {
  return env() !== null;
}

/**
 * Server Component · Server Action 에서 쓴다.
 * Server Component 안에서는 쿠키를 쓸 수 없으므로 setAll 이 조용히 실패해도
 * 된다 — 세션 갱신은 proxy.ts 가 맡는다.
 */
export async function getAdminSupabase() {
  const e = env();
  if (!e) return null;
  const store = await cookies();
  return createServerClient(e.url, e.key, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(list) {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          /* Server Component 렌더 중에는 쿠키를 못 쓴다. proxy 가 갱신한다. */
        }
      },
    },
    global: { headers: { 'x-application-name': 'biznesta-admin' } },
  });
}

export type AdminUser = { id: string; email: string; role: 'ADMIN' };

/**
 * "로그인했고 + 관리자 명단에 있는가" 를 한 번에 확인한다.
 * 로그인만 된 사용자(명단에 없음)는 관리자가 아니다 → null.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const db = await getAdminSupabase();
  if (!db) return null;
  const { data: { user } } = await db.auth.getUser();
  if (!user) return null;
  const { data: row } = await db
    .from('admin_users')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();
  if (!row) return null;
  return { id: user.id, email: user.email ?? '', role: 'ADMIN' };
}
