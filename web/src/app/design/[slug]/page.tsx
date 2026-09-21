import type { Metadata } from 'next';
import Screen from '@/components/site/Screen';
import Pc06 from '@/components/pc06/Pc06';
import Mo06 from '@/components/mo06/Mo06';

export const metadata: Metadata = {
  title: '디자인 상세 — BIZNESTA',
  description: 'BIZNESTA 디자인 샘플 상세.',
  /* 디자인별 실제 콘텐츠 데이터가 아직 없다. 같은 화면이 여러 URL 로
     열리므로 색인 대상에서 빼 둔다. Design Library 단계에서 연다. */
  robots: { index: false, follow: true },
};

/* 디자인별 실제 콘텐츠 데이터는 아직 없다. 지금은 어떤 slug 로 들어와도 공식
   DESIGN DETAIL 화면을 열어 동선이 끊기지 않게 하고, slug 는 상담 맥락으로 넘긴다. */
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <Screen desktop={<Pc06 slug={slug} />} mobile={<Mo06 slug={slug} />} />;
}
