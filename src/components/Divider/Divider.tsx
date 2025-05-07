import React from 'react';
import clsx from 'clsx';

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
  className?: string;
}

export const Divider = ({ vertical = false, className, ...props }: DividerProps) => {
  return (
    <div
      role="separator"
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      className={clsx('bg-gray-20', vertical ? 'h-space-32 w-[1px]' : 'w-[375px] h-[1px]', className)}
      {...props}
    />
  );
};
