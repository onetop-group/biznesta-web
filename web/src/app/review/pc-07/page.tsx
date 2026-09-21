import type { Metadata } from 'next';
import Pc07 from '@/components/pc07/Pc07';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_PC_07_NEW_DESIGN review',
  robots: { index: false, follow: false },
};

export default function ReviewPc07() {
  return <Pc07 />;
}
