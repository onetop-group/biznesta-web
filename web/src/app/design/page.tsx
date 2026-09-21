import type { Metadata } from 'next';
import Screen from '@/components/site/Screen';
import Pc04 from '@/components/pc04/Pc04';
import Mo04 from '@/components/mo04/Mo04';

export const metadata: Metadata = {
  title: '홈페이지 디자인',
  description: '비즈네스타의 홈페이지 디자인 샘플을 업종과 유형별로 둘러보세요. 마음에 드는 디자인은 상담에서 바로 이어집니다.',
  alternates: { canonical: '/design' },
};

export default function Page() {
  return <Screen desktop={<Pc04 />} mobile={<Mo04 />} />;
}
