import type { Metadata } from 'next';
import Pc06 from '@/components/pc06/Pc06';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_PC_06_DESIGN_DETAIL review',
  robots: { index: false, follow: false },
};

export default function ReviewPc06() {
  return <Pc06 />;
}
