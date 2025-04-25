'use client';

import clsx from 'clsx';
import React, { InputHTMLAttributes } from 'react';

export interface PlaceholderFiledProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}
const PlaceholderFiled = ({ error = false, ...props }: PlaceholderFiledProps) => {
  // error style 제거
  if (props.disabled) {
    error = false;
  }
  return (
    <input
      type="text"
      className={clsx(
        `box-border w-[240px] h-[48px] rounded-md border px-space-12 py-space-8
          border-interactive-secondary  
          hover:border-gray-50 hover:placeholder:text-gray-50
          active:border-gray-50 
          disabled:bg-disabled disabled:border-gray-40 disabled:placeholder:text-gray-50 
          focus:outline-none
          text-[15px]`,
        error && '!border-danger-border',
      )}
      placeholder="placeholder"
      {...props}
    />
  );
};

export default PlaceholderFiled;
