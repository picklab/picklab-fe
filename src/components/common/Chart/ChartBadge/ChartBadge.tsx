import FillChevronDown from '@/components/common/Icon/assets/FillChevronDown';
import FillChevronUp from '@/components/common/Icon/assets/FillChevronUp';
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
        'inline-flex items-center justify-center rounded-full gap-space-2 flex-1 h-space-16',
        {
          'bg-danger-5 text-danger-50 min-w-space-16': type === 'new',
          'bg-gray-10 text-gray-60 min-w-space-16': type === 'default',
          'bg-info-5 text-info-50 min-w-7': type === 'down',
          'bg-danger-5 text-danger-50 min-w-7': type === 'up',
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
          <Typography type="Caption2Medium" className="flex items-center justify-center">
            {value}
          </Typography>
          {type === 'up' ? (
            <FillChevronUp width={10} height={10} className="text-danger-50" />
          ) : (
            <FillChevronDown width={10} height={10} className="text-info-50" />
          )}
        </>
      )}
    </span>
  );
};

export default ChartBadge;
