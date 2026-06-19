"use client";

import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";

type RankChange = "up" | "down" | "none";

// TODO(인기검색어): 백엔드 랭킹+순위변동 API 미제공 → 더미 데이터(figma 2107-20308 정합용).
// API 생기면 이 상수를 응답 매핑으로 교체.
const POPULAR_KEYWORDS: {
  rank: number;
  keyword: string;
  change: RankChange;
}[] = [
  { rank: 1, keyword: "검색어명", change: "up" },
  { rank: 2, keyword: "검색어명", change: "down" },
  { rank: 3, keyword: "검색어명", change: "none" },
  { rank: 4, keyword: "검색어명", change: "up" },
  { rank: 5, keyword: "검색어명", change: "up" },
  { rank: 6, keyword: "검색어명", change: "up" },
  { rank: 7, keyword: "검색어명", change: "down" },
  { rank: 8, keyword: "검색어명", change: "none" },
  { rank: 9, keyword: "검색어명", change: "up" },
  { rank: 10, keyword: "검색어명", change: "up" },
];

function RankChangeBadge({ change }: { change: RankChange }) {
  if (change === "none") {
    return (
      <span className="rounded-full bg-gray-5 px-1 py-[1px] text-[11px] text-gray-60">
        -
      </span>
    );
  }

  const isUp = change === "up";
  return (
    <span
      className={clsx(
        "flex items-center gap-0.5 rounded-full px-1 py-[1px] text-[11px]",
        isUp ? "bg-danger-5 text-danger-50" : "bg-info-5 text-info-50",
      )}>
      <Icon icon={isUp ? "arrowUp" : "arrowDown"} size={14} />1
    </span>
  );
}

function RankItem({
  rank,
  keyword,
  change,
}: {
  rank: number;
  keyword: string;
  change: RankChange;
}) {
  return (
    <li className="flex items-center gap-1.5">
      <span className="w-5 text-[14px] font-semibold text-[#393939] flex items-center justify-center">
        {rank}
      </span>
      <span className="text-[13px] font-medium text-[#393939]">{keyword}</span>
      <RankChangeBadge change={change} />
    </li>
  );
}

export default function PopularSearchKeywords() {
  const left = POPULAR_KEYWORDS.slice(0, 5);
  const right = POPULAR_KEYWORDS.slice(5, 10);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <span className="text-[16px] font-semibold text-gray-90">
          인기 검색어
        </span>
        <span className="text-[11px] text-gray-50">00:00 기준</span>
      </div>
      <div className="mt-3 flex gap-x-[55px]">
        <ul className="flex flex-col gap-y-2 w-[140px]">
          {left.map((item) => (
            <RankItem key={item.rank} {...item} />
          ))}
        </ul>
        <ul className="flex flex-col gap-y-2 w-[140px]">
          {right.map((item) => (
            <RankItem key={item.rank} {...item} />
          ))}
        </ul>
      </div>
    </div>
  );
}
