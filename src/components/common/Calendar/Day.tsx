import React from 'react';
import Typography from '../Typography';
import { twMerge } from 'tailwind-merge';

interface DayProps extends React.HTMLAttributes<HTMLDivElement> {
  day: number;
  isToday?: boolean;
  isSelected?: boolean;
  isCurrentMonth?: boolean; // 현재 달의 날짜인지 여부
}

const Day = ({ day, isToday, isSelected, isCurrentMonth, className, ...props }: DayProps) => {
  return (
    <div
      className={twMerge(
        `relative w-8 h-8 rounded-full flex items-center justify-center`,
        className,
        isSelected && 'bg-primary-50',
      )}
      {...props}
    >
      <Typography type="Body1Medium" className={twMerge('text-gray-80', isSelected && 'text-gray-0')}>
        {day}
      </Typography>
      {isToday && !isSelected && (
        <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-1 h-1 rounded-full bg-primary-50"></div>
      )}
    </div>
  );
};

export default Day;
