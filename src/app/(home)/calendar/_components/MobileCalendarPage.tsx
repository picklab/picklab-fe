'use client';

import { useState } from 'react';
import clsx from 'clsx';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import Select from '@/components/common/Select/Select';
import CardDayBadge from '@/components/common/Card/CardDayBadge';
import CardChip, { type CardChipProps } from '@/components/common/Card/CardChip';
import MobileCalendarView from './MobileCalendarView';
import MobileActivityResultView from './MobileActivityResultView';
import {
  APPLY_OPTIONS,
  PROGRESS_OPTIONS,
  type ApplyFilter,
  type ProgressFilter,
  type ScheduleTab,
  type ScheduleViewMode,
} from './filters';

const SORT_OPTIONS = [
  { value: 'RECENT', label: '최근 저장순' },
  { value: 'DEADLINE', label: '마감 임박순' },
];

interface MobileScheduleItem {
  id: string;
  dday: string;
  activityType: CardChipProps['text'];
  title: string;
  organizer: string;
  applyStart: string;
  applyEnd: string;
  applied: boolean;
}

interface MobileScheduleGroup {
  savedAt: string;
  items: MobileScheduleItem[];
}

// TODO(MOCK): 디자인 확인용 가데이터 — 실데이터(useBookmarks/results) 연동 시 교체.
function mockItem(id: string): MobileScheduleItem {
  return {
    id,
    dday: 'D-00',
    activityType: '대외활동',
    title: '제 9회 미래에셋증권 AI 페스티벌',
    organizer: '미래에셋증권',
    applyStart: 'YY.MM.DD',
    applyEnd: 'YY.MM.DD',
    applied: false,
  };
}
const MOCK_GROUPS: MobileScheduleGroup[] = [
  { savedAt: '2025년 2월 13일', items: ['m1', 'm2', 'm3', 'm4'].map(mockItem) },
  { savedAt: '2025년 2월 13일', items: ['m5', 'm6', 'm7', 'm8'].map(mockItem) },
];

function ScheduleCard({ item }: { item: MobileScheduleItem }) {
  return (
    <div className="flex w-[160px] flex-col gap-3 rounded-xl border border-gray-20 bg-white p-[14px]">
      <div className="flex items-center gap-2">
        <CardDayBadge text={item.dday} variant="default" typoType="Caption1Medium" />
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
        <div
          className={clsx(
            'flex items-center gap-1 rounded-full px-3 py-1.5',
            item.applied ? 'bg-primary-50' : 'border border-gray-20',
          )}
        >
          <Icon icon="check" size={14} className={item.applied ? 'text-white' : 'text-gray-40'} />
          <Typography type="Caption1Medium" className={item.applied ? 'text-white' : 'text-gray-40'}>
            지원완료
          </Typography>
        </div>
        <Icon icon="bookmarkFill" size={20} className="text-primary-50" />
      </div>
    </div>
  );
}

// 모바일 일정관리 화면 — figma PROFILE-004-001-002.
export default function MobileCalendarPage() {
  const [tab, setTab] = useState<ScheduleTab>('SCHEDULE');
  const [viewMode, setViewMode] = useState<ScheduleViewMode>('LIST');
  const [progressFilter, setProgressFilter] = useState<ProgressFilter>('ALL');
  const [applyFilter, setApplyFilter] = useState<ApplyFilter>('ALL');
  const [sort, setSort] = useState('RECENT');

  const resetFilters = () => {
    setProgressFilter('ALL');
    setApplyFilter('ALL');
    setSort('RECENT');
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
              <Select
                options={PROGRESS_OPTIONS}
                value={progressFilter}
                onChange={(v) => setProgressFilter((v as ProgressFilter) ?? 'ALL')}
                width="small"
                size="small"
                className="!rounded-[100px]"
                wrapperClassName="shrink-0"
              />
              <Select
                options={APPLY_OPTIONS}
                value={applyFilter}
                onChange={(v) => setApplyFilter((v as ApplyFilter) ?? 'ALL')}
                width="small"
                size="small"
                className="!rounded-[100px]"
                wrapperClassName="shrink-0"
              />
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
            <div className="flex flex-col gap-6">
              {MOCK_GROUPS.map((group, groupIndex) => (
                <div key={`${group.savedAt}-${groupIndex}`} className="flex flex-col gap-3">
                  <Typography type="Body1Semibold" className="text-gray-90">
                    {group.savedAt}
                  </Typography>
                  <div className="grid grid-cols-2 gap-[15px]">
                    {group.items.map((item) => (
                      <ScheduleCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
