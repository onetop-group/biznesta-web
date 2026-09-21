import type { Metadata } from 'next';
import Pc12 from '@/components/pc12/Pc12';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_PC_12_SERVICE_SELECT review',
  robots: { index: false, follow: false },
};

export default function ReviewPc12() {
  return <Pc12 />;
}
