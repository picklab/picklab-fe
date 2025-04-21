import React, { InputHTMLAttributes } from 'react';

// Switch 컴포넌트는 type, className을 제외한 input 속성을 그대로 받을 수 있게 처리
const Switch = ({ ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'>) => {
  return (
    <label className="group inline-flex items-center">
      <input
        // 기본 checkbox input
        type="checkbox"
        className="sr-only peer" // 시각적으로 숨김 + 상태 공유용 peer
        {...props}
        role="switch" // 접근성을 위한 ARIA 속성
        aria-checked={props.checked}
        aria-disabled={props.disabled}
      />
      <div
        // 토글 배경 및 after로 thumb 표현
        className="
          relative w-space-48 h-space-24 rounded-full bg-interactive-secondary border border-interactive-border-secondary cursor-pointer

          after:content-[''] after:absolute after:top-[1px] after:start-[1px] after:bg-white after:shadow-lg after:rounded-full after:size-space-20 after:transition-all

          peer peer-checked:after:translate-x-[120%] // 체크 시 thumb 이동
          peer-checked:bg-info-50 peer-checked:border-transparent // 체크 시 색상 변경

          group-hover:bg-interactive-secondary-hover group-active:bg-interactive-secondary-press
          group-hover:border-interactive-border-secondary-hover group-active:border-interactive-border-secondary-press

          group-hover:peer-checked:bg-info-70 group-active:peer-checked:bg-info-90 // 체크 + 인터랙션 조합

          peer-disabled:!cursor-not-allowed peer-disabled:after:!bg-disabled peer-disabled:!bg-white peer-disabled:!border-disabled-border
          peer-disabled:peer-checked:!bg-disabled peer-disabled:peer-checked:after:!bg-white
        "
      />
    </label>
  );
};

export default Switch;
