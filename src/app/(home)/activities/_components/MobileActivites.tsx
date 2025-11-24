'use client';
import { useState } from 'react';
import MobileFilterSheet from './MobileFilterSheet';

import clsx from 'clsx';
import Typography from '@/components/common/Typography';
import Link from 'next/link';
import MobileActivityList from './MobileActivityList';

export default function MobileActivites() {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [snbMenu, setSnbMenu] = useState<MenuId>('all');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const openSheet = () => setIsSheetOpen(true);
  const closeSheet = () => setIsSheetOpen(false);

  return (
    <div className="pc:hidden">
      <MobileFilterSheet
        isOpen={isSheetOpen}
        onClose={closeSheet}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />
      <ArchiveMenu snbMenu={snbMenu} setSnbMenu={setSnbMenu} />
      <MobileActivityList isSelect onFilterClick={openSheet} />
    </div>
  );
}

const MENU_ITEMS = [
  { id: 'all', label: '전체', href: '#all' },
  { id: 'external-activity', label: '대외활동', href: '#external-activity' },
  { id: 'seminar', label: '강연/세미나', href: '#seminar' },
  { id: 'education', label: '교육', href: '#education' },
  { id: 'contest', label: '공모전/해커톤', href: '#contest' },
] as const;

type MenuId = (typeof MENU_ITEMS)[number]['id'];

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
