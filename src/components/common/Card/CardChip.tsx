import Typography, { TypographyType } from '@/components/common/Typography';
import clsx from 'clsx';
import React from 'react';

export interface CardChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  // Chip에 표시할 텍스트
  text: '대외활동' | '교육' | '공모전/해커톤' | '강연/세미나';
  className?: string;
  typoType?: TypographyType;
}

const CardChip = ({ text, className, typoType = 'Caption2Medium', ...props }: CardChipProps) => {
  return (
    <Typography
      type={typoType}
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

export default CardChip;
