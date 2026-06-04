import type { Metadata } from 'next';
import LegalDocument from '../_components/LegalDocument';
import { PRIVACY_POLICY } from '@/constants/legal';

export const metadata: Metadata = {
  title: '개인정보 처리 방침',
};

export default function PrivacyPage() {
  return <LegalDocument doc={PRIVACY_POLICY} />;
}
