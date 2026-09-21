import type { Metadata } from 'next';
import Pc15 from '@/components/pc15/Pc15';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_PC_15_ABOUT review',
  robots: { index: false, follow: false },
};

export default function ReviewPc15() {
  return <Pc15 />;
}
