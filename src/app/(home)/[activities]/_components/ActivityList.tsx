/** @format */

"use client";

import Typography from "@/components/common/Typography";
import Card from "@/components/common/Card/mobile/Card";
import MoList from "@/components/common/List/mobile/MoList";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Select from "@/components/common/Select/Select";
import { CardData } from "../../_components/constant";
import { extractActivityId, toggleBookmark } from "@/lib/bookmarks";

const CARD_CHIP_TYPES = ["대외활동", "강연/세미나", "교육", "공모전/해커톤"] as const;
type CardChipType = (typeof CARD_CHIP_TYPES)[number];

const normalizeActivityType = (value: string): CardChipType =>
  CARD_CHIP_TYPES.includes(value as CardChipType) ? (value as CardChipType) : "대외활동";

interface ActivityListProps {
  title: string;
  type?: "card" | "list";
  className?: string;
  isSelect?: boolean;
  typoType?: "Headline1SemiBold" | "Body1Medium";
}

export default function ActivityList({
  title,
  type = "card",
  className,
  isSelect,
  typoType = "Headline1SemiBold",
}: ActivityListProps) {
  const router = useRouter();
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});

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

  return (
    <div className={clsx("w-full flex flex-col gap-3", className)}>
      <Typography type={typoType}>{title}</Typography>
      {isSelect && (
        <div className="flex gap-2">
          <Select
            size="xsmall"
            width="xsmall"
            type="checkbox"
            functionOptionType="reset"
            className="!rounded-full !w-[98px] !h-[34px]"
            options={[
              { label: "대외활동", value: "external_activity" },
              { label: "강연/세미나", value: "seminar" },
              { label: "교육", value: "education" },
              { label: "공모전/해커톤", value: "contest" },
            ]}
            // 이 컴포넌트는 현재 렌더 트리에서 사용되지 않는 미사용 파일입니다.
          // PC는 NewActivityList, 모바일은 MobileActivityList가 대신 사용됩니다.
          // 실제 필터 연동이 필요한 경우 해당 컴포넌트를 수정하세요.
          onChange={() => {}}
          />
          <Select
            size="small"
            width="small"
            type="checkbox"
            functionOptionType="reset"
            className="!rounded-full !w-[98px] !h-[34px]"
            options={[
              { label: "기획", value: "planning" },
              { label: "디자인", value: "design" },
              { label: "개발", value: "development" },
              { label: "마케팅", value: "marketing" },
              { label: "AI", value: "ai" },
            ]}
            onChange={() => {}}
          />
        </div>
      )}

      <div
        className={clsx("flex overflow-x-scroll hide-scrollbar w-full", type === "card" ? "gap-4" : "flex-col gap-2")}
      >
        {CardData.slice(0, type === "card" ? 10 : 3).map((item, index) => {
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
        })}
      </div>
    </div>
  );
}
