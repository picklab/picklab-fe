import { IconType } from '@/components/common/Icon/assets';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import React from 'react';

const FunctionType = {
  reset: {
    title: '초기화',
    icon: 'largeRefresh',
    className: 'text-info-60',
  },
  selfplus: {
    title: '직접 추가하기',
    icon: 'plus',
    className: 'text-primary-60',
  },
};

export interface FunctionOptionProps
  extends React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  type: keyof typeof FunctionType;
}

const FunctionOption = ({ className, type, ...props }: FunctionOptionProps) => {
  return (
    <li
      className={clsx(
        `flex items-center min-w-32 h-10 px-[9px] py-2 cursor-pointer rounded gap-2
    active:bg-gray-5 
    `,
        FunctionType[type].className,
        className,
      )}
      {...props}
    >
      <Icon icon={FunctionType[type].icon as IconType} size={18} />
      <Typography type="Body3Medium" className="h-[17px]">
        {FunctionType[type].title}
      </Typography>
    </li>
  );
};

export default FunctionOption;
