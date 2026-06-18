'use client';

import { useState } from 'react';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import Button from '@/components/common/Button/Button';
import Select from '@/components/common/Select/Select';
import CardDayBadge from '@/components/common/Card/CardDayBadge';
import CardChip, { type CardChipProps } from '@/components/common/Card/CardChip';
import useParticipationSummary from '@/hooks/useParticipationSummary';

// 활동 결과 탭 — figma 시안(activity-result). 통계 카드 + 지원한 활동 리스트.
// 통계: useParticipationSummary(200). 리스트: activity-participations/results(500 블로커) → 목업 폴백.

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
  badgeText: string;
  badgeVariant: 'default' | 'deadline';
  activityType: CardChipProps['text'];
  title: string;
  organizer: string;
  applyPeriod: string;
  activityPeriod: string;
  pass: string;
  progress: string;
  bookmarked: boolean;
}

// TODO(MOCK): 디자인 확인용 가데이터 — results API(500) 해소 시 실데이터로 교체.
export const MOCK_ACTIVITIES: ResultActivity[] = [
  {
    id: 'result-1',
    badgeText: '종료',
    badgeVariant: 'default',
    activityType: '공모전/해커톤',
    title: 'BIAF2025 온라인서포터즈 애니_ON',
    organizer: 'BIAF 조직위원회',
    applyPeriod: 'YY.MM.DD ~ YY.MM.DD',
    activityPeriod: 'YY.MM.DD ~ YY.MM.DD',
    pass: '',
    progress: '',
    bookmarked: true,
  },
  {
    id: 'result-2',
    badgeText: '종료',
    badgeVariant: 'default',
    activityType: '대외활동',
    title: 'Super Rookie Challenge Season 16 서포터즈 모집',
    organizer: '(주)셰르파뮤직',
    applyPeriod: 'YY.MM.DD ~ YY.MM.DD',
    activityPeriod: 'YY.MM.DD ~ YY.MM.DD',
    pass: 'ACCEPTED',
    progress: 'COMPLETED',
    bookmarked: true,
  },
  {
    id: 'result-3',
    badgeText: '오늘마감',
    badgeVariant: 'deadline',
    activityType: '대외활동',
    title: '포항 방석리 어촌마을 살아보기 프로그램 참여자 모집(~6/9)',
    organizer: '오션캠퍼스',
    applyPeriod: 'YY.MM.DD ~ YY.MM.DD',
    activityPeriod: 'YY.MM.DD ~ YY.MM.DD',
    pass: '',
    progress: '',
    bookmarked: true,
  },
];

export function StatCards() {
  const { data: summary } = useParticipationSummary();
  const total =
    summary.applied_count + summary.accepted_count + summary.rejected_count + summary.completed_count;
  // 데이터 없으면(미로그인/빈값) 디자인 확인용 목업(50) 폴백
  const results =
    total > 0
      ? [
          { title: '지원완료', value: summary.applied_count },
          { title: '최종합격', value: summary.accepted_count },
          { title: '불합격', value: summary.rejected_count },
          { title: '수료완료', value: summary.completed_count },
        ]
      : [
          { title: '지원완료', value: 50 },
          { title: '최종합격', value: 50 },
          { title: '불합격', value: 50 },
          { title: '수료완료', value: 50 },
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
  const [pass, setPass] = useState(activity.pass);
  const [progress, setProgress] = useState(activity.progress);

  return (
    <div className="flex items-center gap-[91px] py-6">
      {/* 좌: 체크/배지/칩 + 제목/회사 */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-primary-50">
            <Icon icon="check" size={16} className="text-white" />
          </span>
          <CardDayBadge text={activity.badgeText} variant={activity.badgeVariant} typoType="Caption1Medium" />
          <CardChip text={activity.activityType} typoType="Caption1Medium" />
        </div>
        <div className="flex flex-col gap-1">
          <Typography type="Headline2SemiBold" className="line-clamp-2 text-gray-90">
            {activity.title}
          </Typography>
          <Typography type="Body4Medium" className="text-gray-50">
            {activity.organizer}
          </Typography>
        </div>
      </div>

      {/* 합격여부 / 수료여부 */}
      <div className="flex shrink-0 flex-col gap-2">
        <Select
          options={PASS_OPTIONS}
          value={pass}
          onChange={(v) => setPass((v as string) ?? '')}
          width="small"
          size="small"
        />
        <Select
          options={PROGRESS_OPTIONS}
          value={progress}
          onChange={(v) => setProgress((v as string) ?? '')}
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

      {/* 리뷰 작성 + 북마크 */}
      <div className="flex shrink-0 items-center gap-4">
        <Button
          size="sm"
          label="리뷰 작성하기"
          buttonStyle="outline-filled"
          icon={{ icon: 'pencil', position: 'left' }}
          isFullRounded
          className="w-[134px]"
        />
        <Icon
          icon={activity.bookmarked ? 'bookmarkFill' : 'bookmarkLine'}
          size={24}
          className={activity.bookmarked ? 'text-primary-50' : 'text-gray-40'}
        />
      </div>
    </div>
  );
}

export default function ActivityResultView() {
  const [filter, setFilter] = useState<string[]>([]);

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
            className="!rounded-[100px]"
          />
        </div>

        <div className="divide-y divide-gray-10 rounded-xl border border-gray-20 px-6">
          {MOCK_ACTIVITIES.map((activity) => (
            <ActivityResultCard key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
}
