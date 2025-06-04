import CheckBox from '@/components/common/CheckBox/CheckBox';
import { IconType } from '@/components/common/Icon/assets';
import Icon from '@/components/common/Icon/Icon';

import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import React, { DetailedHTMLProps, LiHTMLAttributes, useEffect, useRef, useState } from 'react';

export type OptionType = {
  value: string;
  label: string;
};

// export type TagMap = {
//   label: DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
//   div: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
//   li: DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
// };

// type LabelTag = keyof TagMap;

export interface OptionProps extends DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  selectedValue?: OptionType['value'] | OptionType['value'][];
  options: OptionType[];
  onClickHandler: (value?: string | string[]) => void;
  className?: string;
  focus?: boolean;
  icon?: IconType;
  type?: 'text' | 'checkbox' | 'iconWithText';
}

const styleClass = {
  text: '!bg-info-10 text-info-70',
  checkbox: '!bg-gray-5',
  iconWithText: '!bg-gray-5',
};

const OptionType = ({
  selectedValue,
  options,
  onClickHandler,
  className,
  icon,
  type = 'text',
  ...props
}: OptionProps) => {
  const [focusedIndex, setFocusedIndex] = useState(0); // 현재 키보드 포커스된 아이템의 인덱스
  const itemRefs = useRef<(HTMLElement | null)[]>([]); // 각 <li>에 접근하기 위한 ref 리스트

  // 선택된 값으로 초기 포커스 인덱스를 설정
  useEffect(() => {
    const initialIndex = options.findIndex((opt) => opt.value === selectedValue);
    setFocusedIndex(initialIndex >= 0 ? initialIndex : 0);
  }, [selectedValue, options]);

  // 키보드 이벤트 핸들러 (Enter, Space, ↑, ↓)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>, index: number, value: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // 체크박스일 경우에만 배열로 리턴
      handleOptionSelect(value);
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

  const handleOptionSelect = (value: string) => {
    // 체크박스일 경우에만 배열로 리턴
    if (type === 'checkbox') {
      if (Array.isArray(selectedValue)) {
        if (selectedValue.includes(value)) {
          const checkOutValue = selectedValue.filter((item) => item !== value);
          onClickHandler(checkOutValue);
        } else {
          onClickHandler([...selectedValue, value]);
        }
      }
    } else {
      onClickHandler(value);
    }
  };

  return (
    <>
      {options.map((option, index) => {
        // 배열일 경우와 아닐 경우 조건문 달라짐
        const isSelected = Array.isArray(selectedValue)
          ? selectedValue.includes(option.value)
          : option.value === selectedValue;

        const isFocused = index === focusedIndex;
        return (
          <li
            key={`${option.value}_${index}`}
            className={clsx(
              `flex items-center w-full h-10 px-space-12 py-space-10 cursor-pointer rounded
              hover:bg-gray-5 
          `,
              isSelected && styleClass[type],
              className,
            )}
            onClick={() => {
              handleOptionSelect(option.value);
            }}
            // 각 항목의 DOM 노드를 ref 배열에 저장
            ref={(el: HTMLElement | null) => {
              itemRefs.current[index] = el;
            }}
            role="option"
            aria-selected={isSelected} // 접근성: 현재 항목이 선택되었는지 여부
            tabIndex={isFocused ? 0 : -1} // 포커스 이동 제어
            onKeyDown={(e: React.KeyboardEvent<HTMLLIElement>) => handleKeyDown(e, index, option.value)} // 키보드 이벤트 핸들링
            {...props}
          >
            {type === 'text' && <Typography type="Body3Medium">{option.label}</Typography>}
            {type === 'iconWithText' && icon && (
              <div className="flex gap-0.5">
                <Icon icon={icon} size={18} />
                <Typography type="Body3Medium">{option.label}</Typography>
              </div>
            )}
            {type === 'checkbox' && (
              <div className="flex items-center gap-2">
                <CheckBox color="primary" checked={isSelected} readOnly />
                <Typography type="Body3Medium" className="h-[18px]">
                  {option.label}
                </Typography>
              </div>
            )}
          </li>
        );
      })}
    </>
  );
};

export default OptionType;
