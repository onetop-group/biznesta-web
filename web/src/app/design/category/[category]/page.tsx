import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PortfolioTemplate from '@/components/showroom/PortfolioTemplate';
import {
  ALL_FILTER, SHOWROOM_CATEGORIES, designsIn, getCategory, isShowroomCategory,
} from '@/data/showroom';

/**
 * 카테고리별 디자인 목록.
 *
 * `all` 은 9번째 카테고리가 아니라 8개를 모두 보는 필터다.
 * 상단 카테고리 줄과 8개 대표 카드가 모두 이 주소로 온다 — 같은 category id
 * 하나만 쓰므로 두 입구가 어긋날 수 없다.
 */
export function generateStaticParams() {
  return [{ category: ALL_FILTER.id }, ...SHOWROOM_CATEGORIES.map((c) => ({ category: c.id }))];
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> },
): Promise<Metadata> {
  const { category } = await params;
  if (category === ALL_FILTER.id) {
    return {
      title: '전체 디자인',
      description: 'BIZNESTA가 만든 홈페이지 디자인을 업종별로 모았습니다. PC와 모바일 화면을 함께 확인하실 수 있습니다.',
      alternates: { canonical: '/design/category/all' },
    };
  }
  const c = getCategory(category);
  if (!c) return { title: '디자인' };
  return {
    title: `${c.name} 홈페이지 디자인`,
    description: `${c.desc} ${c.name} 디자인 ${designsIn(c.id).length}개를 PC와 모바일 화면으로 보실 수 있습니다.`,
    alternates: { canonical: `/design/category/${c.id}` },
  };
}

export default async function Page({
  params, searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { category } = await params;
  if (category !== ALL_FILTER.id && !isShowroomCategory(category)) notFound();
  const sp = await searchParams;
  const raw = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const page = Number.parseInt(raw ?? '1', 10);
  const p = Number.isFinite(page) ? page : 1;
  /* CATEGORY PORTFOLIO MASTER — 8개 카테고리와 전체 보기가 같은 화면을 쓴다.
     카테고리별로 바뀌는 것은 데이터(이름 · 한 줄 메시지 · 작품)뿐이다. */
  return <PortfolioTemplate categoryId={category} page={p} />;
}
