'use client';

import type { ActivityCardItem } from '@/app/(home)/_components/constant';
import ReviewWriteBody from './ReviewWriteBody';

interface MobileReviewWritePageProps {
  activity: ActivityCardItem;
  activityId: string;
  participationId?: number | null;
}

export default function MobileReviewWritePage({ activity, activityId, participationId }: MobileReviewWritePageProps) {
  return (
    <div className="min-h-screen bg-gray-0 pc:hidden">
      <ReviewWriteBody activity={activity} activityId={activityId} participationId={participationId} />
    </div>
  );
}
