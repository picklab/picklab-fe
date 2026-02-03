/** @format */

import MobileActivites from "./_components/MobileActivites";
import PcActivites from "./_components/PcActivites";
import { ACTIVITIES } from "./constants";

async function ActivitiesPage({ params }: { params: Promise<{ activities: string }> }) {
  const { activities } = await params;
  const activityTitle = ACTIVITIES[activities as keyof typeof ACTIVITIES];

  return (
    <>
      <PcActivites activities={activityTitle} />
      <MobileActivites activities={activityTitle} />
    </>
  );
}

export default ActivitiesPage;
