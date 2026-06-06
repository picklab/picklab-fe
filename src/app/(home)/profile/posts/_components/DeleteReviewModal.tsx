'use client';

import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';

// 리뷰 삭제 확인 모달 (PROFILE-004-001). PC/모바일 공용.
interface DeleteReviewModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  submitting?: boolean;
}

export default function DeleteReviewModal({ open, onClose, onConfirm, submitting = false }: DeleteReviewModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" role="dialog" aria-modal="true">
      <div className="relative w-[420px] max-w-[90%] rounded-2xl bg-gray-0 px-6 py-6">
        {/* 우상단 닫기 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-4 top-4 flex size-6 items-center justify-center"
        >
          <Icon icon="xMark" size={20} className="text-gray-90" />
        </button>

        <div className="flex flex-col items-center gap-2 text-center">
          <Typography tag="h2" type="Title3Bold" className="text-gray-90">
            정말 삭제하시겠어요?
          </Typography>
          <Typography tag="p" type="Body3Regular" className="text-gray-50">
            삭제한 리뷰는 다시 복구할 수 없습니다.
          </Typography>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-[48px] flex-1 rounded-small bg-primary-50 text-gray-0 hover:bg-primary-60"
          >
            <Typography type="Body2Medium">삭제 안 할래요</Typography>
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="h-[48px] flex-1 rounded-small border border-gray-30 text-gray-90 hover:bg-gray-5 disabled:opacity-50"
          >
            <Typography type="Body2Medium">네, 삭제할게요</Typography>
          </button>
        </div>
      </div>
    </div>
  );
}
