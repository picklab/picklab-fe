'use client';

import ListItem from '@/components/common/List/ListItem';
import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/common/Icon/Icon';
import { useRouter } from 'next/navigation';
import { toggleBookmark } from '@/lib/bookmarks';
import useBookmarks from '@/hooks/useBookmarks';

const MENU_ITEMS = [
  { id: 'archive', label: '전체', href: '#archive' },
  { id: 'external-activity', label: '대외활동', href: '#external-activity' },
  { id: 'seminar', label: '강연/세미나', href: '#seminar' },
  { id: 'education', label: '교육', href: '#education' },
  { id: 'contest', label: '공모전/해커톤', href: '#contest' },
] as const;

type MenuId = 'archive' | 'external-activity' | 'seminar' | 'education' | 'contest';
type BackendBookmarkCategory = 'EXTRACURRICULAR' | 'SEMINAR' | 'EDUCATION' | 'COMPETITION';
interface ArchiveMenuProps {
  snbMenu: MenuId;
  setSnbMenu: (menu: MenuId) => void;
}

const BACKEND_CATEGORY_BY_MENU: Partial<Record<MenuId, BackendBookmarkCategory>> = {
  'external-activity': 'EXTRACURRICULAR',
  seminar: 'SEMINAR',
  education: 'EDUCATION',
  contest: 'COMPETITION',
};

export default function PcProfileArchivePage({ isStorybook = false }: { isStorybook?: boolean }) {
  const router = useRouter();
  const [snbMenu, setSnbMenu] = useState<MenuId>('archive');
  const [sortType, setSortType] = useState<'latest' | 'oldest'>('latest');
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const isLatest = sortType === 'latest';
  const { data: bookmarkedItems, loading, error } = useBookmarks({
    activityType: BACKEND_CATEGORY_BY_MENU[snbMenu],
  });

  const filteredAndSortedItems = useMemo(() => {
    const base = bookmarkedItems.filter((item) => !removedIds.includes(item.id));
    return isLatest ? base : base.slice().reverse();
  }, [bookmarkedItems, isLatest, removedIds]);

  const handleBookmarkClick = async (activityId: string) => {
    try {
      await toggleBookmark({ activityId, isBookmarked: true });
      setRemovedIds((prev) => [...prev, activityId]);
    } catch (err) {
      const message = err instanceof Error ? err.message : '북마크 처리 중 오류가 발생했습니다.';
      window.alert(message);
    }
  };

  return (
    <div className={clsx('w-full', isStorybook ? '' : 'mobile:hidden')}>
      <section className="flex flex-row items-center gap-1 mobile:w-[335px] mobile:relative mobile:py-4 mobile:border-b mobile:border-gray-20 pc:gap-2 pc:pb-0 pc:border-0 pc:w-full">
        <Icon icon="chevronLeft" size={16} />
        <Typography
          type="Heading2Semibold"
          className="text-gray-90 mobile:absolute mobile:left-1/2 mobile:-translate-x-1/2"
        >
          프로필 수정
        </Typography>
      </section>
      <div className="pc:flex mobile:hidden flex-col gap-8 justify-center mt-[42px]">
        <ArchiveMenu snbMenu={snbMenu} setSnbMenu={setSnbMenu} />
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Typography type="Body2Medium">총 {filteredAndSortedItems.length}개</Typography>
            <div className="flex gap-2 items-center justify-center">
              <Typography
                type="Body2Medium"
                className={clsx('cursor-pointer', !isLatest && 'text-gray-40')}
                onClick={() => setSortType('latest')}
              >
                최신순
              </Typography>
              <div className="h-3 border-[0.5px]"></div>
              <Typography
                type="Body2Medium"
                className={clsx('cursor-pointer', isLatest && 'text-gray-40')}
                onClick={() => setSortType('oldest')}
              >
                오래된순
              </Typography>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {loading && (
              <div className="col-span-2 flex h-[180px] items-center justify-center bg-gray-5 rounded-lg">
                <Typography type="Body2Medium" className="text-gray-50">
                  북마크 목록을 불러오는 중입니다.
                </Typography>
              </div>
            )}
            {!loading && error && (
              <div className="col-span-2 flex h-[180px] items-center justify-center bg-gray-5 rounded-lg">
                <Typography type="Body2Medium" className="text-gray-50">
                  북마크 목록을 불러오지 못했습니다.
                </Typography>
              </div>
            )}
            {!loading && !error && filteredAndSortedItems.length === 0 && (
              <div className="col-span-2 flex h-[180px] items-center justify-center bg-gray-5 rounded-lg">
                <Typography type="Body2Medium" className="text-gray-50">
                  북마크한 활동이 없습니다.
                </Typography>
              </div>
            )}
            {!loading &&
              !error &&
              filteredAndSortedItems.map((item) => (
                <ListItem
                  key={item.id}
                  className="border-none"
                  thumbnail={item.thumbnailImage || '/imgs/cat.jpg'}
                  title={item.title}
                  isFinished={false}
                  isBookmarked
                  organization={item.organizer}
                  saveCount={item.saveCount}
                  viewCount={item.viewCount}
                  onListClick={() => router.push(item.detailLink)}
                  onBookmarkClick={() => handleBookmarkClick(item.id)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArchiveMenu({ snbMenu, setSnbMenu }: ArchiveMenuProps) {
  return (
    <div className="flex flex-row w-full h-[35px] overflow-x-auto hide-scrollbar">
      {MENU_ITEMS.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          id={item.id}
          className={clsx(
            'box-border flex justify-center items-center border-b-[1.5px] border-gray-30',
            snbMenu === item.id && '!border-primary-50 !border-b-[3px]',
          )}
          onClick={() => setSnbMenu(item.id)}
        >
          <Typography className="px-9 text-center" type="Heading2Medium">
            {item.label}
          </Typography>
        </Link>
      ))}
    </div>
  );
}
