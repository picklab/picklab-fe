'use client';

import { OptionGroup, OptionGroupProps } from '@/components/common/Option/OptionGroup';
import TextField, { TextFieldProps } from '@/components/common/Field/TextField';
import { debounce } from '@/utils/debounce';
import clsx from 'clsx';
import React, { ChangeEvent, useMemo, useState } from 'react';
import { OptionProps, OptionType } from '@/components/common/Option/Option';

export type SelectTextBoxProps = TextFieldProps & {
  optionGroupProps?: OptionGroupProps;
};
const Search = ({ optionGroupProps, ...props }: SelectTextBoxProps) => {
  const [input, setInput] = useState<OptionProps['selectedValue']>();
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState<OptionType[]>([]);

  const onSelect = (value: OptionProps['selectedValue']) => {
    let label;
    if (Array.isArray(value)) {
      label = optionGroupProps?.options.find((o) => o.value === value[0])?.label;
    } else {
      label = optionGroupProps?.options.find((o) => o.value === value)?.label;
    }
    setInput(label || value);
    optionGroupProps?.onClickHandler(value);
    setIsOpen(false);
  };

  const handleInput = useMemo(
    () =>
      debounce((event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if (value.trim() !== '') {
          const match = optionGroupProps?.options.filter((item) => item.label.includes(value)) || [];
          setFiltered(match);
          setIsOpen(true);
        }
      }, 300),
    [],
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim() === '') {
      setFiltered([]);
      setIsOpen(false);
      setInput('');
      return;
    }
    if (props.onChange) {
      props.onChange(e);
    }
    if (optionGroupProps) {
      setInput(e.target.value);
      optionGroupProps?.onClickHandler(''); // 선택 취소
      handleInput(e);
    }
  };

  return (
    <div className="w-fit relative">
      <TextField
        {...props}
        className={clsx(props.className, optionGroupProps && 'pr-11')}
        value={input}
        onChange={onChange}
        icon="search"
      />
      {isOpen && optionGroupProps && (
        <OptionGroup
          {...optionGroupProps}
          options={filtered}
          onClickHandler={onSelect}
          className={clsx(optionGroupProps.className, 'absolute -bottom-30 z-10 left-0')}
        />
      )}
    </div>
  );
};

export default Search;
