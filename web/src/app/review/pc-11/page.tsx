import type { Metadata } from 'next';
import Pc11 from '@/components/pc11/Pc11';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_PC_11_CUSTOM_SOLUTION review',
  robots: { index: false, follow: false },
};

export default function ReviewPc11() {
  return <Pc11 />;
}
