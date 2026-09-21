import type { Metadata } from 'next';
import Screen from '@/components/site/Screen';
import Pc11 from '@/components/pc11/Pc11';
import Mo11 from '@/components/mo11/Mo11';

export const metadata: Metadata = {
  title: '맞춤 솔루션',
  description: '무엇을 만들지부터 함께 설계합니다. 업종과 목표, 예산에 맞춘 맞춤 제작 과정을 안내합니다.',
  alternates: { canonical: '/solution' },
};

export default function Page() {
  return <Screen desktop={<Pc11 />} mobile={<Mo11 />} />;
}
