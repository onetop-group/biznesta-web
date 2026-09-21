import type { Metadata } from 'next';
import Screen from '@/components/site/Screen';
import Pc07 from '@/components/pc07/Pc07';
import Mo07 from '@/components/mo07/Mo07';

/* 태그 · 필터 기능이 끝날 때까지 공개 동선에서 숨긴다.
   화면과 내용은 그대로 두고, 링크와 sitemap 에서만 빼고 색인을 막는다.
   주소를 직접 아는 경우에는 그대로 볼 수 있다(잠금 · 인증 아님). */
export const metadata: Metadata = {
  title: '새로운 디자인',
  description: '새로 추가된 비즈네스타 디자인 샘플입니다. 최근 작업한 스타일과 구성을 확인해 보세요.',
  alternates: { canonical: '/design/new' },
  robots: { index: false, follow: false, nocache: true,
    googleBot: { index: false, follow: false } },
};

export default function Page() {
  return <Screen desktop={<Pc07 />} mobile={<Mo07 />} />;
}
