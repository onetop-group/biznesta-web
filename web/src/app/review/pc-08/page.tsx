import type { Metadata } from 'next';
import Pc08 from '@/components/pc08/Pc08';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_PC_08_SIGNATURE review',
  robots: { index: false, follow: false },
};

export default function ReviewPc08() {
  return <Pc08 />;
}
