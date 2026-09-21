import type { Metadata } from 'next';
import Screen from '@/components/site/Screen';
import JournalPc from '@/components/journal/JournalPc';
import JournalMo from '@/components/journal/JournalMo';

export const metadata: Metadata = {
  title: 'BIZNESTA JOURNAL',
  description: '비즈네스타의 소식과 인사이트, 새 디자인과 공지를 한곳에서 봅니다.',
  alternates: { canonical: '/journal' },
};

/**
 * JOURNAL 공식 Visual Master(2026-09-08 FINAL LOCK)를 그대로 연다.
 * 화면 구성 · 타이포 · 사진은 건드리지 않고 route 만 이었다.
 */
export default function Page() {
  return <Screen desktop={<JournalPc />} mobile={<JournalMo />} />;
}
