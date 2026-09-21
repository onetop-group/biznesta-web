import type { Metadata } from 'next';
import Screen from '@/components/site/Screen';
import Pc15 from '@/components/pc15/Pc15';
import Mo15 from '@/components/mo15/Mo15';

export const metadata: Metadata = {
  title: '회사소개',
  description: '좋은 비즈니스는 좋은 홈페이지에서 시작됩니다. 비즈네스타가 하는 일과 지향점을 소개합니다.',
  alternates: { canonical: '/about' },
};

export default function Page() {
  return <Screen desktop={<Pc15 />} mobile={<Mo15 />} />;
}
