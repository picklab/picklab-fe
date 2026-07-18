'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import Button from '@/components/common/Button/Button';
import Chip from '@/components/common/Calendar/Chip';
import CardDayBadge from '@/components/common/Card/CardDayBadge';
import CardChip from '@/components/common/Card/CardChip';
import useActivityParticipationResults from '@/hooks/useActivityParticipationResults';
import useCalendarEvents from './useCalendarEvents';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const FILTER_CHIPS = ['전체', '진행 중', '마감완료', '지원완료', '미지원'] as const;
const APPLIED_STATUSES = new Set(['APPLIED', 'ACCEPTED']);

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

interface DayCell {
  day: number;
  current: boolean;
}

// 모바일 캘린더형 — figma MY PICK-006-001.
export default function MobileCalendarView() {
  const router = useRouter();
  const now = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(now.getDate());
  const [filter, setFilter] = useState<(typeof FILTER_CHIPS)[number]>('전체');

  // 저장공고 모집기간 → 날짜별 이벤트 + 지원여부(results)
  const { byDate } = useCalendarEvents();
  const { data: results } = useActivityParticipationResults();

  const appliedMap = useMemo(() => {
    const map = new Map<string, boolean>();
    results.forEach((result) => {
      map.set(String(result.activity_id), APPLIED_STATUSES.has(result.application_status));
    });
    return map;
  }, [results]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const cells = useMemo<DayCell[]>(() => {
    const startWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const result: DayCell[] = [];
    for (let i = startWeekday - 1; i >= 0; i -= 1) result.push({ day: prevMonthDays - i, current: false });
    for (let d = 1; d <= daysInMonth; d += 1) result.push({ day: d, current: true });
    while (result.length % 7 !== 0) result.push({ day: result.length, current: false });
    return result;
  }, [year, month]);

  const moveMonth = (delta: number) => setCursor(new Date(year, month + delta, 1));

  // 현재 달에서 이벤트(시작/마감)가 있는 날짜 집합 → 점 표시
  const eventDays = useMemo<Set<number>>(() => {
    const days = new Set<number>();
    byDate.forEach((_events, key) => {
      const m = key.match(/(\d{4})-(\d{2})-(\d{2})/);
      if (m && Number(m[1]) === year && Number(m[2]) === month + 1) {
        days.add(Number(m[3]));
      }
    });
    return days;
  }, [byDate, year, month]);

  // 선택 날짜의 이벤트 리스트(필터 적용)
  const dayActivities = useMemo(() => {
    const list = byDate.get(toDateKey(year, month, selectedDay)) ?? [];
    return list.filter((event) => {
      const applied = appliedMap.get(event.activityId) ?? false;
      switch (filter) {
        case '진행 중':
          return !event.isClosed;
        case '마감완료':
          return event.isClosed;
        case '지원완료':
          return applied;
        case '미지원':
          return !applied;
        default:
          return true;
      }
    });
  }, [byDate, year, month, selectedDay, filter, appliedMap]);

  return (
    <div className="flex flex-col gap-6">
      {/* 캘린더 헤더 */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="이전 달"
          onClick={() => moveMonth(-1)}
          className="flex h-[28px] w-[28px] items-center justify-center rounded-lg border border-gray-20"
        >
          <Icon icon="chevronLeft" width={13} height={13} className="text-gray-90" />
        </button>
        <span className="text-[20px] font-semibold text-gray-90">
          {year}.{String(month + 1).padStart(2, '0')}
        </span>
        <button
          type="button"
          aria-label="다음 달"
          onClick={() => moveMonth(1)}
          className="flex h-[28px] w-[28px] items-center justify-center rounded-lg border border-gray-20"
        >
          <Icon icon="chevronRight" width={13} height={13} className="text-gray-90" />
        </button>
      </div>

      {/* 요일 + 날짜 그리드 */}
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-7 justify-items-center gap-x-[19px] border-b border-gray-10 pb-2">
          {WEEKDAYS.map((weekday) => (
            <Typography key={weekday} type="Body3Medium" className="text-gray-40">
              {weekday}
            </Typography>
          ))}
        </div>
        <div className="grid grid-cols-7 justify-items-center gap-x-[19px] gap-y-2">
          {cells.map((cell, index) => {
            const isSelected = cell.current && cell.day === selectedDay;
            const hasEvent = cell.current && eventDays.has(cell.day);
            return (
              <button
                key={`${cell.day}-${index}`}
                type="button"
                onClick={() => cell.current && setSelectedDay(cell.day)}
                className="relative flex h-8 w-8 items-center justify-center"
              >
                <span
                  className={clsx(
                    'flex h-8 w-8 items-center justify-center rounded-full',
                    isSelected && 'bg-primary-50',
                  )}
                >
                  <Typography
                    type="Body2Medium"
                    className={isSelected ? 'text-white' : cell.current ? 'text-gray-90' : 'text-gray-30'}
                  >
                    {cell.day}
                  </Typography>
                </span>
                {hasEvent && !isSelected && (
                  <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary-50" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 하단 시트: 핸들 + 필터칩 + 활동 리스트 */}
      {/* 하단 drawer: 상단 모서리 radius 20px */}
      <div className="flex flex-col rounded-t-[20px] bg-white pt-3">
        <div className="mx-auto h-1 w-9 rounded-full bg-gray-20" />

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setFilter(chip)}
              className={clsx(
                'flex h-[36px] shrink-0 items-center rounded-[100px] border px-4',
                filter === chip ? 'border-primary-50' : 'border-gray-20',
              )}
            >
              <Typography type="Body3Medium" className={filter === chip ? 'text-primary-50' : 'text-gray-60'}>
                {chip}
              </Typography>
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col border-t border-gray-20">
          {dayActivities.length === 0 ? (
            <div className="flex min-h-[120px] items-center justify-center">
              <Typography type="Body2Medium" className="text-gray-50">
                이 날짜에 예정된 공고가 없어요.
              </Typography>
            </div>
          ) : (
            dayActivities.map((activity) => {
              const applied = appliedMap.get(activity.activityId) ?? false;
              return (
                <div
                  key={`${activity.activityId}-${activity.type}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(activity.detailLink)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      router.push(activity.detailLink);
                    }
                  }}
                  className="flex cursor-pointer flex-col gap-3 border-b border-gray-10 py-5"
                >
                  <div className="flex items-center gap-2">
                    <Chip
                      text={activity.type === 'start' ? '시작' : '마감'}
                      period={activity.type === 'start' ? 'start' : 'deadline'}
                    />
                    <CardDayBadge
                      text={activity.dday}
                      variant={activity.isClosed ? 'deadline' : 'default'}
                      typoType="Caption1Medium"
                    />
                    <CardChip text={activity.activityType} typoType="Caption1Medium" />
                    <Icon icon="bookmarkFill" size={24} className="ml-auto text-primary-50" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Typography type="Body1Semibold" className="text-gray-90">
                      {activity.title}
                    </Typography>
                    <Typography type="Body4Medium" className="text-gray-50">
                      {activity.organizer}
                    </Typography>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-0.5">
                      <Typography type="Caption1Medium" className="text-gray-50">
                        지원기간
                      </Typography>
                      <Typography type="Caption1Medium" className="text-gray-90">
                        {activity.applyPeriod}
                      </Typography>
                    </div>
                    <Button
                      size="sm"
                      label={applied ? '지원완료' : '지원'}
                      buttonStyle={applied ? 'filled' : 'outlined'}
                      icon={{ icon: 'check', position: 'left' }}
                      isFullRounded
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
