import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DesignDetail from '@/components/showroom/DesignDetail';
import { SHOWROOM_DESIGNS, getCategory, getDesign } from '@/data/showroom';

/**
 * 실제 디자인 작품 상세.
 *
 * 승인된 `/design/[slug]` (PC06 / MO06 DESIGN DETAIL 시안) 은 그대로 두고,
 * 실제 43개 작품은 이 route 로 분리했다. 기존 화면을 덮어쓰지 않기 위해서다.
 */
export function generateStaticParams() {
  return SHOWROOM_DESIGNS.map((d) => ({ id: d.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await params;
  const design = getDesign(id);
  if (!design) return { title: '디자인 상세 — BIZNESTA' };
  const category = getCategory(design.category);
  return {
    title: `${design.title} — BIZNESTA`,
    description: `${category?.name} 홈페이지 디자인 ${String(design.order).padStart(2, '0')}. PC와 모바일 화면을 함께 보실 수 있습니다.`,
    alternates: { canonical: `/design/portfolio/${design.id}` },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const design = getDesign(id);
  if (!design) notFound();
  return <DesignDetail design={design} />;
}
