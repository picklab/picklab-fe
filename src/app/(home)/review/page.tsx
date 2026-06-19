import PcReviewWritePage from '../activity/[id]/review/_components/PcReviewWritePage';
import MobileReviewWritePage from '../activity/[id]/review/_components/MobileReviewWritePage';
import type { ActivityCardItem } from '@/app/(home)/_components/constant';

// 활동 미선택 상태로 진입하는 리뷰쓰기 페이지 (GNB 연필 → 리뷰쓰기, figma 2577-38195).
// 페이지 내 "활동 선택하기"로 활동을 고른 뒤 작성. (활동 상세에서 들어오는 경로는 /activity/[id]/review)
const EMPTY_ACTIVITY: ActivityCardItem = {
  detailLink: '',
  activityType: '대외활동',
  source: '',
  title: '',
  organizer: '',
  companyType: '',
  target: '',
  registrationPeriod: '',
  activityPeriod: '',
  recruitment: '',
  region: '',
  homepage: '',
  contestField: '',
  activityField: '',
  costPrize: '',
  thumbnailImage: '',
  detailImage: '',
};

export default function ReviewWriteEntryPage() {
  return (
    <>
      <PcReviewWritePage activity={EMPTY_ACTIVITY} activityId="" />
      <MobileReviewWritePage activity={EMPTY_ACTIVITY} activityId="" />
    </>
  );
}
