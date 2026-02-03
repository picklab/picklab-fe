'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import BottomSheet from '@/components/common/Modal/BottomSheet';
import Button from '@/components/common/Button/Button';

import Typography from '@/components/common/Typography';
import Icon from '@/components/common/Icon/Icon';
import FilterSection from './FilterSection';

interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilters: Record<string, string[]>;
  setSelectedFilters: Dispatch<SetStateAction<Record<string, string[]>>>;
}

const MobileFilterSheet = ({ isOpen, onClose, selectedFilters, setSelectedFilters }: MobileFilterSheetProps) => {
  const handleReset = () => {
    setSelectedFilters({});
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col h-[80vh] p-4">
        <div className="flex justify-between items-center">
          <Typography type="Body2Medium" className="text-gray-90">
            필터 전체
          </Typography>
          <button onClick={onClose}>
            <Icon icon="xMark" size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <FilterSection selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
        </div>
        <div className="flex gap-x-2 mt-4">
          <Button label="초기화" size="base" buttonStyle="outlined" className="w-full" onClick={handleReset} />
          <Button label="적용하기" size="base" buttonStyle="filled" className="w-full" onClick={onClose} />
        </div>
      </div>
    </BottomSheet>
  );
};

export default MobileFilterSheet;
