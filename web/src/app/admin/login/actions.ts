'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAdminSupabase, adminSupabaseConfigured } from '@/lib/admin/supabase';

/**
 * 관리자 로그인 · 로그아웃. 전부 서버에서만 일어난다.
 *
 * 로그인 실패 이유(계정 없음 / 비밀번호 틀림 / 명단에 없음)는 화면에서
 * 구분하지 않는다 — 같은 문구로 답해 계정 존재 여부를 알려주지 않는다.
 * 로그에도 이메일을 남기지 않는다.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 10;
const hits = new Map<string, number[]>();

async function tooManyAttempts() {
  const h = await headers();
  const ip = (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || h.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) { hits.set(ip, recent); return true; }
  recent.push(now); hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return false;
}

/** 로그인 뒤 돌아갈 곳 — /admin 아래 경로만 허용한다 (외부 주소로 튕기지 않게). */
function safeNext(v: FormDataEntryValue | null) {
  const s = typeof v === 'string' ? v : '';
  return s.startsWith('/admin') && !s.startsWith('//') ? s : '/admin';
}

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().slice(0, 200);
  const password = String(formData.get('password') ?? '').slice(0, 200);
  const next = safeNext(formData.get('next'));

  if (!email || !password) redirect('/admin/login?error=empty');
  if (await tooManyAttempts()) redirect('/admin/login?error=rate');
  if (!adminSupabaseConfigured()) redirect('/admin/login?error=unavailable');

  const db = await getAdminSupabase();
  if (!db) redirect('/admin/login?error=unavailable');

  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    console.warn('[admin/login] 실패:', error?.status ?? 'no-user');
    redirect('/admin/login?error=invalid');
  }

  /* 로그인은 됐지만 관리자 명단에 없으면 세션을 바로 지운다. */
  const { data: row } = await db.from('admin_users').select('role').eq('user_id', data.user.id).maybeSingle();
  if (!row) {
    await db.auth.signOut();
    console.warn('[admin/login] 명단에 없는 사용자 — 세션 종료');
    redirect('/admin/login?error=invalid');
  }

  redirect(next);
}

export async function signOut() {
  const db = await getAdminSupabase();
  if (db) await db.auth.signOut();
  redirect('/admin/login?signedout=1');
}
