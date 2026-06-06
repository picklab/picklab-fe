'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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

export default function MobileMyReviewsPage() {
  const { data, loading, refetch } = useMyReviews();
  const [deleteTarget, setDeleteTarget] = useState<MyReviewItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const items = data?.items ?? [];

  // 케밥 메뉴 바깥 클릭 시 닫기
  useEffect(() => {
    if (openMenuId === null) return;
    const close = () => setOpenMenuId(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [openMenuId]);

  // 수정: 백엔드 activity_id 연동 전까지 임시 안내
  const handleEdit = () => {
    // TODO(edit): 백엔드가 리뷰 응답에 activity_id 추가하면 작성 폼 edit 모드로 연결(이미 useReviewWriteForm mode="edit" 준비됨)
    window.alert('수정 기능은 백엔드 활동 연동(activity_id) 후 제공됩니다.');
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
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
      ) : items.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center">
          <Typography type="Body3Medium" className="text-gray-40">
            작성한 리뷰가 없어요
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
                          handleEdit();
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
