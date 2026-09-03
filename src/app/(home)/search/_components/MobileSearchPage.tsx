/** @format */

"use client";

import Typography from "@/components/common/Typography";
import clsx from "clsx";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/common/Card/mobile/Card";
import { extractActivityId, toggleBookmark } from "@/lib/bookmarks";
import Icon from "@/components/common/Icon/Icon";
import useSearchActivities from "@/hooks/useSearchActivities";

const MENU_ITEMS = [
  { id: "all", label: "전체" },
  { id: "activities", label: "대외활동" },
  { id: "seminar", label: "강연/세미나" },
  { id: "education", label: "교육" },
  { id: "contest", label: "공모전/해커톤" },
] as const;
// 전체 탭에서 카테고리별 미리보기로 노출할 섹션(전체 제외)
const CATEGORY_SECTIONS = MENU_ITEMS.filter((item) => item.id !== "all");
const JOB_TYPES = ["기획", "디자인", "개발", "마케팅", "AI"] as const;
const PREVIEW_COUNT = 3;

type MenuId = (typeof MENU_ITEMS)[number]["id"];

function toTabCategory(activityType: string): MenuId {
  if (activityType === "강연/세미나") return "seminar";
  if (activityType === "교육") return "education";
  if (activityType === "공모전/해커톤") return "contest";
  return "activities";
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

  // 개별 탭: 해당 카테고리만 노출 (필터/정렬은 Figma에 없어 제거)
  const visibleItems = useMemo(
    () =>
      activeMenu === "all"
        ? searchedItems
        : searchedItems.filter(
            (item) => toTabCategory(item.activityType) === activeMenu,
          ),
    [activeMenu, searchedItems],
  );

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

  const renderCard = (item: (typeof searchedItems)[number]) => {
    const activityId = extractActivityId(item.detailLink);
    const isBookmarked = activityId
      ? (bookmarkedMap[activityId] ?? false)
      : false;
    const jobs = item.jobs.filter((job): job is (typeof JOB_TYPES)[number] =>
      JOB_TYPES.includes(job as (typeof JOB_TYPES)[number]),
    );

    return (
      <Card
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
        onBookmarkClick={() => activityId && handleBookmarkToggle(activityId)}
      />
    );
  };

  const stateBox = (message: string) => (
    <div className="flex h-[220px] items-center justify-center rounded-lg bg-gray-5">
      <Typography type="Body2Medium" className="text-gray-50">
        {message}
      </Typography>
    </div>
  );

  return (
    <div className="mobile:flex pc:hidden flex-col gap-5">
      <Typography type="Heading1Semibold" className="text-gray-80">
        ‘{decodedSearch}’ 검색
      </Typography>
      <ArchiveMenu
        activeMenu={activeMenu}
        search={search}
        tabCounts={tabCounts}
      />

      {loading ? (
        stateBox("검색 결과를 불러오는 중입니다.")
      ) : error ? (
        stateBox("검색 결과를 불러오지 못했습니다.")
      ) : activeMenu === "all" ? (
        searchedItems.length === 0 ? (
          stateBox("검색 결과가 없습니다.")
        ) : (
          // 전체 탭: 카테고리별 미리보기(최대 3개) + 모두 보기
          <div className="flex flex-col gap-10">
            {CATEGORY_SECTIONS.map((cat) => {
              const catItems = searchedItems.filter(
                (item) => toTabCategory(item.activityType) === cat.id,
              );
              if (catItems.length === 0) return null;

              return (
                <section key={cat.id} className="flex flex-col gap-3">
                  <Typography type="Body1Medium" className="text-gray-60">
                    {cat.label} {catItems.length}건
                  </Typography>
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex w-full gap-[14px] overflow-x-auto hide-scrollbar">
                      {catItems.slice(0, PREVIEW_COUNT).map((item) => (
                        <div key={item.id} className="shrink-0">
                          {renderCard(item)}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/search/${search}?tab=${cat.id}`)
                      }
                      className="flex h-10 items-center justify-center gap-1 rounded-full bg-gray-10 py-2 pl-4 pr-3">
                      <Typography type="Body2Medium" className="text-gray-50">
                        모두 보기
                      </Typography>
                      <Icon
                        icon="chevronRight"
                        size={20}
                        className="text-gray-50"
                      />
                    </button>
                  </div>
                </section>
              );
            })}
          </div>
        )
      ) : visibleItems.length === 0 ? (
        stateBox("검색 결과가 없습니다.")
      ) : (
        // 개별 탭: 해당 카테고리 전체 2열 grid
        <div className="grid grid-cols-2 gap-4">
          {visibleItems.map((item) => (
            <div key={item.id}>{renderCard(item)}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArchiveMenu({
  activeMenu,
  search,
  tabCounts,
}: {
  activeMenu: MenuId;
  search: string;
  tabCounts: Record<MenuId, number>;
}) {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar">
      <div className="flex w-max min-w-full">
        {MENU_ITEMS.map((item) => {
          const isActive = activeMenu === item.id;
          return (
            <Link
              key={item.id}
              href={`/search/${search}?tab=${item.id}`}
              id={item.id}
              className="flex shrink-0 flex-col gap-2">
              <div className="flex items-center justify-center px-9">
                <Typography
                  type="Body2Semibold"
                  className="whitespace-nowrap text-gray-90">
                  {item.label} {tabCounts[item.id]}
                </Typography>
              </div>
              {/* 3px 트랙 안에서 세로 중앙 정렬 → 활성 3px / 비활성 1.5px의 세로 중심이 일치 */}
              <div className="flex h-[3px] w-full items-center">
                <div
                  className={clsx(
                    "w-full",
                    isActive
                      ? "h-[3px] rounded-full bg-primary-50"
                      : "h-[1.5px] bg-gray-30",
                  )}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
