import FunctionOption, { FunctionOptionProps } from '@/components/common/Option/FunctionOption';
import OptionComponent, { OptionProps, OptionType } from '@/components/common/Option/Option';

import { widthClassMap } from '@/components/common/Select/Select';
import clsx from 'clsx';

import React from 'react';

export type OptionGroupProps = {
  options: OptionType[]; // 렌더링할 옵션 리스트
  selectedValue: OptionProps['selectedValue']; // 현재 선택된 값
  onClickHandler: (value: OptionProps['selectedValue']) => void;
  type?: OptionProps['type'];
  icon?: OptionProps['icon'];
  width?: 'default' | 'large' | 'small';
  className?: string;
  functionOptionType?: FunctionOptionProps['type'];
};

export const OptionGroup = ({
  options,
  selectedValue,
  onClickHandler,
  type = 'text',
  width = 'default',
  icon,
  className,
  functionOptionType,
}: OptionGroupProps) => {
  return (
    <ul
      role="listbox"
      className={clsx(
        'flex flex-col mt-1 rounded border border-gray-30 bg-gray-0 p-space-2 focus:outline-none',
        'max-h-[248px] overflow-y-auto',
        widthClassMap[width],
        className,
      )}
    >
      <OptionComponent
        type={type}
        icon={icon}
        options={options}
        selectedValue={selectedValue}
        onClickHandler={onClickHandler}
        className="!w-full !justify-start"
      />
      {functionOptionType && <FunctionOption type={functionOptionType} />}
    </ul>
  );
};
