import type { Metadata } from 'next';
import Pc16 from '@/components/pc16/Pc16';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_PC_16_CONTACT review',
  robots: { index: false, follow: false },
};

export default function ReviewPc16() {
  return <Pc16 />;
}
