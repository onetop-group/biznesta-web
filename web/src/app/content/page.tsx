import type { Metadata } from 'next';
import Screen from '@/components/site/Screen';
import Pc09 from '@/components/pc09/Pc09';
import Mo09 from '@/components/mo09/Mo09';

export const metadata: Metadata = {
  title: '콘텐츠 & 성장',
  description: '홈페이지와 SNS를 연결해 꾸준히 노출되는 콘텐츠 운영을 함께 설계합니다.',
  alternates: { canonical: '/content' },
};

export default function Page() {
  return <Screen desktop={<Pc09 />} mobile={<Mo09 />} />;
}
