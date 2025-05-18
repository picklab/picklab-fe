import clsx from 'clsx';
import React, { InputHTMLAttributes } from 'react';

const scaleClass = {
  base: {
    wrapper: 'size-space-24',
    input: 'size-space-20',
    dot: 'size-space-8',
  },
  sm: {
    wrapper: 'size-space-20',
    input: 'size-space-16',
    dot: 'size-space-6',
  },
};

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: string;
  scale?: keyof typeof scaleClass;
  // error?: boolean; // 에러 상태를 시각적으로 표시할지 여부
}

const Radio = ({ name, scale = 'base', ...props }: RadioProps) => {
  // let errorVisible = error;
  // 비활성화 상태에서는 에러 '스타일'을 적용하지 않음
  if (props.disabled) {
    // errorVisible = false;
  }

  return (
    <div
      className={clsx(
        'inline-flex relative items-center size-space-24 justify-center cursor-pointer',
        props.disabled && '!cursor-not-allowed',
        scaleClass[scale].wrapper,
      )}
    >
      {/* 
        숨겨진 실제 라디오 input
        - 커스텀 스타일을 위해 appearance-none 사용
        - checked, disabled 상태에 따른 스타일 처리
        - error 상태 시 빨간 테두리, 선택 시 위험 색상 배경 적용
      */}
      <input
        type="radio"
        aria-checked={props.checked}
        aria-disabled={props.disabled}
        // data-error={error}
        className={clsx(
          `peer appearance-none rounded-full  border-[1.5px] border-gray-40 bg-gray-0
           disabled:!bg-gray-5 disabled:checked:!border-solid disabled:!border-gray-30  disabled:!cursor-not-allowed
           checked:bg-info-60 checked:border-none
           `,
          scaleClass[scale].input,
          // errorVisible && '!border-danger-50 !bg-white checked:!bg-interactive-destructive',
        )}
        name={name}
        {...props}
      />

      {/* 
        선택된 경우에만 표시되는 내부 흰 점
        - peer-checked로 제어
        - 정중앙 정렬
        - 비활성화 시 커서 표시 제거
      */}
      <div
        className={clsx(
          `hidden peer-checked:blockbg-white absolute rounded-full 
          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          peer-disabled:cursor-not-allowed peer-disabled:bg-gray-30`,
          scaleClass[scale].dot,
        )}
      />
    </div>
  );
};

export default Radio;
