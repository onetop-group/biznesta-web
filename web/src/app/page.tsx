import type { Metadata } from 'next';
import Screen from '@/components/site/Screen';
import Pc01 from '@/components/pc01/Pc01';
import Mo01 from '@/components/mo01/Mo01';

export const metadata: Metadata = {
  title: 'BIZNESTA — 당신의 비즈니스가 오늘보다 내일 더 빛나도록',
  description: '비즈네스타는 디자인과 시스템, 운영까지 함께 설계하는 홈페이지 제작 브랜드입니다. 업종과 목표에 맞는 홈페이지와 온라인 운영 방식을 상담부터 함께 만듭니다.',
  alternates: { canonical: '/' },
};

export default function Page() {
  return <Screen desktop={<Pc01 />} mobile={<Mo01 />} />;
}
