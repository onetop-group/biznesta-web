import type { Metadata } from 'next';
import Screen from '@/components/site/Screen';
import Pc14 from '@/components/pc14/Pc14';
import Mo14 from '@/components/mo14/Mo14';

export const metadata: Metadata = {
  title: '제작 과정',
  description: '상담과 기획부터 디자인, 제작, 오픈, 이후 관리까지 비즈네스타의 제작 과정을 단계별로 안내합니다.',
  alternates: { canonical: '/process' },
};

export default function Page() {
  return <Screen desktop={<Pc14 />} mobile={<Mo14 />} />;
}
