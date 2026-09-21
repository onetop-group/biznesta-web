import type { Metadata } from 'next';
import Pc04 from '@/components/pc04/Pc04';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_PC_04_DESIGN_SHOWROOM review',
  robots: { index: false, follow: false },
};

export default function ReviewPc04() {
  return <Pc04 />;
}
