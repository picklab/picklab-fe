import IconButton from '@/components/common/Button/IconButton';
import { IconProps } from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import { Divider } from '@/components/Divider/Divider';
import clsx from 'clsx';
import React from 'react';

export type StepType = {
  label: string;
  icon: IconProps['icon'];
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
    <div className="flex flex-col items-center justify-between w-[48px] h-[52px] transition-all">
      <div className="relative flex items-center justify-center size-9">
        {showLine && (
          <Divider className="absolute top-1/2 left-full -translate-x-[4px] -translate-y-1/2 -z-10 !w-[45px]" />
        )}
        <IconButton
          size="sm"
          aria-current={isActive ? 'step' : undefined}
          buttonStyles={isActive ? 'filled' : 'outlined'}
          disabled={isPast || !isActive}
          readonly
          icon={step.icon}
        />
      </div>
      <Typography
        type={isActive ? 'Caption2Medium' : 'Caption2Regular'}
        className={clsx({
          'text-gray-60': isActive,
          'text-gray-40': !isActive,
        })}
      >
        {step.label}
      </Typography>
    </div>
  );
};

export default FunnelStep;
