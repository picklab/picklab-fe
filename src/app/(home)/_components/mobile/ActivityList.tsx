'use client';

import Typography from '@/components/common/Typography';
import Card from '@/components/common/Card/mobile/Card';
import MoList from '@/components/common/List/mobile/MoList';
import clsx from 'clsx';

import Select from '@/components/common/Select/Select';

interface ActivityListProps {
  title: string;
  type?: 'card' | 'list';
  className?: string;
  isSelect?: boolean;
}

export default function ActivityList({ title, type = 'card', className, isSelect }: ActivityListProps) {
  return (
    <div className={clsx('w-full flex flex-col gap-3', className)}>
      <Typography type="Headline1SemiBold">{title}</Typography>
      {isSelect && (
        <div className="flex gap-2">
          <Select
            size="xsmall"
            width="xsmall"
            type="checkbox"
            functionOptionType="reset"
            className="!rounded-full !w-[98px] !h-[34px]"
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
      )}

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
