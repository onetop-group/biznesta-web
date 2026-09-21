import type { Metadata } from 'next';
import Screen from '@/components/site/Screen';
import Pc13 from '@/components/pc13/Pc13';
import Mo13 from '@/components/mo13/Mo13';

export const metadata: Metadata = {
  title: '제작 비용',
  description: '규모와 목적에 따라 선택할 수 있는 제작 플랜을 안내합니다. 정확한 비용은 상담 후 안내드립니다.',
  alternates: { canonical: '/price' },
};

export default function Page() {
  return <Screen desktop={<Pc13 />} mobile={<Mo13 />} />;
}
