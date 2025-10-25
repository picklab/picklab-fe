'use client';

import Typography from '@/components/common/Typography';
import ChevronRight from '@/components/common/Icon/assets/ChevronRight';

import ListItem from '@/components/common/List/ListItem';
import MobileProfile from './MobileProfile';
import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import Card from '@/components/common/Card/mobile/Card';

export default function MobileProfilePage() {
  const [snbMenu, setSnbMenu] = useState<'my-activity' | 'my-post' | 'account'>('my-activity');
  return (
    <div className="mobile:flex pc:hidden flex-col gap-4 justify-center">
      <div className="flex flex-col gap-8">
        <MobileProfile />
        {/*snb menu */}
        <div className="flex flex-row w-full h-[35px]">
          <Link
            href="#1"
            id="my-activity"
            className={clsx(
              'box-border w-full flex px-space-10  justify-center border-b-[1.5px] border-gray-30',
              snbMenu === 'my-activity' && '!border-primary-50 !border-b-[3px]',
            )}
            onClick={() => setSnbMenu('my-activity')}
          >
            <Typography type="Headline2SemiBold">MY 활동</Typography>
          </Link>
          <Link
            href="#2"
            id="my-post"
            className={clsx(
              'box-border w-full flex px-space-10 justify-center border-b-[1.5px] border-gray-30',
              snbMenu === 'my-post' && '!border-primary-50 !border-b-[3px]',
            )}
            onClick={() => setSnbMenu('my-post')}
          >
            <Typography type="Headline2SemiBold">게시물</Typography>
          </Link>
          <Link
            href="#3"
            id="account"
            className={clsx(
              'box-border w-full flex px-space-10 justify-center border-b-[1.5px] border-gray-30',
              snbMenu === 'account' && '!border-primary-50 !border-b-[3px]',
            )}
            onClick={() => setSnbMenu('account')}
          >
            <Typography type="Headline2SemiBold">계정</Typography>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-[52px]">
        <div className="flex flex-col gap-4">
          <ContentHeader title="활동 결과" onClick={() => {}} />
          <div className="flex justify-between">
            {Array.from(['지원완료', '최종합격', '불합격', '수료완료']).map((title, index) => (
              <div
                key={index}
                className="w-[77.75px] h-[80px] flex flex-col justify-center items-center border border-gray-30 rounded-[6px]"
              >
                <Typography type="Body3Medium" className="text-gray-50">
                  {title}
                </Typography>
                <Typography type="Heading1Semibold">50</Typography>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ContentHeader title="아카이브" onClick={() => {}} />
          <div className="flex flex-col gap-[3px]">
            {Array.from({ length: 2 }).map((_, index) => (
              <ListItem
                key={index}
                className="border-none"
                thumbnail="/imgs/cat.jpg"
                title="리스트 아이템 제목"
                isFinished={true}
                chipTitle="대외활동"
                organization="삼양 그룹"
                startDate={new Date('2025-05-01')}
                endDate={new Date('2025-05-15')}
                onListClick={() => {}}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ContentHeader title="저장한 공고" onClick={() => {}} />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card
                key={index}
                imageUrl="/imgs/cat.jpg"
                badgeText="대외활동"
                badgeVariant="default"
                isBookmarked={false}
                chipText="대외활동"
                companyName="삼양 그룹"
                title="리스트 아이템 제목"
                jobs={['기획', '개발', '마케팅']}
                onBookmarkClick={() => {}}
                onCardClick={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentHeader({ title, onClick }: { title: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className="w-full flex justify-between cursor-pointer">
      <Typography type="Headline2SemiBold">{title}</Typography>
      <div className="flex flex-row items-center gap-1">
        <Typography type="Body4Medium">더보기</Typography> <ChevronRight width={9} height={9} />
      </div>
    </div>
  );
}
