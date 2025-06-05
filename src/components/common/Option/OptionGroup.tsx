import FunctionOption, { FunctionOptionProps } from '@/components/common/Option/FunctionOption';
import Option, { OptionProps, OptionType } from '@/components/common/Option/Option';

import { widthClassMap } from '@/components/common/Select/Select';
import clsx from 'clsx';

import React from 'react';

export type OptionGroupProps = {
  options: OptionType[]; // 렌더링할 옵션 리스트
  selectedValue?: OptionProps['selectedValue']; // 현재 선택된 값
  onClickHandler: OptionProps['onClickHandler'];
  type?: OptionProps['type'];
  icon?: OptionProps['icon'];
  width?: keyof typeof widthClassMap;
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
  const functionOptionOnClickHandler = () => {
    // 초기화 버튼 시
    if (functionOptionType === 'reset') {
      // 체크박스이면
      if (type === 'checkbox') {
        onClickHandler([]);
      } else {
        onClickHandler(undefined);
      }
    }
  };

  return (
    <div className="relative ">
      <ul
        role="listbox"
        className={clsx(
          'flex flex-col mt-1 rounded  bg-gray-0 p-space-2 focus:outline-none',
          'overflow-y-auto max-h-60 shadow-optionGroup',
          functionOptionType && 'pb-10',
          widthClassMap[width],
          className,
        )}
      >
        <Option
          type={type}
          icon={icon}
          options={options}
          selectedValue={selectedValue}
          onClickHandler={onClickHandler}
        />
        {functionOptionType && (
          <FunctionOption
            type={functionOptionType}
            onClick={functionOptionOnClickHandler}
            className="absolute bottom-[1px] w-[calc(100%-12px)] bg-white"
          />
        )}
      </ul>
    </div>
  );
};
