'use client';

import { OptionGroup, OptionGroupProps } from '@/components/common/Field/OptionGroup';
import Icon from '@/components/common/Icon/Icon';
import { debounce } from '@/utils/debounce';
import clsx from 'clsx';
import React, { ChangeEvent, InputHTMLAttributes, useMemo } from 'react';

export interface TextBoxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  error?: boolean;
  optionGroupProps?: OptionGroupProps;
}
const TextBox = ({ error = false, optionGroupProps, onChange, ...props }: TextBoxProps) => {
  // error style 제거
  if (props.disabled) {
    error = false;
  }
  const handleDebouncedChange = useMemo(
    () =>
      debounce((e: ChangeEvent<HTMLInputElement>) => {
        if (onChange) onChange(e);
      }, 1000),
    [onChange],
  );
  return (
    <div className="w-fit relative">
      <input
        type="text"
        className={clsx(
          `box-border w-60 h-space-48 rounded-md border px-space-12 py-space-8 text-gray-90
          border-interactive-secondary  
          hover:border-gray-50 hover:placeholder:text-gray-50
          active:border-gray-50 
          disabled:bg-disabled disabled:border-gray-40 disabled:placeholder:text-gray-50 disabled:cursor-not-allowed
          focus:outline-none
          text-[15px]`,
          optionGroupProps && 'pr-space-32',
          error && '!border-danger-border placeholder:!text-gray-90',
        )}
        placeholder="placeholder"
        {...props}
        onChange={(event) => {
          handleDebouncedChange(event);
        }}
      />
      {optionGroupProps && <Icon className="absolute top-1/2 -translate-y-1/2 right-2" icon="search" size={24} />}
      {optionGroupProps && <OptionGroup className="absolute -bottom-30 z-10 left-0" {...optionGroupProps} />}
    </div>
  );
};

export default TextBox;
