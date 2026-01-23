'use client';

import { useRef } from 'react';
import Card from '@/components/common/Card/Card';
import ChevronLeft from '@/components/common/Icon/assets/ChevronLeft';
import ChevronRight from '@/components/common/Icon/assets/ChevronRight';
import Typography from '@/components/common/Typography';
import ListItem from '@/components/common/List/ListItem';

interface ActivityListProps {
  title: string;
  type?: 'card' | 'list';
}

export default function ActivityList({ title, type = 'card' }: ActivityListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300, // 한 번에 스크롤할 거리 (px)
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300, // 한 번에 스크롤할 거리 (px)
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex justify-between items-center py-[1px]">
        <Typography type="Heading1Bold">{title}</Typography>
        <div className="flex gap-2">
          <ChevronIconButton direction="left" onClick={scrollLeft} />
          <ChevronIconButton direction="right" onClick={scrollRight} />
        </div>
      </div>
      <div ref={scrollContainerRef} className="flex gap-5 overflow-x-scroll hide-scrollbar w-full">
        {Array.from({ length: 10 }).map((_, index) =>
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
            <ListItem
              key={index}
              thumbnail={'/imgs/cat.jpg'}
              title="2025 삼양그룹 대학생 서포터즈 Samyang Seeds 9기"
              label="회사명"
              chipTitle="공모전/해커톤"
              organization="삼양 그룹"
              startDate={new Date('2025-05-01')}
              endDate={new Date('2025-05-15')}
              isFinished={false}
              onListClick={() => {}}
              onBookmarkClick={() => {}}
              saveCount={10}
              viewCount={100}
            />
          ),
        )}
      </div>
    </div>
  );
}

const ChevronIconButton = ({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-[4px] border-gray-20 border flex items-center justify-center hover:bg-gray-50 transition-colors"
    >
      {direction === 'left' ? (
        <ChevronLeft color="#101828" height={13.5} />
      ) : (
        <ChevronRight color="#101828" height={13.5} />
      )}
    </button>
  );
};
