import CheckBoxLabel from '@/components/common/Field/CheckBoxLabel';
import Label, { Option } from '@/components/common/Field/Label';
import React from 'react';

type OptionGroupProps = {
  options: Option[]; // 렌더링할 옵션 리스트
  selectedValue: string; // 현재 선택된 값
  onClickHandler: (value: string) => void;
  type?: 'checkBox' | 'default';
};

export const OptionGroup = ({ options, selectedValue, onClickHandler, type = 'default' }: OptionGroupProps) => {
  return (
    <ul
      role="listbox"
      className="flex flex-col w-60 mt-1 rounded border border-gray-30 bg-gray-0 p-space-2 focus:outline-none"
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
    </ul>
  );
};
