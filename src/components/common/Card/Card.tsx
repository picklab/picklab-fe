'use client';

import React from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import Icon from '@/components/common/Icon/Icon';
import Chip from '@/components/common/Card/Chip';
import JobChip from '@/components/common/Card/JobChip';
import Typography from '@/components/common/Typography';
import CardDayBadge from '@/components/common/Card/CardDayBadge';

interface CardProps {
  imageUrl: string;
  badgeText: string;
  badgeVariant: 'default' | 'deadline' | 'intended';
  isBookmarked: boolean;
  chipText: string;
  companyName: string;
  title: string;
  jobs: ('기획' | '개발' | '마케팅' | '디자인' | 'AI')[];
  onBookmarkClick?: (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => void;
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
  jobs,
  onBookmarkClick,
  onCardClick,
}: CardProps) => {
  return (
    <div
      onClick={onCardClick}
      aria-label={`카드: ${title}`}
      className="flex flex-col w-[250px] h-[358px] rounded-[10px] bg-white cursor-pointer"
    >
      {/* 이미지 영역 */}
      <div className="relative w-full h-[180px] overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          width={250}
          height={180}
          className="w-full h-full object-cover rounded-[10px]"
        />
        <CardDayBadge text={badgeText} variant={badgeVariant} className="absolute top-4 left-4" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmarkClick?.(e);
          }}
          aria-pressed={isBookmarked}
          aria-label={isBookmarked ? '북마크 취소' : '북마크 추가'}
          className="absolute top-4 right-4 z-20"
        >
          <Icon
            icon={isBookmarked ? 'bookmarkFill' : 'bookmarkLine'}
            className={clsx('w-6 h-6', isBookmarked ? 'text-primary-50' : 'text-gray-10')}
          />
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex flex-col px-space-8 py-space-20 gap-space-6">
        <Chip text={chipText} />
        <div className="flex flex-col gap-space-16">
          <div className="flex flex-col gap-space-6">
            <div className="text-gray-90 overflow-hidden line-clamp-2 max-w-[222px]">
              <Typography type="Body1Semibold">{title}</Typography>
            </div>
            <Typography
              type="Body4Regular"
              className="text-gray-50 overflow-hidden text-ellipsis whitespace-nowrap max-w-[222px]"
            >
              {companyName}
            </Typography>
          </div>
          <div className="flex gap-1">
            {jobs.map((job) => (
              <JobChip key={job} job={job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
