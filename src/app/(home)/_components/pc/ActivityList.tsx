'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/common/Card/Card';
import ChevronLeft from '@/components/common/Icon/assets/ChevronLeft';
import ChevronRight from '@/components/common/Icon/assets/ChevronRight';
import Typography from '@/components/common/Typography';
import ListItem from '@/components/common/List/ListItem';
import { ListItemData, CardData } from '../constant';
import { extractActivityId, toggleBookmark } from '@/lib/bookmarks';
import { useActivities, type ActivityEndpoint } from '@/hooks/useActivities';

interface ActivityListProps {
  title: string;
  type?: 'card' | 'list';
  endpoint?: ActivityEndpoint;
}

export default function ActivityList({ title, type = 'card', endpoint }: ActivityListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});
  const { data: apiData, loading } = useActivities(endpoint ?? 'recommendations');

  // 카드 1개 너비(+gap) 만큼만 스크롤해 "한 칸씩" 이동 (인기/추천/최근 동일 인터랙션, 속도는 smooth 유지)
  const scrollByOneCard = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const items = container.children;
    const step =
      items.length > 1
        ? (items[1] as HTMLElement).offsetLeft - (items[0] as HTMLElement).offsetLeft
        : (container.firstElementChild as HTMLElement)?.clientWidth ?? 300;
    container.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' });
  };

  const scrollLeft = () => scrollByOneCard('left');
  const scrollRight = () => scrollByOneCard('right');

  const handleBookmarkToggle = async (activityId: string) => {
    const current = bookmarkedMap[activityId] ?? false;
    try {
      const result = await toggleBookmark({ activityId, isBookmarked: current });
      setBookmarkedMap((prev) => ({ ...prev, [activityId]: result.isBookmarked }));
    } catch (error) {
      const message = error instanceof Error ? error.message : '북마크 처리 중 오류가 발생했습니다.';
      window.alert(message);
    }
  };

  // API 데이터가 있으면 사용, 없으면 mock 데이터 fallback
  const hasApiData = !loading && apiData.length > 0;
  const showEmptyRecentlyViewed = endpoint === 'recently-viewed' && !loading && apiData.length === 0;
  const shouldUseFallback = !loading && apiData.length === 0 && endpoint !== 'recently-viewed';

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex justify-between items-center py-[1px]">
        <Typography type="Heading1Bold">{title}</Typography>
        <div className="flex gap-2">
          <ChevronIconButton direction="left" onClick={scrollLeft} />
          <ChevronIconButton direction="right" onClick={scrollRight} />
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-scroll hide-scrollbar w-full"
      >
        {hasApiData
          ? apiData.map((item) => {
              const isBookmarked = bookmarkedMap[item.id] ?? false;
              return type === 'card' ? (
                <Card
                  key={item.id}
                  imageUrl={item.thumbnailImage || '/imgs/cat.jpg'}
                  chipText={(item.activityType as '대외활동' | '강연/세미나' | '교육' | '공모전/해커톤') || '대외활동'}
                  badgeText={item.registrationPeriod}
                  badgeVariant="default"
                  isBookmarked={isBookmarked}
                  companyName={item.organizer}
                  title={item.title}
                  jobs={item.jobs as ('기획' | '개발' | '마케팅' | '디자인' | 'AI')[]}
                  onBookmarkClick={() => handleBookmarkToggle(item.id)}
                  onCardClick={() => router.push(item.detailLink)}
                />
              ) : (
                <ListItem
                  key={item.id}
                  thumbnail={item.thumbnailImage || '/imgs/cat.jpg'}
                  title={item.title}
                  label={item.organizer}
                  chipTitle={(item.activityType as '대외활동' | '강연/세미나' | '교육' | '공모전/해커톤') || '대외활동'}
                  organization={item.organizer}
                  startDate={item.activityPeriod ? new Date(item.activityPeriod.split(' ~ ')[0]) : new Date()}
                  endDate={item.activityPeriod ? new Date(item.activityPeriod.split(' ~ ')[1] || item.activityPeriod.split(' ~ ')[0]) : new Date()}
                  isFinished={false}
                  isBookmarked={isBookmarked}
                  onListClick={() => router.push(item.detailLink)}
                  onBookmarkClick={() => handleBookmarkToggle(item.id)}
                  saveCount={item.saveCount}
                  viewCount={item.viewCount}
                />
              );
            })
          : null}
        {showEmptyRecentlyViewed ? (
          <div className="flex h-[240px] w-full items-center justify-center rounded-lg bg-gray-5">
            <Typography type="Body2Medium" className="text-gray-50">
              아직 본 활동이 없습니다. 관심 있는 공고를 눌러보면 이곳에 다시 표시됩니다.
            </Typography>
          </div>
        ) : null}
        {shouldUseFallback
          ? CardData.map((item, index) =>
              (() => {
                const activityId = extractActivityId(item.detailLink);
                const isBookmarked = activityId ? bookmarkedMap[activityId] ?? false : false;

                return type === 'card' ? (
                  <Card
                    key={index}
                    imageUrl={item.thumbnailImage || '/imgs/cat.jpg'}
                    chipText="공모전/해커톤"
                    badgeText={item.registrationPeriod}
                    badgeVariant="default"
                    isBookmarked={isBookmarked}
                    companyName={item.companyType}
                    title={item.title}
                    jobs={item.activityField
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
                    onBookmarkClick={() => activityId && handleBookmarkToggle(activityId)}
                    onCardClick={() => router.push(item.detailLink)}
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
                    isBookmarked={isBookmarked}
                    onListClick={() => router.push(item.detailLink)}
                    onBookmarkClick={() => activityId && handleBookmarkToggle(activityId)}
                    saveCount={10}
                    viewCount={100}
                  />
                );
              })(),
            )
          : null}
      </div>
    </div>
  );
}

const ChevronIconButton = ({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-[4px] border-gray-20 border flex items-center justify-center hover:bg-gray-5 transition-colors"
    >
      {direction === 'left' ? (
        <ChevronLeft color="#101828" height={13.5} />
      ) : (
        <ChevronRight color="#101828" height={13.5} />
      )}
    </button>
  );
};
