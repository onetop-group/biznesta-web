import type { Metadata } from 'next';
import Pc14 from '@/components/pc14/Pc14';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_PC_14_PROCESS review',
  robots: { index: false, follow: false },
};

export default function ReviewPc14() {
  return <Pc14 />;
}
