/** @format */

"use client";
import { useState } from "react";
import MobileFilterSheet from "./MobileFilterSheet";

import clsx from "clsx";
import Typography from "@/components/common/Typography";
import MobileActivityList from "./MobileActivityList";
import Search from "@/components/common/Field/Search";
import type { ActivityMenuId, ActivityPageFilters, ActivityRouteSlug } from "@/lib/activity-data";

function getInitialMenu(activitySlug: ActivityRouteSlug): ActivityMenuId {
  if (activitySlug === "activities") return "external-activity";
  return activitySlug;
}

export default function MobileActivites({ activitySlug }: { activitySlug: ActivityRouteSlug }) {
  const [selectedFilters, setSelectedFilters] = useState<ActivityPageFilters>({});
  const [snbMenu, setSnbMenu] = useState<ActivityMenuId>(getInitialMenu(activitySlug));
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
      <div className="py-[13px]">
        <Search
          status="default"
          wrapperClassName="w-full"
          className="!w-full !rounded-[6px] !border-[#00BC7D] hover:!border-[#00BC7D] active:!border-[#00BC7D] focus:!border-[#00BC7D]"
          iconClassName="!text-[#00BC7D]"
          placeholder="찾고 싶은 활동을 검색해보세요"
        />
      </div>
      <ArchiveMenu snbMenu={snbMenu} setSnbMenu={setSnbMenu} />
      <MobileActivityList
        activeMenu={snbMenu}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        onFilterClick={openSheet}
      />
    </div>
  );
}

const MENU_ITEMS = [
  { id: "all", label: "전체", href: "#all" },
  { id: "external-activity", label: "대외활동", href: "#external-activity" },
  { id: "seminar", label: "강연/세미나", href: "#seminar" },
  { id: "education", label: "교육", href: "#education" },
  { id: "contest", label: "공모전/해커톤", href: "#contest" },
] as const;

interface ArchiveMenuProps {
  snbMenu: ActivityMenuId;
  setSnbMenu: (menu: ActivityMenuId) => void;
}

function ArchiveMenu({ snbMenu, setSnbMenu }: ArchiveMenuProps) {
  return (
    <div className="relative flex flex-row w-full h-[35px] overflow-x-auto hide-scrollbar before:absolute before:left-0 before:right-0 before:bottom-0 before:h-[1.5px] before:bg-gray-30 before:content-['']">
      {MENU_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          id={item.id}
          className={clsx(
            "relative box-border flex justify-center items-center",
            snbMenu === item.id &&
              "after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[3px] after:translate-y-1/2 after:bg-primary-50 after:content-['']"
          )}
          onClick={() => setSnbMenu(item.id)}
        >
          <Typography className="w-[86px] text-center" type="Body2Medium">
            {item.label}
          </Typography>
        </button>
      ))}
    </div>
  );
}
