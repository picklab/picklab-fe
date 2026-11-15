/** @format */

import MobileActivites from "./_components/MobileActivites";
import PcActivites from "./_components/PcActivites";
import { ACTIVITIES } from "./constants";
import type { ActivityRouteSlug } from "@/lib/activity-data";
import { ACTIVITY_LIST_REQUEST_SIZE } from "@/constants/activityList";

async function ActivitiesPage({ params }: { params: Promise<{ activities: string }> }) {
  const { activities } = await params;
  const activitySlug = activities as ActivityRouteSlug;
  const activityTitle = ACTIVITIES[activitySlug];

  return (
    <>
      <PcActivites
        activities={activityTitle}
        activitySlug={activitySlug}
        requestSize={ACTIVITY_LIST_REQUEST_SIZE}
      />
      <MobileActivites activitySlug={activitySlug} />
    </>
  );
}

export default ActivitiesPage;
