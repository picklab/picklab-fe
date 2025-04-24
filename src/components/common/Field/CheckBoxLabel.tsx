import CheckBox, { CheckBoxProps } from '@/components/common/Field/CheckBox';
import { TagMap } from '@/components/common/Field/Label';
import { Option } from '@/components/common/Field/Label';
import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import React, { ElementType, useEffect, useRef, useState } from 'react';

type LabelTag = keyof TagMap;

export interface CheckBoxLabelProps<T extends LabelTag = 'label'> {
  tag?: T;
  className?: string;
  checkBoxProps?: CheckBoxProps; // checkbox에 내려줄 Props
  selectedValue: Option['value'];
  options: Option[];
  onClickHandler: (value: string) => void;
}

const CheckBoxLabel = <T extends LabelTag = 'label'>({
  tag = 'label' as T,
  className,
  options,
  selectedValue,
  checkBoxProps,
  onClickHandler,
  ...labelProps
}: CheckBoxLabelProps<T> & TagMap[T]) => {
  const Component = tag as ElementType;
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
      onClickHandler(value);
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
    <>
      {options.map((option, index) => {
        const isSelected = option.value === selectedValue;
        const isFocused = index === focusedIndex;
        return (
          <Component
            key={`${option.value}_${index}`}
            className={clsx(
              `check-box-label flex justify-center items-center w-[83px] h-9 px-space-12 py-space-10 gap-2 cursor-pointer rounded
          hover:bg-gray-5 hover:text-gray-60
          active:bg-info-10 active:text-info-70
          `,
              className,
              isSelected && 'bg-info-10 text-info-70',
            )}
            onClick={() => {
              onClickHandler(option.value);
            }}
            tag="li"
            // 각 항목의 DOM 노드를 ref 배열에 저장
            ref={(el: HTMLElement | null) => {
              itemRefs.current[index] = el;
            }}
            role="option"
            aria-selected={isSelected} // 접근성: 현재 항목이 선택되었는지 여부
            tabIndex={isFocused ? 0 : -1} // 포커스 이동 제어
            onKeyDown={(e: React.KeyboardEvent<HTMLLIElement>) => handleKeyDown(e, index, option.value)} // 키보드 이벤트 핸들링
            {...labelProps}
          >
            <CheckBox {...checkBoxProps} checked={isSelected} readOnly />
            <Typography type="Body3Medium">{option.label}</Typography>
          </Component>
        );
      })}
    </>
  );
};

export default CheckBoxLabel;
