'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import Typography from '@/components/common/Typography';
import ScheduleListView from './ScheduleListView';
import CalendarMonthView from './CalendarMonthView';
import ActivityResultView from './ActivityResultView';
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

// 일정관리(캘린더) 화면 — figma 2527-24643 / UX 2-25064.
// 목록형은 디자인 확보·구현 완료. 캘린더형 / 활동 결과 탭은 디자인·백엔드(results 500) 도착 시 채움.
export default function CalendarPage() {
  const searchParams = useSearchParams();
  // 마이페이지 '활동 결과 더보기'(?tab=result) 진입 시 활동 결과 탭으로 시작
  const [tab, setTab] = useState<ScheduleTab>(
    searchParams.get('tab') === 'result' ? 'RESULT' : 'SCHEDULE',
  );
  const [viewMode, setViewMode] = useState<ScheduleViewMode>('LIST');
  const [progressFilter, setProgressFilter] = useState<ProgressFilter[]>([]);
  const [applyFilter, setApplyFilter] = useState<ApplyFilter[]>([]);

  return (
    <div className="mx-auto hidden w-full max-w-[1100px] px-5 pb-20 pc:block pc:pt-10">
      {/* 상단 탭: 일정 관리 / 활동 결과 */}
      <div className={clsx('flex w-fit border-b-[1.5px] border-gray-30', tab === 'RESULT' ? 'mb-[28px]' : 'mb-8')}>
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
              'relative flex w-[146px] justify-center pb-3 pt-1',
              tab === key && 'after:absolute after:inset-x-0 after:bottom-[-2px] after:h-[3px] after:bg-primary-50',
            )}
          >
            <Typography type="Title3Bold" className={tab === key ? 'text-gray-90' : 'text-gray-40'}>
              {label}
            </Typography>
          </button>
        ))}
      </div>

      {tab === 'SCHEDULE' ? (
        <>
          <div className="mb-4 flex items-center justify-between">
            {/* 목록형 / 캘린더형 토글 (242×46, radius 6px, bg gray-20 / 선택 gray-0) */}
            <div className="flex h-[46px] w-[242px] items-center gap-1 rounded-[6px] bg-gray-20 p-1">
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
                  <Typography type="Body3Medium" className={viewMode === key ? 'text-gray-90' : 'text-[#A5ADBB]'}>
                    {label}
                  </Typography>
                </button>
              ))}
            </div>

            {/* 필터 드롭다운 2개 — 체크박스 다중선택(140×40), 목록형에서만 노출 (figma 2696-34096) */}
            {viewMode === 'LIST' && (
              <div className="flex gap-2">
                <CalendarFilterDropdown
                  placeholder={PROGRESS_TRIGGER_LABEL}
                  allLabel={PROGRESS_ALL_LABEL}
                  options={PROGRESS_OPTIONS}
                  selected={progressFilter}
                  onChange={setProgressFilter}
                />
                <CalendarFilterDropdown
                  placeholder={APPLY_TRIGGER_LABEL}
                  allLabel={APPLY_ALL_LABEL}
                  options={APPLY_OPTIONS}
                  selected={applyFilter}
                  onChange={setApplyFilter}
                />
              </div>
            )}
          </div>

          {viewMode === 'LIST' ? (
            <ScheduleListView progressFilter={progressFilter} applyFilter={applyFilter} />
          ) : (
            <CalendarMonthView />
          )}
        </>
      ) : (
        <ActivityResultView />
      )}
    </div>
  );
}
