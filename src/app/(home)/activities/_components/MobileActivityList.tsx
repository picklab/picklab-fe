'use client';

import Typography from '@/components/common/Typography';
import Card from '@/components/common/Card/mobile/Card';
import MoList from '@/components/common/List/mobile/MoList';
import clsx from 'clsx';

import Select from '@/components/common/Select/Select';

import Icon from '@/components/common/Icon/Icon';

interface ActivityListProps {
  title?: string;
  type?: 'card' | 'list';
  className?: string;
  isSelect?: boolean;
  typoType?: 'Headline1SemiBold' | 'Body1Medium';
  onFilterClick?: () => void;
}

export default function MobileActivityList({
  title,
  type = 'card',
  className,
  typoType = 'Headline1SemiBold',
  onFilterClick,
}: ActivityListProps) {
  return (
    <div className={clsx('w-full flex flex-col gap-3', className)}>
      <Typography type={typoType}>{title}</Typography>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        <div
          className="border border-gray-30 rounded-full cursor-pointer py-1.5 px-2 flex items-center justify-center"
          onClick={onFilterClick}
        >
          <Icon icon="threeDots" size={14} />
        </div>
        <div className="bg-primary-60 rounded-full py-1.5 px-2.5 flex items-center justify-center cursor-pointer">
          <Icon icon="largeRefresh" color="white" size={14} />
        </div>
        <Select
          size="xsmall"
          width="xsmall"
          type="checkbox"
          functionOptionType="reset"
          className="!rounded-full !w-[98px] !h-[34px]"
          placeholder="주최기관"
          options={[
            { label: '대외활동', value: 'external_activity' },
            { label: '강연/세미나', value: 'seminar' },
            { label: '교육', value: 'education' },
            { label: '공모전/해커톤', value: 'contest' },
          ]}
          onChange={() => {}}
        />
        <Select
          size="small"
          width="small"
          type="checkbox"
          functionOptionType="reset"
          placeholder="참여대상"
          className="!rounded-full !w-[98px] !h-[34px]"
          options={[
            { label: '기획', value: 'planning' },
            { label: '디자인', value: 'design' },
            { label: '개발', value: 'development' },
            { label: '마케팅', value: 'marketing' },
            { label: 'AI', value: 'ai' },
          ]}
          onChange={() => {}}
        />
        <Select
          size="small"
          width="small"
          type="checkbox"
          functionOptionType="reset"
          placeholder="활동분야"
          className="!rounded-full !w-[98px] !h-[34px]"
          options={[
            { label: '기획', value: 'planning' },
            { label: '디자인', value: 'design' },
            { label: '개발', value: 'development' },
            { label: '마케팅', value: 'marketing' },
            { label: 'AI', value: 'ai' },
          ]}
          onChange={() => {}}
        />
        <Select
          size="small"
          width="small"
          type="checkbox"
          functionOptionType="reset"
          placeholder="지역"
          className="!rounded-full !w-[98px] !h-[34px]"
          options={[
            { label: '기획', value: 'planning' },
            { label: '디자인', value: 'design' },
            { label: '개발', value: 'development' },
            { label: '마케팅', value: 'marketing' },
            { label: 'AI', value: 'ai' },
          ]}
          onChange={() => {}}
        />
        <Select
          size="small"
          width="small"
          type="checkbox"
          functionOptionType="reset"
          placeholder="직무"
          className="!rounded-full !w-[98px] !h-[34px]"
          options={[
            { label: '기획', value: 'planning' },
            { label: '디자인', value: 'design' },
            { label: '개발', value: 'development' },
            { label: '마케팅', value: 'marketing' },
            { label: 'AI', value: 'ai' },
          ]}
          onChange={() => {}}
        />
      </div>

      <div
        className={clsx('flex overflow-x-scroll hide-scrollbar w-full', type === 'card' ? 'gap-4' : 'flex-col gap-2')}
      >
        {Array.from({ length: type === 'card' ? 10 : 3 }).map((_, index) =>
          type === 'card' ? (
            <Card
              key={index}
              imageUrl={'/imgs/cat.jpg'}
              chipText="공모전/해커톤"
              badgeText="D-01"
              badgeVariant="default"
              isBookmarked={false}
              companyName="삼양 그룹"
              title="2025 삼양그룹 대학생 서포터즈 Samyang Seeds 9기"
              jobs={['개발']}
              onBookmarkClick={() => {}}
              onCardClick={() => {}}
            />
          ) : (
            <MoList
              key={index}
              imageSrc={'/imgs/cat.jpg'}
              company="삼양 그룹"
              title="2025 삼양그룹 대학생 서포터즈 Samyang Seeds 9기"
              viewCount={10}
              saveCount={10}
              isBookmarked={false}
              onListClick={() => {}}
              onBookmarkClick={() => {}}
            />
          ),
        )}
      </div>
    </div>
  );
}
