import type { Metadata } from 'next';
import Screen from '@/components/site/Screen';
import Pc10 from '@/components/pc10/Pc10';
import Mo10 from '@/components/mo10/Mo10';

export const metadata: Metadata = {
  title: '관리자 시스템',
  description: '문의 확인부터 콘텐츠 수정까지, 누구나 직접 관리할 수 있는 관리자 페이지를 함께 만듭니다.',
  alternates: { canonical: '/admin-system' },
};

export default function Page() {
  return <Screen desktop={<Pc10 />} mobile={<Mo10 />} />;
}
