'use client';

import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import ActivityList from '../../_components/mobile/ActivityList';
import Button from '@/components/common/Button/Button';

// 스타일 상수
const MOBILE_STYLES = {
  CONTAINER: 'flex flex-col pb-[113px]',
  FIRST_SECTION: 'mt-5',
  SECOND_SECTION: 'mt-10',
  THIRD_SECTION: 'mt-[60px]',
} as const;

const MENU_ITEMS = [
  { id: 'all', label: '전체', href: '#all' },
  { id: 'external-activity', label: '대외활동', href: '#external-activity' },
  { id: 'seminar', label: '강연/세미나', href: '#seminar' },
  { id: 'education', label: '교육', href: '#education' },
  { id: 'contest', label: '공모전/해커톤', href: '#contest' },
] as const;

type MenuId = (typeof MENU_ITEMS)[number]['id'];

export default function MobileSearchPage({ search }: { search: string }) {
  console.log(search);
  const [snbMenu, setSnbMenu] = useState<MenuId>('all');

  return (
    <div className="mobile:flex pc:hidden flex-col gap-[33.57px] justify-center">
      <Typography type="Heading1Semibold">{decodeURIComponent(search)} 검색</Typography>
      <ArchiveMenu snbMenu={snbMenu} setSnbMenu={setSnbMenu} />
      <MobileActivityList title={'대외활동'} count={60} />
      <MobileActivityList title={'강연/세미나'} count={60} />
    </div>
  );
}

function MobileActivityList({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex flex-col gap-4">
      <ActivityList title={`${title} ${count}건`} className={MOBILE_STYLES.FIRST_SECTION} typoType="Body1Medium" />
      <Button
        disabled
        label="모두 보기"
        size="base"
        buttonStyle="filled"
        className="w-[108px] h-10 !rounded-full mx-auto"
      />
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
