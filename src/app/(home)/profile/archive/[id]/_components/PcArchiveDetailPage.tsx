'use client';
import Button from '@/components/common/Button/Button';
import CardChip from '@/components/common/Card/CardChip';
import TextField from '@/components/common/Field/TextField';
import TextArea from '@/components/common/Field/TextArea';
import Select from '@/components/common/Select/Select';
import Typography from '@/components/common/Typography';
import useArchiveActivities from '@/hooks/useArchiveActivities';
import { getFormatDate } from '@/utils/day';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import FileAttachModal from '@/components/common/Modal/FileAttachModal';
import {
  type ArchiveRole,
  DETAIL_ROLE_OPTIONS,
  parsePresignedUploadInfo,
  readApiErrorMessage,
  ROLE_OPTIONS,
  toDateString,
} from './archiveRecordOptions';

type PcArchiveDetailPageProps = {
  archiveId?: string;
  isStorybook?: boolean;
};

function formatPeriod(startDate?: Date | null, endDate?: Date | null) {
  if (!startDate || !endDate) return '-';
  return `${getFormatDate(startDate)}~${getFormatDate(endDate)}`;
}

export default function PcArchiveDetailPage({ archiveId = 'storybook', isStorybook = false }: PcArchiveDetailPageProps) {
  const router = useRouter();
  const { data: archiveItems, loading, error } = useArchiveActivities();
  const archiveItem = useMemo(() => archiveItems.find((item) => item.id === archiveId), [archiveId, archiveItems]);
  const [role, setRole] = useState<ArchiveRole | ''>('');
  const [detailRole, setDetailRole] = useState('');
  const [activityRecord, setActivityRecord] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [referenceUrls, setReferenceUrls] = useState<string[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const detailRoleOptions = role ? [...DETAIL_ROLE_OPTIONS[role]] : [];
  const canSubmit =
    Boolean(archiveItem) &&
    Boolean(role) &&
    Boolean(detailRole) &&
    activityRecord.trim().length > 0 &&
    Boolean(toDateString(archiveItem?.startDate)) &&
    Boolean(toDateString(archiveItem?.endDate)) &&
    !isSubmitting;

  const handleAddReferenceUrl = () => {
    const trimmedUrl = referenceUrl.trim();
    if (!trimmedUrl || referenceUrls.includes(trimmedUrl)) return;
    setReferenceUrls((prev) => [...prev, trimmedUrl]);
    setReferenceUrl('');
  };

  const handleFileSubmit = async (files: File[]) => {
    if (!archiveItem || files.length === 0) return;

    try {
      setIsUploadingFiles(true);
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const presignedResponse = await fetch('/api/files/presigned-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            file_name: file.name,
            category: 'ARCHIVE',
            file_size: file.size,
            activity_id: Number(archiveItem.activityId) || undefined,
          }),
        });

        const presignedPayload = await presignedResponse.json().catch(() => ({}));
        if (!presignedResponse.ok) {
          window.alert(readApiErrorMessage(presignedPayload, '파일 업로드 URL 발급에 실패했습니다.'));
          return;
        }

        const presignedInfo = parsePresignedUploadInfo(presignedPayload);
        if (!presignedInfo) {
          window.alert('업로드 URL 정보를 해석할 수 없습니다.');
          return;
        }

        const uploadResponse = await fetch(presignedInfo.uploadUrl, {
          method: 'PUT',
          headers: file.type ? { 'Content-Type': file.type } : undefined,
          body: file,
        });

        if (!uploadResponse.ok) {
          window.alert('파일 업로드에 실패했습니다.');
          return;
        }

        uploadedUrls.push(presignedInfo.fileUrl || presignedInfo.uploadUrl.split('?')[0]);
      }

      setFileUrls((prev) => [...prev, ...uploadedUrls]);
      setIsFileModalOpen(false);
    } catch (uploadError) {
      console.error('아카이브 파일 업로드 중 오류 발생:', uploadError);
      window.alert('파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploadingFiles(false);
    }
  };

  const handleSubmit = async () => {
    if (!archiveItem || !role || !detailRole) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/archive/${archiveItem.id}/record`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          activity_record: activityRecord.trim(),
          role,
          detail_role: detailRole,
          file_urls: fileUrls,
          reference_urls: referenceUrls,
          start_date: toDateString(archiveItem.startDate),
          end_date: toDateString(archiveItem.endDate),
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        window.alert(readApiErrorMessage(payload, '아카이브 기록 저장에 실패했습니다.'));
        return;
      }

      window.alert('아카이브 기록이 저장되었습니다.');
      router.push('/profile/archive');
    } catch (submitError) {
      console.error('아카이브 기록 저장 중 오류 발생:', submitError);
      window.alert('아카이브 기록 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={clsx('max-w-[640px] mx-auto', isStorybook ? 'flex' : 'pc:flex mobile:hidden')}>
      <form
        action=""
        className="flex flex-col gap-8 w-full"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <div className="flex flex-col gap-3 p-6 border rounded-lg">
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
          <div className="flex gap-4 items-end">
            <Select
              label="담당 역할"
              id="pc-signup-employment"
              options={[...ROLE_OPTIONS]}
              value={role}
              onChange={(value) => {
                setRole((Array.isArray(value) ? value[0] : value || '') as ArchiveRole | '');
                setDetailRole('');
              }}
              labelStatus="default"
              className="h-12"
              width="full"
              placeholder="역할"
            />
            <Select
              id="pc-signup-subrole"
              options={detailRoleOptions}
              value={detailRole}
              onChange={(value) => setDetailRole(Array.isArray(value) ? value[0] || '' : value || '')}
              className="h-12"
              placeholder="세부 역할"
              width="full"
              disabled={!role}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <TextArea
              label="활동 기록"
              placeholder="이 활동에서 어떤 역할을 맡았는지 자세히 작성해 주세요."
              status="default"
              maxLength={300}
              className="w-[640px]"
              value={activityRecord}
              onChange={(event) => setActivityRecord(event.target.value)}
              labelStatus="default"
              id="pc-activity-record"
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
            <Button
              type="button"
              label={isUploadingFiles ? '업로드 중' : '파일 첨부'}
              size="base"
              buttonStyle="outlined"
              disabled={!archiveItem || isUploadingFiles}
              onClick={() => setIsFileModalOpen(true)}
            />
            <div className="flex flex-1 gap-2">
              <TextField
                id="pc-reference-url"
                placeholder="관련 URL 입력"
                status="default"
                value={referenceUrl}
                onChange={(event) => setReferenceUrl(event.target.value)}
              />
              <Button
                type="button"
                label="URL 첨부"
                size="base"
                buttonStyle="outlined"
                disabled={!referenceUrl.trim()}
                onClick={handleAddReferenceUrl}
              />
            </div>
          </div>
          {referenceUrls.length > 0 && (
            <div className="flex flex-col gap-2">
              {referenceUrls.map((url) => (
                <div key={url} className="flex items-center justify-between rounded bg-gray-5 px-3 py-2">
                  <Typography type="Body3Medium" className="max-w-[520px] truncate text-gray-70">
                    {url}
                  </Typography>
                  <button
                    type="button"
                    className="text-gray-50"
                    onClick={() => setReferenceUrls((prev) => prev.filter((item) => item !== url))}
                  >
                    <Typography type="Body3Medium">삭제</Typography>
                  </button>
                </div>
              ))}
            </div>
          )}
          {fileUrls.length > 0 && (
            <div className="flex flex-col gap-2">
              {fileUrls.map((url) => (
                <div key={url} className="flex items-center justify-between rounded bg-gray-5 px-3 py-2">
                  <Typography type="Body3Medium" className="max-w-[520px] truncate text-gray-70">
                    {url}
                  </Typography>
                  <button
                    type="button"
                    className="text-gray-50"
                    onClick={() => setFileUrls((prev) => prev.filter((item) => item !== url))}
                  >
                    <Typography type="Body3Medium">삭제</Typography>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 mx-auto">
          <Button
            type="button"
            label="나가기"
            size="base"
            buttonStyle="outlined"
            className="w-40 h-12 bg-gray-10"
            onClick={() => router.back()}
          />
          <Button
            type="submit"
            label={isSubmitting ? '저장 중' : '저장하기'}
            size="base"
            buttonStyle="filled"
            className="w-40 h-12"
            disabled={!canSubmit}
          />
        </div>
      </form>
      <FileAttachModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onSubmit={handleFileSubmit}
        title="관련 자료 첨부"
        description="수료증, 사진, 공고 이미지 등 아카이브에 남길 파일을 선택해 주세요."
      />
    </div>
  );
}
