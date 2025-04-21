import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  // Badge에 표시할 텍스트
  text: string;
  // Variant 타입 (default, deadline, intended)
  variant: 'default' | 'deadline' | 'intended';
}

const Badge = ({ text, variant, className, ...props }: BadgeProps) => {
  const baseClasses = 'w-fit px-space-8 py-space-base rounded-md inline-block cursor-default';

  const variantClasses = {
    default: 'bg-gray-90 text-gray-0',
    deadline: 'bg-danger-50 text-danger-5',
    intended: 'bg-gray-10 text-gray-50',
  };

  return (
    <Typography type="Caption1Medium" className={clsx(baseClasses, variantClasses[variant], className)} {...props}>
      {text}
    </Typography>
  );
};

export default Badge;
