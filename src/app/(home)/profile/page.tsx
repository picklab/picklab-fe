'use client';

import MobileProfilePage from './_components/MobileProfilePage';
import PcProfilePage from './_components/PcProfilePage';

export default function ProfilePage() {
  return (
    <>
      <PcProfilePage />
      <MobileProfilePage />
    </>
  );
}
