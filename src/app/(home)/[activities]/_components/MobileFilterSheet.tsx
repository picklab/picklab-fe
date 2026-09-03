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
        {/* 탭: 주최기관/참여대상/활동분야 flex-1(균등) + 지역/직무 w-56 고정. 밑줄은 탭 폭 전체 */}
        <div className="flex">
          {ACTIVITY_FILTERS.map((filter) => {
            const isActive = filter.title === currentTab;
            const isShort =
              filter.title === '모집지역' || filter.title === '관련직무';
            return (
              <button
                key={filter.title}
                type="button"
                onClick={() => setCurrentTab(filter.title)}
                className={clsx(
                  'flex flex-col gap-2',
                  isShort ? 'w-[56px] shrink-0' : 'flex-1 min-w-0',
                )}
              >
                <span className="text-center text-[15px] font-semibold text-gray-90">
                  {TAB_LABELS[filter.title] ?? filter.title}
                </span>
                {/* 3px 트랙 안 세로 중앙: 활성 3px(초록) / 비활성 1.5px(회색) */}
                <div className="flex h-[3px] w-full items-center">
                  <div
                    className={clsx(
                      'w-full',
                      isActive
                        ? 'h-[3px] rounded-full bg-primary-50'
                        : 'h-[1.5px] bg-gray-30',
                    )}
                  />
                </div>
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
