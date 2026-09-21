import type { Metadata } from 'next';
import Pc05 from '@/components/pc05/Pc05';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_PC_05_CATEGORY_DETAIL review',
  robots: { index: false, follow: false },
};

export default function ReviewPc05() {
  return <Pc05 />;
}
