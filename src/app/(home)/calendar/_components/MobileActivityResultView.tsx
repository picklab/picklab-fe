'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import Button from '@/components/common/Button/Button';
import Select from '@/components/common/Select/Select';
import CardDayBadge from '@/components/common/Card/CardDayBadge';
import CardChip from '@/components/common/Card/CardChip';
import useActivityParticipationResults from '@/hooks/useActivityParticipationResults';
import type { ApplicationStatus, ParticipationProgressStatus } from '@/types/review.types';
import {
  FILTER_OPTIONS,
  PASS_OPTIONS,
  PROGRESS_OPTIONS,
  StatCards,
  mapResult,
  type ResultActivity,
} from './ActivityResultView';

// 체크박스 옵션(placeholder용 빈 값 제외)
const PASS_FILTER = PASS_OPTIONS.filter((o) => o.value);
const PROGRESS_FILTER = PROGRESS_OPTIONS.filter((o) => o.value);

function MobileResultCard({ activity }: { activity: ResultActivity }) {
  const router = useRouter();
  const [pass, setPass] = useState<string[]>(activity.pass ? [activity.pass] : []);
  const [progress, setProgress] = useState<string[]>(activity.progress ? [activity.progress] : []);
  const [passPending, setPassPending] = useState(false);
  const [progressPending, setProgressPending] = useState(false);

  // 마지막 선택값을 단일 상태로 저장(체크박스 UI지만 합격/수료는 단일값)
  // 초기화(빈 값)는 서버에 unset 개념이 없어 무시(로컬도 안 비워 서버값 유지)
  const handlePassChange = async (values: string[]) => {
    const next = values[values.length - 1] ?? '';
    if (passPending || !next) return;
    setPass([next]);
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
      setPass(activity.pass ? [activity.pass] : []);
      window.alert('합격 여부 변경 중 오류가 발생했습니다.');
    } finally {
      setPassPending(false);
    }
  };

  const handleProgressChange = async (values: string[]) => {
    const next = values[values.length - 1] ?? '';
    if (progressPending || !next) return;
    setProgress([next]);
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
      setProgress(activity.progress ? [activity.progress] : []);
      window.alert('수료 여부 변경 중 오류가 발생했습니다.');
    } finally {
      setProgressPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-[18px] border-b border-gray-10 py-6">
      <div className="flex items-center gap-2">
        <span className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-primary-50">
          <Icon icon="check" size={16} className="text-white" />
        </span>
        <CardDayBadge text={activity.badgeText} variant={activity.badgeVariant} typoType="Caption1Medium" />
        <CardChip text={activity.activityType} typoType="Caption1Medium" />
      </div>

      <div className="flex flex-col gap-1">
        <Typography type="Body1Semibold" className="text-gray-90">
          {activity.title}
        </Typography>
        <Typography type="Caption2Regular" className="text-gray-90">
          {activity.organizer}
        </Typography>
      </div>

      {/* 합격여부 / 수료여부 */}
      <div className="flex gap-2">
        <Select
          options={PASS_FILTER}
          value={pass}
          onChange={(v) => handlePassChange((v as string[]) ?? [])}
          type="checkbox"
          functionOptionType="reset"
          placeholder="합격여부"
          width="full"
          size="small"
          wrapperClassName="flex-1"
          className="!h-[42px] [&_span]:!text-[13px] [&_span]:!font-medium [&_span]:!text-[#A5ADBB]"
        />
        <Select
          options={PROGRESS_FILTER}
          value={progress}
          onChange={(v) => handleProgressChange((v as string[]) ?? [])}
          type="checkbox"
          functionOptionType="reset"
          placeholder="수료여부"
          width="full"
          size="small"
          wrapperClassName="flex-1"
          className="!h-[42px] [&_span]:!text-[13px] [&_span]:!font-medium [&_span]:!text-[#A5ADBB]"
        />
      </div>

      {/* 지원기간 / 활동기간 */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <Typography type="Body4Regular" className="text-gray-50">
            지원기간
          </Typography>
          <Typography type="Body4Regular" className="text-gray-70">
            {activity.applyPeriod}
          </Typography>
        </div>
        <div className="flex items-center gap-3">
          <Typography type="Body4Regular" className="text-gray-50">
            활동기간
          </Typography>
          <Typography type="Body4Regular" className="text-gray-70">
            {activity.activityPeriod}
          </Typography>
        </div>
      </div>

      {/* 리뷰 작성 (수료/중도포기 시에만 활성) */}
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          label="리뷰 작성하기"
          buttonStyle="outline-filled"
          icon={{ icon: 'pencil', position: 'left' }}
          isFullRounded
          className="!h-[34px] flex-1"
          disabled={!activity.canWriteReview}
          onClick={() => router.push(`/activity/${activity.activityId}/review`)}
        />
      </div>
    </div>
  );
}

// 모바일 활동 결과 — figma MY PICK-006-002.
export default function MobileActivityResultView() {
  const [filter, setFilter] = useState<string[]>([]);
  const { data: results, loading } = useActivityParticipationResults();

  const activities = useMemo(() => results.map(mapResult), [results]);
  const filteredActivities = useMemo(() => {
    if (filter.length === 0) return activities;
    return activities.filter((a) => filter.includes(a.pass));
  }, [activities, filter]);

  return (
    <div className="flex flex-col gap-[34px]">
      <StatCards />

      <div className="flex flex-col gap-4">
        <Typography type="Headline1SemiBold" className="text-[#1E2939]">
          지원한 활동
        </Typography>
        <Select
          options={FILTER_OPTIONS}
          value={filter}
          onChange={(v) => setFilter((v as string[]) ?? [])}
          type="checkbox"
          functionOptionType="reset"
          placeholder="합격여부"
          width="xsmall"
          size="xsmall"
          className="!h-[34px] !w-[98px] !justify-start !gap-1 !rounded-[100px] !pl-3 !pr-2 [&_span]:!text-[14px] [&_svg]:!h-4 [&_svg]:!w-4"
          wrapperClassName="!w-[98px]"
        />

        {loading ? (
          <div className="flex min-h-[140px] items-center justify-center">
            <Typography type="Body3Medium" className="text-gray-50">
              불러오는 중...
            </Typography>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="flex min-h-[140px] items-center justify-center rounded-xl border border-gray-20">
            <Typography type="Body3Medium" className="text-gray-50">
              지원한 활동이 없어요.
            </Typography>
          </div>
        ) : (
          <div className="flex flex-col border-t border-gray-20">
            {filteredActivities.map((activity) => (
              <MobileResultCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
