import type { Metadata } from 'next';
import Mo10 from '@/components/mo10/Mo10';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_MO_10_ADMIN_SYSTEM review',
  robots: { index: false, follow: false },
};

export default function ReviewMo10() {
  return <Mo10 />;
}
