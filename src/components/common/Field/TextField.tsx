import HelpMessage, { HelpMessageProps } from '@/components/common/Field/HelpMessage';
import LabelType, { LabelTypeProps } from '@/components/common/Field/LabelType';
import TextBox, { TextBoxProps } from '@/components/common/Field/TextBox';
import clsx from 'clsx';
import React from 'react';

type WithLabel = {
  label: string;
  id: string;
  labelStatus: LabelTypeProps['status'];
};

type WithoutLabel = {
  label?: never;
  id?: string;
  labelStatus?: never;
};

type WithOptionalLabel = WithLabel | WithoutLabel;

export type TextFieldProps = Omit<TextBoxProps, 'error'> &
  WithOptionalLabel & {
    helpMessage?: string;
    status: HelpMessageProps['status'];
  };
const TextField = (props: TextFieldProps) => {
  const { label, id, helpMessage, status, labelStatus, disabled, ...rest } = props;

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
      <TextBox id={id} disabled={disabled} {...rest} error={status === 'error'} />
      {helpMessage && <HelpMessage title={helpMessage} status={status} />}
    </div>
  );
};

export default TextField;
