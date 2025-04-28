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
    <div className="flex items-center gap-space-6 h-[21px] w-[106px]">
      <Typography type="Body3Semibold" className="w-[21px] h-[21px] flex items-center justify-center">
        {rank}
      </Typography>
      <Typography type="Caption1Medium">{title}</Typography>
      <ChartBadge type={type} value={value} />
    </div>
  );
};

export default Chart;
