import type { Metadata } from 'next';
import Pc09 from '@/components/pc09/Pc09';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_PC_09_CONTENT_GROWTH review',
  robots: { index: false, follow: false },
};

export default function ReviewPc09() {
  return <Pc09 />;
}
