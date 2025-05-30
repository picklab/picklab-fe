import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import React from 'react';

export type BadgeTypes = 'new' | 'default' | 'up' | 'down';

interface ChartBadgeProps {
  type: BadgeTypes;
  value?: number; // 'up'이나 'down'일 때 몇 단계 올랐는지
  className?: string;
}

const ChartBadge = ({ type, value, className }: ChartBadgeProps) => {
  const isUpOrDown = type === 'up' || type === 'down';
  const hasValue = typeof value === 'number';

  // type별 동적으로 aria-label 생성하는 함수
  const getAriaLabel = (type: BadgeTypes, value?: number) => {
    switch (type) {
      case 'new':
        return '새로운 항목';
      case 'default':
        return '변동 없음';
      case 'up':
        return value ? `${value}단계 상승` : '상승';
      case 'down':
        return value ? `${value}단계 하락` : '하락';
      default:
        return '';
    }
  };

  return (
    <span
      className={clsx(
        'flex justify-center items-center rounded-full h-space-16 w-fit',
        {
          'bg-danger-5 text-danger-50 min-w-space-16': type === 'new',
          'bg-gray-10 text-gray-60 min-w-space-16': type === 'default',
          'bg-info-5 text-info-50 min-w-[34px]': type === 'down',
          'bg-danger-5 text-danger-50 min-w-[34px]': type === 'up',
        },
        className,
      )}
      role="status"
      aria-label={getAriaLabel(type, value)}
    >
      {type === 'new' && <Typography type="Caption2Medium">N</Typography>}
      {type === 'default' && <Typography type="Caption2Medium">-</Typography>}
      {isUpOrDown && hasValue && (
        <>
          {type === 'up' ? (
            <Icon icon="arrowUp" size={14} className="text-danger-50" />
          ) : (
            <Icon icon="arrowDown" size={14} className="text-info-50" />
          )}
          <Typography type="Caption2Medium" className="mr-[3px]">
            {value}
          </Typography>
        </>
      )}
    </span>
  );
};

export default ChartBadge;
