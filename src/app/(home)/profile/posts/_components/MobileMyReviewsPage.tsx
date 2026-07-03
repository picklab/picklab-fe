'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import { deleteReview, useMyReviews } from '@/hooks/useMyReviews';
import {
  REVIEW_APPROVAL_STATUS_TEXT_CLASS,
  reviewApprovalStatusLabel,
  type MyReviewItem,
} from '@/types/review.types';
import MobileProfile from '../../_components/MobileProfile';
import DeleteReviewModal from './DeleteReviewModal';

// activity_type(코드) → 한글 라벨 (PC와 동일 규칙)
const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  EXTRACURRICULAR: '대외활동',
  EDUCATION: '교육',
  COMPETITION: '공모전/해커톤',
  SEMINAR: '강연/세미나',
};

function activityTypeLabel(code: string): string {
  return ACTIVITY_TYPE_LABELS[code] ?? code;
}

// ISO datetime → "YYYY.MM.DD". 잘못된 값이면 빈 문자열.
function formatCreatedAt(value?: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

// TODO(MOCK): 작성한 리뷰가 없을 때 화면 확인용 임시 데이터(figma 1136-76050). 실 리뷰가 생기면 자동으로 대체됨.
// 음수 id = 목업 → 수정/삭제 비활성. 실데이터 연동 시 이 블록 삭제.
const MOCK_MY_REVIEWS: MyReviewItem[] = [
  {
    id: -1,
    title: 'K-Digital Training 국비지원 SW개발자 육성 프로그램 11기 후기',
    organizer: '멋쟁이사자처럼',
    organizer_type: '',
    activity_type: 'EXTRACURRICULAR',
    created_at: '2026-02-14T00:00:00',
    approval_status: 'PENDING',
  },
  {
    id: -2,
    title: '2026 대학생 마케팅 서포터즈 활동 리뷰',
    organizer: '링커리어',
    organizer_type: '',
    activity_type: 'EXTRACURRICULAR',
    created_at: '2026-01-30T00:00:00',
    approval_status: 'REJECTED',
  },
  {
    id: -3,
    title: '전국 대학생 IT 해커톤 참가 후기',
    organizer: '한국디자인혁신협회',
    organizer_type: '',
    activity_type: 'COMPETITION',
    created_at: '2026-01-10T00:00:00',
    approval_status: 'APPROVED',
  },
];

export default function MobileMyReviewsPage() {
  const router = useRouter();
  const { data, loading, refetch } = useMyReviews();
  const [deleteTarget, setDeleteTarget] = useState<MyReviewItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | string | null>(null);

  const realItems = data?.items ?? [];
  // 실 리뷰가 없으면 목업 폴백(화면 확인용). 목업은 음수 id.
  const items = !loading && realItems.length === 0 ? MOCK_MY_REVIEWS : realItems;

  // 케밥 메뉴 바깥 클릭 시 닫기
  useEffect(() => {
    if (openMenuId === null) return;
    const close = () => setOpenMenuId(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [openMenuId]);

  // 수정: 리뷰 단건 조회로 activity_id를 얻어 작성 폼 edit 모드로 이동
  const handleEdit = async (reviewId: number | string) => {
    if (typeof reviewId === 'number' && reviewId < 0) return; // 목업은 수정 불가
    if (editingId != null) return;
    setEditingId(reviewId);
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { credentials: 'include' });
      if (!res.ok) throw new Error('리뷰 정보를 불러오지 못했습니다.');
      const json = await res.json();
      const activityId = json?.data?.activity_id;
      if (!activityId) throw new Error('연결된 활동 정보를 찾을 수 없습니다.');
      router.push(`/activity/${activityId}/review?edit=${reviewId}`);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : '리뷰 수정 화면으로 이동하지 못했습니다.');
    } finally {
      // 네비게이션 후/실패 후 모두 잠금 해제(뒤로가기로 캐시된 목록 복귀 시 버튼 영구 비활성 방지)
      setEditingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.id < 0) {
      // 목업은 삭제 API 호출 없이 닫기만
      setDeleteTarget(null);
      return;
    }
    setSubmitting(true);
    try {
      await deleteReview(deleteTarget.id);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : '리뷰 삭제에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mobile:flex pc:hidden flex-col gap-8">
      <MobileProfile />

      {/* 탭 */}
      <div className="flex flex-row w-full h-[35px]">
        <Link
          href="/profile/archive"
          className="box-border w-full flex px-space-10 justify-center border-b-[1.5px] border-gray-30"
        >
          <Typography type="Headline2SemiBold">MY 활동</Typography>
        </Link>
        <Link
          href="/profile/posts"
          className="box-border w-full flex px-space-10 justify-center border-b-[3px] border-primary-50"
        >
          <Typography type="Headline2SemiBold">작성글</Typography>
        </Link>
        <Link
          href="/profile/account/info"
          className="box-border w-full flex px-space-10 justify-center border-b-[1.5px] border-gray-30"
        >
          <Typography type="Headline2SemiBold">계정</Typography>
        </Link>
      </div>

      {/* 작성글 카드 리스트 */}
      {loading ? (
        <div className="flex h-[200px] items-center justify-center">
          <Typography type="Body3Medium" className="text-gray-40">
            불러오는 중
          </Typography>
        </div>
      ) : (
        <ul className="flex flex-col">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col gap-2 border-b border-gray-10 py-4">
              {/* 1행: 승인상태 + 활동구분 칩 */}
              <div className="flex flex-row items-center gap-2">
                <Typography
                  type="Headline2SemiBold"
                  className={REVIEW_APPROVAL_STATUS_TEXT_CLASS[item.approval_status]}
                >
                  {reviewApprovalStatusLabel(item.approval_status)}
                </Typography>
                <span className="inline-flex items-center rounded bg-gray-10 px-2 py-0.5">
                  <Typography type="Caption1Medium" className="text-gray-50">
                    {activityTypeLabel(item.activity_type)}
                  </Typography>
                </span>
              </div>

              {/* 2행: 제목 */}
              <Typography type="Body1Semibold" className="text-gray-90">
                {item.title}
              </Typography>

              {/* 3행: 주체기관 */}
              <Typography type="Body3Regular" className="text-gray-70">
                {item.organizer}
              </Typography>

              {/* 4행: 작성일 / 케밥 */}
              <div className="flex flex-row items-center justify-between">
                <Typography type="Body3Regular" className="text-gray-40">
                  {formatCreatedAt(item.created_at)}
                </Typography>

                <div className="relative">
                  <button
                    type="button"
                    aria-label="더보기"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId((id) => (id === item.id ? null : item.id));
                    }}
                    className="flex size-6 items-center justify-center"
                  >
                    <Icon icon="threeDots" size={20} className="text-gray-50" />
                  </button>

                  {openMenuId === item.id && (
                    <div className="absolute right-0 top-7 z-10 flex w-[120px] flex-col rounded-lg border border-gray-20 bg-gray-0 py-1 shadow-md">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                          handleEdit(item.id);
                        }}
                        className="px-4 py-2 text-left hover:bg-gray-5"
                      >
                        <Typography type="Body3Medium" className="text-gray-90">
                          수정
                        </Typography>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                          setDeleteTarget(item);
                        }}
                        className="px-4 py-2 text-left hover:bg-gray-5"
                      >
                        <Typography type="Body3Medium" className="text-gray-90">
                          삭제
                        </Typography>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <DeleteReviewModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        submitting={submitting}
      />
    </div>
  );
}
