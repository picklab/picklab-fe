'use client';

import type { ActivityCardItem } from '@/app/(home)/_components/constant';
import type { MyReviewDetail } from '@/types/review.types';
import ReviewWriteBody from './ReviewWriteBody';
import { myReviewDetailToFormState, type ReviewFormMode } from './useReviewWriteForm';

interface PcReviewWritePageProps {
  activity: ActivityCardItem;
  activityId: string;
  participationId?: number | null;
  mode?: ReviewFormMode;
  reviewId?: string | number;
  initialReviewDetail?: MyReviewDetail | null;
}

export default function PcReviewWritePage({
  activity,
  activityId,
  participationId,
  mode,
  reviewId,
  initialReviewDetail,
}: PcReviewWritePageProps) {
  const initialState = initialReviewDetail ? myReviewDetailToFormState(initialReviewDetail) : undefined;
  return (
    <div className="hidden min-h-screen bg-gray-0 pc:block">
      <ReviewWriteBody
        activity={activity}
        activityId={activityId}
        participationId={participationId}
        mode={mode}
        reviewId={reviewId}
        initialState={initialState}
        initialFileUrl={initialReviewDetail?.url ?? undefined}
      />
    </div>
  );
}
