/** @format */

"use client";
import Button from "@/components/common/Button/Button";
import Search from "@/components/common/Field/Search";
import Avatar from "@/components/common/GNB/pc/Avatar";
import GNBMenu from "@/components/common/GNB/pc/GNBMenu";
import Icon from "@/components/common/Icon/Icon";
import { GNBNavigationMenus } from "@/constants/menus";
import { useAuthClient } from "@/contexts/AuthContext";
import type { OptionGroupProps } from "@/components/common/Option/OptionGroup";
import { createSearchHistory } from "@/hooks/useSearchHistory";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

interface GNBProps {
  isLogin: boolean;
}

const GNB = ({ isLogin = false }: GNBProps) => {
  const { isAuthenticated } = useAuthClient();
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const suggestions = useSearchSuggestions(keyword);

  // 검색어 자동완성 드롭다운 (figma WordList 2582:34074)
  const optionGroupProps = useMemo<OptionGroupProps>(
    () => ({
      options: suggestions.map((suggestion) => ({ label: suggestion, value: suggestion })),
      onClickHandler: (value) => {
        if (typeof value !== "string" || !value.trim()) return;
        createSearchHistory(value.trim());
        router.push(`/search/${encodeURIComponent(value.trim())}?tab=all`);
      },
      type: "word",
      query: keyword.trim(),
      width: "full",
      // figma WordList: 검색창과 같은 폭, 검색창 아래 6px, p8, radius 8, border #E6E6E6
      className: "!mt-[6px] !w-full !rounded-[8px] !p-2 border border-[#E6E6E6] !max-h-none",
      // figma Word: p10, radius 없음
      itemClassName: "!min-h-0 !p-[10px] !rounded-none",
    }),
    [router, suggestions, keyword],
  );

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
            onChange={(e) => setKeyword(e.target.value)}
            optionGroupProps={optionGroupProps}
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
                <Link href="/review" aria-label="리뷰쓰기" className="flex items-center">
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
