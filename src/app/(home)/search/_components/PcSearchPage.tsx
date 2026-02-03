/** @format */

"use client";
import Card from "@/components/common/Card/Card";
import ChevronRight from "@/components/common/Icon/assets/ChevronRight";
import BoxTab from "@/components/common/Tab/BoxTab";
import Typography from "@/components/common/Typography";
import { useState } from "react";
import clsx from "clsx";

const TAB_LIST = [
  { label: "전체", value: "all" },
  { label: "대외활동", value: "activities" },
  { label: "강연/세미나", value: "seminar" },
  { label: "교육", value: "education" },
  { label: "공모전/해커톤", value: "contest" },
];

export default function PcSearchPage({ search, isStorybook = false }: { search: string; isStorybook?: boolean }) {
  const [activeTab, setActiveTab] = useState("all");
  const handleTabClick = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className={clsx("w-[1100px] px-5  flex-col gap-10", isStorybook ? "flex" : "hidden pc:flex")}>
      <div role="tablist" className="flex">
        {TAB_LIST.map((tab) => (
          <BoxTab
            key={tab.value}
            active={activeTab === tab.value}
            label={tab.label as "전체" | "대외활동" | "강연/세미나" | "교육" | "공모전/해커톤"}
            notiNumber="0"
            href={`/search/${search}?tab=${tab.value}`}
            id={tab.value}
            panelId={tab.value}
            onClick={() => handleTabClick(tab.value)}
          />
        ))}
      </div>
      <ActivityList title="대외활동" count={60} />
      <ActivityList title="강연/세미나" count={60} />
    </div>
  );
}

function ActivityList({ title, count }: { title: string; count: number }) {
  return (
    <div className="w-full flex flex-col gap-3">
      <div onClick={() => {}} className="w-full flex justify-between cursor-pointer">
        <Typography type="Headline2SemiBold">
          {title} {count}건
        </Typography>
        <div className="flex flex-row items-center gap-1">
          <Typography type="Body4Medium">더보기</Typography> <ChevronRight width={9} height={9} />
        </div>
      </div>
      <div className="flex gap-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            imageUrl={"/imgs/cat.jpg"}
            chipText="공모전/해커톤"
            badgeText="D-01"
            badgeVariant="default"
            isBookmarked={false}
            companyName="삼양 그룹"
            title="2025 삼양그룹 대학생 서포터즈 Samyang Seeds 9기"
            jobs={["개발"]}
            onBookmarkClick={() => {}}
            onCardClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
