'use client';

import { useRouter } from 'next/navigation';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import Button from '@/components/common/Button/Button';
import CardDayBadge from '@/components/common/Card/CardDayBadge';
import CardChip from '@/components/common/Card/CardChip';
import type { CalendarEventItem } from './useCalendarEvents';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function formatHeader(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}. ${m}. ${d} (${WEEKDAYS[date.getDay()]})`;
}

interface DayDetailPanelProps {
  date: Date;
  activities: CalendarEventItem[];
  onClose: () => void;
  onChangeDate: (delta: number) => void;
}

// 캘린더 날짜 클릭 시 우측에 열리는 상세 패널 — 선택 날짜의 활동 카드 리스트.
export default function DayDetailPanel({ date, activities, onClose, onChangeDate }: DayDetailPanelProps) {
  const router = useRouter();
  return (
    <div className="flex h-[598px] w-[417px] shrink-0 flex-col gap-5 rounded-2xl bg-gray-5 p-5">
      {/* 헤더: 날짜 네비(가운데 그룹) + 닫기(우측) */}
      <div className="relative flex items-center justify-center pt-1">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="이전 날짜"
            onClick={() => onChangeDate(-1)}
            className="flex h-[26px] w-[26px] items-center justify-center rounded-lg border border-gray-20 bg-gray-0"
          >
            <Icon icon="chevronLeft" width={11} height={11} className="text-gray-90" />
          </button>
          <Typography type="Title3Bold" className="text-gray-90">
            {formatHeader(date)}
          </Typography>
          <button
            type="button"
            aria-label="다음 날짜"
            onClick={() => onChangeDate(1)}
            className="flex h-[26px] w-[26px] items-center justify-center rounded-lg border border-gray-20 bg-gray-0"
          >
            <Icon icon="chevronRight" width={11} height={11} className="text-gray-90" />
          </button>
        </div>
        <button type="button" aria-label="닫기" onClick={onClose} className="absolute right-0 top-0">
          <Icon icon="xMark" size={24} className="text-gray-90" />
        </button>
      </div>

      {/* 카드 리스트 */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <Typography type="Body2Medium" className="text-gray-50">
              이 날짜에 예정된 공고가 없어요.
            </Typography>
          </div>
        ) : (
          activities.map((activity) => (
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
              className="flex cursor-pointer flex-col gap-4 rounded-2xl bg-gray-0 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CardDayBadge
                    text={activity.dday}
                    variant={activity.isClosed ? 'deadline' : 'default'}
                    typoType="Caption1Medium"
                  />
                  <CardChip text={activity.activityType} typoType="Caption1Medium" />
                </div>
                <Icon icon="bookmarkFill" size={24} className="text-primary-50" />
              </div>

              <div className="flex flex-col gap-1">
                <Typography type="Body1Semibold" className="text-gray-90">
                  {activity.title}
                </Typography>
                <Typography type="Body4Medium" className="text-gray-50">
                  {activity.organizer}
                </Typography>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Typography type="Body4Medium" className="text-gray-50">
                    지원기간 :
                  </Typography>
                  <Typography type="Body4Medium" className="text-gray-90">
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
          ))
        )}
      </div>
    </div>
  );
}
