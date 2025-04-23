import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import React, { useRef, useState, useEffect } from 'react';

type Option = {
  value: string;
  label: string;
};

type OptionGroupProps = {
  options: Option[]; // 렌더링할 옵션 리스트
  onSelect: (value: string) => void; // 옵션 선택 시 호출되는 콜백
  selectedValue?: string; // 현재 선택된 값
};

export const OptionGroup = ({ options, selectedValue, onSelect }: OptionGroupProps) => {
  const [focusedIndex, setFocusedIndex] = useState(0); // 현재 키보드 포커스된 아이템의 인덱스
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]); // 각 <li>에 접근하기 위한 ref 리스트

  // 선택된 값으로 초기 포커스 인덱스를 설정
  useEffect(() => {
    const initialIndex = options.findIndex((opt) => opt.value === selectedValue);
    setFocusedIndex(initialIndex >= 0 ? initialIndex : 0);
  }, [selectedValue, options]);

  // 키보드 이벤트 핸들러 (Enter, Space, ↑, ↓)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, index: number, value: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(value);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % options.length; // 아래 방향키: 다음 인덱스로 이동
      setFocusedIndex(nextIndex);
      itemRefs.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + options.length) % options.length; // 위 방향키: 이전 인덱스로 이동
      setFocusedIndex(prevIndex);
      itemRefs.current[prevIndex]?.focus();
    }
  };

  return (
    <ul role="listbox" className="w-60 mt-1 rounded border border-gray-30 bg-gray-0 p-space-2 focus:outline-none">
      {options.map((option, index) => {
        const isSelected = option.value === selectedValue;
        const isFocused = index === focusedIndex;

        return (
          <li
            key={option.value}
            // 각 항목의 DOM 노드를 ref 배열에 저장
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            role="option"
            aria-selected={isSelected} // 접근성: 현재 항목이 선택되었는지 여부
            tabIndex={isFocused ? 0 : -1} // 포커스 이동 제어
            onClick={() => onSelect(option.value)} // 마우스로 항목 선택 시 콜백 호출
            onKeyDown={(e) => handleKeyDown(e, index, option.value)} // 키보드 이벤트 핸들링
            className={clsx(
              'cursor-pointer px-3 py-2 flex items-center transition-colors',
              'hover:bg-gray-5 hover:text-gray-60 focus:outline-none focus:bg-gray-5 focus:text-gray-60',
              isSelected && 'bg-info-10',
            )}
          >
            <Typography type="Body3Medium" className={clsx(isSelected && 'text-info-70')}>
              {option.label}
            </Typography>
          </li>
        );
      })}
    </ul>
  );
};
