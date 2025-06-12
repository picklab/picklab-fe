'use client';

import { OptionGroup, OptionGroupProps } from '@/components/common/Option/OptionGroup';
import TextField, { TextFieldProps } from '@/components/common/Field/TextField';
import { debounce } from '@/utils/debounce';
import clsx from 'clsx';
import React, { ChangeEvent, useMemo, useState } from 'react';
import { OptionType } from '@/components/common/Option/Option';

// Props 타입 정의: TextFieldProps를 기반으로 하고, optionGroupProps를 선택적으로 추가
export type SelectTextBoxProps = TextFieldProps & {
  optionGroupProps?: Omit<OptionGroupProps, 'type'>; // 'type'은 내부에서 지정하므로 제외
};

// 검색 가능한 TextField 컴포넌트
const Search = ({ optionGroupProps, ...props }: SelectTextBoxProps) => {
  // 입력값 상태
  const [input, setInput] = useState<string>('');
  // OptionGroup 드롭다운 열림 여부
  const [isOpen, setIsOpen] = useState(false);
  // 필터링된 옵션 목록
  const [filtered, setFiltered] = useState<OptionType[]>([]);
  // 검색 결과 또는 기본 도움말 메시지
  const [searchHelpMessage, setSearchHelpMessage] = useState(props.helpMessage);

  // 옵션 선택 시 동작
  const onSelect = (value?: string | string[]) => {
    // functionOptionType이 'selfplus'가 아닐 경우, 선택한 옵션의 label을 input에 표시
    if (optionGroupProps?.functionOptionType !== 'selfplus') {
      const label = optionGroupProps?.options.find((o) => o.value === value)?.label;
      setInput(label || '');
    }

    // 선택된 값을 부모로 전달
    optionGroupProps?.onClickHandler(value);
    // 드롭다운 닫기
    setIsOpen(false);
  };

  // debounce된 입력 필터 함수
  const handleInput = useMemo(
    () =>
      debounce((event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        if (value.trim() !== '') {
          // 입력값을 포함하는 옵션 필터링
          const match = optionGroupProps?.options.filter((item) => item.label.includes(value)) || [];

          if (match.length > 0) {
            setIsOpen(true);
            setFiltered(match);
          } else {
            // 결과 없을 경우 헬프 메시지 출력
            setSearchHelpMessage('검색 결과가 없습니다!');
          }
        }
      }, 300),
    [], // 의존성 없음
  );

  // 입력 필드 변경 핸들러
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.trim() === '') {
      // 입력값이 비어있으면 상태 초기화
      setFiltered([]);
      setIsOpen(false);
      setInput('');
      setSearchHelpMessage(props.helpMessage);
      return;
    }

    // 부모로 이벤트 전달
    if (props.onChange) {
      props.onChange(e);
    }

    // 상태 업데이트 및 선택 초기화
    if (optionGroupProps) {
      setInput(value);
      optionGroupProps?.onClickHandler(''); // 선택 해제 처리
      handleInput(e); // debounce된 필터 함수 호출
    }
  };

  return (
    <div className="w-fit relative">
      {/* 검색 입력 필드 */}
      <TextField
        {...props}
        className={clsx(props.className, optionGroupProps && 'pr-11')}
        value={input}
        onChange={onChange}
        icon="search"
        helpMessage={searchHelpMessage}
      />

      {/* 필터링된 옵션 드롭다운 렌더링 */}
      {isOpen && optionGroupProps && (
        <OptionGroup
          {...optionGroupProps}
          type="text" // 내부에서 강제 지정
          textFieldValue={input}
          options={filtered}
          onClickHandler={onSelect}
          className={clsx(optionGroupProps.className, 'absolute -bottom-30 z-10 left-0')}
        />
      )}
    </div>
  );
};

export default Search;
