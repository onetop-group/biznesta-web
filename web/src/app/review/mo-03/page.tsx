import type { Metadata } from 'next';
import Mo03 from '@/components/mo03/Mo03';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_MO_03_CATEGORY review',
  robots: { index: false, follow: false },
};

export default function ReviewMo03() {
  return <Mo03 />;
}
