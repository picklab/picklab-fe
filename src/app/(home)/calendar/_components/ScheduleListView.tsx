'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import CardDayBadge from '@/components/common/Card/CardDayBadge';
import CardChip, { type CardChipProps } from '@/components/common/Card/CardChip';
import useBookmarks from '@/hooks/useBookmarks';
import useActivityParticipationResults from '@/hooks/useActivityParticipationResults';
import { toggleBookmark } from '@/lib/bookmarks';
import type { ApplyFilter, ProgressFilter } from './filters';

interface ScheduleListViewProps {
  progressFilter: ProgressFilter[]; // 빈 배열 = 전체
  applyFilter: ApplyFilter[]; // 빈 배열 = 모든 활동
}

const APPLIED_STATUSES = new Set(['APPLIED', 'ACCEPTED']);

// 목록형 카드의 표시 모델 (실데이터/목업 공통)
interface ScheduleItem {
  id: string;
  detailLink: string;
  dday: string; // 'D-00' / '마감' 등
  activityType: string;
  organizer: string;
  title: string;
  applyStart: string; // 'YY.MM.DD' or '-'
  applyEnd: string;
  applied: boolean;
  isClosed: boolean;
}

// 저장일 그룹
interface ScheduleGroup {
  savedAt: string | null; // '2025년 2월 14일' or null(헤더 없음)
  items: ScheduleItem[];
}

// ─────────────────────────────────────────────────────────────
// TODO(MOCK): 디자인 확인용 가데이터 — 실 저장공고가 없을 때만 폴백.
// 백엔드 필드(저장일/모집기간/지원여부) 확정되면 이 블록 통째로 삭제.
const MOCK_GROUPS: ScheduleGroup[] = [
  {
    savedAt: '2025년 2월 14일',
    items: [
      {
        id: 'mock-1',
        detailLink: '/calendar',
        dday: 'D-03',
        activityType: '공모전/해커톤',
        organizer: '주최기관 A',
        title: '2025 대학생 아이디어 공모전',
        applyStart: '25.02.10',
        applyEnd: '25.02.28',
        applied: false,
        isClosed: false,
      },
      {
        id: 'mock-2',
        detailLink: '/calendar',
        dday: 'D-07',
        activityType: '대외활동',
        organizer: '주최기관 B',
        title: '글로벌 서포터즈 2기 모집',
        applyStart: '25.02.12',
        applyEnd: '25.03.05',
        applied: true,
        isClosed: false,
      },
    ],
  },
  {
    savedAt: '2025년 2월 13일',
    items: [
      {
        id: 'mock-3',
        detailLink: '/calendar',
        dday: '마감',
        activityType: '교육',
        organizer: '주최기관 C',
        title: '프론트엔드 부트캠프 5기',
        applyStart: '25.01.20',
        applyEnd: '25.02.10',
        applied: true,
        isClosed: true,
      },
      {
        id: 'mock-4',
        detailLink: '/calendar',
        dday: 'D-Day',
        activityType: '강연/세미나',
        organizer: '주최기관 D',
        title: 'UX 디자인 트렌드 세미나',
        applyStart: '25.02.01',
        applyEnd: '25.02.13',
        applied: false,
        isClosed: false,
      },
    ],
  },
];
// ─────────────────────────────────────────────────────────────

// 목록형 일정관리 카드 리스트 — figma 2527-24643.
// 데이터: 저장공고(useBookmarks) + 지원여부(activity-participations/results).
// TODO(데이터): ① 공고저장일 그룹핑(북마크 응답에 저장일 필드 없음) ② 지원 시작/마감일(응답에 모집 기간 필드 없음)
//   → 백엔드 필드 제공 시 그룹 헤더/날짜 채움. ③ results 500 블로커 해소 시 지원여부 정상 반영.
export default function ScheduleListView({ progressFilter, applyFilter }: ScheduleListViewProps) {
  const router = useRouter();
  const { data: bookmarks, loading } = useBookmarks();
  const { data: results } = useActivityParticipationResults();
  const [optimisticUnmarked, setOptimisticUnmarked] = useState<Set<string>>(new Set());
  // 지원완료 토글 낙관적 오버라이드 (activityId → applied). undefined면 results 기반 item.applied 사용.
  const [appliedOverride, setAppliedOverride] = useState<Record<string, boolean>>({});

  // activity_id → 지원완료 여부 맵
  const appliedMap = useMemo(() => {
    const map = new Map<string, boolean>();
    results.forEach((result) => {
      map.set(String(result.activity_id), APPLIED_STATUSES.has(result.application_status));
    });
    return map;
  }, [results]);

  // 실 저장공고 → 단일 그룹(헤더 없음). 비어 있으면 목업 폴백.
  const groups = useMemo<ScheduleGroup[]>(() => {
    const realItems: ScheduleItem[] = bookmarks
      .filter((item) => !optimisticUnmarked.has(item.id))
      .map((item) => ({
        id: item.id,
        detailLink: item.detailLink,
        dday: item.registrationPeriod,
        activityType: item.activityType,
        organizer: item.organizer,
        title: item.title,
        applyStart: '-',
        applyEnd: '-',
        applied: appliedMap.get(item.id) ?? false,
        isClosed: item.registrationPeriod === '마감',
      }));

    if (realItems.length === 0) return MOCK_GROUPS; // TODO(MOCK): 폴백
    return [{ savedAt: null, items: realItems }];
  }, [bookmarks, optimisticUnmarked, appliedMap]);

  // 필터 적용 후 빈 그룹 제거
  const filteredGroups = useMemo<ScheduleGroup[]>(() => {
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (progressFilter.length > 0) {
            const itemProgress = item.isClosed ? 'CLOSED' : 'ONGOING';
            if (!progressFilter.includes(itemProgress)) return false;
          }
          if (applyFilter.length > 0) {
            const itemApply = item.applied ? 'APPLIED' : 'NOT_APPLIED';
            if (!applyFilter.includes(itemApply)) return false;
          }
          return true;
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, progressFilter, applyFilter]);

  // 지원완료 토글: activityId만으로 POST(지원완료 표시)/DELETE(취소). 낙관적 + 실패 롤백.
  const handleToggleApplied = async (item: ScheduleItem) => {
    if (item.id.startsWith('mock-')) return; // 목업은 토글 무시
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
      setAppliedOverride((prev) => ({ ...prev, [item.id]: current })); // 롤백
      window.alert('지원 여부 변경 중 오류가 발생했습니다.');
    }
  };

  const handleBookmark = async (item: ScheduleItem) => {
    if (item.id.startsWith('mock-')) return; // 목업은 토글 무시
    // 북마크 해제(낙관적): 일정관리는 저장공고 목록이라 해제 시 목록에서 제거
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

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Typography type="Body2Medium" className="text-gray-50">
          불러오는 중...
        </Typography>
      </div>
    );
  }

  if (filteredGroups.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg bg-gray-5">
        <Typography type="Body2Medium" className="text-gray-50">
          조건에 맞는 저장한 공고가 없어요.
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {filteredGroups.map((group, groupIndex) => (
        <div
          key={group.savedAt ?? `group-${groupIndex}`}
          className="flex flex-col gap-4 rounded-xl bg-gray-5 p-4 pc:p-6"
        >
          {group.savedAt && (
            <Typography type="Body3Medium" className="mb-4 self-end text-gray-50">
              공고저장 | {group.savedAt}
            </Typography>
          )}
          {group.items.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => router.push(item.detailLink)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  router.push(item.detailLink);
                }
              }}
              className="flex cursor-pointer flex-col gap-3 rounded-lg bg-white p-4 pc:flex-row pc:items-center pc:gap-6 pc:px-6 pc:py-5"
            >
              {/* 배지 + 칩 (기존 디자인 시스템 컴포넌트 재사용). CSV 11 ②: 배지↔제목 36px(gap-6 24 + mr-3 12) */}
              <div className="flex shrink-0 flex-col items-start gap-2 pc:mr-3 pc:w-[120px]">
                <CardDayBadge
                  text={item.dday}
                  variant={item.isClosed ? 'deadline' : 'default'}
                  typoType="Caption1Medium"
                />
                <CardChip text={item.activityType as CardChipProps['text']} typoType="Caption1Medium" />
              </div>

              {/* company / title */}
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Typography type="Body4Medium" className="truncate text-gray-50">
                  {item.organizer || '-'}
                </Typography>
                <Typography type="Headline2SemiBold" className="truncate text-gray-90">
                  {item.title || '-'}
                </Typography>
              </div>

              {/* 지원 시작/마감 */}
              <div className="flex shrink-0 flex-col gap-1 pc:w-[160px]">
                <div className="flex items-center gap-2">
                  <Typography type="Caption1Medium" className="text-gray-50">
                    지원 시작
                  </Typography>
                  <Typography type="Caption1Medium" className="text-gray-90">
                    {item.applyStart}
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  <Typography type="Caption1Medium" className="text-gray-50">
                    지원 마감
                  </Typography>
                  <Typography type="Caption1Medium" className="text-gray-90">
                    {item.applyEnd}
                  </Typography>
                </div>
              </div>

              {/* 지원완료 토글 (CSV 12): 클릭 시 POST/DELETE participations로 지원여부 변경 */}
              {(() => {
                const applied = appliedOverride[item.id] ?? item.applied;
                return (
                  <button
                    type="button"
                    aria-pressed={applied}
                    aria-label={applied ? '지원완료 취소' : '지원완료로 표시'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleApplied(item);
                    }}
                    className={clsx(
                      'flex h-[40px] w-[92px] shrink-0 items-center justify-center gap-0.5 rounded-full transition-colors',
                      applied ? 'bg-primary-50 hover:bg-primary-60' : 'border border-gray-20 hover:bg-gray-5',
                    )}
                  >
                    <Icon icon="check" size={16} className={applied ? 'text-white' : 'text-gray-40'} />
                    <Typography type="Body4Medium" className={applied ? 'text-white' : 'text-gray-40'}>
                      지원완료
                    </Typography>
                  </button>
                );
              })()}

              {/* 북마크 */}
              <Icon
                icon="bookmarkFill"
                size={24}
                className="shrink-0 cursor-pointer text-primary-50"
                role="button"
                tabIndex={0}
                aria-label="북마크 해제"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookmark(item);
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
