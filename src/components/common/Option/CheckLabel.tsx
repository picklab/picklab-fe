import React from 'react';
import CheckBox from './CheckBox';
import Label from '@/components/common/Field/LabelType';

interface CheckLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string; // 우측에 표시할 텍스트
  error?: boolean;
}

const CheckLabel = ({ label, error, id, ...props }: CheckLabelProps) => {
  const checkboxId = id ?? `checkbox-${label}`;

  return (
    <div className="flex items-center gap-space-10">
      <CheckBox id={checkboxId} error={error} {...props} />
      <Label title={label} htmlFor={checkboxId} />
    </div>
  );
};

export default CheckLabel;
