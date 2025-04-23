import Typography from '@/components/common/Typography';
import React from 'react';

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  // Chip에 표시할 텍스트
  text: string;
}

const Chip = ({ text, ...props }: ChipProps) => {
  return (
    <Typography
      type="Caption2Medium"
      className={`w-fit rounded-full px-space-6 py-[3px] inline-block cursor-default text-gray-60 bg-gray-20`}
      {...props}
    >
      {text}
    </Typography>
  );
};

export default Chip;
