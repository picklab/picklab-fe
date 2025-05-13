import clsx from 'clsx';
import React, { InputHTMLAttributes } from 'react';

const scaleStyle = {
  base: 'w-[52px] h-space-32 after:top-1 after:start-[4px] after:size-space-24 peer-checked:after:translate-x-[85%] ',
  sm: 'w-[39px] h-space-24 after:top-[3px] after:start-[3px] after:size-[18px] peer-checked:after:translate-x-[85%] ',
};

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  scale?: keyof typeof scaleStyle;
}

// Switch 컴포넌트는 type, className을 제외한 input 속성을 그대로 받을 수 있게 처리
const Switch = ({ scale = 'base', ...props }: SwitchProps) => {
  return (
    <label className="group inline-flex items-center ">
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
        className={clsx(
          `          
          relative rounded-full bg-gray-20  cursor-pointer
          after:content-[''] after:absolute  after:bg-white  after:rounded-full  after:transition-all
          peer // 체크 시 thumb 이동
          peer-checked:bg-info-50 
          peer-disabled:!cursor-not-allowed peer-disabled:after:!bg-gray-0 peer-disabled:!bg-gray-10 peer-disabled:!border-disabled-border
          peer-disabled:peer-checked:!bg-info-20 peer-disabled:peer-checked:after:!bg-gray-0
        `,
          scaleStyle[scale],
        )}
      />
    </label>
  );
};

export default Switch;
