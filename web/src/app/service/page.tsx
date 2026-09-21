import type { Metadata } from 'next';
import Screen from '@/components/site/Screen';
import Pc12 from '@/components/pc12/Pc12';
import Mo12 from '@/components/mo12/Mo12';

export const metadata: Metadata = {
  title: '제작 서비스',
  description: '홈페이지 제작, 브랜드 디자인, 콘텐츠, 운영 시스템까지. 필요한 서비스를 골라 상담해 보세요.',
  alternates: { canonical: '/service' },
};

export default function Page() {
  return <Screen desktop={<Pc12 />} mobile={<Mo12 />} />;
}
