import ChartBadge, { BadgeTypes } from '@/components/common/Chart/ChartBadge/ChartBadge';
import Typography from '@/components/common/Typography';
import React from 'react';

interface ChartProps {
  rank: number;
  title: string;
  type: BadgeTypes;
  value?: number;
}

const ChartList = ({ rank, title, type, value }: ChartProps) => {
  return (
    <button className="flex items-center gap-space-6 h-[21px] w-full max-w-[140px]">
      <Typography type="Body3Semibold" className="min-w-[21px] h-full flex items-center justify-center">
        {rank}
      </Typography>
      <div className="flex items-center gap-space-6 min-w-0">
        <Typography
          type="Caption1Medium"
          className="truncate max-w-[73px] overflow-hidden whitespace-nowrap"
          title={title}
        >
          {title}
        </Typography>
        <ChartBadge type={type} value={value} />
      </div>
    </button>
  );
};

export default ChartList;
