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
  statusText?: string;
  className?: string;
}

const cardCompanyText = 'text-gray-50 group-active:text-gray-40';
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
  statusText,
  className,
}: ListItemProps) => {
  const ongoingOrganization = organization || label;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onListClick();
    }
  };

  // 모집 및 활동이 종료된 FinishedListItem
  const renderFinishedContent = () =>
    chipTitle && (
      <div className="flex flex-col justify-center max-w-[268px] gap-space-8">
        <div className="flex flex-col gap-space-6">
          <CardChip text={chipTitle} className="cursor-pointer" />
          <div className="flex flex-col gap-space-2">
            <Typography type="Body2Semibold" className={`${grayTextStrong} truncate`}>
              {title}
            </Typography>
            {organization && (
              <Typography type="Body4Medium" className={`${cardCompanyText} truncate`}>
                {organization}
              </Typography>
            )}
          </div>
        </div>
        <div className="flex items-center gap-space-6">
          <Typography type="Caption1Regular" className="text-gray-90">
            활동기간
          </Typography>
          <Typography type="Caption1Regular" className="text-gray-90">
            {startDate && endDate ? `${getFormatDate(startDate)}~${getFormatDate(endDate)}` : '-'}
          </Typography>
        </div>
      </div>
    );

  // 모집 및 활동이 진행중인 ListItem
  const renderOngoingContent = () =>
    ongoingOrganization &&
    saveCount !== undefined &&
    viewCount !== undefined && (
      <div className="flex flex-col justify-between h-full py-space-base max-w-[240px]">
        <div className="flex flex-col gap-space-base">
          <Typography type="Body4Medium" className={`${cardCompanyText} truncate`}>
            {ongoingOrganization}
          </Typography>
          <Typography type="Body1Semibold" className={`${grayTextStrong} line-clamp-2 break-keep`}>
            {title}
          </Typography>
        </div>
        <div className="flex gap-space-14 items-center">
          <div className="flex gap-space-2 items-center">
            <Typography type="Caption1Medium" className={cardCompanyText}>
              저장수
            </Typography>
            <Typography type="Caption1Medium" className={cardCompanyText}>
              {saveCount}
            </Typography>
          </div>
          <div className="flex gap-space-2 items-center">
            <Typography type="Caption1Medium" className={cardCompanyText}>
              조회수
            </Typography>
            <Typography type="Caption1Medium" className={cardCompanyText}>
              {viewCount}
            </Typography>
          </div>
        </div>
      </div>
    );

  return (
    <div
      className={clsx(
        'flex justify-between cursor-pointer border rounded-lg border-gray-20 focus:outline-none ',
        isFinished ? 'p-space-base' : 'py-space-10 px-3',
        'min-w-[414px]',
        className,
      )}
      role="button"
      tabIndex={0}
      onClick={onListClick}
      onKeyDown={handleKeyDown}
    >
      <div className={clsx('flex gap-space-14 items-start group')}>
        <div className={clsx('w-[86px] relative overflow-hidden', isFinished ? 'h-[94px]' : 'h-[110px]')}>
          <Image src={thumbnail} alt="리스트 썸네일" sizes="86" fill className="object-cover rounded-lg" />
        </div>
        {isFinished ? renderFinishedContent() : renderOngoingContent()}
      </div>
      {isFinished && statusText && (
        <Typography type="Caption1Medium" className="shrink-0 self-start rounded-full bg-gray-5 px-3 py-1 text-gray-60">
          {statusText}
        </Typography>
      )}
      {!isFinished && (
        <Icon
          icon={isBookmarked ? 'bookmarkFill' : 'bookmarkLine'}
          size={24}
          className={clsx('cursor-pointer outline-none mt-1', isBookmarked ? 'text-primary-50' : 'text-gray-40')}
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
