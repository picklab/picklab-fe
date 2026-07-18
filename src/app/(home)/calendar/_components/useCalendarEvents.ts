'use client';

import { useMemo } from 'react';
import useBookmarks from '@/hooks/useBookmarks';
import type { CardChipProps } from '@/components/common/Card/CardChip';

export type CalendarEventType = 'start' | 'end'; // 모집 시작 / 마감

// 캘린더 셀·상세 패널이 공유하는 이벤트 표시 모델.
export interface CalendarEventItem {
  activityId: string;
  detailLink: string;
  dateKey: string; // 'YYYY-MM-DD' (이벤트가 걸린 날짜)
  type: CalendarEventType;
  dday: string; // 'D-00' / '마감' 등
  activityType: CardChipProps['text'];
  title: string;
  organizer: string;
  applyStart: string; // 'YY.MM.DD' or '-'
  applyEnd: string;
  applyPeriod: string; // 'YY.MM.DD ~ YY.MM.DD'
  isClosed: boolean;
}

/** "2025-02-10..." → "2025-02-10" (없으면 null) */
function toDateKey(value?: string): string | null {
  if (!value) return null;
  const m = value.match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

/** "2025-02-10" → "25.02.10" */
export function formatShortDate(value?: string): string {
  if (!value) return '-';
  const m = value.match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1].slice(2)}.${m[2]}.${m[3]}` : value;
}

/** 저장공고(모집기간)를 날짜별 시작/마감 이벤트로 변환. PC/모바일 캘린더 공용. */
export function useCalendarEvents() {
  const { data: bookmarks, loading } = useBookmarks({ includeClosed: true });

  const events = useMemo<CalendarEventItem[]>(() => {
    const result: CalendarEventItem[] = [];
    bookmarks.forEach((item) => {
      const applyStart = formatShortDate(item.recruitmentStartDate);
      const applyEnd = formatShortDate(item.recruitmentEndDate);
      const base = {
        activityId: item.id,
        detailLink: item.detailLink,
        dday: item.registrationPeriod,
        activityType: item.activityType as CardChipProps['text'],
        title: item.title || '-',
        organizer: item.organizer || '-',
        applyStart,
        applyEnd,
        applyPeriod: `${applyStart} ~ ${applyEnd}`,
        isClosed: item.isClosed,
      };
      const startKey = toDateKey(item.recruitmentStartDate);
      if (startKey) result.push({ ...base, dateKey: startKey, type: 'start' });
      const endKey = toDateKey(item.recruitmentEndDate);
      if (endKey) result.push({ ...base, dateKey: endKey, type: 'end' });
    });
    return result;
  }, [bookmarks]);

  // 날짜(YYYY-MM-DD) → 이벤트 목록
  const byDate = useMemo<Map<string, CalendarEventItem[]>>(() => {
    const map = new Map<string, CalendarEventItem[]>();
    events.forEach((event) => {
      const arr = map.get(event.dateKey) ?? [];
      arr.push(event);
      map.set(event.dateKey, arr);
    });
    return map;
  }, [events]);

  return { events, byDate, loading };
}

export default useCalendarEvents;
