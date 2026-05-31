/** @format */

"use client";
import Button from "@/components/common/Button/Button";
import Search from "@/components/common/Field/Search";
import Avatar from "@/components/common/GNB/pc/Avatar";
import GNBMenu from "@/components/common/GNB/pc/GNBMenu";
import Icon from "@/components/common/Icon/Icon";
import { GNBNavigationMenus } from "@/constants/menus";
import { useAuthClient } from "@/contexts/AuthContext";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

interface GNBProps {
  isLogin: boolean;
}

const GNB = ({ isLogin = false }: GNBProps) => {
  const { isAuthenticated } = useAuthClient();

  return (
    <header className="w-full border-b border-gray-20">
      <div
        className={clsx(
          "max-w-[1440px] h-[58px] mx-auto flex items-center justify-between px-[170px] py-3 gap-[44.5px]",
          !isLogin && "!gap-12",
        )}
      >
        {/* 로고 및 메뉴 */}
        <div className="flex items-center gap-[54px]">
          <Link href="/" aria-label="PickLab 홈">
            <Image
              src="/imgs/logo.png"
              width={93}
              height={22}
              alt="PickLab 로고"
            />
          </Link>
          <nav aria-label="메인 메뉴">
            <ul className="flex gap-7">
              {GNBNavigationMenus.map((menu) => (
                <li key={menu.label}>
                  <GNBMenu href={menu.href}>{menu.label}</GNBMenu>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* 검색 및 아이콘 */}
        <div className="flex items-center gap-6">
          <Search
            status="default"
            rounded
            wrapperClassName="w-[280px]"
            className="!w-[280px] !h-[36px] !rounded-full !px-[18px] !py-0 placeholder:!text-gray-40"
            placeholder="활동을 검색해보세요"
          />
        </div>
        {isAuthenticated ? (
          <nav aria-label="유저 메뉴">
            <ul className="flex items-center gap-4">
              <li>
                <Link href="/calendar" aria-label="일정">
                  <Icon size={24} icon="calendar" />
                </Link>
              </li>
              <li>
                <Link href="/write" aria-label="글쓰기">
                  <Icon size={24} icon="pencil" />
                </Link>
              </li>
              <li>
                <Link href="/notifications" aria-label="알림">
                  <Icon size={20} icon="largeCowBell" />
                </Link>
              </li>
              <li className="flex items-center gap-4">
                <Link href="/profile" aria-label="프로필">
                  <Avatar className="size-6" />
                </Link>
              </li>
            </ul>
          </nav>
        ) : (
          <div className="flex gap-space-10">
            <Link href="/signin" aria-label="로그인">
              <Button label="로그인" buttonStyle="outlined" size="sm" />
            </Link>
            <Link href="/signup" aria-label="회원가입">
              {" "}
              <Button label="회원가입" buttonStyle="filled" size="sm" />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default GNB;
