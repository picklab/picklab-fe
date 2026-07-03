'use client';

import ListItem from '@/components/common/List/ListItem';
import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import Icon from '@/components/common/Icon/Icon';
import { useRouter } from 'next/navigation';
import useArchiveActivities from '@/hooks/useArchiveActivities';

const MENU_ITEMS = [
  { id: 'archive', label: '전체', href: '#archive' },
  { id: 'external-activity', label: '대외활동', href: '#external-activity' },
  { id: 'seminar', label: '강연/세미나', href: '#seminar' },
  { id: 'education', label: '교육', href: '#education' },
  { id: 'contest', label: '공모전/해커톤', href: '#contest' },
] as const;

type MenuId = 'archive' | 'external-activity' | 'seminar' | 'education' | 'contest';
interface ArchiveMenuProps {
  snbMenu: MenuId;
  setSnbMenu: (menu: MenuId) => void;
}

const MENU_LABEL_BY_ID: Partial<Record<MenuId, string>> = {
  'external-activity': '대외활동',
  seminar: '강연/세미나',
  education: '교육',
  contest: '공모전/해커톤',
};

export default function PcProfileArchivePage({ isStorybook = false }: { isStorybook?: boolean }) {
  const router = useRouter();
  const [snbMenu, setSnbMenu] = useState<MenuId>('archive');
  const [sortType, setSortType] = useState<'latest' | 'oldest'>('latest');
  const isLatest = sortType === 'latest';
  const { data: archiveItems, loading, error } = useArchiveActivities();

  const filteredAndSortedItems = useMemo(() => {
    const menuLabel = MENU_LABEL_BY_ID[snbMenu];
    const base = menuLabel ? archiveItems.filter((item) => item.chipTitle === menuLabel) : archiveItems;

    return base.slice().sort((a, b) => {
      const aTime = a.endDate?.getTime() ?? a.startDate?.getTime() ?? 0;
      const bTime = b.endDate?.getTime() ?? b.startDate?.getTime() ?? 0;
      return isLatest ? bTime - aTime : aTime - bTime;
    });
  }, [archiveItems, isLatest, snbMenu]);

  return (
    <div className={clsx('w-full', isStorybook ? '' : 'mobile:hidden')}>
      <section className="flex flex-row items-center gap-1 mobile:w-[335px] mobile:relative mobile:py-4 mobile:border-b mobile:border-gray-20 pc:gap-2 pc:pb-0 pc:border-0 pc:w-full">
        <button type="button" onClick={() => router.push('/profile')} aria-label="마이페이지로 이동">
          <Icon icon="chevronLeft" size={16} />
        </button>
        <Typography
          type="Heading2Semibold"
          className="text-gray-90 mobile:absolute mobile:left-1/2 mobile:-translate-x-1/2"
        >
          아카이브
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
                  아카이브 활동을 불러오는 중입니다.
                </Typography>
              </div>
            )}
            {!loading && error && (
              <div className="col-span-2 flex h-[180px] items-center justify-center bg-gray-5 rounded-lg">
                <Typography type="Body2Medium" className="text-gray-50">
                  아카이브 활동을 불러오지 못했습니다.
                </Typography>
              </div>
            )}
            {!loading && !error && filteredAndSortedItems.length === 0 && (
              <div className="col-span-2 flex h-[180px] items-center justify-center bg-gray-5 rounded-lg">
                <Typography type="Body2Medium" className="text-gray-50">
                  아카이브 활동이 없습니다.
                </Typography>
              </div>
            )}
            {!loading &&
              !error &&
              filteredAndSortedItems.map((item) => (
                <ListItem
                  key={item.id}
                  className="border-none"
                  thumbnail={item.thumbnail}
                  title={item.title}
                  isFinished
                  chipTitle={item.chipTitle}
                  organization={item.organization}
                  startDate={item.startDate}
                  endDate={item.endDate}
                  statusText={item.statusText}
                  onListClick={() => router.push(`/profile/archive/${item.id}`)}
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
    <div className="h-[35px] w-full overflow-x-auto hide-scrollbar">
      {/* 전체 폭 하단 divider(before) + 선택 탭 밑줄(after) */}
      <div className="relative flex h-full w-max min-w-full flex-row before:absolute before:left-0 before:right-0 before:bottom-0 before:h-[1.5px] before:bg-gray-30 before:content-['']">
        {MENU_ITEMS.map((item) => {
          const active = snbMenu === item.id;
          return (
            <button
              key={item.id}
              type="button"
              id={item.id}
              onClick={() => setSnbMenu(item.id)}
              className={clsx(
                'relative flex shrink-0 items-center justify-center',
                active &&
                  "after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[3px] after:bg-primary-50 after:content-['']",
              )}
            >
              <Typography
                className={clsx('px-9 text-center', active ? 'text-gray-90' : 'text-gray-40')}
                type="Heading2Medium"
              >
                {item.label}
              </Typography>
            </button>
          );
        })}
      </div>
    </div>
  );
}
