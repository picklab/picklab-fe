import { BadgeTypes } from '@/components/common/Chart/ChartBadge/ChartBadge';
import ChartList from '@/components/common/Chart/ChartList';
import RecentWord from '@/components/common/Chart/RecentWord';
import { Divider } from '@/components/common/Divider/Divider';
import Typography from '@/components/common/Typography';
import { getFormatDate } from '@/utils/day';
import React from 'react';

interface keywordTypes {
  id: number;
  word: string;
}

export interface chartDataTypes {
  rank: number;
  title: string;
  type: BadgeTypes;
  value?: number;
}

interface RecentListProps {
  keywords: keywordTypes[];
  chartDatas: chartDataTypes[];
  removeHandler: (id: number) => void;
  popularTime: Date;
}

const RecentList = ({ keywords, chartDatas, removeHandler, popularTime }: RecentListProps) => {
  return (
    <div className="flex flex-col px-8 py-7 bg-white rounded-lg shadow-lg border border-gray-20 gap-5 w-fit max-w-[372px]">
      <div className="flex flex-col gap-3 w-[308px]">
        <div className="flex justify-between items-center">
          <Typography type="Body1Semibold" className="text-gray-90">
            최근 검색기록
          </Typography>
          <Typography type="Caption1Medium" className="text-gray-50 cursor-pointer">
            전체삭제
          </Typography>
        </div>
        <div className="flex-wrap flex gap-2">
          {keywords.map((keyword) => (
            <RecentWord key={keyword.id} keyword={keyword} removeHandler={removeHandler} />
          ))}
        </div>
      </div>
      <Divider className="w-[308px]" />

      <div className="flex flex-col gap-3 w-[308px]">
        <div className="flex justify-between items-center">
          <Typography type="Body1Semibold" className="text-gray-90">
            인기 검색어
          </Typography>
          <Typography type="Caption2Regular" className="text-gray-50">
            {`${getFormatDate(popularTime, 'TIME')} 기준`}
          </Typography>
        </div>
        <div className="flex-wrap flex justify-between gap-2">
          {chartDatas.map((chart, idx) => (
            <ChartList
              key={`chart-${idx}`}
              rank={chart.rank}
              title={chart.title}
              type={chart.type as BadgeTypes}
              value={chart.value}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentList;
