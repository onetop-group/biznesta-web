'use server';

import { headers } from 'next/headers';
import { getSupabase, supabaseConfigured } from '@/lib/supabase';
import { toInquiryRow } from '@/lib/inquiry-db';
import type { InquiryRecord } from '@/lib/inquiry';

/**
 * 상담 문의 접수.
 *
 * 브라우저 → Server Action → 검증 → Supabase insert 순서로만 저장한다.
 * 브라우저가 Supabase 를 직접 호출하지 않는다. Server Action 은 UI 를 거치지
 * 않고 POST 로도 불릴 수 있으므로, 여기서 다시 전부 검증한다.
 *
 * 사용자에게는 성공/실패만 알려준다. DB 오류 메시지는 서버 로그에만 남긴다.
 */

export type SubmitResult =
  | { ok: true }
  | { ok: false; kind: 'invalid' | 'rate' | 'unavailable' | 'error' };

/* --------------------------------------------------------------------------
   가벼운 rate limit.
   별도 Redis/Upstash 를 새로 도입하지 않고 인스턴스 메모리로만 막는다.
   서버리스에서는 인스턴스마다 따로 세므로 완벽한 제한은 아니다 — 자동 도구의
   연속 전송을 늦추는 1차 방어이고, 더 강한 제한이 필요한지는 문서에 적어 두었다.
   -------------------------------------------------------------------------- */
const WINDOW_MS = 10 * 60 * 1000;   // 10분
const MAX_PER_WINDOW = 5;           // 같은 IP 에서 10분에 5건
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {           // 메모리가 무한정 늘지 않게
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return false;
}

async function clientKey() {
  const h = await headers();
  const fwd = h.get('x-forwarded-for') ?? '';
  const ip = fwd.split(',')[0].trim() || h.get('x-real-ip') || 'unknown';
  return ip;
}

export async function submitInquiry(
  payload: Partial<InquiryRecord>,
  /** 사람에게는 보이지 않는 칸. 값이 채워져 있으면 자동 입력으로 본다. */
  honeypot: string,
): Promise<SubmitResult> {
  if (honeypot) {
    /* 봇에게는 실패를 알리지 않고 조용히 끝낸다. 저장하지 않는다. */
    console.warn('[inquiry] honeypot 걸림 — 저장하지 않음');
    return { ok: true };
  }

  if (rateLimited(await clientKey())) {
    console.warn('[inquiry] rate limit');
    return { ok: false, kind: 'rate' };
  }

  const checked = toInquiryRow(payload);
  if (!checked.ok) {
    console.warn('[inquiry] 서버 검증 실패:', checked.reason);
    return { ok: false, kind: 'invalid' };
  }

  if (!supabaseConfigured()) {
    console.error('[inquiry] Supabase 환경변수가 없어 저장하지 못했다');
    return { ok: false, kind: 'unavailable' };
  }

  const db = getSupabase();
  if (!db) return { ok: false, kind: 'unavailable' };

  const { error } = await db.from('inquiries').insert(checked.row);
  if (error) {
    /* 사용자 화면에는 이 내용을 절대 보여주지 않는다. */
    console.error('[inquiry] insert 실패:', error.code, error.message);
    return { ok: false, kind: 'error' };
  }
  return { ok: true };
}
