import { notFound } from 'next/navigation';
import { Placeholder } from '@/components/admin/ui';
import { navItemFor } from '@/lib/admin/nav';

/* 자리만 있는 메뉴. 내용 · 배지는 lib/admin/nav.ts 한 곳에서 관리한다. */
const item = navItemFor('/admin/settings');
export const metadata = { title: item?.label ?? '준비 중' };

export default function Page() {
  if (!item) notFound();
  return <Placeholder item={item} />;
}
