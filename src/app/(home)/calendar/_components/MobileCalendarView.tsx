'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import Button from '@/components/common/Button/Button';
import Chip from '@/components/common/Calendar/Chip';
import CardDayBadge from '@/components/common/Card/CardDayBadge';
import CardChip, { type CardChipProps } from '@/components/common/Card/CardChip';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const FILTER_CHIPS = ['전체', '진행 중', '마감완료', '지원완료', '미지원'];

// TODO(MOCK): 이벤트 있는 날(점 표시) — 모집 시작/마감 API 필드 확정 시 교체.
const MOCK_EVENT_DAYS = new Set([9]);

interface DayActivity {
  id: string;
  eventType: 'start' | 'deadline';
  dday: string;
  activityType: CardChipProps['text'];
  title: string;
  organizer: string;
  applyPeriod: string;
}

// TODO(MOCK): 선택 날짜 활동 리스트.
const MOCK_ACTIVITIES: DayActivity[] = [
  {
    id: 'mc-1',
    eventType: 'start',
    dday: 'D-00',
    activityType: '공모전/해커톤',
    title: 'Title',
    organizer: 'company',
    applyPeriod: 'YY.MM.DD ~ YY.MM.DD',
  },
  {
    id: 'mc-2',
    eventType: 'start',
    dday: 'D-00',
    activityType: '공모전/해커톤',
    title: 'Title',
    organizer: 'company',
    applyPeriod: 'YY.MM.DD ~ YY.MM.DD',
  },
];

interface DayCell {
  day: number;
  current: boolean;
}

// 모바일 캘린더형 — figma MY PICK-006-001.
export default function MobileCalendarView() {
  const [cursor, setCursor] = useState(() => new Date(2025, 3, 1));
  const [selectedDay, setSelectedDay] = useState(15);
  const [filter, setFilter] = useState('전체');

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
            const hasEvent = cell.current && MOCK_EVENT_DAYS.has(cell.day);
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
          {MOCK_ACTIVITIES.map((activity) => (
            <div key={activity.id} className="flex flex-col gap-3 border-b border-gray-10 py-5">
              <div className="flex items-center gap-2">
                <Chip text={activity.eventType === 'start' ? '시작' : '마감'} period={activity.eventType} />
                <CardDayBadge text={activity.dday} variant="default" typoType="Caption1Medium" />
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
                  label="지원"
                  buttonStyle="filled"
                  icon={{ icon: 'check', position: 'left' }}
                  isFullRounded
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
