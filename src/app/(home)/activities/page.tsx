'use client';
import MobileActivites from './_components/MobileActivites';
import PcActivites from './_components/PcActivites';

const ActivitiesPage = () => {
  return (
    <>
      <PcActivites />
      <MobileActivites />
    </>
  );
};

export default ActivitiesPage;
