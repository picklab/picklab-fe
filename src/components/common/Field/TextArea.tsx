'use client';

import HelpMessage, { HelpMessageProps } from '@/components/common/Field/HelpMessage';
import Label from '@/components/common/Field/Label';
import TextBox, { TextareaTextBoxProps } from '@/components/common/Field/TextBox';
import { WithOptionalLabel } from '@/components/common/Field/TextField';
import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import React, { ChangeEvent, useState } from 'react';

// TextArea 컴포넌트의 props 타입 정의
export type TextAreaProps = Omit<TextareaTextBoxProps, 'error' | 'textBoxType'> &
  WithOptionalLabel & {
    helpMessage?: string;
    status: HelpMessageProps['status']; // 상태 (예: 'error', 'success')
    maxLength: number;
    minLength?: number;
  };

// TextArea 컴포넌트
const TextArea = (props: TextAreaProps) => {
  const { label, id, status, labelStatus, helpMessage, minLength, disabled, maxLength, ...rest } = props;

  const lengthMessageClass = 'h-space-12';

  const [length, setLength] = useState(0); // 입력된 글자 수 상태
  const isMaxLength = length > maxLength; // 최대 글자를 초과했나 판별하는 변수
  const isUnderMinLength = minLength ? length < minLength : false; // 최소 글자인지 판별하는 변수
  const helpMessageTitle = isUnderMinLength ? `최소 ${minLength}글자 이상 입력하세요` : helpMessage;
  // textarea 값이 변경될 때 글자 수 업데이트
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLength(e.target.value.length);
  };

  return (
    <div className="flex flex-col w-fit h-fit gap-1">
      {/* 라벨 영역 */}
      {label && (
        <Label
          disable={disabled}
          status={labelStatus}
          htmlFor={id}
          title={label}
          className={clsx(disabled && '!cursor-not-allowed')}
        />
      )}

      {/* 텍스트박스 영역 */}
      <TextBox
        id={id}
        disabled={disabled}
        {...rest}
        error={isMaxLength || status === 'error'}
        textBoxType="textarea"
        maxLength={maxLength}
        minLength={minLength}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          handleChange(event); // 글자 수 업데이트
          rest.onChange?.(event); // 외부 onChange 호출
        }}
      />

      {/* 하단 안내 메시지 및 글자 수 카운터 */}
      <div className={clsx('flex justify-between items-center')}>
        {helpMessageTitle ? <HelpMessage status={disabled ? 'disabled' : status} title={helpMessageTitle} /> : <div />}
        {/* 글자 수 카운터 */}
        <div className={clsx('flex items-center text-gray-60', disabled && '!text-gray-40')}>
          <Typography type="Caption2Medium" className={clsx(lengthMessageClass, isMaxLength && 'text-danger-50')}>
            {length}&nbsp;
          </Typography>
          <Typography type="Caption2Medium" className={lengthMessageClass}>
            / {maxLength}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default TextArea;
