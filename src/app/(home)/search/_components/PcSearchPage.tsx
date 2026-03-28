/** @format */

"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/common/Card/Card";
import BoxTab from "@/components/common/Tab/BoxTab";
import Typography from "@/components/common/Typography";
import Pagination from "@/components/common/Pagination/Pagination";
import clsx from "clsx";
import { getAllActivities, mapActivityToApiItem } from "@/lib/activity-data";

const TAB_LIST = [
  { label: "전체", value: "all" },
  { label: "대외활동", value: "activities" },
  { label: "강연/세미나", value: "seminar" },
  { label: "교육", value: "education" },
  { label: "공모전/해커톤", value: "contest" },
] as const;

const SEARCH_PAGE_SIZE = 12;
const JOB_TYPES = ["기획", "디자인", "개발", "마케팅", "AI"] as const;

type SearchTab = (typeof TAB_LIST)[number]["value"];

function parseDate(value?: string | null): number {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function toTabCategory(activityType: string): SearchTab {
  if (activityType === "강연/세미나") return "seminar";
  if (activityType === "교육") return "education";
  if (activityType === "공모전/해커톤") return "contest";
  return "activities";
}

function matchesKeyword(keyword: string, raw: ReturnType<typeof getAllActivities>[number]) {
  if (!keyword) return true;

  const normalizedKeyword = normalizeText(keyword);
  const searchable = normalizeText(
    [
      raw.title,
      raw.organization,
      raw.companyName,
      raw.categoryLabel,
      raw.summary,
      raw.source,
      raw.sourceUrl,
      raw.raw?.content,
      raw.raw?.organizer,
      raw.raw?.category,
      ...(Array.isArray(raw.jobs) ? raw.jobs : []),
    ]
      .filter(Boolean)
      .join(" "),
  );

  return searchable.includes(normalizedKeyword);
}

export default function PcSearchPage({ search, isStorybook = false }: { search: string; isStorybook?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const decodedSearch = decodeURIComponent(search);
  const requestedTab = (searchParams.get("tab") ?? "all") as SearchTab;
  const activeTab = TAB_LIST.some((tab) => tab.value === requestedTab) ? requestedTab : "all";
  const requestedPage = Number(searchParams.get("page") ?? "1");

  const filteredActivities = useMemo(() => {
    return getAllActivities()
      .filter((raw) => matchesKeyword(decodedSearch, raw))
      .sort((a, b) => {
        const aDate = parseDate(a.startDate ?? a.raw?.applicationStartAt);
        const bDate = parseDate(b.startDate ?? b.raw?.applicationStartAt);
        return bDate - aDate;
      })
      .map(mapActivityToApiItem);
  }, [decodedSearch]);

  const tabCounts = useMemo(() => {
    const counts: Record<SearchTab, number> = {
      all: filteredActivities.length,
      activities: 0,
      seminar: 0,
      education: 0,
      contest: 0,
    };

    filteredActivities.forEach((item) => {
      counts[toTabCategory(item.activityType)] += 1;
    });

    return counts;
  }, [filteredActivities]);

  const visibleItems = useMemo(() => {
    if (activeTab === "all") return filteredActivities;
    return filteredActivities.filter((item) => toTabCategory(item.activityType) === activeTab);
  }, [activeTab, filteredActivities]);

  const totalPage = Math.max(1, Math.ceil(visibleItems.length / SEARCH_PAGE_SIZE));
  const activePage = Number.isFinite(requestedPage) ? Math.min(Math.max(requestedPage, 1), totalPage) : 1;
  const pagedItems = visibleItems.slice((activePage - 1) * SEARCH_PAGE_SIZE, activePage * SEARCH_PAGE_SIZE);

  return (
    <div className={clsx("w-[1100px] px-5 flex-col gap-10", isStorybook ? "flex" : "hidden pc:flex")}>
      <div className="flex flex-col gap-6">
        <Typography type="Headline1SemiBold">{decodedSearch} 검색 결과</Typography>
        <div role="tablist" className="flex">
          {TAB_LIST.map((tab) => (
            <BoxTab
              key={tab.value}
              active={activeTab === tab.value}
              label={tab.label}
              notiNumber={String(tabCounts[tab.value])}
              href={`/search/${search}?tab=${tab.value}&page=1`}
              id={tab.value}
              panelId={tab.value}
            />
          ))}
        </div>
        <Typography type="Body2Medium" className="text-gray-60">
          총 {visibleItems.length}건
        </Typography>
      </div>

      {visibleItems.length === 0 ? (
        <div className="flex h-[320px] items-center justify-center rounded-lg bg-gray-5">
          <Typography type="Body2Medium" className="text-gray-50">
            검색 결과가 없습니다.
          </Typography>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-5">
            {pagedItems.map((item) => {
              const jobs = item.jobs.filter((job): job is (typeof JOB_TYPES)[number] =>
                JOB_TYPES.includes(job as (typeof JOB_TYPES)[number]),
              );

              return (
                <Card
                  key={item.id}
                  imageUrl={item.thumbnailImage || "/imgs/cat.jpg"}
                  chipText={(item.activityType as "대외활동" | "강연/세미나" | "교육" | "공모전/해커톤") || "대외활동"}
                  badgeText={item.registrationPeriod || "D-01"}
                  badgeVariant="default"
                  isBookmarked={false}
                  companyName={item.organizer}
                  title={item.title}
                  jobs={(jobs.length > 0 ? jobs : ["기획"]) as ("기획" | "디자인" | "개발" | "마케팅" | "AI")[]}
                  onBookmarkClick={() => {}}
                  onCardClick={() => router.push(item.detailLink)}
                />
              );
            })}
          </div>

          {totalPage > 1 && <Pagination totalPage={totalPage} activePage={activePage} />}
        </>
      )}
    </div>
  );
}
