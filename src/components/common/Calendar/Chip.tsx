import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import React from 'react';

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  period: 'start' | 'deadline';
}

const chipStyle = {
  start: {
    bg: 'bg-primary-10',
    text: 'text-primary-60',
  },
  deadline: {
    bg: 'bg-danger-5',
    text: 'text-danger-40',
  },
};

const Chip = ({ text, className, period = 'start', ...props }: ChipProps) => {
  return (
    <div
      className={clsx('flex w-[33px] h-[22px] items-center justify-center rounded', chipStyle[period].bg, className)}
      {...props}
    >
      <Typography type="Caption1Semibold" className={chipStyle[period].text}>
        {text}
      </Typography>
    </div>
  );
};

export default Chip;
