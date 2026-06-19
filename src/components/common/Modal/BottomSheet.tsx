'use client';

import { PropsWithChildren, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const BottomSheet = ({ isOpen, onClose, children }: PropsWithChildren<BottomSheetProps>) => {
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
    <div className="fixed inset-0 z-50 flex items-end bg-black bg-opacity-50">
      <div
        ref={sheetRef}
        className="w-full bg-white rounded-t-2xl animate-slide-up"
        style={{
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <div className="w-12 h-1 mx-auto bg-gray-300 rounded-full mt-2.5" />
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default BottomSheet;


