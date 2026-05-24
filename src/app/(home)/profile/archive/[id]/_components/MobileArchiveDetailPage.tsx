'use client';
import Button from '@/components/common/Button/Button';
import CardChip from '@/components/common/Card/CardChip';
import TextArea from '@/components/common/Field/TextArea';
import Select from '@/components/common/Select/Select';
import Typography from '@/components/common/Typography';
import useArchiveActivities from '@/hooks/useArchiveActivities';
import { getFormatDate } from '@/utils/day';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

type MobileArchiveDetailPageProps = {
  archiveId?: string;
};

function formatPeriod(startDate?: Date | null, endDate?: Date | null) {
  if (!startDate || !endDate) return '-';
  return `${getFormatDate(startDate)}~${getFormatDate(endDate)}`;
}

export default function MobileArchiveDetailPage({ archiveId = 'storybook' }: MobileArchiveDetailPageProps) {
  const router = useRouter();
  const { data: archiveItems, loading, error } = useArchiveActivities();
  const archiveItem = useMemo(() => archiveItems.find((item) => item.id === archiveId), [archiveId, archiveItems]);

  return (
    <div className="mobile:flex pc:hidden">
      <form
        action=""
        className="flex flex-col gap-8"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="flex flex-col gap-3 p-[18px] border rounded-lg">
          <div className="flex flex-col gap-1.5 p-1">
            <CardChip text={archiveItem?.chipTitle ?? '대외활동'} className="cursor-pointer" />
            <div className="flex flex-col gap-0.5">
              <Typography type="Body1Semibold" className="text-gray-90 truncate">
                {loading
                  ? '아카이브 활동을 불러오는 중입니다.'
                  : error
                    ? '아카이브 활동을 불러오지 못했습니다.'
                    : archiveItem?.title || '아카이브 활동을 찾을 수 없습니다.'}
              </Typography>
              {archiveItem?.organization && (
                <Typography type="Caption1Medium" className="text-gray-50">
                  {archiveItem.organization}
                </Typography>
              )}
            </div>
            <Typography type="Caption1Medium" className="text-gray-50">
              활동기간 {formatPeriod(archiveItem?.startDate, archiveItem?.endDate)}
            </Typography>
          </div>
          <Button
            type="button"
            label="공고 보기"
            size="base"
            buttonStyle="outlined"
            disabled={!archiveItem?.activityId}
            onClick={() => archiveItem?.activityId && router.push(`/activity/${archiveItem.activityId}`)}
          />
        </div>
        <div className="flex flex-col gap-[18px]">
          <div className="flex gap-2 items-end ">
            <Select
              label="담당 역할"
              id="signup-employment"
              options={[
                { label: '재직중', value: 'employed' },
                { label: '구직중', value: 'job_seeking' },
                { label: '프리랜서', value: 'freelancer' },
                { label: '학생', value: 'student' },
                { label: '기타', value: 'other' },
              ]}
              // value={signupData.userInfo.employmentStatus}
              onChange={() => {}}
              labelStatus="default"
              className="w-[143px]"
              placeholder="역할"
            />
            <Select
              id="signup-subrole"
              options={[
                { label: '재직중', value: 'employed' },
                { label: '구직중', value: 'job_seeking' },
                { label: '프리랜서', value: 'freelancer' },
                { label: '학생', value: 'student' },
                { label: '기타', value: 'other' },
              ]}
              // value={signupData.userInfo.employmentStatus}
              onChange={() => {}}
              width="default"
              className="w-[184px]"
              placeholder="세부 역할"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <TextArea
              label="활동 기록"
              placeholder="이 활동에서 어떤 역할을 맡았는지 자세히 작성해 주세요."
              status="default"
              maxLength={100}
              className="max-w-[335px]"
              //   onChange={() => {}}
              value=""
              labelStatus="default"
              id="activity-record"
            />
          </div>
        </div>

        <div className="flex flex-col gap-[18px]">
          <div>
            <Typography type="Body1Semibold" className="text-gray-90">
              관련 자료 (수료증 파일, 사진, 공고 사진 등)
            </Typography>
          </div>
          <div className="flex gap-2">
            <Button label="파일 첨부" size="base" buttonStyle="outlined" />
            <Button label="URL 첨부" size="base" buttonStyle="outlined" />
          </div>
        </div>

        <Button type="submit" label="저장하기" size="base" buttonStyle="filled" className="w-40 h-12 mx-auto" disabled />
      </form>
    </div>
  );
}
