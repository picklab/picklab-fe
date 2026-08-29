"use client";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/common/Card/Card";
import Typography from "@/components/common/Typography";
import SortTab from "@/components/common/Tab/SortTab";
import Select from "@/components/common/Select/Select";
import Pagination from "@/components/common/Pagination/Pagination";
import { useActivities } from "@/hooks/useActivities";
import {
  getAllActivities,
  type ActivityPageFilters,
  type ActivityRouteSlug,
} from "@/lib/activity-data";
import { toggleBookmark } from "@/lib/bookmarks";
import { JOB_TYPE_OPTIONS } from "@/constants/filters";

interface NewActivityListProps {
  title: string;
  categorySlug?: ActivityRouteSlug;
  selectedFilters?: ActivityPageFilters;
  showInlineFilters?: boolean;
  useExternalPagination?: boolean;
  showTitle?: boolean;
  resultCount?: number;
}

const CARDS_PER_PAGE = 12;
const JOB_TYPES = ["기획", "디자인", "개발", "마케팅", "AI"] as const;
const CATEGORY_TO_API = {
  activities: "EXTRACURRICULAR",
  seminar: "SEMINAR",
  education: "EDUCATION",
  contest: "COMPETITION",
} as const satisfies Record<ActivityRouteSlug, string>;
const SORT_TO_API = {
  latest: "LATEST",
  soon: "DEADLINE_ASC",
  remain: "DEADLINE_DESC",
} as const;

function getDeadlineRank(badgeText: string): number {
  if (badgeText === "마감") return Number.NEGATIVE_INFINITY;
  if (badgeText === "D-Day") return 0;
  if (badgeText.startsWith("D-")) return Number(badgeText.slice(2));
  return 999;
}

// 직무 라벨/코드 → 백엔드 jobTag 코드(PLANNING/DESIGN/DEVELOPMENT/MARKETING/AI)
const JOB_LABEL_TO_TAG: Record<string, string> = {
  기획: "PLANNING",
  디자인: "DESIGN",
  개발: "DEVELOPMENT",
  마케팅: "MARKETING",
  AI: "AI",
};
const JOB_CODE_TO_TAG: Record<string, string> = {
  planning: "PLANNING",
  design: "DESIGN",
  development: "DEVELOPMENT",
  marketing: "MARKETING",
  ai: "AI",
};
// 주최기관 옵션 라벨 → 백엔드 organizerType 코드 (※ 금융권 코드는 백엔드 확인 필요)
const ORGANIZER_LABEL_TO_TYPE: Record<string, string> = {
  대기업: "LARGE_CORPORATION",
  중견기업: "MEDIUM_CORPORATION",
  중소기업: "SMALL_CORPORATION",
  "공공기관/공기업": "PUBLIC_ORGANIZATION",
  외국계: "FOREIGN_CORPORATION",
  "비영리/협회/재단": "NON_PROFIT",
  스타트업: "STARTUP",
  금융권: "FINANCIAL_INSTITUTION",
  병원: "HOSPITAL",
  기타: "ETC",
};
// 클라 보정 비교용 공백 정규화 (옵션 "외국계 기업" vs 라벨 "외국계기업" 불일치 방지)
const normalizeOrg = (s: string) => s.replace(/\s/g, "");

// 참여대상 라벨 → 백엔드 target 코드 (대문자 enum). "기타"는 백엔드 코드 없음 → 미전송
const TARGET_LABEL_TO_CODE: Record<string, string> = {
  "제한 없음": "ALL",
  대학생: "UNIVERSITY_STUDENT",
  "직장인/일반인": "WORKER",
};
// 활동분야 라벨 → 백엔드 field 코드 (1:1, 대문자 enum)
const FIELD_LABEL_TO_CODE: Record<string, string> = {
  서포터즈: "SUPPORTERS",
  마케터: "MARKETER",
  멘토링: "MENTORING",
  기자단: "PRESS",
  해외봉사: "OVERSEAS_VOLUNTEER",
  국내봉사단: "DOMESTIC_VOLUNTEER",
};
// 모집지역 라벨 → 백엔드 location 권역 코드(대문자 enum). UX 2-25064: 권역 그룹 1:1 매핑(해외=OVERSEAS).
const REGION_LABEL_TO_LOCATION: Record<string, string> = {
  "서울/인천": "SEOUL_INCHEON",
  "경기/강원": "GYEONGGI_GANGWON",
  "대전/세종/충남": "DAEJEON_SEJONG_CHUNGNAM",
  "부산/대구/경상": "BUSAN_DAEGU_GYEONGSANG",
  "광주/전라": "GWANGJU_JEOLLA",
  제주: "JEJU",
  해외: "OVERSEAS",
};
const uniqueJoin = (codes: string[]) =>
  Array.from(new Set(codes.filter(Boolean))).join(",");

export default function NewActivityList({
  title,
  categorySlug,
  selectedFilters = {},
  showInlineFilters = true,
  useExternalPagination = false,
  showTitle = true,
  resultCount,
}: NewActivityListProps) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("latest");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  // 카드별 북마크 상태(낙관적 업데이트): { [activityId]: boolean }
  const [bookmarkMap, setBookmarkMap] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // 선택한 직무유형(관련직무 칩 + 직무유형 Select)을 백엔드 jobTag 코드로 변환
  const selectedJobTags = useMemo(() => {
    const fromFilters = (selectedFilters["관련직무"] ?? [])
      .filter((v) => v !== "전체" && v !== "모두")
      .map((label) => JOB_LABEL_TO_TAG[label]);
    const fromSelect = selectedJobs.map((code) => JOB_CODE_TO_TAG[code]);
    return Array.from(new Set([...fromFilters, ...fromSelect].filter(Boolean)));
  }, [selectedFilters, selectedJobs]);

  // 선택한 주최기관(유형)을 백엔드 organizerType 코드로 변환
  const selectedOrgTypes = useMemo(
    () =>
      (selectedFilters["주최기관"] ?? [])
        .filter((v) => v !== "전체" && v !== "모두")
        .map((label) => ORGANIZER_LABEL_TO_TYPE[label])
        .filter(Boolean),
    [selectedFilters],
  );

  // 참여대상(target)/활동분야(field)/모집지역(location)/온오프라인(format) 백엔드 코드로 변환
  const selectedTargets = useMemo(
    () =>
      (selectedFilters["참여대상"] ?? [])
        .filter((v) => v !== "전체" && v !== "모두")
        .map((label) => TARGET_LABEL_TO_CODE[label])
        .filter(Boolean),
    [selectedFilters],
  );
  const selectedFields = useMemo(
    () =>
      (selectedFilters["활동분야"] ?? [])
        .filter((v) => v !== "전체" && v !== "모두")
        .map((label) => FIELD_LABEL_TO_CODE[label])
        .filter(Boolean),
    [selectedFilters],
  );
  const regionSelection = useMemo(
    () => selectedFilters["모집지역"] ?? [],
    [selectedFilters],
  );
  const selectedLocations = useMemo(
    () =>
      regionSelection
        .filter((v) => v !== "전체" && v !== "모두")
        .map((label) => REGION_LABEL_TO_LOCATION[label])
        .filter(Boolean),
    [regionSelection],
  );

  const activityParams = useMemo(
    () => ({
      size: String(getAllActivities().length),
      sort: SORT_TO_API[sort as keyof typeof SORT_TO_API] ?? "LATEST",
      ...(categorySlug
        ? { category: CATEGORY_TO_API[categorySlug], fallbackOnEmpty: "false" }
        : {}),
      ...(selectedJobTags.length > 0
        ? { jobTag: selectedJobTags.join(",") }
        : {}),
      ...(selectedOrgTypes.length > 0
        ? { organizerType: selectedOrgTypes.join(",") }
        : {}),
      ...(selectedTargets.length > 0
        ? { target: uniqueJoin(selectedTargets) }
        : {}),
      ...(selectedFields.length > 0
        ? { field: uniqueJoin(selectedFields) }
        : {}),
      ...(selectedLocations.length > 0
        ? { location: uniqueJoin(selectedLocations) }
        : {}),
    }),
    [
      categorySlug,
      sort,
      selectedJobTags,
      selectedOrgTypes,
      selectedTargets,
      selectedFields,
      selectedLocations,
    ],
  );
  const { data: apiData, loading } = useActivities("latest", activityParams);
  const effectiveLoading = loading;

  const resetExternalPage = () => {
    if (!useExternalPagination) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const cards = useMemo(() => {
    const sourceItems = apiData;

    if (sourceItems.length === 0) {
      if (categorySlug) {
        return [];
      }

      return Array.from({ length: 10 }).map((_, index) => ({
        key: String(index),
        imageUrl: "/imgs/cat.jpg",
        chipText: "공모전/해커톤" as const,
        badgeText: "D-01",
        badgeVariant: "default" as const,
        isBookmarked: false,
        companyName: "삼양 그룹",
        title: "2025 삼양그룹 대학생 서포터즈 Samyang Seeds 9기",
        jobs: ["개발"] as "개발"[],
        detailLink: "",
      }));
    }

    const mergedSelectedFilters = {
      ...selectedFilters,
      ...(selectedCategories.length > 0
        ? { 활동유형: selectedCategories }
        : {}),
      ...(selectedJobs.length > 0
        ? {
            관련직무: selectedJobs.map((job) =>
              job === "planning"
                ? "기획"
                : job === "design"
                  ? "디자인"
                  : job === "development"
                    ? "개발"
                    : job === "marketing"
                      ? "마케팅"
                      : "AI",
            ),
          }
        : {}),
    };

    const filtered = sourceItems.filter((item) => {
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

      const filterEntries = Object.entries(mergedSelectedFilters).filter(
        ([, values]) => values.length > 0,
      );
      const matchesFilters = filterEntries.every(([filterName, values]) => {
        const activeValues = values.filter(
          (value) => value !== "전체" && value !== "모두",
        );
        if (activeValues.length === 0) return true;
        if (filterName === "주최기관")
          return activeValues.some(
            (v) => normalizeOrg(v) === normalizeOrg(item.companyType),
          );
        if (filterName === "관련직무")
          return item.jobs.some((job) => activeValues.includes(job));
        // [임시 방어] 활동분야(서포터즈/해외봉사 등)는 대외활동 전용 속성인데,
        // 백엔드가 교육·공모전 카테고리에서 field 파라미터를 무시하고 전체를 반환한다.
        // (예: 교육 field=OVERSEAS_VOLUNTEER → 14개 그대로 노출) 그래서 필터가 안 먹는 것처럼 보임.
        // 응답 item에 활동분야 정보가 없어 값으로는 못 거르므로, 대외활동이 아닌 항목을 제외한다.
        // TODO(기획 2-25064): 카테고리별 필터 노출 스펙 확정 필요 — 활동분야를 대외활동 탭에만 노출할지 결정.
        // TODO(백엔드): 교육·공모전에서 field 파라미터 무시 대신 일관 처리(적용 or 400) 필요.
        if (filterName === "활동분야") return item.activityType === "대외활동";
        if (filterName === "활동유형") return true;
        return true;
      });

      return matchesCategory && matchesFilters;
    });

    const sorted = [...filtered].sort((a, b) => {
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
      return 0;
    });

    return sorted.map((item) => {
      const jobs = item.jobs.filter((job): job is (typeof JOB_TYPES)[number] =>
        JOB_TYPES.includes(job as (typeof JOB_TYPES)[number]),
      );

      // 낙관적 상태가 있으면 우선 적용, 없으면 백엔드 응답값 사용
      const currentBookmarked =
        bookmarkMap[item.id] ?? item.isBookmarked ?? false;

      return {
        key: item.id,
        imageUrl: item.thumbnailImage || "/imgs/cat.jpg",
        chipText:
          (item.activityType as
            | "대외활동"
            | "강연/세미나"
            | "교육"
            | "공모전/해커톤") || "공모전/해커톤",
        badgeText: item.registrationPeriod || "D-01",
        badgeVariant: "default" as const,
        isBookmarked: currentBookmarked,
        companyName: item.organizer || "",
        title: item.title,
        jobs: (jobs.length > 0 ? jobs : ["기획"]) as (
          | "기획"
          | "디자인"
          | "개발"
          | "마케팅"
          | "AI"
        )[],
        detailLink: item.detailLink,
      };
    });
  }, [
    apiData,
    bookmarkMap,
    categorySlug,
    selectedCategories,
    selectedFilters,
    selectedJobs,
    sort,
  ]);

  const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);
  const externalPage = Number(searchParams.get("page") ?? 1);
  const activePage =
    useExternalPagination && Number.isFinite(externalPage)
      ? Math.min(Math.max(externalPage, 1), Math.max(totalPages, 1))
      : page;
  const pagedCards = cards.slice(
    (activePage - 1) * CARDS_PER_PAGE,
    activePage * CARDS_PER_PAGE,
  );

  return (
    <div className="w-full flex flex-col gap-[2rem]">
      <div className="flex flex-col gap-4">
        {showTitle && <Typography type="Heading1Bold">{title}</Typography>}

        <div className="flex items-end justify-between w-full">
          {showInlineFilters ? (
            <div className="flex gap-2">
              <Select
                size="small"
                width="medium"
                type="checkbox"
                functionOptionType="reset"
                portalDropdown
                className="!rounded-full [&_span]:text-[14px] [&_span]:font-medium [&_span]:!text-[#101828]"
                placeholder="활동유형"
                options={[
                  { label: "대외활동", value: "external_activity" },
                  { label: "강연/세미나", value: "seminar" },
                  { label: "교육", value: "education" },
                  { label: "공모전/해커톤", value: "contest" },
                ]}
                value={selectedCategories}
                onChange={(value) => {
                  setSelectedCategories(Array.isArray(value) ? value : []);
                  if (useExternalPagination) {
                    resetExternalPage();
                  } else {
                    setPage(1);
                  }
                }}
              />
              <Select
                size="small"
                width="medium"
                type="checkbox"
                functionOptionType="reset"
                portalDropdown
                className="!rounded-full [&_span]:text-[14px] [&_span]:font-medium [&_span]:!text-[#101828]"
                placeholder="직무유형"
                options={JOB_TYPE_OPTIONS}
                value={selectedJobs}
                onChange={(value) => {
                  setSelectedJobs(Array.isArray(value) ? value : []);
                  if (useExternalPagination) {
                    resetExternalPage();
                  } else {
                    setPage(1);
                  }
                }}
              />
            </div>
          ) : (
            <Typography type="Body2Medium" className="text-gray-60">
              공고{" "}
              {typeof resultCount === "number" ? resultCount : cards.length}건
            </Typography>
          )}
          <SortTab
            options={[
              { label: "최신순", value: "latest" },
              { label: "마감임박순", value: "soon" },
              { label: "여유 있는순", value: "remain" },
            ]}
            currentValue={sort}
            onTabClick={(value) => {
              setSort(value);
              if (useExternalPagination) {
                resetExternalPage();
              } else {
                setPage(1);
              }
            }}
          />
        </div>
      </div>
      <div
        className={`grid grid-cols-4 ${categorySlug === "activities" ? "gap-5" : "gap-5"}`}>
        {effectiveLoading ? (
          Array.from({ length: CARDS_PER_PAGE }).map((_, i) => (
            <div
              key={i}
              className="h-[280px] rounded-lg bg-gray-10 animate-pulse"
            />
          ))
        ) : pagedCards.length === 0 ? (
          <div className="col-span-4 flex h-[240px] items-center justify-center rounded-lg bg-gray-5">
            <Typography type="Body2Medium" className="text-gray-50">
              선택한 조건에 맞는 활동이 없습니다.
            </Typography>
          </div>
        ) : (
          pagedCards.map((card) => (
            <Card
              key={card.key}
              imageUrl={card.imageUrl}
              chipText={card.chipText}
              badgeText={card.badgeText}
              badgeVariant={card.badgeVariant}
              isBookmarked={card.isBookmarked}
              companyName={card.companyName}
              title={card.title}
              jobs={card.jobs}
              onBookmarkClick={async () => {
                const prev = card.isBookmarked;
                // 낙관적 업데이트: 즉시 상태 반영
                setBookmarkMap((m) => ({ ...m, [card.key]: !prev }));
                try {
                  await toggleBookmark({
                    activityId: card.key,
                    isBookmarked: prev,
                  });
                } catch (error) {
                  // 실패 시 롤백
                  setBookmarkMap((m) => ({ ...m, [card.key]: prev }));
                  const message =
                    error instanceof Error
                      ? error.message
                      : "북마크 처리 중 오류가 발생했습니다.";
                  window.alert(message);
                }
              }}
              onCardClick={() =>
                card.detailLink && router.push(card.detailLink)
              }
            />
          ))
        )}
      </div>
      {!useExternalPagination && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            totalPage={totalPages}
            activePage={activePage}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
