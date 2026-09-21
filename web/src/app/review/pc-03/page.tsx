import type { Metadata } from 'next';
import Pc03 from '@/components/pc03/Pc03';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_PC_03_CATEGORY review',
  robots: { index: false, follow: false },
};

/** Review route for design sign-off. PC_01 and PC_02 are untouched. */
export default function ReviewPc03() {
  return <Pc03 />;
}
