import type { Metadata } from 'next';
import Screen from '@/components/site/Screen';
import Pc08 from '@/components/pc08/Pc08';
import Mo08 from '@/components/mo08/Mo08';

export const metadata: Metadata = {
  title: '제작 사례',
  description: '비즈네스타의 시그니처 디자인 샘플입니다. 디자인과 시스템, 운영이 어떻게 이어지는지 보여드립니다.',
  alternates: { canonical: '/portfolio' },
};

export default function Page() {
  return <Screen desktop={<Pc08 />} mobile={<Mo08 />} />;
}
