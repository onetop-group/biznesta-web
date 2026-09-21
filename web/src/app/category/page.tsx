import type { Metadata } from 'next';
import Screen from '@/components/site/Screen';
import Pc03 from '@/components/pc03/Pc03';
import Mo03 from '@/components/mo03/Mo03';

export const metadata: Metadata = {
  title: '홈페이지 종류',
  description: '기업·브랜드형부터 매장형, 전문가형, 랜딩페이지, 쇼핑몰까지. 업종과 목적에 맞는 홈페이지 종류를 살펴보세요.',
  alternates: { canonical: '/category' },
};

export default function Page() {
  return <Screen desktop={<Pc03 />} mobile={<Mo03 />} />;
}
