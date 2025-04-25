import HelpMessage, { HelpMessageProps } from '@/components/common/Field/HelpMessage';
import LabelType from '@/components/common/Field/LabelType';
import TextBox, { TextBoxProps } from '@/components/common/Field/TextBox';
import clsx from 'clsx';
import React from 'react';
interface BaseProps extends Omit<TextBoxProps, 'error'> {
  status: HelpMessageProps['status'];
  helpMessage?: string;
}

type WithLabel = {
  label: string;
  id: string;
};

type WithoutLabel = Partial<WithLabel>;

type TextFieldProps = BaseProps & (WithLabel | WithoutLabel);

const TextField = ({ label, id, status, helpMessage, ...props }: TextFieldProps) => {
  if (props.disabled) {
    status = 'default';
  }

  return (
    <div className="flex flex-col w-fit h-fit ">
      {label && <LabelType htmlFor={id} title={label} className={clsx(props.disabled && '!cursor-not-allowed')} />}
      <TextBox id={id} {...props} error={status === 'error'} />
      {helpMessage && <HelpMessage title={helpMessage} status={status} />}
    </div>
  );
};

export default TextField;
