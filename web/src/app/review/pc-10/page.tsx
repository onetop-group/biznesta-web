import type { Metadata } from 'next';
import Pc10 from '@/components/pc10/Pc10';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_PC_10_ADMIN_SYSTEM review',
  robots: { index: false, follow: false },
};

export default function ReviewPc10() {
  return <Pc10 />;
}
