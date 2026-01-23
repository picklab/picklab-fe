'use client';
import Card from '@/components/common/Card/Card';
import Typography from '@/components/common/Typography';
import SortTab from '@/components/common/Tab/SortTab';
import Select from '@/components/common/Select/Select';

interface NewActivityListProps {
  title: string;
}

export default function NewActivityList({ title }: NewActivityListProps) {
  return (
    <div className="w-full flex flex-col gap-[2rem]">
      <div className="flex flex-col gap-4">
        <Typography type="Heading1Bold">{title}</Typography>

        <div className="flex items-end justify-between w-full">
          <div className="flex gap-2">
            <Select
              size="small"
              width="small"
              type="checkbox"
              functionOptionType="reset"
              className="!rounded-full"
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
              className="!rounded-full"
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
          <SortTab
            options={[
              { label: '최신순', value: 'latest' },
              { label: '마감임박순', value: 'soon' },
              { label: '여유 있는순', value: 'remain' },
            ]}
          />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-5">
        {Array.from({ length: 10 }).map((_, index) => (
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
        ))}
      </div>
    </div>
  );
}
