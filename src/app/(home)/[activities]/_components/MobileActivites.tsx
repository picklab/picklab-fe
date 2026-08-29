/** @format */

"use client";
import { useState } from "react";
import MobileFilterSheet from "./MobileFilterSheet";

import clsx from "clsx";
import Link from "next/link";
import Typography from "@/components/common/Typography";
import MobileActivityList from "./MobileActivityList";
import Search from "@/components/common/Field/Search";
import type {
  ActivityMenuId,
  ActivityPageFilters,
  ActivityRouteSlug,
} from "@/lib/activity-data";

function getInitialMenu(activitySlug: ActivityRouteSlug): ActivityMenuId {
  if (activitySlug === "activities") return "external-activity";
  return activitySlug;
}

export default function MobileActivites({
  activitySlug,
}: {
  activitySlug: ActivityRouteSlug;
}) {
  const [selectedFilters, setSelectedFilters] = useState<ActivityPageFilters>(
    {},
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const activeMenu = getInitialMenu(activitySlug);

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
      <div className="py-[13px]">
        <Search
          status="default"
          wrapperClassName="w-full"
          className="!w-full !rounded-[6px] !border-[#00BC7D] hover:!border-[#00BC7D] active:!border-[#00BC7D] focus:!border-[#00BC7D]"
          iconClassName="!text-[#00BC7D]"
          placeholder="찾고 싶은 활동을 검색해보세요"
        />
      </div>
      <CategoryTabs activitySlug={activitySlug} />
      <MobileActivityList
        activeMenu={activeMenu}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        onFilterClick={openSheet}
      />
    </div>
  );
}

// 홈 화면 탭바와 동일한 양식(라우트 이동). 홈 탭만 54px, 나머지 86px.
const CATEGORY_TABS = [
  { label: "홈", href: "/" },
  { label: "대외활동", href: "/activities" },
  { label: "강연/세미나", href: "/seminar" },
  { label: "교육", href: "/education" },
  { label: "공모전/해커톤", href: "/contest" },
] as const;

function CategoryTabs({ activitySlug }: { activitySlug: ActivityRouteSlug }) {
  return (
    <div className="h-[35px] w-full overflow-x-auto hide-scrollbar">
      <div className="relative flex h-full w-max min-w-full flex-row">
        {/* 하단 베이스라인: 활성 초록(3px)과 동일한 3px 트랙 안에 회색 1.5px를 세로 중앙 배치 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex h-[3px] items-center">
          <div className="h-[1.5px] w-full bg-gray-30" />
        </div>
        {CATEGORY_TABS.map((item) => {
          const isActive = item.href === `/${activitySlug}`;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "relative z-10 flex shrink-0 items-center justify-center",
                isActive &&
                  "after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-primary-50 after:content-['']",
              )}>
              <Typography
                className={clsx(
                  "text-center",
                  item.href === "/" ? "w-[54px]" : "w-[86px]",
                )}
                type="Body2Medium">
                {item.label}
              </Typography>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
