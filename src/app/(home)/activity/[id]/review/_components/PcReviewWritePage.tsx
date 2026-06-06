'use client';

import type { ActivityCardItem } from '@/app/(home)/_components/constant';
import ReviewWriteBody from './ReviewWriteBody';

interface PcReviewWritePageProps {
  activity: ActivityCardItem;
  activityId: string;
  participationId?: number | null;
}

export default function PcReviewWritePage({ activity, activityId, participationId }: PcReviewWritePageProps) {
  return (
    <div className="hidden min-h-screen bg-gray-0 pc:block">
      <ReviewWriteBody activity={activity} activityId={activityId} participationId={participationId} />
    </div>
  );
}
