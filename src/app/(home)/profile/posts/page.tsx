import PcMyReviewsPage from './_components/PcMyReviewsPage';
import MobileMyReviewsPage from './_components/MobileMyReviewsPage';

// 내가 작성한 리뷰(작성글) 진입점 — PC/모바일 분기 렌더 (PROFILE-004-001)
export default function MyReviewsPage() {
  return (
    <>
      <PcMyReviewsPage />
      <MobileMyReviewsPage />
    </>
  );
}
