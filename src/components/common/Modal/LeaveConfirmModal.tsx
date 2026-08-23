'use client';

import { useEffect, useRef } from 'react';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';

export interface LeaveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

// Figma 정합(1136:80862 이탈 확인 모달): 좌측 회색 '나가기'(실제 이탈=onConfirm),
// 우측 primary '계속 작성하기'(닫고 계속 작성=onClose). 공용 CustomModal은 취소/확인
// 구조라 버튼 라벨·좌우 동작이 반대여서 전용 마크업으로 구현.
const LeaveConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = '지금 나가시면 작성한 내용이 사라져요!',
  description = '입력하신 정보는 저장되지 않습니다.',
}: LeaveConfirmModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // ESC 키로 닫기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // 열릴 때 닫기 버튼 포커스
  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-gray-100/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-modal-title"
      aria-describedby="leave-modal-description"
      onClick={onClose}
    >
      <div
        className="relative flex w-[360px] flex-col rounded-[12px] bg-gray-0 px-8 pb-7 pt-[22px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-8 top-[22px] flex size-6 items-center justify-center text-gray-90"
        >
          <Icon icon="exit" size={12} />
        </button>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-1.5 px-2.5 text-center">
            <Typography
              tag="h1"
              type="Heading1Semibold"
              id="leave-modal-title"
              className="break-keep text-gray-90"
            >
              {title}
            </Typography>
            {description && (
              <Typography
                tag="p"
                type="Body4Regular"
                id="leave-modal-description"
                className="text-gray-50"
              >
                {description}
              </Typography>
            )}
          </div>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onConfirm}
              className="flex h-10 flex-1 items-center justify-center rounded-small bg-gray-10"
            >
              <Typography type="Headline2Medium" className="text-gray-50">
                나가기
              </Typography>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 flex-1 items-center justify-center rounded-small bg-primary-50 hover:bg-primary-60 active:bg-primary-70"
            >
              <Typography type="Headline2Medium" className="text-gray-0">
                계속 작성하기
              </Typography>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveConfirmModal;
