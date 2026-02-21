'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/common/Card/Card';
import ChevronLeft from '@/components/common/Icon/assets/ChevronLeft';
import ChevronRight from '@/components/common/Icon/assets/ChevronRight';
import Typography from '@/components/common/Typography';
import ListItem from '@/components/common/List/ListItem';
import { ListItemData, CardData } from '../constant';

interface ActivityListProps {
  title: string;
  type?: 'card' | 'list';
}

export default function ActivityList({ title, type = 'card' }: ActivityListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
        {Array.from({ length: CardData.length }).map((_, index) =>
          type === 'card' ? (
            <Card
              key={index}
              imageUrl={CardData[index].thumbnailImage || '/imgs/cat.jpg'}
              chipText="공모전/해커톤"
              badgeText={CardData[index].registrationPeriod}
              badgeVariant="default"
              isBookmarked={false}
              companyName={CardData[index].companyType}
              title={CardData[index].title}
              jobs={CardData[index].activityField
                .split(';')
                .map((job) => job.trim())
                .filter((job) => ['기획', '개발', '마케팅', '디자인', 'AI', '마케터', '기타'].includes(job)) as (
                | '기획'
                | '개발'
                | '마케팅'
                | '디자인'
                | 'AI'
                | '마케터'
                | '기타'
              )[]}
              onBookmarkClick={() => {}}
              onCardClick={() => router.push(CardData[index].detailLink)}
            />
          ) : (
            <ListItem
              key={index}
              thumbnail={ListItemData[index].thumbnailImage || '/imgs/cat.jpg'}
              title={ListItemData[index].title}
              label={ListItemData[index].organizer}
              chipTitle="공모전/해커톤"
              organization={ListItemData[index].organizer}
              startDate={new Date(ListItemData[index].activityPeriod.split(' ~ ')[0])}
              endDate={new Date(ListItemData[index].activityPeriod.split(' ~ ')[1])}
              isFinished={false}
              onListClick={() => router.push(CardData[index].detailLink)}
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
