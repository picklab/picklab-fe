'use client';

import type { ActivityCardItem } from '@/app/(home)/_components/constant';
import ReviewWriteBody from './ReviewWriteBody';

interface MobileReviewWritePageProps {
  activity: ActivityCardItem;
  activityId: string;
}

export default function MobileReviewWritePage({ activity, activityId }: MobileReviewWritePageProps) {
  return (
    <div className="min-h-screen bg-gray-0 pc:hidden">
      <ReviewWriteBody activity={activity} activityId={activityId} />
    </div>
  );
}
