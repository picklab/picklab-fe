'use client';

import type { ActivityCardItem } from '@/app/(home)/_components/constant';
import type { MyReviewDetail } from '@/types/review.types';
import ReviewWriteBody from './ReviewWriteBody';
import { myReviewDetailToFormState, type ReviewFormMode } from './useReviewWriteForm';

interface MobileReviewWritePageProps {
  activity: ActivityCardItem;
  activityId: string;
  participationId?: number | null;
  mode?: ReviewFormMode;
  reviewId?: string | number;
  initialReviewDetail?: MyReviewDetail | null;
}

export default function MobileReviewWritePage({
  activity,
  activityId,
  participationId,
  mode,
  reviewId,
  initialReviewDetail,
}: MobileReviewWritePageProps) {
  const initialState = initialReviewDetail ? myReviewDetailToFormState(initialReviewDetail) : undefined;
  return (
    <div className="min-h-screen bg-gray-0 pc:hidden">
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
