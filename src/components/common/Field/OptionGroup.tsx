import CheckBoxLabel from '@/components/common/Field/CheckBoxLabel';
import Label, { Option } from '@/components/common/Field/Label';
import { widthClassMap } from '@/components/common/Field/SelectField';
import clsx from 'clsx';
import React from 'react';

export type OptionGroupProps = {
  options: Option[]; // 렌더링할 옵션 리스트
  selectedValue: string; // 현재 선택된 값
  onClickHandler: (value: string) => void;
  type?: 'checkBox' | 'default';
  width?: 'default' | 'large' | 'small';
  className?: string;
  manualInputField?: string;
};

export const OptionGroup = ({
  options,
  selectedValue,
  onClickHandler,
  type = 'default',
  width = 'default',
  manualInputField,
  className,
}: OptionGroupProps) => {
  return (
    <ul
      role="listbox"
      className={clsx(
        'flex flex-col mt-1 rounded border border-gray-30 bg-gray-0 p-space-2 focus:outline-none',
        'max-h-[248px] overflow-y-auto scrollbar-thin',
        widthClassMap[width],
        className,
      )}
    >
      {type === 'checkBox' && (
        <CheckBoxLabel
          options={options}
          selectedValue={selectedValue}
          onClickHandler={onClickHandler}
          className="!w-full !justify-start"
        />
      )}
      {type === 'default' && (
        <Label
          options={options}
          selectedValue={selectedValue}
          onClickHandler={onClickHandler}
          className="!w-full !justify-start"
        />
      )}
      {manualInputField && (
        <Label
          focus
          options={[{ value: manualInputField, label: `${manualInputField} 직접입력` }]}
          selectedValue={selectedValue}
          onClickHandler={onClickHandler}
          className="!w-full !justify-center pt-2.5 cursor-pointer underline"
        />
      )}
    </ul>
  );
};
