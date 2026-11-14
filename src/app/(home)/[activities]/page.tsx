/** @format */

import MobileActivites from "./_components/MobileActivites";
import PcActivites from "./_components/PcActivites";
import { ACTIVITIES } from "./constants";
import { getAllActivities, type ActivityRouteSlug } from "@/lib/activity-data";

async function ActivitiesPage({ params }: { params: Promise<{ activities: string }> }) {
  const { activities } = await params;
  const activitySlug = activities as ActivityRouteSlug;
  const activityTitle = ACTIVITIES[activitySlug];

  return (
    <>
      <PcActivites
        activities={activityTitle}
        activitySlug={activitySlug}
        requestSize={getAllActivities().length}
      />
      <MobileActivites activitySlug={activitySlug} />
    </>
  );
}

export default ActivitiesPage;
