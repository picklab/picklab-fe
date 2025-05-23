import ChartBadge, { BadgeTypes } from '@/components/common/Chart/ChartBadge/ChartBadge';
import Typography from '@/components/common/Typography';
import React from 'react';

interface ChartProps {
  rank: number;
  title: string;
  type: BadgeTypes;
  value?: number;
}

const Chart = ({ rank, title, type, value }: ChartProps) => {
  return (
    <div className="flex items-center gap-space-6 h-[21px] w-full">
      <Typography type="Body3Semibold" className="min-w-[21px] flex items-center justify-center">
        {rank}
      </Typography>
      <div className="flex items-center gap-space-6 min-w-0">
        <Typography type="Caption1Medium" className="truncate">
          {title}
        </Typography>
        <ChartBadge type={type} value={value} />
      </div>
    </div>
  );
};

export default Chart;
