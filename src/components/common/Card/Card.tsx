'use client';

import React from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import Badge from '@/components/common/Card/Badge';
import Icon from '@/components/common/Icon/Icon';
import Chip from '@/components/common/Card/Chip';
import JobChip from '@/components/common/Card/JobChip';
import Typography from '@/components/common/Typography';

interface CardProps {
  imageUrl: string;
  badgeText: string;
  badgeVariant: 'default' | 'deadline' | 'intended';
  isBookmarked: boolean;
  chipText: string;
  companyName: string;
  title: string;
  job: '기획' | '개발' | '마케팅' | '디자인' | 'AI';
  onBookmarkClick?: () => void;
  onCardClick: () => void;
}

const Card = ({
  imageUrl,
  badgeText,
  badgeVariant,
  isBookmarked,
  chipText,
  companyName,
  title,
  job,
  onBookmarkClick,
  onCardClick,
}: CardProps) => {
  return (
    <div
      onClick={onCardClick}
      className="flex flex-col gap-[15px] w-[250px] h-[321px] rounded-[10px] bg-white shadow-md group cursor-pointer"
    >
      {/* 이미지 영역 */}
      <div className="relative w-full h-[200px] overflow-hidden transition-transform duration-300 group-hover:-translate-y-space-10">
        <Image
          src={imageUrl}
          alt={title}
          width={250}
          height={200}
          className="w-full h-full object-cover rounded-[10px]"
        />
        <Badge text={badgeText} variant={badgeVariant} className="absolute top-[18px] left-5" />
        <button onClick={onBookmarkClick} className="absolute top-[18px] right-5">
          <Icon
            icon={isBookmarked ? 'bookmarkFill' : 'bookmarkLine'}
            className={clsx('w-6 h-6', isBookmarked ? 'text-primary-50' : 'text-gray-0')}
          />
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex flex-col px-1 gap-space-6">
        <Chip text={chipText} />
        <div className="flex flex-col gap-space-12">
          <div className="flex flex-col">
            <Typography type="Body4Medium" className="text-gray-50 overflow-hidden text-ellipsis whitespace-nowrap">
              {companyName}
            </Typography>
            <Typography type="Body1Semibold" className="text-gray-90 overflow-hidden line-clamp-2">
              {title}
            </Typography>
          </div>

          <JobChip job={job} />
        </div>
      </div>
    </div>
  );
};

export default Card;
