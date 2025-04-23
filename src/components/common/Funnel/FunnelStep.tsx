import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import React from 'react';

export type StepType = {
  label: string;
  icon: React.ReactNode;
};

const FunnelStep = ({
  step,
  isActive,
  isPast,
  showLine,
}: {
  step: StepType;
  isActive: boolean;
  isPast: boolean;
  showLine: boolean;
}) => {
  return (
    <div className="flex flex-col items-center justify-between w-[60px] transition-all">
      <div className="relative flex items-center justify-center w-space-40 h-space-40">
        {showLine && <div className="absolute top-1/2 left-full w-[44px] h-px bg-gray-30 -translate-y-1/2 -z-10" />}
        <div
          aria-current={isActive ? 'step' : undefined}
          className={clsx('rounded-full w-full h-full flex items-center justify-center transition-colors', {
            'bg-primary-50 text-gray-0': isActive,
            'bg-gray-20 text-gray-40': isPast,
            'bg-transparent text-gray-90': !isActive && !isPast,
          })}
        >
          {step.icon}
        </div>
      </div>
      <Typography
        type="Body2Medium"
        className={clsx({
          'text-gray-90': isActive,
          'text-gray-40': !isActive,
        })}
      >
        {step.label}
      </Typography>
    </div>
  );
};

export default FunnelStep;
