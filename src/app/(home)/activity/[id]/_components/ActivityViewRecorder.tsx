'use client';

import { useEffect } from 'react';
import { recordRecentlyViewedActivity } from '@/lib/activity-data';

interface ActivityViewRecorderProps {
  activityId: string;
}

export default function ActivityViewRecorder({ activityId }: ActivityViewRecorderProps) {
  useEffect(() => {
    if (!activityId) return;

    recordRecentlyViewedActivity(activityId);
    fetch(`/api/activities/${activityId}/view`, { method: 'POST' }).catch(() => {});
  }, [activityId]);

  return null;
}
