'use client';

import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import Image from 'next/image';
import React from 'react';

export interface MoListProps {
  imageSrc?: string;
  company: string;
  title: string;
  viewCount: number;
  saveCount: number;
  onListClick?: () => void;
  onBookmarkClick?: () => void;
  isBookmarked?: boolean;
}

const MoList = ({
  imageSrc = '/imgs/placeholder_mo_list.png',
  company,
  title,
  viewCount,
  saveCount,
  onListClick,
  onBookmarkClick,
  isBookmarked = false,
}: MoListProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onListClick?.();
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmarkClick?.();
  };

  return (
    <div
      className="flex justify-between w-[335px] h-[90px] p-3 rounded-lg border cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={onListClick}
      onKeyDown={handleKeyDown}
    >
      <div className="flex gap-3 w-[250px] h-full items-center">
        {/* image */}
        {/* 이미지 width height 뚫고 나와 왜그래? */}
        <div className="relative w-[57px] h-[64px]">
          <Image placeholder="empty" src={imageSrc} alt="리스트 썸네일" fill className="rounded-lg" />
        </div>

        <div className="flex flex-col gap-1 h-full justify-center min-w-0 flex-1">
          {/* Caption3Regular로 수정 */}
          <Typography type="Caption2Regular" className="text-gray-90 truncate">
            {company}
          </Typography>
          <Typography type="Body4Semibold" className="text-gray-90 truncate">
            {title}
          </Typography>
        </div>
      </div>
      <div className="flex flex-col gap-1 w-[38px] h-full items-center justify-center">
        <div className="flex gap-1 items-center justify-center">
          <Icon icon="eye" size={16} className="!text-gray-40" />
          <Typography type="Caption1Medium" className="text-gray-40 h-3">
            {viewCount}
          </Typography>
        </div>
        <div
          className="flex gap-1 items-center justify-center cursor-pointer"
          onClick={handleBookmarkClick}
          role="button"
          tabIndex={0}
        >
          <Icon
            icon={isBookmarked ? 'bookmarkFill' : 'bookmarkLine'}
            size={16}
            className={isBookmarked ? '!text-primary-50' : '!text-gray-40'}
          />
          <Typography type="Caption1Medium" className="text-gray-40 h-3">
            {saveCount}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default MoList;
