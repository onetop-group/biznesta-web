import type { Metadata } from 'next';
import Screen from '@/components/site/Screen';
import Pc02 from '@/components/pc02/Pc02';
import Mo02 from '@/components/mo02/Mo02';

export const metadata: Metadata = {
  title: '브랜드 이야기',
  description: '예쁜 홈페이지에서 끝나지 않습니다. 비즈네스타가 홈페이지를 바라보는 방식과 만드는 기준을 소개합니다.',
  alternates: { canonical: '/brand' },
};

export default function Page() {
  return <Screen desktop={<Pc02 />} mobile={<Mo02 />} />;
}
