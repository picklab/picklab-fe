import clsx from 'clsx';
import React, { InputHTMLAttributes } from 'react';

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: string;
  error?: boolean; // 에러 상태를 시각적으로 표시할지 여부
}

const Radio = ({ name, error = false, ...props }: RadioProps) => {
  let errorVisible = error;
  // 비활성화 상태에서는 에러 '스타일'을 적용하지 않음
  if (props.disabled) {
    errorVisible = false;
  }

  return (
    <label className="inline-flex relative items-center justify-center cursor-pointer">
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
        data-error={error}
        className={clsx(
          `peer appearance-none rounded-full size-space-16 border-[1.5px] border-interactive-secondary 
           hover:border-interactive-secondary-hover active:bg-interactive-secondary-press
           disabled:!bg-disabled disabled:!border-disabled-border disabled:!cursor-not-allowed
           checked:bg-interactive-primary checked:border-none
           checked:hover:bg-interactive-primary-hover 
           checked:active:bg-interactive-primary-press`,
          errorVisible && '!border-danger-50 !bg-white checked:!bg-interactive-destructive',
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
        className="hidden peer-checked:block size-space-8 bg-white absolute rounded-full
                   top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                   peer-disabled:cursor-not-allowed"
      />
    </label>
  );
};

export default Radio;
