'use client';

import ListItem from '@/components/common/List/ListItem';
import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import useBookmarks from '@/hooks/useBookmarks';
import { toggleBookmark } from '@/lib/bookmarks';

const MENU_ITEMS = [
  { id: 'archive', label: '전체', href: '#archive' },
  { id: 'external-activity', label: '대외활동', href: '#external-activity' },
  { id: 'seminar', label: '강연/세미나', href: '#seminar' },
  { id: 'education', label: '교육', href: '#education' },
  { id: 'contest', label: '공모전/해커톤', href: '#contest' },
] as const;

type MenuId = (typeof MENU_ITEMS)[number]['id'];
type BackendBookmarkCategory = 'EXTRACURRICULAR' | 'SEMINAR' | 'EDUCATION' | 'COMPETITION';

const BACKEND_CATEGORY_BY_MENU: Partial<Record<MenuId, BackendBookmarkCategory>> = {
  'external-activity': 'EXTRACURRICULAR',
  seminar: 'SEMINAR',
  education: 'EDUCATION',
  contest: 'COMPETITION',
};

export default function MobileProfileArchivePage() {
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
    <div className="mobile:flex pc:hidden flex-col gap-[33.57px] justify-center">
      <ArchiveMenu snbMenu={snbMenu} setSnbMenu={setSnbMenu} />
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <Typography type="Body2Medium">총 {filteredAndSortedItems.length}개</Typography>
          <div className="flex gap-1.5 items-center justify-center">
            <Typography
              type="Body2Medium"
              className={clsx('mt-0.5 cursor-pointer', !isLatest && 'text-gray-40')}
              onClick={() => setSortType('latest')}
            >
              최신순
            </Typography>
            <div className="h-3 border-[0.5px]"></div>
            <Typography
              type="Body2Medium"
              className={clsx('mt-0.5 cursor-pointer', isLatest && 'text-gray-40')}
              onClick={() => setSortType('oldest')}
            >
              오래된순
            </Typography>
          </div>
        </div>
        <div className="flex flex-col gap-[3px]">
          {loading && (
            <div className="flex h-[180px] items-center justify-center bg-gray-5 rounded-lg">
              <Typography type="Body2Medium" className="text-gray-50">
                북마크 목록을 불러오는 중입니다.
              </Typography>
            </div>
          )}
          {!loading && error && (
            <div className="flex h-[180px] items-center justify-center bg-gray-5 rounded-lg">
              <Typography type="Body2Medium" className="text-gray-50">
                북마크 목록을 불러오지 못했습니다.
              </Typography>
            </div>
          )}
          {!loading && !error && filteredAndSortedItems.length === 0 && (
            <div className="flex h-[180px] items-center justify-center bg-gray-5 rounded-lg">
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
  );
}

interface ArchiveMenuProps {
  snbMenu: MenuId;
  setSnbMenu: (menu: MenuId) => void;
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
          <Typography className="w-[86px] text-center" type="Body2Medium">
            {item.label}
          </Typography>
        </Link>
      ))}
    </div>
  );
}
