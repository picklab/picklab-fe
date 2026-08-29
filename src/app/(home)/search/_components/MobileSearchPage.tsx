/** @format */

"use client";

import Typography from "@/components/common/Typography";
import clsx from "clsx";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/common/Card/mobile/Card";
import { extractActivityId, toggleBookmark } from "@/lib/bookmarks";
import Select from "@/components/common/Select/Select";
import Icon from "@/components/common/Icon/Icon";
import useSearchActivities from "@/hooks/useSearchActivities";
import { JOB_TYPE_OPTIONS } from "@/constants/filters";

const MENU_ITEMS = [
  { id: "all", label: "전체" },
  { id: "activities", label: "대외활동" },
  { id: "seminar", label: "강연/세미나" },
  { id: "education", label: "교육" },
  { id: "contest", label: "공모전/해커톤" },
] as const;
const JOB_TYPES = ["기획", "디자인", "개발", "마케팅", "AI"] as const;

type MenuId = (typeof MENU_ITEMS)[number]["id"];

function parseDate(value?: string | null): number {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function toTabCategory(activityType: string): MenuId {
  if (activityType === "강연/세미나") return "seminar";
  if (activityType === "교육") return "education";
  if (activityType === "공모전/해커톤") return "contest";
  return "activities";
}

function getDeadlineRank(badgeText: string): number {
  if (badgeText === "마감") return Number.NEGATIVE_INFINITY;
  if (badgeText === "D-Day") return 0;
  if (badgeText.startsWith("D-")) return Number(badgeText.slice(2));
  return 999;
}

export default function MobileSearchPage({ search }: { search: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const decodedSearch = decodeURIComponent(search);
  const {
    data: searchedItems,
    loading,
    error,
  } = useSearchActivities(decodedSearch);
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>(
    {},
  );
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [sort, setSort] = useState<string>("latest");
  const requestedTab = (searchParams.get("tab") ?? "all") as MenuId;
  const activeMenu = MENU_ITEMS.some((item) => item.id === requestedTab)
    ? requestedTab
    : "all";

  const tabCounts = useMemo(() => {
    const counts: Record<MenuId, number> = {
      all: searchedItems.length,
      activities: 0,
      seminar: 0,
      education: 0,
      contest: 0,
    };

    searchedItems.forEach((item) => {
      counts[toTabCategory(item.activityType)] += 1;
    });

    return counts;
  }, [searchedItems]);

  const visibleItems = useMemo(() => {
    const tabFiltered =
      activeMenu === "all"
        ? searchedItems
        : searchedItems.filter(
            (item) => toTabCategory(item.activityType) === activeMenu,
          );

    const filtered = tabFiltered.filter((item) => {
      const matchesCategory =
        selectedCategory.length === 0 ||
        selectedCategory.includes("all") ||
        selectedCategory.includes(toTabCategory(item.activityType));

      const matchesJob =
        selectedJobs.length === 0 ||
        item.jobs.some((job) =>
          selectedJobs.includes(
            job === "기획"
              ? "planning"
              : job === "디자인"
                ? "design"
                : job === "개발"
                  ? "development"
                  : job === "마케팅"
                    ? "marketing"
                    : "ai",
          ),
        );

      return matchesCategory && matchesJob;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "soon") {
        return (
          getDeadlineRank(a.registrationPeriod) -
          getDeadlineRank(b.registrationPeriod)
        );
      }
      if (sort === "remain") {
        return (
          getDeadlineRank(b.registrationPeriod) -
          getDeadlineRank(a.registrationPeriod)
        );
      }
      const aDate = parseDate(a.registrationPeriod);
      const bDate = parseDate(b.registrationPeriod);
      return bDate - aDate;
    });
  }, [activeMenu, searchedItems, selectedCategory, selectedJobs, sort]);

  const handleBookmarkToggle = async (activityId: string) => {
    const current = bookmarkedMap[activityId] ?? false;

    try {
      const result = await toggleBookmark({
        activityId,
        isBookmarked: current,
      });
      setBookmarkedMap((prev) => ({
        ...prev,
        [activityId]: result.isBookmarked,
      }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "북마크 처리 중 오류가 발생했습니다.";
      window.alert(message);
    }
  };

  return (
    <div className="mobile:flex pc:hidden flex-col gap-6">
      <Typography type="Heading1Semibold">{decodedSearch} 검색</Typography>
      <ArchiveMenu
        activeMenu={activeMenu}
        search={search}
        tabCounts={tabCounts}
      />
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
        <button
          type="button"
          className="border border-gray-30 rounded-full cursor-pointer w-8 h-8 flex items-center justify-center shrink-0">
          <Icon icon="filter" size={20} className="text-[#383838]" />
        </button>
        <button
          type="button"
          className="bg-primary-50 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shrink-0"
          onClick={() => {
            setSelectedCategory([]);
            setSelectedJobs([]);
          }}>
          <Icon icon="largeRefresh" color="white" size={20} />
        </button>
        <Select
          size="xsmall"
          width="xsmall"
          type="checkbox"
          functionOptionType="reset"
          wrapperClassName="!w-[98px]"
          portalDropdown
          dropdownClassName="!w-[160px]"
          className="!rounded-full !w-[98px] !h-[34px] [&_span]:text-[14px] [&_span]:font-medium [&_span]:!text-[#101828]"
          placeholder="전체"
          options={[
            { label: "전체", value: "all" },
            { label: "대외활동", value: "activities" },
            { label: "강연/세미나", value: "seminar" },
            { label: "교육", value: "education" },
            { label: "공모전/해커톤", value: "contest" },
          ]}
          value={selectedCategory}
          onChange={(value) =>
            setSelectedCategory(Array.isArray(value) ? value : [])
          }
        />
        <Select
          size="xsmall"
          width="xsmall"
          type="checkbox"
          functionOptionType="reset"
          wrapperClassName="!w-[111px]"
          portalDropdown
          dropdownClassName="!w-[172px]"
          className="!rounded-full !w-[111px] !h-[34px] !px-3 [&_span]:text-[14px] [&_span]:font-medium [&_span]:!text-[#101828]"
          placeholder="직무유형"
          options={JOB_TYPE_OPTIONS}
          value={selectedJobs}
          onChange={(value) =>
            setSelectedJobs(Array.isArray(value) ? value : [])
          }
        />
      </div>
      <Typography type="Body2Medium" className="text-gray-60">
        총 {visibleItems.length}건
      </Typography>

      <div className="flex items-center justify-between">
        <Typography type="Body2Medium" className="text-gray-60">
          {MENU_ITEMS.find((item) => item.id === activeMenu)?.label ?? "전체"}{" "}
          {visibleItems.length}건
        </Typography>
        <Select
          size="xsmall"
          width="xsmall"
          placeholder="최신순"
          options={[
            { label: "최신순", value: "latest" },
            { label: "마감 임박순", value: "soon" },
            { label: "여유 있는순", value: "remain" },
          ]}
          value={sort}
          onChange={(value) =>
            setSort(typeof value === "string" ? value : "latest")
          }
          className="!w-auto !min-w-[88px] !h-[34px] !border-none !px-0 [&_span]:text-[14px] [&_span]:font-medium [&_span]:!text-[#101828]"
          wrapperClassName="!w-auto"
          dropdownClassName="!w-[124px]"
          portalDropdown
        />
      </div>

      {loading ? (
        <div className="flex h-[220px] items-center justify-center rounded-lg bg-gray-5">
          <Typography type="Body2Medium" className="text-gray-50">
            검색 결과를 불러오는 중입니다.
          </Typography>
        </div>
      ) : error ? (
        <div className="flex h-[220px] items-center justify-center rounded-lg bg-gray-5">
          <Typography type="Body2Medium" className="text-gray-50">
            검색 결과를 불러오지 못했습니다.
          </Typography>
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="flex h-[220px] items-center justify-center rounded-lg bg-gray-5">
          <Typography type="Body2Medium" className="text-gray-50">
            검색 결과가 없습니다.
          </Typography>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {visibleItems.map((item) => {
            const activityId = extractActivityId(item.detailLink);
            const isBookmarked = activityId
              ? (bookmarkedMap[activityId] ?? false)
              : false;
            const jobs = item.jobs.filter(
              (job): job is (typeof JOB_TYPES)[number] =>
                JOB_TYPES.includes(job as (typeof JOB_TYPES)[number]),
            );

            return (
              <Card
                key={item.id}
                imageUrl={item.thumbnailImage || "/imgs/cat.jpg"}
                chipText={
                  (item.activityType as
                    | "대외활동"
                    | "강연/세미나"
                    | "교육"
                    | "공모전/해커톤") || "대외활동"
                }
                badgeText={item.registrationPeriod || "D-01"}
                badgeVariant="default"
                isBookmarked={isBookmarked}
                companyName={item.organizer}
                title={item.title}
                jobs={jobs.length > 0 ? jobs : ["기획"]}
                onCardClick={() => router.push(item.detailLink)}
                onBookmarkClick={() =>
                  activityId && handleBookmarkToggle(activityId)
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function ArchiveMenu({
  activeMenu,
  search,
}: {
  activeMenu: MenuId;
  search: string;
  tabCounts: Record<MenuId, number>;
}) {
  return (
    <div className="relative flex flex-row w-full h-[35px] overflow-x-auto hide-scrollbar before:absolute before:left-0 before:right-0 before:bottom-0 before:h-[1.5px] before:bg-gray-30 before:content-['']">
      {MENU_ITEMS.map((item) => (
        <Link
          key={item.id}
          href={`/search/${search}?tab=${item.id}`}
          id={item.id}
          className={clsx(
            "relative box-border flex shrink-0 justify-center items-center",
            activeMenu === item.id &&
              "after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[3px] after:translate-y-1/2 after:bg-primary-50 after:content-['']",
          )}>
          <Typography className="w-[86px] text-center" type="Body2Medium">
            {item.label}
          </Typography>
        </Link>
      ))}
    </div>
  );
}
