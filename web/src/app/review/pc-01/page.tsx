import type { Metadata } from 'next';
import Pc01 from '@/components/pc01/Pc01';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_PC_01_HERO review',
  robots: { index: false, follow: false },
};

/** Review route for design sign-off. Renders exactly what `/` renders. */
export default function ReviewPc01() {
  return <Pc01 />;
}
