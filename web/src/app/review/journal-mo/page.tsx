import type { Metadata } from 'next';
import JournalMo from '@/components/journal/JournalMo';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_MO_JOURNAL review',
  robots: { index: false, follow: false },
};

/** 검수 전용. 다른 모바일 화면과 같이 스테이지가 스스로 폭에 맞춘다. */
export default function ReviewJournalMo() {
  return <main><JournalMo /></main>;
}
