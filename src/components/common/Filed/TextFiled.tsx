import PlaceholderFiled, { PlaceholderFiledProps } from '@/components/common/Filed/PlaceholderFiled';
import HelpMessage, { HelpMessageProps } from '@/components/common/HelpMessage';
import Label from '@/components/common/Label';
import clsx from 'clsx';
import React from 'react';

interface TextFiledProps extends PlaceholderFiledProps {
  label: string;
  id: string;
  status: HelpMessageProps['status'];
  message: string;
}

const TextFiled = ({ label, id, status, message, ...props }: TextFiledProps) => {
  if (props.disabled) {
    status = 'default';
  }
  return (
    <div className="flex flex-col w-fit h-fit ">
      <Label htmlFor={id} title={label} className={clsx(props.disabled && '!cursor-not-allowed')} />
      <PlaceholderFiled id={id} {...props} error={status === 'error'} />
      <HelpMessage title={message} status={status} />
    </div>
  );
};

export default TextFiled;
