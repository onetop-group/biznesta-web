import 'server-only';
import { redirect } from 'next/navigation';
import { getAdminUser, type AdminUser } from './supabase';

/**
 * 화면 · Server Action 이 공통으로 쓰는 문지기.
 *
 * proxy.ts 가 "세션 없음" 을 먼저 걸러 주지만, 여기서 다시 확인한다 —
 * 세션은 있는데 관리자 명단에 없는 사용자, proxy 가 빠진 경로, 직접 호출된
 * Server Action 까지 막기 위해서다. 두 겹이 정상이다.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) redirect('/admin/login?reason=denied');
  return admin;
}

/** Server Action 용 — redirect 대신 결과를 돌려준다. */
export async function currentAdmin(): Promise<AdminUser | null> {
  return getAdminUser();
}
