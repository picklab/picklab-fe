'use client';

import type { ActivityCardItem } from '@/app/(home)/_components/constant';
import ReviewWriteBody from './ReviewWriteBody';

interface PcReviewWritePageProps {
  activity: ActivityCardItem;
  activityId: string;
}

export default function PcReviewWritePage({ activity, activityId }: PcReviewWritePageProps) {
  return (
    <div className="hidden min-h-screen bg-gray-0 pc:block">
      <ReviewWriteBody activity={activity} activityId={activityId} />
    </div>
  );
}
