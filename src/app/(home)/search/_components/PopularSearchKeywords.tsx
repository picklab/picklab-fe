"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";

type RankChange = "up" | "down" | "none";

interface PopularKeyword {
  rank: number;
  keyword: string;
  change: RankChange;
}

// 백엔드 trend(UP/DOWN/SAME/NEW) → UI change 매핑. (SAME/NEW는 변동 없음 '-' 표시)
function trendToChange(trend: unknown): RankChange {
  if (trend === "UP") return "up";
  if (trend === "DOWN") return "down";
  return "none";
}

// "2026-06-21T14:00:00" → "14:00 기준"
function formatAggregatedAt(value: unknown): string {
  if (typeof value !== "string") return "";
  const match = value.match(/T(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]} 기준` : "";
}

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
  const [keywords, setKeywords] = useState<PopularKeyword[]>([]);
  const [aggregatedAt, setAggregatedAt] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/search/popular-keywords")
      .then((res) => {
        if (!res.ok) throw new Error("인기 검색어 조회 실패");
        return res.json();
      })
      .then((json) => {
        if (!active) return;
        const data = json?.data ?? json;
        const items = Array.isArray(data?.keywords) ? data.keywords : [];
        setKeywords(
          items.map((item: Record<string, unknown>) => ({
            rank: typeof item.rank === "number" ? item.rank : 0,
            keyword: typeof item.keyword === "string" ? item.keyword : "",
            change: trendToChange(item.trend),
          })),
        );
        setAggregatedAt(formatAggregatedAt(data?.aggregated_at));
      })
      .catch(() => {
        if (!active) return;
        setKeywords([]);
        setAggregatedAt("");
      });
    return () => {
      active = false;
    };
  }, []);

  const left = keywords.slice(0, 5);
  const right = keywords.slice(5, 10);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <span className="text-[16px] font-semibold text-gray-90">
          인기 검색어
        </span>
        {aggregatedAt && (
          <span className="text-[12px] font-medium text-gray-50">{aggregatedAt}</span>
        )}
      </div>
      {keywords.length === 0 ? (
        <p className="mt-3 text-[13px] text-gray-50">
          아직 집계된 인기 검색어가 없어요.
        </p>
      ) : (
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
      )}
    </div>
  );
}
