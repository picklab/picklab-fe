import type { Metadata } from 'next';
import LegalDocument from '../_components/LegalDocument';
import { TERMS_OF_SERVICE } from '@/constants/legal';

export const metadata: Metadata = {
  title: '이용약관',
};

export default function TermsPage() {
  return <LegalDocument doc={TERMS_OF_SERVICE} />;
}
