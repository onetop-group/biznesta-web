import type { Metadata } from 'next';
import Pc02 from '@/components/pc02/Pc02';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_PC_02_BRAND_MESSAGE review',
  robots: { index: false, follow: false },
};

/** Review route for design sign-off. PC_01 is untouched at /review/pc-01. */
export default function ReviewPc02() {
  return <Pc02 />;
}
