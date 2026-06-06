/** @format */

"use client";

import Typography from "@/components/common/Typography";
import Card from "@/components/common/Card/mobile/Card";
import MoList from "@/components/common/List/mobile/MoList";
import clsx from "clsx";
import Select from "@/components/common/Select/Select";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import Icon from "@/components/common/Icon/Icon";
import { extractActivityId, toggleBookmark } from "@/lib/bookmarks";
import {
  type ActivityMenuId,
  type ActivityPageFilters,
} from "@/lib/activity-data";
import { useActivities } from "@/hooks/useActivities";

const CARD_CHIP_TYPES = [
  "대외활동",
  "강연/세미나",
  "교육",
  "공모전/해커톤",
] as const;
const JOB_TYPES = ["기획", "디자인", "개발", "마케팅", "AI"] as const;
type CardChipType = (typeof CARD_CHIP_TYPES)[number];

const normalizeActivityType = (value: string): CardChipType =>
  CARD_CHIP_TYPES.includes(value as CardChipType)
    ? (value as CardChipType)
    : "대외활동";

const MENU_TO_SLUG = {
  all: "all",
  "external-activity": "activities",
  seminar: "seminar",
  education: "education",
  contest: "contest",
} as const;
const CATEGORY_TO_API = {
  activities: "EXTRACURRICULAR",
  seminar: "SEMINAR",
  education: "EDUCATION",
  contest: "COMPETITION",
} as const;

interface ActivityListProps {
  title?: string;
  type?: "card" | "list";
  className?: string;
  typoType?: "Headline1SemiBold" | "Body1Medium";
  onFilterClick?: () => void;
  activeMenu: ActivityMenuId;
  selectedFilters: ActivityPageFilters;
  setSelectedFilters: Dispatch<SetStateAction<ActivityPageFilters>>;
}

function updateFilter(
  previous: ActivityPageFilters,
  category: string,
  value?: string | string[],
): ActivityPageFilters {
  const options = Array.isArray(value) ? value : [];

  if (options.length === 0) {
    const next = { ...previous };
    delete next[category];
    return next;
  }

  return {
    ...previous,
    [category]: options,
  };
}

export default function MobileActivityList({
  title,
  type = "card",
  className,
  typoType = "Headline1SemiBold",
  onFilterClick,
  activeMenu,
  selectedFilters,
  setSelectedFilters,
}: ActivityListProps) {
  const router = useRouter();
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>(
    {},
  );
  const activitySlug = MENU_TO_SLUG[activeMenu];
  const activityParams = useMemo(() => {
    // 직무유형(관련직무) → 백엔드 jobTag 코드. 선택 시 쿼리로 전송.
    const jobLabelToTag: Record<string, string> = {
      기획: "PLANNING",
      디자인: "DESIGN",
      개발: "DEVELOPMENT",
      마케팅: "MARKETING",
      AI: "AI",
    };
    const jobTags = (selectedFilters["관련직무"] ?? [])
      .filter((v) => v !== "전체")
      .map((label) => jobLabelToTag[label])
      .filter(Boolean);
    return {
      size: "200",
      sort: "LATEST",
      ...(activitySlug !== "all" ? { category: CATEGORY_TO_API[activitySlug], fallbackOnEmpty: "false" } : {}),
      ...(jobTags.length > 0 ? { jobTag: jobTags.join(",") } : {}),
    };
  }, [activitySlug, selectedFilters]);
  const { data: apiData, loading } = useActivities("latest", activityParams);
  const items = useMemo(
    () =>
      apiData.filter((item) => {
        const filterEntries = Object.entries(selectedFilters).filter(([, values]) => values.length > 0);
        return filterEntries.every(([filterName, values]) => {
          const activeValues = values.filter((value) => value !== "전체");
          if (activeValues.length === 0) return true;
          if (filterName === "주최기관") return activeValues.includes(item.organizer);
          if (filterName === "관련직무") return item.jobs.some((job) => activeValues.includes(job));
          return true;
        });
      }),
    [apiData, selectedFilters],
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

  return (
    <div className={clsx("w-full flex flex-col gap-5", className)}>
      {title ? <Typography type={typoType}>{title}</Typography> : null}

      <div className="relative z-20 mt-5">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar items-center pb-1">
          <button
            type="button"
            className="border border-gray-30 rounded-full cursor-pointer w-8 h-8 flex items-center justify-center shrink-0"
            onClick={onFilterClick}>
            <Icon icon="threeDots" size={14} />
          </button>
          <button
            type="button"
            className="bg-primary-60 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shrink-0"
            onClick={() => setSelectedFilters({})}>
            <Icon icon="largeRefresh" color="white" size={14} />
          </button>
          <Select
            size="xsmall"
            width="xsmall"
            type="checkbox"
          functionOptionType="reset"
            placeholder="주최기관"
            wrapperClassName="!w-[111px]"
            portalDropdown
            dropdownClassName="!w-[220px]"
            className="!rounded-full !w-[111px] !h-[40px] !px-3 [&_span]:text-[15px] [&_span]:font-medium [&_span]:text-[#101828]"
            options={[
              { label: "대기업", value: "대기업" },
              { label: "중견기업", value: "중견기업" },
              { label: "중소기업", value: "중소기업" },
              { label: "공공기관/공기업", value: "공공기관/공기업" },
              { label: "외국계 기업", value: "외국계 기업" },
              { label: "비영리단체/협회/재단", value: "비영리단체/협회/재단" },
              { label: "스타트업", value: "스타트업" },
              { label: "금융권", value: "금융권" },
              { label: "병원", value: "병원" },
              { label: "기타", value: "기타" },
            ]}
            value={selectedFilters["주최기관"] ?? []}
            onChange={(value) =>
              setSelectedFilters((prev) => updateFilter(prev, "주최기관", value))
            }
          />
          <Select
            size="small"
            width="small"
            type="checkbox"
          functionOptionType="reset"
            placeholder="참여대상"
            wrapperClassName="!w-[111px]"
            portalDropdown
            dropdownClassName="!w-[172px]"
            className="!rounded-full !w-[111px] !h-[40px] !px-3 [&_span]:text-[15px] [&_span]:font-medium [&_span]:text-[#101828]"
            options={[
              { label: "제한 없음", value: "제한 없음" },
              { label: "대학생", value: "대학생" },
              { label: "직장인", value: "직장인" },
              { label: "기타", value: "기타" },
            ]}
            value={selectedFilters["참여대상"] ?? []}
            onChange={(value) =>
              setSelectedFilters((prev) => updateFilter(prev, "참여대상", value))
            }
          />
          <Select
            size="small"
            width="small"
            type="checkbox"
          functionOptionType="reset"
            placeholder="활동분야"
            wrapperClassName="!w-[111px]"
            portalDropdown
            dropdownClassName="!w-[172px]"
            className="!rounded-full !w-[111px] !h-[40px] !px-3 [&_span]:text-[15px] [&_span]:font-medium [&_span]:text-[#101828]"
          options={[
              { label: "서포터즈", value: "서포터즈" },
              { label: "마케터", value: "마케터" },
              { label: "멘토링", value: "멘토링" },
              { label: "기자단", value: "기자단" },
              { label: "해외봉사", value: "해외봉사" },
              { label: "국내봉사단", value: "국내봉사단" },
            ]}
            value={selectedFilters["활동분야"] ?? []}
            onChange={(value) =>
              setSelectedFilters((prev) => updateFilter(prev, "활동분야", value))
            }
          />
          <Select
            size="small"
            width="small"
            type="checkbox"
          functionOptionType="reset"
            placeholder="지역"
            wrapperClassName="!w-[111px]"
            portalDropdown
            dropdownClassName="!w-[172px]"
            className="!rounded-full !w-[111px] !h-[40px] !px-3 [&_span]:text-[15px] [&_span]:font-medium [&_span]:text-[#101828]"
            options={[
              { label: "온라인", value: "온라인" },
              { label: "서울", value: "서울" },
              { label: "경기", value: "경기" },
              { label: "인천", value: "인천" },
              { label: "강원", value: "강원" },
              { label: "대전", value: "대전" },
              { label: "세종", value: "세종" },
              { label: "충남", value: "충남" },
              { label: "충북", value: "충북" },
              { label: "광주", value: "광주" },
              { label: "전남", value: "전남" },
              { label: "전북", value: "전북" },
              { label: "대구", value: "대구" },
              { label: "경북", value: "경북" },
              { label: "부산", value: "부산" },
              { label: "울산", value: "울산" },
              { label: "경남", value: "경남" },
              { label: "제주", value: "제주" },
            ]}
            value={selectedFilters["모집지역"] ?? []}
            onChange={(value) =>
              setSelectedFilters((prev) => updateFilter(prev, "모집지역", value))
            }
          />
          <Select
            size="small"
            width="small"
            type="checkbox"
          functionOptionType="reset"
            placeholder="직무"
            wrapperClassName="!w-[111px]"
            portalDropdown
            dropdownClassName="!w-[172px]"
            className="!rounded-full !w-[111px] !h-[40px] !px-3 [&_span]:text-[15px] [&_span]:font-medium [&_span]:text-[#101828]"
            options={[
              { label: "기획", value: "기획" },
              { label: "마케팅", value: "마케팅" },
              { label: "디자인", value: "디자인" },
              { label: "개발", value: "개발" },
              { label: "기타", value: "기타" },
            ]}
            value={selectedFilters["관련직무"] ?? []}
            onChange={(value) =>
              setSelectedFilters((prev) => updateFilter(prev, "관련직무", value))
            }
          />
        </div>
      </div>

      <div
        className={clsx(
          "w-full",
          type === "card"
            ? "grid grid-cols-2 gap-4"
            : "flex flex-col gap-2",
        )}>
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-[250px] rounded-lg bg-gray-10 animate-pulse" />
          ))
        ) : items.length === 0 ? (
          <div
            className={clsx(
              "flex h-[220px] w-full items-center justify-center rounded-lg bg-gray-5",
              type === "card" && "col-span-2",
            )}>
            <Typography type="Body2Medium" className="text-gray-50">
              선택한 조건에 맞는 활동이 없습니다.
            </Typography>
          </div>
        ) : (
          items.map((item) => {
            const activityId = extractActivityId(item.detailLink);
            const isBookmarked = activityId
              ? (bookmarkedMap[activityId] ?? false)
              : false;
            const jobs = item.jobs.filter(
              (job): job is (typeof JOB_TYPES)[number] =>
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
                onBookmarkClick={() =>
                  activityId && handleBookmarkToggle(activityId)
                }
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
                onBookmarkClick={() =>
                  activityId && handleBookmarkToggle(activityId)
                }
              />
            );
          })
        )}
      </div>
    </div>
  );
}
