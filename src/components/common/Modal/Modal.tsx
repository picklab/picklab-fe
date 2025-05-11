// components/Modal.tsx
'use client';

import Button from '@/components/common/Button/Button';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onSuccess: () => void;
}

const Modal = ({ isOpen, onClose, onSuccess, title, description }: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // ESC 키로 닫기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // 포커스 트랩
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const onSuccessHandler = () => {
    onSuccess();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-gray-100/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        ref={dialogRef}
        className="flex flex-col w-[360px] bg-gray-0 rounded-2xl px-space-32 pt-[22px] pb-[28px] gap-space-12 "
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex justify-end">
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="닫기"
            className="flex justify-center items-center size-6"
          >
            <Icon icon="exit" size={12} className="text-gray-90" />
          </button>
        </div>

        <div className="flex flex-col gap-space-32">
          {/* Body */}
          <div className="flex flex-col items-center justify-center gap-2">
            <Typography tag="h1" type="Heading1Semibold" id="modal-title" className="text-gray-90">
              {title}
            </Typography>
            <Typography tag="p" type="Body4Regular" id="modal-description" className="text-gray-50">
              {description}
            </Typography>
          </div>

          {/* Footer */}
          <div className="mt-6 flex gap-2">
            <Button className="w-full" buttonStyle="filled" size="base" label="취소" onClick={onClose} />

            <Button className="w-full" buttonStyle="outlined" size="base" label="확인" onClick={onSuccessHandler} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Modal;
