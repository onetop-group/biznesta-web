import type { Metadata } from 'next';
import { headers } from 'next/headers';
import AdminShell from '@/components/admin/AdminShell';
import { requireAdmin } from '@/lib/admin/auth';

export const metadata: Metadata = {
  title: { default: 'BIZNESTA ADMIN', template: '%s — BIZNESTA ADMIN' },
  robots: { index: false, follow: false, nocache: true },
};

/* 관리자 화면은 항상 요청 시점에 그린다. 정적으로 굽거나 캐시하지 않는다. */
export const dynamic = 'force-dynamic';

/**
 * /admin 아래 모든 화면(로그인 제외)의 틀.
 * requireAdmin() 이 "로그인 + 관리자 명단" 을 확인하고, 아니면 로그인으로 보낸다.
 */
export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const h = await headers();
  /* 현재 경로 — 메뉴 활성 표시용. proxy 가 넣어 주는 값이 없으면 /admin 으로 본다. */
  const current = h.get('x-admin-path') ?? '/admin';
  return <AdminShell user={user} current={current}>{children}</AdminShell>;
}
