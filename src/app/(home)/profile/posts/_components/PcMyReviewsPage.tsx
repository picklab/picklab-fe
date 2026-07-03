'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import SNB from '@/components/common/SNB/SNB';
import Typography from '@/components/common/Typography';
import { deleteReview, useMyReviews } from '@/hooks/useMyReviews';
import {
  REVIEW_APPROVAL_STATUS_TEXT_CLASS,
  reviewApprovalStatusLabel,
  type MyReviewItem,
} from '@/types/review.types';
import DeleteReviewModal from './DeleteReviewModal';

// activity_type(코드) → 한글 라벨 (활동 상세 리뷰 page.tsx의 CATEGORY_LABELS와 동일 규칙)
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

export default function PcMyReviewsPage() {
  const router = useRouter();
  const { data, loading, refetch } = useMyReviews();
  const [deleteTarget, setDeleteTarget] = useState<MyReviewItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);

  const items = data?.items ?? [];

  // 수정: 리뷰 단건 조회로 activity_id를 얻어 작성 폼 edit 모드로 이동
  const handleEdit = async (reviewId: number | string) => {
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
    <div className="hidden pc:flex gap-[62px] w-[1100px] px-5 pc:pt-10">
      <SNB Jobs={[]} />
      <section className="max-w-[758px] w-full flex flex-col gap-6">
        <Typography tag="h1" type="Title3Bold" className="text-gray-90">
          내가 작성한 리뷰
        </Typography>

        <div className="w-[750px]">
          {/* 헤더 행 */}
          <div className="grid grid-cols-[2fr_1.4fr_1fr_1fr_1fr_1.4fr] items-center border-b border-gray-20 py-3">
            <Typography type="Body3Medium" className="text-center text-gray-50">
              활동명
            </Typography>
            <Typography type="Body3Medium" className="text-center text-gray-50">
              주체기관/단체명
            </Typography>
            <Typography type="Body3Medium" className="text-center text-gray-50">
              활동구분
            </Typography>
            <Typography type="Body3Medium" className="text-center text-gray-50">
              작성일
            </Typography>
            <Typography type="Body3Medium" className="text-center text-gray-50">
              승인여부
            </Typography>
            <Typography type="Body3Medium" className="text-center text-gray-50">
              수정/삭제
            </Typography>
          </div>

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
            items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[2fr_1.4fr_1fr_1fr_1fr_1.4fr] items-center border-b border-gray-20 py-5"
              >
                {/* 활동명 */}
                <Typography type="Body3Medium" className="truncate pr-2 text-left text-gray-90">
                  {item.title}
                </Typography>

                {/* 주체기관/단체명 */}
                <Typography type="Body3Medium" className="truncate px-2 text-center text-gray-70">
                  {item.organizer}
                </Typography>

                {/* 활동구분 칩 */}
                <div className="flex justify-center">
                  <span className="inline-flex items-center rounded bg-gray-10 px-2 py-0.5">
                    <Typography type="Caption1Medium" className="text-gray-50">
                      {activityTypeLabel(item.activity_type)}
                    </Typography>
                  </span>
                </div>

                {/* 작성일 */}
                <Typography type="Body3Medium" className="text-center text-gray-70">
                  {formatCreatedAt(item.created_at)}
                </Typography>

                {/* 승인여부 */}
                <Typography
                  type={item.approval_status === 'REJECTED' ? 'Body3Semibold' : 'Body3Medium'}
                  className={clsx('text-center', REVIEW_APPROVAL_STATUS_TEXT_CLASS[item.approval_status])}
                >
                  {reviewApprovalStatusLabel(item.approval_status)}
                </Typography>

                {/* 수정/삭제 (수정은 미승인(REJECTED)일 때만 활성) */}
                <div className="flex justify-center gap-2">
                  {(() => {
                    const editable = item.approval_status === 'REJECTED';
                    return (
                      <button
                        type="button"
                        onClick={() => handleEdit(item.id)}
                        disabled={!editable || editingId === item.id}
                        className={clsx(
                          'h-[34px] rounded-full border px-4',
                          editable
                            ? 'border-gray-30 hover:bg-gray-5'
                            : 'cursor-not-allowed border-gray-20',
                        )}
                      >
                        <Typography
                          type="Body3Medium"
                          className={editable ? 'text-gray-90' : 'text-gray-30'}
                        >
                          수정
                        </Typography>
                      </button>
                    );
                  })()}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="h-[34px] rounded-full border border-gray-30 px-4 hover:bg-gray-5"
                  >
                    <Typography type="Body3Medium" className="text-gray-90">
                      삭제
                    </Typography>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <DeleteReviewModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        submitting={submitting}
      />
    </div>
  );
}
