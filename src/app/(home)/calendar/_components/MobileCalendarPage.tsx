'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import Select from '@/components/common/Select/Select';
import CardDayBadge from '@/components/common/Card/CardDayBadge';
import CardChip, { type CardChipProps } from '@/components/common/Card/CardChip';
import useBookmarks from '@/hooks/useBookmarks';
import useActivityParticipationResults from '@/hooks/useActivityParticipationResults';
import { toggleBookmark } from '@/lib/bookmarks';
import MobileCalendarView from './MobileCalendarView';
import MobileActivityResultView from './MobileActivityResultView';
import CalendarFilterDropdown from './CalendarFilterDropdown';
import {
  APPLY_ALL_LABEL,
  APPLY_OPTIONS,
  APPLY_TRIGGER_LABEL,
  PROGRESS_ALL_LABEL,
  PROGRESS_OPTIONS,
  PROGRESS_TRIGGER_LABEL,
  type ApplyFilter,
  type ProgressFilter,
  type ScheduleTab,
  type ScheduleViewMode,
} from './filters';

const SORT_OPTIONS = [
  { value: 'RECENT', label: '최근 저장순' },
  { value: 'DEADLINE', label: '마감 임박순' },
];

const APPLIED_STATUSES = new Set(['APPLIED', 'ACCEPTED']);

interface MobileScheduleItem {
  id: string;
  detailLink: string;
  dday: string;
  activityType: CardChipProps['text'];
  title: string;
  organizer: string;
  applyStart: string;
  applyEnd: string;
  applied: boolean;
  isClosed: boolean;
  recruitmentEndDate?: string; // 마감 임박순 정렬용
}

interface MobileScheduleGroup {
  savedAt: string | null;
  items: MobileScheduleItem[];
}

/** "2025-02-10" → "25.02.10" */
function formatApplyDate(value?: string): string {
  if (!value) return '-';
  const m = value.match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1].slice(2)}.${m[2]}.${m[3]}` : value;
}

/** "2025-02-14" → "2025년 2월 14일" */
function formatSavedAt(value: string): string {
  const m = value.match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}년 ${Number(m[2])}월 ${Number(m[3])}일` : value;
}

function ScheduleCard({
  item,
  onOpen,
  onToggleApplied,
  onBookmark,
}: {
  item: MobileScheduleItem;
  onOpen: () => void;
  onToggleApplied: () => void;
  onBookmark: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      className="flex w-[160px] cursor-pointer flex-col gap-3 rounded-xl border border-gray-20 bg-white p-[14px]"
    >
      <div className="flex items-center gap-2">
        <CardDayBadge
          text={item.dday}
          variant={item.isClosed ? 'deadline' : 'default'}
          typoType="Caption1Medium"
        />
        <CardChip text={item.activityType} typoType="Caption1Medium" />
      </div>
      <div className="flex flex-col gap-1">
        <Typography type="Body2Semibold" className="line-clamp-2 text-gray-90">
          {item.title}
        </Typography>
        <Typography type="Caption1Medium" className="text-gray-50">
          {item.organizer}
        </Typography>
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <Typography type="Caption1Medium" className="text-gray-50">
            지원시작
          </Typography>
          <Typography type="Caption1Medium" className="text-gray-90">
            {item.applyStart}
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <Typography type="Caption1Medium" className="text-gray-50">
            지원마감
          </Typography>
          <Typography type="Caption1Medium" className="text-gray-90">
            {item.applyEnd}
          </Typography>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-pressed={item.applied}
          aria-label={item.applied ? '지원완료 취소' : '지원완료로 표시'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleApplied();
          }}
          className={clsx(
            'flex items-center gap-1 rounded-full px-3 py-1.5',
            item.applied ? 'bg-primary-50' : 'border border-gray-20',
          )}
        >
          <Icon icon="check" size={14} className={item.applied ? 'text-white' : 'text-gray-40'} />
          <Typography type="Caption1Medium" className={item.applied ? 'text-white' : 'text-gray-40'}>
            지원완료
          </Typography>
        </button>
        <Icon
          icon="bookmarkFill"
          size={20}
          className="cursor-pointer text-primary-50"
          role="button"
          tabIndex={0}
          aria-label="북마크 해제"
          onClick={(e) => {
            e.stopPropagation();
            onBookmark();
          }}
        />
      </div>
    </div>
  );
}

// 모바일 일정관리 화면 — figma PROFILE-004-001-002.
export default function MobileCalendarPage() {
  const router = useRouter();
  const [tab, setTab] = useState<ScheduleTab>('SCHEDULE');
  const [viewMode, setViewMode] = useState<ScheduleViewMode>('LIST');
  const [progressFilter, setProgressFilter] = useState<ProgressFilter[]>([]);
  const [applyFilter, setApplyFilter] = useState<ApplyFilter[]>([]);
  const [sort, setSort] = useState('RECENT');

  // 저장공고(북마크) + 지원여부(results)
  const { data: bookmarks, loading } = useBookmarks({ includeClosed: true });
  const { data: results } = useActivityParticipationResults();
  const [optimisticUnmarked, setOptimisticUnmarked] = useState<Set<string>>(new Set());
  const [appliedOverride, setAppliedOverride] = useState<Record<string, boolean>>({});

  const resetFilters = () => {
    setProgressFilter([]);
    setApplyFilter([]);
    setSort('RECENT');
  };

  // activity_id → 지원완료 여부
  const appliedMap = useMemo(() => {
    const map = new Map<string, boolean>();
    results.forEach((result) => {
      map.set(String(result.activity_id), APPLIED_STATUSES.has(result.application_status));
    });
    return map;
  }, [results]);

  // 저장공고 → 저장일(bookmarkedAt)별 그룹핑
  const groups = useMemo<MobileScheduleGroup[]>(() => {
    const active = bookmarks.filter((item) => !optimisticUnmarked.has(item.id));
    if (active.length === 0) return [];

    const byDate = new Map<string, MobileScheduleItem[]>();
    active.forEach((item) => {
      const scheduleItem: MobileScheduleItem = {
        id: item.id,
        detailLink: item.detailLink,
        dday: item.registrationPeriod,
        activityType: item.activityType as CardChipProps['text'],
        title: item.title || '-',
        organizer: item.organizer || '-',
        applyStart: formatApplyDate(item.recruitmentStartDate),
        applyEnd: formatApplyDate(item.recruitmentEndDate),
        applied: appliedOverride[item.id] ?? appliedMap.get(item.id) ?? false,
        isClosed: item.isClosed,
        recruitmentEndDate: item.recruitmentEndDate,
      };
      const key = item.bookmarkedAt ?? '';
      const arr = byDate.get(key) ?? [];
      arr.push(scheduleItem);
      byDate.set(key, arr);
    });

    return Array.from(byDate.entries()).map(([date, items]) => ({
      savedAt: date ? formatSavedAt(date) : null,
      items,
    }));
  }, [bookmarks, optimisticUnmarked, appliedMap, appliedOverride]);

  // 필터 + 정렬 적용 후 빈 그룹 제거
  const filteredGroups = useMemo<MobileScheduleGroup[]>(() => {
    return groups
      .map((group) => {
        const items = group.items.filter((item) => {
          if (progressFilter.length > 0) {
            const itemProgress = item.isClosed ? 'CLOSED' : 'ONGOING';
            if (!progressFilter.includes(itemProgress)) return false;
          }
          if (applyFilter.length > 0) {
            const itemApply = item.applied ? 'APPLIED' : 'NOT_APPLIED';
            if (!applyFilter.includes(itemApply)) return false;
          }
          return true;
        });
        if (sort === 'DEADLINE') {
          items.sort((a, b) => (a.recruitmentEndDate ?? '').localeCompare(b.recruitmentEndDate ?? ''));
        }
        return { ...group, items };
      })
      .filter((group) => group.items.length > 0);
  }, [groups, progressFilter, applyFilter, sort]);

  // 지원완료 토글: activityId만으로 POST(표시)/DELETE(취소). 낙관적 + 실패 롤백.
  const handleToggleApplied = async (item: MobileScheduleItem) => {
    const current = appliedOverride[item.id] ?? item.applied;
    const next = !current;
    setAppliedOverride((prev) => ({ ...prev, [item.id]: next }));
    try {
      const res = await fetch(`/api/activities/${item.id}/participations`, {
        method: next ? 'POST' : 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('지원 여부 변경 실패');
    } catch {
      setAppliedOverride((prev) => ({ ...prev, [item.id]: current }));
      window.alert('지원 여부 변경 중 오류가 발생했습니다.');
    }
  };

  // 북마크 해제(낙관적): 일정관리는 저장공고 목록이라 해제 시 목록에서 제거
  const handleBookmark = async (item: MobileScheduleItem) => {
    setOptimisticUnmarked((prev) => new Set(prev).add(item.id));
    try {
      await toggleBookmark({ activityId: item.id, isBookmarked: true });
    } catch {
      setOptimisticUnmarked((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col gap-5 pc:hidden">
      {/* 탭 */}
      <div className="flex border-b-[1.5px] border-gray-30">
        {(
          [
            { key: 'SCHEDULE', label: '일정 관리' },
            { key: 'RESULT', label: '활동 결과' },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={clsx(
              'relative flex flex-1 justify-center pb-2 pt-1',
              tab === key && 'after:absolute after:inset-x-0 after:bottom-[-2px] after:h-[3px] after:bg-primary-50',
            )}
          >
            <Typography
              type={tab === key ? 'Heading2Bold' : 'Heading2Semibold'}
              className={tab === key ? 'text-gray-90' : 'text-gray-40'}
            >
              {label}
            </Typography>
          </button>
        ))}
      </div>

      {tab === 'SCHEDULE' ? (
        <>
          {/* 목록형 / 캘린더형 토글 */}
          <div className="flex h-[46px] w-full items-center gap-1 rounded-[6px] bg-gray-20 p-1">
            {(
              [
                { key: 'LIST', label: '목록형' },
                { key: 'CALENDAR', label: '캘린더형' },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setViewMode(key)}
                className={clsx(
                  'flex h-full flex-1 items-center justify-center rounded-[4px]',
                  viewMode === key ? 'bg-gray-0' : 'bg-transparent',
                )}
              >
                <Typography type="Body1Medium" className={viewMode === key ? 'text-gray-90' : 'text-[#A5ADBB]'}>
                  {label}
                </Typography>
              </button>
            ))}
          </div>

          {/* 필터: 초기화 + 드롭다운 가로 스크롤 */}
          {viewMode === 'LIST' && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
              <button
                type="button"
                aria-label="필터 초기화"
                onClick={resetFilters}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50"
              >
                <Icon icon="largeRefresh" size={20} className="text-white" />
              </button>
              <div className="shrink-0">
                <CalendarFilterDropdown
                  placeholder={PROGRESS_TRIGGER_LABEL}
                  allLabel={PROGRESS_ALL_LABEL}
                  options={PROGRESS_OPTIONS}
                  selected={progressFilter}
                  onChange={setProgressFilter}
                />
              </div>
              <div className="shrink-0">
                <CalendarFilterDropdown
                  placeholder={APPLY_TRIGGER_LABEL}
                  allLabel={APPLY_ALL_LABEL}
                  options={APPLY_OPTIONS}
                  selected={applyFilter}
                  onChange={setApplyFilter}
                />
              </div>
              <Select
                options={SORT_OPTIONS}
                value={sort}
                onChange={(v) => setSort((v as string) ?? 'RECENT')}
                width="small"
                size="small"
                className="!rounded-[100px]"
                wrapperClassName="shrink-0"
              />
            </div>
          )}

          {viewMode === 'LIST' ? (
            loading ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <Typography type="Body2Medium" className="text-gray-50">
                  불러오는 중...
                </Typography>
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="flex min-h-[200px] items-center justify-center rounded-lg bg-gray-5">
                <Typography type="Body2Medium" className="text-gray-50">
                  조건에 맞는 저장한 공고가 없어요.
                </Typography>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {filteredGroups.map((group, groupIndex) => (
                  <div key={group.savedAt ?? `group-${groupIndex}`} className="flex flex-col gap-3">
                    {group.savedAt && (
                      <Typography type="Body1Semibold" className="text-gray-90">
                        {group.savedAt}
                      </Typography>
                    )}
                    <div className="grid grid-cols-2 gap-[15px]">
                      {group.items.map((item) => (
                        <ScheduleCard
                          key={item.id}
                          item={item}
                          onOpen={() => router.push(item.detailLink)}
                          onToggleApplied={() => handleToggleApplied(item)}
                          onBookmark={() => handleBookmark(item)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <MobileCalendarView />
          )}
        </>
      ) : (
        <MobileActivityResultView />
      )}
    </div>
  );
}
