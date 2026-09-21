import type { Metadata } from 'next';
import JournalPc from '@/components/journal/JournalPc';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_PC_JOURNAL review',
  robots: { index: false, follow: false },
};

/** 검수 전용. 공개 경로(/journal)는 Visual Master 승인 뒤에 연다. */
export default function ReviewJournalPc() {
  return <main><JournalPc /></main>;
}
