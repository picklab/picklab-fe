'use client';

import Button from '@/components/common/Button/Button';
import { Divider } from '@/components/common/Divider/Divider';
import Avatar from '@/components/common/GNB/Avatar';
import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

// const likeJobs = ['서비스 기획', 'PM/PO', '프론트엔드', '사업 개발', '데이터 분석'];

const navItems = [
  { label: 'MY 활동', href: '/my' },
  { label: '작성 글', href: '/my/posts' },
];

interface SNBProps {
  Jobs: string[];
}

const SNB = ({ Jobs }: SNBProps) => {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] h-[960px] px-6 flex flex-col" aria-label="사이드 내비게이션">
      {/* 프로필 영역 */}
      <section className="flex flex-col h-[202px] pt-space-10 border-b" aria-labelledby="profile-heading">
        <div className="flex flex-col h-30 gap-space-14 items-center">
          <Avatar className="size-20" />
          <h2 id="profile-heading" className="sr-only">
            사용자 프로필
          </h2>
          <div className="flex h-[26px] justify-center">
            <Typography type="Headline1SemiBold">닉네임</Typography>
          </div>
        </div>
        <div className="flex mx-auto pt-space-16">
          <Button buttonStyle="outlined" label="프로필 수정" size="sm" />
        </div>
      </section>

      {/* 관심 직무 영역 */}
      <section
        className="flex flex-col h-[118px] pt-[18px] pb-5 justify-center items-center gap-3 border-b"
        aria-labelledby="interest-heading"
      >
        <h2 id="interest-heading" className="sr-only">
          관심 직무
        </h2>
        <div className="flex h-6 justify-center items-center">
          <Typography type="Headline2SemiBold">나의 관심직무</Typography>
        </div>
        <ul className="flex flex-wrap w-[200px] gap-1 justify-center items-center px-[11.5px]">
          {Jobs.map((item, index) => (
            <li key={item} className="flex items-center gap-1 h-[19px]">
              <Typography type="Caption1Regular" className="text-primary-60">
                {item}
              </Typography>
              {index < Jobs.length - 1 && <Divider vertical className="h-3" />}
            </li>
          ))}
        </ul>
      </section>

      {/* 메뉴 영역 */}
      <nav className="flex flex-col flex-1 pt-[26px]" aria-label="내 메뉴">
        <ul className="flex flex-col gap-3">
          {navItems.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <li key={href} className="flex flex-col justify-center h-[34px] px-2 py-1">
                <Link href={href} aria-current={isActive ? 'page' : undefined}>
                  <Typography
                    type="Headline1SemiBold"
                    className={clsx(isActive ? 'text-gray-90' : 'text-gray-40', 'hover:text-gray-90')}
                  >
                    {label}
                  </Typography>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default SNB;
