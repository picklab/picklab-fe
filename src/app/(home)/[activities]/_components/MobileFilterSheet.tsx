'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import clsx from 'clsx';
import BottomSheet from '@/components/common/Modal/BottomSheet';
import Button from '@/components/common/Button/Button';
import { ACTIVITY_FILTERS } from '../constants';

interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilters: Record<string, string[]>;
  setSelectedFilters: Dispatch<SetStateAction<Record<string, string[]>>>;
}

// 탭 표시 라벨(데이터 키는 ACTIVITY_FILTERS title 유지, 모집지역→지역 / 관련직무→직무)
const TAB_LABELS: Record<string, string> = {
  모집지역: '지역',
  관련직무: '직무',
};

const MobileFilterSheet = ({ isOpen, onClose, selectedFilters, setSelectedFilters }: MobileFilterSheetProps) => {
  const [currentTab, setCurrentTab] = useState(ACTIVITY_FILTERS[0].title);

  const handleReset = () => setSelectedFilters({});

  const toggleOption = (category: string, option: string) => {
    setSelectedFilters((prev) => {
      const current = prev[category] ?? [];
      const next = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      const updated = { ...prev };
      if (next.length === 0) {
        delete updated[category];
      } else {
        updated[category] = next;
      }
      return updated;
    });
  };

  // "전체"는 시안에 칩으로 노출되지 않으므로 제외
  const currentOptions = (
    ACTIVITY_FILTERS.find((filter) => filter.title === currentTab)?.options ?? []
  ).filter((option) => option !== '전체');

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex h-[460px] flex-col px-5 pb-[42px] pt-4">
        {/* 카테고리 탭 (초록 밑줄) */}
        <div className="relative flex justify-between">
          {/* 하단 베이스라인: 활성 초록(3px)과 동일한 3px 트랙 안에 회색 1.5px를 세로 중앙 배치.
              서브픽셀(bottom-0.75px)이 기기에서 반올림돼 안 먹히므로 flex items-center로 중앙정렬. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[3px] items-center">
            <div className="h-[1.5px] w-full bg-gray-30" />
          </div>
          {ACTIVITY_FILTERS.map((filter) => {
            const isActive = filter.title === currentTab;
            return (
              <button
                key={filter.title}
                type="button"
                onClick={() => setCurrentTab(filter.title)}
                className={clsx(
                  'relative z-10 pb-2.5',
                  isActive &&
                    "after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-[#00BC7D] after:content-['']",
                )}
              >
                <span className="text-[15px] font-semibold text-gray-90">
                  {TAB_LABELS[filter.title] ?? filter.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* 옵션 칩 */}
        <div className="mt-6 flex flex-1 flex-wrap content-start gap-2.5 overflow-y-auto">
          {currentOptions.map((option) => {
            const isSelected = selectedFilters[currentTab]?.includes(option) ?? false;
            return (
              <Button
                key={option}
                label={option}
                size="base"
                buttonStyle={isSelected ? 'filled' : 'outlined'}
                isFullRounded
                className={clsx(
                  'rounded-full !min-w-[72px]',
                  !isSelected &&
                    '!border-0 !bg-gray-10 hover:!bg-gray-20 [&_span]:!text-[15px] [&_span]:!font-medium [&_span]:!text-gray-50',
                )}
                onClick={() => toggleOption(currentTab, option)}
              />
            );
          })}
        </div>

        {/* 하단 버튼 (초기화 1 : 적용하기 2) */}
        <div className="mt-4 flex gap-x-[11px]">
          <button
            type="button"
            onClick={handleReset}
            className="h-[52px] flex-1 rounded-xl bg-gray-20 text-[17px] font-medium text-gray-90"
          >
            초기화
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-[52px] flex-[2] rounded-xl bg-primary-50 text-[17px] font-medium text-white"
          >
            적용하기
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};

export default MobileFilterSheet;
