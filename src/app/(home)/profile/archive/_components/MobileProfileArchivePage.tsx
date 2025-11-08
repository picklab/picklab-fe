'use client';

import ListItem from '@/components/common/List/ListItem';
import type { CardChipProps } from '@/components/common/Card/CardChip';
import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const MENU_ITEMS = [
  { id: 'archive', label: '전체', href: '#archive' },
  { id: 'external-activity', label: '대외활동', href: '#external-activity' },
  { id: 'seminar', label: '강연/세미나', href: '#seminar' },
  { id: 'education', label: '교육', href: '#education' },
  { id: 'contest', label: '공모전/해커톤', href: '#contest' },
] as const;

type MenuId = (typeof MENU_ITEMS)[number]['id'];
type ArchiveCategory = Exclude<MenuId, 'archive'>;

const MENU_LABEL_BY_ID: Record<ArchiveCategory, CardChipProps['text']> = {
  'external-activity': '대외활동',
  seminar: '강연/세미나',
  education: '교육',
  contest: '공모전/해커톤',
};

type ArchiveItem = {
  id: string;
  title: string;
  category: ArchiveCategory;
  organization: string;
  startDate: Date;
  endDate: Date;
  thumbnail: string;
  isFinished: boolean;
};

const MOCK_ITEMS: ArchiveItem[] = [
  {
    id: '1',
    title: '리스트 아이템 제목 A',
    category: 'external-activity',
    organization: '삼양 그룹',
    startDate: new Date('2025-05-01'),
    endDate: new Date('2025-05-15'),
    thumbnail: '/imgs/cat.jpg',
    isFinished: true,
  },
  {
    id: '2',
    title: '리스트 아이템 제목 B',
    category: 'seminar',
    organization: '네이버',
    startDate: new Date('2025-04-10'),
    endDate: new Date('2025-04-12'),
    thumbnail: '/imgs/cat.jpg',
    isFinished: true,
  },
  {
    id: '3',
    title: '리스트 아이템 제목 C',
    category: 'education',
    organization: '토스',
    startDate: new Date('2025-03-01'),
    endDate: new Date('2025-03-31'),
    thumbnail: '/imgs/cat.jpg',
    isFinished: true,
  },
  {
    id: '4',
    title: '리스트 아이템 제목 D',
    category: 'contest',
    organization: '카카오',
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-02-15'),
    thumbnail: '/imgs/cat.jpg',
    isFinished: true,
  },
];

export default function MobileProfileArchivePage() {
  const [snbMenu, setSnbMenu] = useState<MenuId>('archive');
  const [sortType, setSortType] = useState<'latest' | 'oldest'>('latest');
  const isLatest = sortType === 'latest';
  const filteredAndSortedItems = useMemo(() => {
    const base = snbMenu === 'archive' ? MOCK_ITEMS : MOCK_ITEMS.filter((item) => item.category === snbMenu);
    return base.slice().sort((a, b) => {
      const aTime = a.endDate.getTime();
      const bTime = b.endDate.getTime();
      return isLatest ? bTime - aTime : aTime - bTime;
    });
  }, [snbMenu, isLatest]);
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
          {filteredAndSortedItems.map((item) => (
            <ListItem
              key={item.id}
              className="border-none"
              thumbnail={item.thumbnail}
              title={item.title}
              isFinished={item.isFinished}
              chipTitle={MENU_LABEL_BY_ID[item.category]}
              organization={item.organization}
              startDate={item.startDate}
              endDate={item.endDate}
              onListClick={() => {}}
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
