import React from 'react';
import CheckBox from './CheckBox';
import Typography from '@/components/common/Typography';

interface CheckLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string; // 우측에 표시할 텍스트
  error?: boolean;
}

const CheckLabel = ({ label, error, id, ...props }: CheckLabelProps) => {
  const checkboxId = id ?? `checkbox-${label}`;

  return (
    <div className="flex items-center gap-space-10">
      <CheckBox id={checkboxId} error={error} {...props} />
      <Typography
        type="Body1Medium"
        tag="label"
        htmlFor={checkboxId} // CheckBox 컴포넌트의 id와 동기화
        className="text-gray-60 cursor-pointer"
      >
        {label}
      </Typography>
    </div>
  );
};

export default CheckLabel;
