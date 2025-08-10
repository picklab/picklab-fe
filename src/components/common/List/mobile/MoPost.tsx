'use client';
import CardChip, { CardChipProps } from '@/components/common/Card/CardChip';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import { getFormatDate } from '@/utils/day';

import React from 'react';

export interface MoPostProps {
  text: string;
  chipText: CardChipProps['text'];
  title: string;
  company: string;
  date: Date;
  onPostClick?: () => void;
  onMenuClick?: () => void;
}

const MoPost = ({ text, chipText, title, company, date, onPostClick, onMenuClick }: MoPostProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onPostClick?.();
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMenuClick?.();
  };

  return (
    <div
      className="flex flex-col gap-2 w-[335px] h-[150px] py-3 px-1 border cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={onPostClick}
      onKeyDown={handleKeyDown}
    >
      <div className="flex gap-2 items-center flex-1">
        <Typography type="Body3Medium" className="max-w-[70%] text-gray-50 truncate">
          {text}
        </Typography>
        <CardChip text={chipText} />
      </div>
      <div className="flex flex-col gap-1 justify-center flex-2">
        <Typography type="Body1Semibold" className="text-gray-90 truncate">
          {title}
        </Typography>
        <Typography type="Body3Regular" className="text-gray-90 truncate">
          {company}
        </Typography>
      </div>
      <div className="flex h-6 w-full flex-1 justify-between items-center">
        <Typography type="Caption1Medium" className="text-gray-40 h-3.5">
          {getFormatDate(date)}
        </Typography>
        <Icon
          icon="threeDots"
          size={24}
          className="!text-gray-40 cursor-pointer"
          onClick={handleMenuClick}
          role="button"
          tabIndex={0}
        />
      </div>
    </div>
  );
};

export default MoPost;
