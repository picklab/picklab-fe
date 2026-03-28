'use client';
import { useState } from 'react';
import Card from '@/components/common/Card/Card';
import Typography from '@/components/common/Typography';
import SortTab from '@/components/common/Tab/SortTab';
import Select from '@/components/common/Select/Select';
import ChevronIconButton from '@/components/common/Pagination/ChevronIconButton';

interface NewActivityListProps {
  title: string;
}

const CARDS_PER_PAGE = 4;

const MOCK_CARDS = Array.from({ length: 10 }).map((_, index) => ({
  key: index,
  imageUrl: '/imgs/cat.jpg',
  chipText: '공모전/해커톤' as const,
  badgeText: 'D-01',
  badgeVariant: 'default' as const,
  isBookmarked: false,
  companyName: '삼양 그룹',
  title: '2025 삼양그룹 대학생 서포터즈 Samyang Seeds 9기',
  jobs: ['개발'] as ('개발')[],
}));

export default function NewActivityList({ title }: NewActivityListProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(MOCK_CARDS.length / CARDS_PER_PAGE);
  const pagedCards = MOCK_CARDS.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);

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
              placeholder="활동유형"
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
              placeholder="직무유형"
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
        {pagedCards.map((card) => (
          <Card
            key={card.key}
            imageUrl={card.imageUrl}
            chipText={card.chipText}
            badgeText={card.badgeText}
            badgeVariant={card.badgeVariant}
            isBookmarked={card.isBookmarked}
            companyName={card.companyName}
            title={card.title}
            jobs={card.jobs}
            onBookmarkClick={() => {}}
            onCardClick={() => {}}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <ChevronIconButton
            direction="left"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          />
          <Typography type="Body3Medium" className="text-gray-60">
            {page} / {totalPages}
          </Typography>
          <ChevronIconButton
            direction="right"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          />
        </div>
      )}
    </div>
  );
}
