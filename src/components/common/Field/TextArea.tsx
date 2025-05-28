'use client';
import HelpMessage, { HelpMessageProps } from '@/components/common/Field/HelpMessage';
import LabelType from '@/components/common/Field/LabelType';
import TextBox, { TextareaTextBoxProps } from '@/components/common/Field/TextBox';
import { WithOptionalLabel } from '@/components/common/Field/TextField';
import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import React, { ChangeEvent, useState } from 'react';

export type TextAreaProps = Omit<TextareaTextBoxProps, 'error' | 'textBoxType'> &
  WithOptionalLabel & {
    helpMessage?: string;
    status: HelpMessageProps['status'];
  };
const TextArea = (props: TextAreaProps) => {
  const { label, id, helpMessage, status, labelStatus, disabled, maxLength, ...rest } = props;
  const [length, setLength] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLength(e.target.value.length);
  };
  return (
    <div className="flex flex-col w-fit h-fit gap-1">
      {label && (
        <LabelType
          disable={disabled}
          status={labelStatus}
          htmlFor={id}
          title={label}
          className={clsx(disabled && '!cursor-not-allowed')}
        />
      )}
      <TextBox
        id={id}
        disabled={disabled}
        {...rest}
        error={status === 'error'}
        textBoxType="textarea"
        maxLength={maxLength}
        className="!rounded"
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          handleChange(event);
          if (rest.onChange) rest.onChange(event);
        }}
      />
      {(helpMessage || maxLength) && (
        <div className="flex justify-between items-center text-gray-60 px-1">
          {helpMessage ? (
            <HelpMessage className="mt-0.5" title={helpMessage} status={status} />
          ) : (
            <div /> // 공간 확보용
          )}
          {maxLength && (
            <Typography type="Caption2Semibold" className={clsx(length >= maxLength && 'text-danger-50', 'self-end')}>
              {length} / {maxLength}
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default TextArea;
