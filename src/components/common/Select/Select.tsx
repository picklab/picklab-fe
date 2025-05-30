'use client';

import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/common/Icon/Icon';
import HelpMessage, { HelpMessageProps } from '@/components/common/Field/HelpMessage';
import LabelType, { LabelTypeProps } from '@/components/common/Field/LabelType';
import { OptionGroup } from '@/components/common/Select/OptionGroup';

interface Option {
  label: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  labelStatus?: LabelTypeProps['status'];
  helpMessage?: string;
  helpMessageStatus?: HelpMessageProps['status'];
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  type?: 'checkBox' | 'default';
  disabled?: boolean;
  width?: 'default' | 'large' | 'small';
  size?: 'default' | 'small';
}

export const widthClassMap = {
  default: 'w-60',
  large: 'w-[426px]',
  small: 'w-[136px]',
};

export const sizeClassMap = {
  default: 'h-space-48',
  small: 'h-space-40',
};

const Select = ({
  label,
  labelStatus,
  helpMessage,
  helpMessageStatus = 'default',
  options,
  value,
  onChange,
  disabled = false,
  type = 'default',
  width = 'default',
  size = 'default',
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selectedLabel = options.find((opt) => opt.value === value)?.label;
  const displayText = selectedLabel || '선택해주세요';

  const widthClass = widthClassMap[width];
  const sizeClass = sizeClassMap[size];

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    buttonRef.current?.focus(); // 접근성을 위해 button에 포커싱 유지
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={selectRef} className={clsx('relative flex flex-col gap-space-4', widthClass)}>
      {label && <LabelType title={label} status={labelStatus} />}

      <button
        ref={buttonRef}
        type="button"
        id="select-button"
        className={clsx(
          'px-space-12 py-space-12 rounded-md border text-left text-gray-40 flex justify-between items-center transition-colors group',
          'border-gray-30 bg-gray-0',
          'hover:border-gray-40 hover:text-gray-60 hover:placeholder:text-gray-60',
          'focus:border-primary-50 focus:bg-gray-0',
          'disabled:border-gray-30 disabled:bg-gray-5 disabled:text-gray-40 disabled:cursor-not-allowed disabled:group-hover:text-gray-40',
          helpMessageStatus === 'error' && 'border-danger-50',
          selectedLabel && 'border-gray-50 text-gray-90',
          widthClass,
          sizeClass,
        )}
        onClick={toggleDropdown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="select-options"
      >
        <span
          className={clsx(
            'overflow-hidden whitespace-nowrap text-ellipsis break-words',
            !selectedLabel && 'text-gray-40',
            !disabled && 'group-hover:text-gray-60',
          )}
        >
          {displayText}
        </span>
        <Icon icon={isOpen ? 'chevronUp' : 'chevronDown'} size={24} className="text-gray-90" />
      </button>

      {isOpen && (
        <div
          id="select-options"
          role="listbox"
          className={clsx('absolute z-10', widthClass, size === 'small' ? 'top-[64px]' : 'top-[72px]')}
        >
          <OptionGroup
            options={options}
            selectedValue={value}
            onClickHandler={handleSelect}
            type={type}
            width={width}
          />
        </div>
      )}

      {helpMessage && <HelpMessage title={helpMessage} status={helpMessageStatus} />}
    </div>
  );
};

export default Select;
