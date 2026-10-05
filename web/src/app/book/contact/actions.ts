'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { toBookInquiryRow } from '@/lib/book/inquiry';

/**
 * BIZNESTA BOOK 문의 접수.
 *
 * 브라우저 → Server Action → 검증 → Supabase insert 순서로만 저장한다.
 * 브라우저가 Supabase 를 직접 부르지 않는다.
 *
 * 홈페이지 상담폼(`app/actions/inquiry.ts`)과 같은 표에 넣지만 경로가 다르다.
 * 그쪽 코드는 손대지 않았다 — 기존 기능이 이 작업의 영향을 받지 않아야 한다.
 */

/* 자동 전송을 늦추는 1차 방어. 서버리스라 인스턴스마다 따로 센다. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) { hits.set(key, recent); return true; }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return false;
}

export async function submitBookInquiry(formData: FormData) {
  const product = String(formData.get('product') ?? '').trim();
  const back = '/book/contact' + (product ? `?product=${encodeURIComponent(product)}` : '');

  /* 사람에게 보이지 않는 칸. 채워져 있으면 자동 입력으로 본다 —
     봇에게는 실패를 알리지 않고 조용히 끝낸다. */
  if (String(formData.get('website') ?? '')) redirect(`${back}${product ? '&' : '?'}sent=1`);

  const check = toBookInquiryRow(formData, '/book/contact');
  if (!check.ok) redirect(`${back}${product ? '&' : '?'}err=${check.field}`);

  const h = await headers();
  const ip = (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || h.get('x-real-ip') || 'unknown';
  if (rateLimited(ip)) redirect(`${back}${product ? '&' : '?'}err=rate`);

  const db = getSupabase();
  if (!db) {
    console.error('[book/contact] Supabase 미설정');
    redirect(`${back}${product ? '&' : '?'}err=unavailable`);
  }

  const { error } = await db.from('inquiries').insert(check.row);
  if (error) {
    /* 고객 이름·연락처는 로그에 남기지 않는다. 코드만 남긴다. */
    console.error('[book/contact] 저장 실패:', error.code);
    redirect(`${back}${product ? '&' : '?'}err=save`);
  }

  redirect(`${back}${product ? '&' : '?'}sent=1`);
}
