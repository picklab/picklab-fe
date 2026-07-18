"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import Typography from "@/components/common/Typography";
import Chip from "@/components/common/Calendar/Chip";
import DayDetailPanel from "./DayDetailPanel";
import useCalendarEvents from "./useCalendarEvents";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

interface DayCell {
  day: number;
  current: boolean; // 현재 표시 중인 달 소속 여부
  key: string | null; // 이벤트 조회 키(현재 달만)
}

// 캘린더형 월 그리드 — figma(일정관리 UX 2-25064) + 사용자 제공 시안.
export default function CalendarMonthView() {
  // 현재 달부터 시작. 화살표로 월 이동.
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  // 날짜 클릭 시 우측 상세 패널 노출(+ 캘린더 축소)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 저장공고 모집기간 → 날짜별 시작/마감 이벤트
  const { byDate } = useCalendarEvents();

  const year = cursor.getFullYear();
  const month = cursor.getMonth(); // 0-indexed

  const cells = useMemo<DayCell[]>(() => {
    const startWeekday = new Date(year, month, 1).getDay(); // 0=일
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const result: DayCell[] = [];
    // 앞쪽: 이전 달 잔여
    for (let i = startWeekday - 1; i >= 0; i -= 1) {
      result.push({ day: prevMonthDays - i, current: false, key: null });
    }
    // 현재 달
    for (let d = 1; d <= daysInMonth; d += 1) {
      result.push({ day: d, current: true, key: dateKey(year, month, d) });
    }
    // 뒤쪽: 다음 달로 마지막 주 채움
    let nextDay = 1;
    while (result.length % 7 !== 0) {
      result.push({ day: nextDay, current: false, key: null });
      nextDay += 1;
    }
    return result;
  }, [year, month]);

  const moveMonth = (delta: number) => {
    setCursor(new Date(year, month + delta, 1));
    setSelectedDate(null); // 월 이동 시 패널 닫기
  };

  const handleSelectDay = (cell: DayCell) => {
    if (!cell.current) return;
    setSelectedDate(new Date(year, month, cell.day));
  };

  // 패널 헤더 화살표: 선택 날짜 ±1일. 월이 바뀌면 그리드도 따라 이동.
  const changeSelectedDate = (delta: number) => {
    if (!selectedDate) return;
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + delta);
    setSelectedDate(next);
    if (next.getFullYear() !== year || next.getMonth() !== month) {
      setCursor(new Date(next.getFullYear(), next.getMonth(), 1));
    }
  };

  const panelOpen = selectedDate != null;
  const weeks = cells.length / 7;

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더: 이전/다음 + 년월 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="이전 달"
          onClick={() => moveMonth(-1)}
          className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] border border-gray-20">
          <Icon icon="chevronLeft" width={10} height={10} className="text-gray-90" />
        </button>
        <span className="text-[32px] font-bold leading-none text-gray-90">
          {year}.{String(month + 1).padStart(2, "0")}
        </span>
        <button
          type="button"
          aria-label="다음 달"
          onClick={() => moveMonth(1)}
          className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] border border-gray-20">
          <Icon icon="chevronRight" width={10} height={10} className="text-gray-90" />
        </button>
      </div>

      {/* 그리드 + 패널 — 같은 줄, 상·하단 정렬(동일 높이) */}
      <div className="flex items-start gap-[23px]">
        {/* 그리드 — 패널 열리면 598 높이로 축소(행 균등 분배) */}
        <div
          className="grid min-w-0 flex-1 grid-cols-7 border-l border-t border-gray-10"
          style={
            panelOpen
              ? { height: 598, gridTemplateRows: `40px repeat(${weeks}, minmax(0, 1fr))` }
              : undefined
          }
        >
          {/* 요일 헤더 */}
          {WEEKDAYS.map((weekday) => (
            <div
              key={weekday}
              className="flex h-[40px] items-center border-b border-r border-gray-10 bg-gray-5 px-3">
              <Typography type="Body3Medium" className="text-gray-60">
                {weekday}
              </Typography>
            </div>
          ))}

          {/* 날짜 셀 */}
          {cells.map((cell, index) => {
            const events = cell.key ? (byDate.get(cell.key) ?? []) : [];
            const isSelected =
              cell.current &&
              selectedDate != null &&
              selectedDate.getFullYear() === year &&
              selectedDate.getMonth() === month &&
              selectedDate.getDate() === cell.day;
            return (
              <div
                key={`${cell.key ?? "pad"}-${index}`}
                onClick={() => handleSelectDay(cell)}
                className={clsx(
                  "flex flex-col gap-2 overflow-hidden border-b border-r border-gray-10 p-3",
                  panelOpen ? "min-h-0" : "min-h-[180px]",
                  cell.current && "cursor-pointer",
                  isSelected && "border-[0.4px] border-primary-50 bg-[#E5F7EF]",
                )}>
                <Typography
                  type="Body3Medium"
                  className={cell.current ? "text-gray-70" : "text-gray-30"}>
                  {cell.day}
                </Typography>
                {events.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    {events.map((event, eventIndex) => (
                      <div key={eventIndex} className="flex items-center gap-1.5">
                        <Chip
                          text={event.type === "start" ? "시작" : "마감"}
                          period={event.type === "start" ? "start" : "deadline"}
                          className="shrink-0"
                        />
                        <Typography
                          type="Caption1Medium"
                          className={clsx(
                            "truncate",
                            event.type === "start"
                              ? "text-gray-40"
                              : "text-gray-90",
                          )}>
                          {event.title}
                        </Typography>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedDate && (
          <DayDetailPanel
            date={selectedDate}
            activities={
              byDate.get(
                dateKey(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()),
              ) ?? []
            }
            onClose={() => setSelectedDate(null)}
            onChangeDate={changeSelectedDate}
          />
        )}
      </div>
    </div>
  );
}
