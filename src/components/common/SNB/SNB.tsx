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

const navSections = [
  {
    label: 'MY 활동',
    href: '/my',
  },
  {
    label: '작성 글',
    href: '/my/posts',
  },
  {
    label: '계정',
    href: '/my/account/profile', // 대표 메뉴는 계정관리
    children: [
      { label: '계정관리', href: '/my/account/profile' },
      { label: '알림관리', href: '/my/account/notification' },
    ],
  },
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
          <Avatar className="!size-20" />
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
              {index < Jobs.length - 1 && <Divider vertical className="!h-3" />}
            </li>
          ))}
        </ul>
      </section>

      {/* 메뉴 영역 */}
      <nav className="flex flex-col flex-1 pt-[26px]" aria-label="내 메뉴">
        <ul className="flex flex-col gap-3">
          {navSections.map(({ label, href, children }) => {
            // 현재 경로가 해당 섹션이거나, 자식 라우트 중 하나일 경우 활성화로 판단
            const isActive =
              pathname === href || (children && children.some((child) => pathname.startsWith(child.href)));

            // 자식 메뉴 개수 (없으면 0)
            const numberOfChildren = children?.length ?? 0;

            // 활성화되었고 자식이 있을 경우 전체 높이 계산 (상단 34px + gap 4px + 자식당 30px씩)
            // 비활성화거나 자식이 없으면 기본 높이 34px
            const liHeight = isActive && numberOfChildren > 0 ? 34 + 4 + numberOfChildren * 30 : 34;
            return (
              <li
                key={href}
                className={clsx('flex flex-col justify-center h-[34px] px-2 py-1', isActive && `gap-1`)}
                style={{ height: liHeight }}
              >
                <Link href={href} aria-current={isActive ? 'page' : undefined}>
                  <Typography
                    type="Headline1SemiBold"
                    className={clsx(isActive ? 'text-gray-90 h-[34px]' : 'text-gray-40', 'hover:text-gray-90')}
                  >
                    {label}
                  </Typography>
                </Link>

                {/* 소분류 렌더링 */}
                {children && isActive && (
                  <ul className="flex flex-col">
                    {children.map(({ label: subLabel, href: subHref }) => {
                      const isSubActive = pathname === subHref;
                      return (
                        <li key={subHref} className="flex flex-col h-[30px] justify-center">
                          <Link href={subHref}>
                            <Typography
                              type="Body2Semibold"
                              className={clsx(isSubActive ? 'text-gray-90' : 'text-gray-40', 'hover:text-gray-90')}
                            >
                              {subLabel}
                            </Typography>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default SNB;
