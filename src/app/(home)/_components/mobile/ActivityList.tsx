/** @format */

"use client";

import Typography from "@/components/common/Typography";
import Card from "@/components/common/Card/mobile/Card";
import MoList from "@/components/common/List/mobile/MoList";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import Select from "@/components/common/Select/Select";
import { CardData } from "../constant";
import { extractActivityId, toggleBookmark } from "@/lib/bookmarks";
import { useActivities, type ActivityEndpoint } from "@/hooks/useActivities";

const CARD_CHIP_TYPES = ["대외활동", "강연/세미나", "교육", "공모전/해커톤"] as const;
const JOB_TYPES = ["기획", "디자인", "개발", "마케팅", "AI"] as const;
type CardChipType = (typeof CARD_CHIP_TYPES)[number];

const normalizeActivityType = (value: string): CardChipType =>
  CARD_CHIP_TYPES.includes(value as CardChipType) ? (value as CardChipType) : "대외활동";

interface ActivityListProps {
  title: string;
  type?: "card" | "list";
  className?: string;
  isSelect?: boolean;
  typoType?: "Headline1SemiBold" | "Body1Medium";
  endpoint?: ActivityEndpoint;
}

export default function ActivityList({
  title,
  type = "card",
  className,
  isSelect,
  typoType = "Headline1SemiBold",
  endpoint,
}: ActivityListProps) {
  const router = useRouter();
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const { data: apiData, loading } = useActivities(endpoint ?? "recommendations");

  const handleBookmarkToggle = async (activityId: string) => {
    const current = bookmarkedMap[activityId] ?? false;

    try {
      const result = await toggleBookmark({ activityId, isBookmarked: current });
      setBookmarkedMap((prev) => ({ ...prev, [activityId]: result.isBookmarked }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "북마크 처리 중 오류가 발생했습니다.";
      window.alert(message);
    }
  };

  const hasApiData = !loading && apiData.length > 0;
  const displayLimit = type === "card" ? 10 : 3;
  const filteredData = useMemo(() => {
    return apiData.filter((item) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(
          item.activityType === "공모전/해커톤"
            ? "contest"
            : item.activityType === "교육"
              ? "education"
              : item.activityType === "강연/세미나"
                ? "seminar"
                : "external_activity",
        );

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
  }, [apiData, selectedCategories, selectedJobs]);
  const filteredItems = filteredData.slice(0, displayLimit);

  return (
    <div className={clsx("w-full flex flex-col gap-3", className)}>
      <Typography type={typoType}>{title}</Typography>
      {isSelect && (
        <div className="flex gap-2">
          <Select
            size="small"
            width="small"
            type="checkbox"
            functionOptionType="reset"
            wrapperClassName="!w-[160px]"
            className="!rounded-full !w-[160px] [&_span]:text-[14px] [&_span]:font-medium [&_span]:text-[#101828]"
            dropdownClassName="!w-[160px] [&_ul]:!w-[160px]"
            placeholder="활동유형"
            options={[
              { label: "대외활동", value: "external_activity" },
              { label: "강연/세미나", value: "seminar" },
              { label: "교육", value: "education" },
              { label: "공모전/해커톤", value: "contest" },
            ]}
            value={selectedCategories}
            onChange={(value) => setSelectedCategories(Array.isArray(value) ? value : [])}
          />
          <Select
            size="small"
            width="small"
            type="checkbox"
            functionOptionType="reset"
            wrapperClassName="!w-[160px]"
            className="!rounded-full !w-[160px] [&_span]:text-[14px] [&_span]:font-medium [&_span]:text-[#101828]"
            dropdownClassName="!w-[160px] [&_ul]:!w-[160px]"
            placeholder="직무유형"
            options={[
              { label: "기획", value: "planning" },
              { label: "디자인", value: "design" },
              { label: "개발", value: "development" },
              { label: "마케팅", value: "marketing" },
              { label: "AI", value: "ai" },
            ]}
            value={selectedJobs}
            onChange={(value) => setSelectedJobs(Array.isArray(value) ? value : [])}
          />
        </div>
      )}

      <div
        className={clsx("flex overflow-x-scroll hide-scrollbar w-full", type === "card" ? "gap-4" : "flex-col gap-2")}
      >
        {hasApiData ? filteredItems.map((item) => {
          const isBookmarked = bookmarkedMap[item.id] ?? false;
          const jobs = item.jobs.filter((job): job is (typeof JOB_TYPES)[number] =>
            JOB_TYPES.includes(job as (typeof JOB_TYPES)[number]),
          );

          return type === "card" ? (
            <Card
              key={item.id}
              imageUrl={item.thumbnailImage || "/imgs/cat.jpg"}
              chipText={normalizeActivityType(item.activityType)}
              badgeText={item.registrationPeriod}
              badgeVariant="default"
              isBookmarked={isBookmarked}
              companyName={item.organizer}
              title={item.title}
              jobs={jobs.length > 0 ? jobs : ["기획"]}
              onBookmarkClick={() => handleBookmarkToggle(item.id)}
              onCardClick={() => router.push(item.detailLink)}
            />
          ) : (
            <MoList
              key={item.id}
              imageSrc={item.thumbnailImage || "/imgs/cat.jpg"}
              company={item.organizer}
              title={item.title}
              viewCount={item.viewCount}
              saveCount={item.saveCount}
              isBookmarked={isBookmarked}
              onListClick={() => router.push(item.detailLink)}
              onBookmarkClick={() => handleBookmarkToggle(item.id)}
            />
          );
        }) : null}
        {hasApiData && filteredItems.length === 0 ? (
          <div className="flex h-[160px] w-full items-center justify-center rounded-lg bg-gray-5">
            <Typography type="Body3Medium" className="text-gray-50">
              선택한 조건에 맞는 활동이 없습니다.
            </Typography>
          </div>
        ) : null}
        {!hasApiData
          ? CardData.slice(0, displayLimit).map((item, index) => {
              const activityId = extractActivityId(item.detailLink);
              const isBookmarked = activityId ? bookmarkedMap[activityId] ?? false : false;

              return type === "card" ? (
                <Card
                  key={`${item.detailLink}-${index}`}
                  imageUrl={item.thumbnailImage || "/imgs/cat.jpg"}
                  chipText={normalizeActivityType(item.activityType)}
                  badgeText={item.registrationPeriod}
                  badgeVariant="default"
                  isBookmarked={isBookmarked}
                  companyName={item.organizer}
                  title={item.title}
                  jobs={["개발"]}
                  onBookmarkClick={() => activityId && handleBookmarkToggle(activityId)}
                  onCardClick={() => router.push(item.detailLink)}
                />
              ) : (
                <MoList
                  key={`${item.detailLink}-${index}`}
                  imageSrc={item.thumbnailImage || "/imgs/cat.jpg"}
                  company={item.organizer}
                  title={item.title}
                  viewCount={10}
                  saveCount={10}
                  isBookmarked={isBookmarked}
                  onListClick={() => router.push(item.detailLink)}
                  onBookmarkClick={() => activityId && handleBookmarkToggle(activityId)}
                />
              );
            })
          : null}
      </div>
    </div>
  );
}
