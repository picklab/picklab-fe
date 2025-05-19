'use client';

import { IconType } from '@/components/common/Icon/assets';
import Icon from '@/components/common/Icon/Icon';
import clsx from 'clsx';
import React, { InputHTMLAttributes } from 'react';

const scaleStyleClass = {
  base: 'h-space-48 px-[18px] py-[13px]',
  sm: 'h-space-34 px-[18px] py-[7px]',
};
export interface TextBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  rounded?: boolean;
  className?: string;
  scale?: keyof typeof scaleStyleClass;
  icon?: IconType;
}

const TextBox = ({ error = false, rounded = false, scale = 'base', icon, className, ...props }: TextBoxProps) => {
  // error style 제거
  if (props.disabled) {
    error = false;
  }
  return (
    <div className="relative w-fit">
      <input
        type="text"
        className={clsx(
          `box-border w-60  rounded-md border text-gray-90
          border-interactive-secondary  
          hover:border-gray-40 hover:placeholder:text-gray-50
          active:border-gray-50 
          disabled:bg-gray-5 disabled:border-gray-30 disabled:placeholder:text-gray-40 disabled:cursor-not-allowed
          focus:outline-none
          text-[15px]`,
          error && '!border-danger-50 placeholder:!text-gray-90',
          rounded && '!rounded-full',
          scale && scaleStyleClass[scale],
          className,
        )}
        placeholder="placeholder"
        {...props}
      />
      {icon && <Icon className={clsx('absolute top-1/2 -translate-y-1/2 right-4')} icon={icon} size={24} />}
    </div>
  );
};

export default TextBox;
