'use client';

import Button from '@/components/common/Button/Button';
import { Divider } from '@/components/common/Divider/Divider';
import Avatar from '@/components/common/GNB/Avatar';
import Typography from '@/components/common/Typography';
import { SNBNavigationMenus, SNBNavigationMenusType } from '@/constants/menus';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

// SNB 컴포넌트 props 타입
interface SNBProps {
  Jobs: string[]; // 관심 직무 리스트
}

const SNB = ({ Jobs }: SNBProps) => {
  const pathname = usePathname(); // 현재 경로 가져오기

  // 섹션 활성화 여부 계산 함수
  const isSectionActive = (
    pathname: string,
    href: string,
    activeHref?: string,
    children?: SNBNavigationMenusType[],
  ) => {
    // activeHref가 있고, 현재 경로가 activeHref로 시작하면 활성화
    if (activeHref && pathname.startsWith(activeHref)) return true;
    // 현재 경로가 href와 정확히 일치하면 활성화
    if (pathname === href) return true;
    // 자식 메뉴 중 현재 경로와 일치하는 것이 있으면 활성화
    if (children && children.some((child) => pathname === child.href)) return true;
    return false;
  };

  // 서브 메뉴 활성화 여부 계산 함수
  const isSubActive = (pathname: string, subHref: string) => pathname === subHref;

  return (
    <aside className="w-[260px] h-[960px] px-6 flex flex-col" aria-label="사이드 내비게이션">
      {/* 프로필 영역 */}
      <section className="flex flex-col h-[202px] pt-space-10 border-b" aria-labelledby="profile-heading">
        <div className="flex flex-col h-30 gap-[18px] items-center">
          <Avatar className="!size-20" />
          <h2 id="profile-heading" className="sr-only">
            사용자 프로필
          </h2>
          <div className="flex h-[26px] justify-center items-center ">
            <Typography type="Headline1SemiBold">닉네임</Typography>
          </div>
        </div>
        <div className="flex justify-center py-space-20">
          <Button buttonStyle="outlined" label="프로필 수정" size="sm" />
        </div>
      </section>

      {/* 관심 직무 영역 */}
      <section
        className="flex flex-col h-[118px] py-[18px] justify-center items-center gap-space-10 border-b"
        aria-labelledby="interest-heading"
      >
        <h2 id="interest-heading" className="sr-only">
          관심 직무
        </h2>
        <div className="flex h-6 justify-center items-center">
          <Typography type="Headline2SemiBold">나의 관심직무</Typography>
        </div>
        {/* 관심 직무 리스트 렌더링 */}
        <ul className="flex flex-wrap w-[200px] gap-1 justify-center items-center px-[11.5px]">
          {Jobs.map((item, index) => (
            <li key={item} className="flex items-center gap-1 h-[19px]">
              <Typography type="Caption1Regular" className="text-primary-60">
                {item}
              </Typography>
              {/* 마지막 아이템이 아니면 구분선 표시 */}
              {index < Jobs.length - 1 && <Divider vertical className="!h-3" />}
            </li>
          ))}
        </ul>
      </section>

      {/* 메뉴 영역 */}
      <nav className="flex flex-col flex-1 pt-[18px]" aria-label="내 메뉴">
        <ul className="flex flex-col">
          {SNBNavigationMenus.map(({ label, href, children, activeHref }) => {
            const active = isSectionActive(pathname, href, activeHref, children);

            return (
              <li key={href} className={clsx('flex flex-col px-2 py-space-10', active && 'gap-space-10')}>
                {/* 상위 메뉴 */}
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={clsx('flex h-[26px] items-center')}
                >
                  <Typography
                    type="Headline1SemiBold"
                    className={clsx(active ? 'text-gray-90' : 'text-gray-40', 'hover:text-gray-90')}
                  >
                    {label}
                  </Typography>
                </Link>

                {/* 소분류(자식 메뉴) 렌더링 */}
                {children && active && (
                  <ul className="flex flex-col">
                    {children.map(({ label: subLabel, href: subHref }) => (
                      <li key={subHref} className="flex flex-col justify-center py-2">
                        <Link href={subHref} className="flex flex-col h-[22px] justify-center">
                          <Typography
                            type="Body2Semibold"
                            className={clsx(
                              isSubActive(pathname, subHref) ? 'text-gray-90' : 'text-gray-40',
                              'hover:text-gray-90',
                            )}
                          >
                            {subLabel}
                          </Typography>
                        </Link>
                      </li>
                    ))}
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
