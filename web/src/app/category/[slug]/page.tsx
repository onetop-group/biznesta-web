import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import Screen from '@/components/site/Screen';
import Pc05 from '@/components/pc05/Pc05';
import Mo05 from '@/components/mo05/Mo05';
import { canonicalCategory, needsCategoryRedirect } from '@/data/categories';

export const metadata: Metadata = {
  title: '카테고리 디자인',
  description: '선택한 카테고리의 홈페이지 디자인 샘플.',
  /* 카테고리별 실제 콘텐츠 데이터가 아직 없다. 같은 화면이 여러 URL 로
     열리므로 색인 대상에서 빼 둔다. Design Library 단계에서 연다. */
  robots: { index: false, follow: true },
};

/**
 * 카테고리 상세.
 *
 * 예전 slug 로 들어오면 공식 slug 로 넘겨준다(data/categories.ts). 밖에 걸린
 * 링크나 북마크가 깨지지 않으면서 주소는 하나로 모인다. 카테고리별 실제
 * 콘텐츠는 아직 없으므로 어떤 slug 로 들어와도 공식 CATEGORY DETAIL 화면을
 * 열고, slug 는 상담 맥락으로 넘긴다.
 */
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (needsCategoryRedirect(slug)) permanentRedirect(`/category/${canonicalCategory(slug)}`);
  return <Screen desktop={<Pc05 slug={slug} />} mobile={<Mo05 slug={slug} />} />;
}
