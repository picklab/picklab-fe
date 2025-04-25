'use client';

import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/common/Icon/Icon';
import HelpMessage from '@/components/common/Field/HelpMessage';
import LabelType, { statusValue } from '@/components/common/Field/LabelType';
import { OptionGroup } from '@/components/common/Field/OptionGroup';

interface Option {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label?: string;
  labelStatus?: keyof typeof statusValue | 'default';
  helpMessage?: string;
  helpMessageStatus?: 'default' | 'error' | 'success';
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  type?: 'checkBox' | 'default';
  disabled?: boolean;
  width?: 'default' | 'large' | 'small';
}

export const widthClassMap = {
  default: 'w-[240px]',
  large: 'w-[426px]',
  small: 'w-[136px]',
};

const SelectField = ({
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
}: SelectFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selectedLabel = options.find((opt) => opt.value === value)?.label;
  const displayText = selectedLabel || '선택해주세요';

  const widthClass = widthClassMap[width];

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
          'px-space-12 py-space-12 rounded-md border text-left text-gray-90 flex justify-between items-center transition-colors',
          'border-interactive-secondary bg-gray-0',
          'hover:border-gray-50 hover:text-gray-60',
          'active:border-gray-50',
          'disabled:border-gray-40 disabled:bg-disabled disabled:text-gray-50 disabled:cursor-not-allowed',
          helpMessageStatus === 'error' && 'border-danger-border',
          widthClass,
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
          )}
        >
          {displayText}
        </span>
        <Icon icon={isOpen ? 'chevronUp' : 'chevronDown'} width={24} height={24} className="text-gray-90" />
      </button>

      {isOpen && (
        <div id="select-options" role="listbox" className={clsx('absolute top-[72px] z-10', widthClass)}>
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

export default SelectField;
