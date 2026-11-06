'use client';

import { PropsWithChildren, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  /** 화면별 시안 차이를 위한 클래스 덮어쓰기(딤/시트/손잡이). 미전달 시 기본 스타일 */
  classNames?: { overlay?: string; sheet?: string; handle?: string };
}

const BottomSheet = ({ isOpen, onClose, classNames, children }: PropsWithChildren<BottomSheetProps>) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (typeof window === 'undefined' || !isOpen) {
    return null;
  }

  return createPortal(
    <div className={clsx('fixed inset-0 z-50 flex items-end bg-black bg-opacity-50', classNames?.overlay)}>
      <div
        ref={sheetRef}
        className={clsx('w-full bg-white rounded-t-2xl animate-slide-up', classNames?.sheet)}
        style={{
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <div className={clsx('w-12 h-1 mx-auto bg-gray-300 rounded-full mt-2.5', classNames?.handle)} />
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default BottomSheet;


