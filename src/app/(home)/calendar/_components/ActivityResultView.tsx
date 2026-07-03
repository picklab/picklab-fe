'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import Button from '@/components/common/Button/Button';
import Select from '@/components/common/Select/Select';
import CardDayBadge from '@/components/common/Card/CardDayBadge';
import CardChip, { type CardChipProps } from '@/components/common/Card/CardChip';
import useParticipationSummary from '@/hooks/useParticipationSummary';
import useActivityParticipationResults from '@/hooks/useActivityParticipationResults';
import type {
  ActivityParticipationResult,
  ApplicationStatus,
  ParticipationProgressStatus,
} from '@/types/review.types';

// 활동 결과 탭 — figma 시안(activity-result). 통계 카드 + 지원한 활동 리스트.
// 통계: useParticipationSummary. 리스트: activity-participations/results(실데이터).

export const PASS_OPTIONS = [
  { value: '', label: '합격여부' },
  { value: 'ACCEPTED', label: '합격' },
  { value: 'REJECTED', label: '불합격' },
];

export const PROGRESS_OPTIONS = [
  { value: '', label: '수료여부' },
  { value: 'COMPLETED', label: '수료완료' },
  { value: 'DROPPED', label: '중도포기' },
];

export const FILTER_OPTIONS = [
  { value: 'ACCEPTED', label: '합격' },
  { value: 'REJECTED', label: '불합격' },
];

export interface ResultActivity {
  id: string;
  participationId: number;
  activityId: number;
  badgeText: string;
  badgeVariant: 'default' | 'deadline';
  activityType: CardChipProps['text'];
  title: string;
  organizer: string;
  applyPeriod: string;
  activityPeriod: string;
  pass: string;
  progress: string;
  canWriteReview: boolean;
}

// 'YYYY-MM-DD'(또는 datetime) ~ → 'YY.MM.DD ~ YY.MM.DD'
function formatPeriod(start?: string | null, end?: string | null): string {
  // slice(2,10): 연도 앞 2자리 제거 + 'T...' datetime 꼬리 방어
  const fmt = (v?: string | null) => (v ? v.slice(2, 10).replace(/-/g, '.') : '');
  const s = fmt(start);
  const e = fmt(end);
  if (s && e) return `${s} ~ ${e}`;
  return s || e || '-';
}

// 모집 마감일 기준 배지 텍스트/변형
function toBadge(endDate?: string | null): { text: string; variant: 'default' | 'deadline' } {
  if (!endDate) return { text: '상시', variant: 'default' };
  const today = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (Number.isNaN(diff)) return { text: '상시', variant: 'default' };
  if (diff < 0) return { text: '마감', variant: 'default' };
  if (diff === 0) return { text: 'D-Day', variant: 'deadline' };
  return { text: `D-${String(diff).padStart(2, '0')}`, variant: 'deadline' };
}

export function mapResult(item: ActivityParticipationResult): ResultActivity {
  const badge = toBadge(item.recruitment_end_date);
  return {
    id: `result-${item.participation_id}`,
    participationId: item.participation_id,
    activityId: item.activity_id,
    badgeText: badge.text,
    badgeVariant: badge.variant,
    activityType: item.activity_type as CardChipProps['text'],
    title: item.title,
    organizer: item.organizer,
    applyPeriod: formatPeriod(item.recruitment_start_date, item.recruitment_end_date),
    activityPeriod: formatPeriod(item.activity_start_date, item.activity_end_date),
    pass: item.application_status === 'APPLIED' ? '' : item.application_status,
    progress: item.progress_status === 'NOT_SELECTED' || item.progress_status === 'IN_PROGRESSING' ? '' : item.progress_status,
    canWriteReview: item.can_write_review,
  };
}

export function StatCards() {
  const { data: summary } = useParticipationSummary();
  const results = [
    { title: '지원완료', value: summary.applied_count },
    { title: '최종합격', value: summary.accepted_count },
    { title: '불합격', value: summary.rejected_count },
    { title: '수료완료', value: summary.completed_count },
  ];

  return (
    <div className="flex gap-2 pc:gap-4">
      {results.map(({ title, value }) => (
        <div
          key={title}
          className="flex h-[80px] flex-1 flex-col items-center justify-center gap-1 rounded-[6px] border border-gray-30 pc:h-[102px]"
        >
          <Typography type="Body3Medium" className="text-gray-50">
            {title}
          </Typography>
          <Typography type="Heading1Semibold">{value}</Typography>
        </div>
      ))}
    </div>
  );
}

function ActivityResultCard({ activity }: { activity: ResultActivity }) {
  const router = useRouter();
  const [pass, setPass] = useState(activity.pass);
  const [progress, setProgress] = useState(activity.progress);
  const [passPending, setPassPending] = useState(false);
  const [progressPending, setProgressPending] = useState(false);

  // 합격여부 변경 → PATCH application-status (낙관적 + 롤백)
  // 플레이스홀더('')는 서버에 unset 개념이 없어 무시(로컬도 안 비워 서버값 유지)
  const handlePassChange = async (next: string) => {
    if (passPending || next === pass || !next) return;
    const prev = pass;
    setPass(next);
    setPassPending(true);
    try {
      const res = await fetch(`/api/activity-participations/${activity.participationId}/application-status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_status: next as ApplicationStatus }),
      });
      if (!res.ok) throw new Error('합격 여부 변경 실패');
    } catch {
      setPass(prev);
      window.alert('합격 여부 변경 중 오류가 발생했습니다.');
    } finally {
      setPassPending(false);
    }
  };

  // 수료여부 변경 → PATCH progress-status (낙관적 + 롤백)
  const handleProgressChange = async (next: string) => {
    if (progressPending || next === progress || !next) return;
    const prev = progress;
    setProgress(next);
    setProgressPending(true);
    try {
      const res = await fetch(`/api/activity-participations/${activity.participationId}/progress-status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress_status: next as ParticipationProgressStatus }),
      });
      if (!res.ok) throw new Error('수료 여부 변경 실패');
    } catch {
      setProgress(prev);
      window.alert('수료 여부 변경 중 오류가 발생했습니다.');
    } finally {
      setProgressPending(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-6 py-6">
      {/* 좌: 체크/배지/칩 + 제목/회사 (컨텐츠 너비 280px) */}
      <div className="flex w-[280px] shrink-0 flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-primary-50">
            <Icon icon="check" size={16} className="text-white" />
          </span>
          <CardDayBadge text={activity.badgeText} variant={activity.badgeVariant} typoType="Caption1Medium" />
          <CardChip text={activity.activityType} typoType="Caption1Medium" />
        </div>
        <div className="flex flex-col gap-1">
          <Typography type="Body1Semibold" className="line-clamp-2 text-gray-90">
            {activity.title}
          </Typography>
          <Typography type="Body4Medium" className="text-gray-50">
            {activity.organizer}
          </Typography>
        </div>
      </div>

      {/* 합격여부 / 수료여부 — 합격(ACCEPTED) 선택 시 텍스트 info-50 */}
      <div className="flex shrink-0 flex-col gap-2">
        <Select
          options={PASS_OPTIONS}
          value={pass}
          onChange={(v) => handlePassChange((v as string) ?? '')}
          width="small"
          size="small"
          className={pass === 'ACCEPTED' ? '[&>span]:!text-info-50' : undefined}
        />
        <Select
          options={PROGRESS_OPTIONS}
          value={progress}
          onChange={(v) => handleProgressChange((v as string) ?? '')}
          width="small"
          size="small"
        />
      </div>

      {/* 지원기간 / 활동기간 */}
      <div className="flex shrink-0 flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <Typography type="Body4Medium" className="text-gray-50">
            지원기간
          </Typography>
          <Typography type="Body4Medium" className="text-gray-70">
            {activity.applyPeriod}
          </Typography>
        </div>
        <div className="flex items-center gap-3">
          <Typography type="Body4Medium" className="text-gray-50">
            활동기간
          </Typography>
          <Typography type="Body4Medium" className="text-gray-70">
            {activity.activityPeriod}
          </Typography>
        </div>
      </div>

      {/* 리뷰 작성 (수료/중도포기 시에만 활성) */}
      <div className="flex shrink-0 items-center gap-4">
        <Button
          size="base"
          label="리뷰 작성하기"
          buttonStyle="outline-filled"
          icon={{ icon: 'pencil', position: 'left' }}
          isFullRounded
          disabled={!activity.canWriteReview}
          onClick={() => router.push(`/activity/${activity.activityId}/review`)}
        />
      </div>
    </div>
  );
}

export default function ActivityResultView() {
  const [filter, setFilter] = useState<string[]>([]);
  const { data: results, loading } = useActivityParticipationResults();

  const activities = useMemo(() => results.map(mapResult), [results]);

  // 합격여부 체크박스 필터(ACCEPTED/REJECTED)
  const filteredActivities = useMemo(() => {
    if (filter.length === 0) return activities;
    return activities.filter((a) => filter.includes(a.pass));
  }, [activities, filter]);

  return (
    <div className="flex flex-col gap-[60px]">
      <StatCards />

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <Typography type="Title3Bold" className="text-gray-90">
            지원한 활동
          </Typography>
          <Select
            options={FILTER_OPTIONS}
            value={filter}
            onChange={(v) => setFilter((v as string[]) ?? [])}
            type="checkbox"
            functionOptionType="reset"
            placeholder="합격여부"
            width="small"
            size="small"
            className="!rounded-[100px] [&>span]:!text-gray-90"
          />
        </div>

        {loading ? (
          <div className="flex min-h-[160px] items-center justify-center">
            <Typography type="Body2Medium" className="text-gray-50">
              불러오는 중...
            </Typography>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-gray-20">
            <Typography type="Body2Medium" className="text-gray-50">
              지원한 활동이 없어요.
            </Typography>
          </div>
        ) : (
          <div className="divide-y divide-gray-10 border-y border-gray-10">
            {filteredActivities.map((activity) => (
              <ActivityResultCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
