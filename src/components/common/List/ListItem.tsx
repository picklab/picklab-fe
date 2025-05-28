'use client';

import CardChip, { CardChipProps } from '@/components/common/Card/CardChip';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import { getFormatDate } from '@/utils/day';
import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

export interface ListItemProps {
  thumbnail: string;
  label?: string;
  title: string;
  saveCount?: number;
  viewCount?: number;
  isBookmarked?: boolean;
  isFinished: boolean;
  onListClick: () => void;
  onBookmarkClick?: () => void;
  chipTitle?: CardChipProps['text'];
  organization?: string;
  startDate?: Date | null;
  endDate?: Date | null;
}

const grayText = 'text-gray-50 group-active:text-gray-40';
const grayTextStrong = 'text-gray-90 group-active:text-gray-40';

const ListItem = ({
  thumbnail,
  label,
  title,
  saveCount,
  viewCount,
  isBookmarked,
  isFinished,
  onListClick,
  onBookmarkClick,
  chipTitle,
  organization,
  startDate,
  endDate,
}: ListItemProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onListClick();
    }
  };

  // 모집 및 활동이 종료된 FinisihedListItem
  const renderFinishedContent = () =>
    chipTitle &&
    organization &&
    startDate &&
    endDate && (
      <div className="flex flex-col justify-center max-w-[268px] gap-space-8">
        <div className="flex flex-col gap-space-6">
          <CardChip text={chipTitle} className="cursor-pointer" />
          <div className="flex flex-col gap-space-2">
            <Typography type="Body2Semibold" className={`${grayTextStrong} truncate`}>
              {title}
            </Typography>
            <Typography type="Body4Medium" className={`${grayText} truncate`}>
              {organization}
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-space-6">
          <Typography type="Caption1Regular" className="text-gray-90">
            활동기간
          </Typography>
          <Typography type="Caption1Regular" className="text-gray-90">
            {`${getFormatDate(startDate)}~${getFormatDate(endDate)}`}
          </Typography>
        </div>
      </div>
    );

  // 모집 및 활동이 진행중인 ListItem
  const renderOngoingContent = () =>
    label &&
    saveCount &&
    viewCount && (
      <div className="flex flex-col gap-space-base py-space-base max-w-[268px]">
        <div className="flex flex-col gap-space-base">
          <Typography type="Body4Medium" className={`${grayText} truncate`}>
            {label}
          </Typography>
          <Typography type="Body1Semibold" className={`${grayTextStrong} truncate`}>
            {title}
          </Typography>
        </div>
        <div className="flex gap-space-14 items-center">
          <div className="flex gap-space-2 items-center">
            <Typography type="Caption1Medium" className={grayText}>
              저장수
            </Typography>
            <Typography type="Caption1Medium" className={grayText}>
              {saveCount}
            </Typography>
          </div>
          <div className="flex gap-space-2 items-center">
            <Typography type="Caption1Medium" className={grayText}>
              조회수
            </Typography>
            <Typography type="Caption1Medium" className={grayText}>
              {viewCount}
            </Typography>
          </div>
        </div>
      </div>
    );

  return (
    <div
      className={clsx(
        'flex justify-between items-center cursor-pointer border-b border-gray-20 focus:outline-none',
        isFinished ? 'py-space-base' : 'py-space-14',
      )}
      role="button"
      tabIndex={0}
      onClick={onListClick}
      onKeyDown={handleKeyDown}
    >
      <div className={clsx('flex gap-space-14 items-start group', isFinished ? 'min-w-[368px]' : 'min-w-[488px]')}>
        <div className={clsx('w-[86px] relative overflow-hidden', isFinished ? 'h-[94px]' : 'h-[86px]')}>
          <Image src={thumbnail} alt="리스트 썸네일" sizes="86" fill className="object-cover rounded-lg" />
        </div>
        {isFinished ? renderFinishedContent() : renderOngoingContent()}
      </div>
      {!isFinished && (
        <Icon
          icon={isBookmarked ? 'bookmarkFill' : 'bookmarkLine'}
          size={24}
          className={clsx('cursor-pointer outline-none', isBookmarked ? 'text-primary-50' : 'text-gray-40')}
          onClick={(e) => {
            e.stopPropagation();
            onBookmarkClick?.();
          }}
          aria-pressed={isBookmarked}
          role="button"
          tabIndex={0}
        />
      )}
    </div>
  );
};

export default ListItem;
