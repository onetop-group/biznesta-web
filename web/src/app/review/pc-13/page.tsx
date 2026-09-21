import type { Metadata } from 'next';
import Pc13 from '@/components/pc13/Pc13';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_PC_13_PRICE review',
  robots: { index: false, follow: false },
};

export default function ReviewPc13() {
  return <Pc13 />;
}
