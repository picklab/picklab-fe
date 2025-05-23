import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import React from 'react';

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  // Chip에 표시할 텍스트
  text: string;
  className?: string;
}

const Chip = ({ text, className, ...props }: ChipProps) => {
  return (
    <Typography
      type="Caption2Medium"
      className={clsx(
        `w-fit flex justify-center items-center h-[22px] rounded-full px-space-8 py-space-base cursor-default text-gray-50 bg-gray-20 `,
        className,
      )}
      {...props}
    >
      {text}
    </Typography>
  );
};

export default Chip;
