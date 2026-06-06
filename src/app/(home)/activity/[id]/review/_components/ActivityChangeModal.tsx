'use client';

import { useState } from 'react';
import clsx from 'clsx';
import Typography from '@/components/common/Typography';
import type { ActivityCardItem } from '@/app/(home)/_components/constant';
import useActivityParticipationResults from '@/hooks/useActivityParticipationResults';
import type { ActivityParticipationResult, ParticipationProgressStatus } from '@/types/review.types';
import { ConfirmDialog, ModalShell } from './ReviewWriteShared';

interface ActivityChangeModalProps {
  onClose: () => void;
  onApply: (activity: ActivityCardItem, activityId: string, participationId: number) => void;
}

// activity_type(코드) → 한글 라벨
const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  EXTRACURRICULAR: '대외활동',
  EDUCATION: '교육',
  COMPETITION: '공모전/해커톤',
  SEMINAR: '강연/세미나',
};

// 수료여부(progress_status) → 한글 라벨
const PROGRESS_LABELS: Record<ParticipationProgressStatus, string> = {
  COMPLETED: '수료 완료',
  DROPPED: '중도 하차',
  IN_PROGRESSING: '진행 중',
  NOT_SELECTED: '-',
};

/** 활동 참여 결과(ActivityParticipationResult)를 리뷰 작성용 ActivityCardItem(부분)으로 변환. */
function toActivityCardItem(item: ActivityParticipationResult): ActivityCardItem {
  return {
    detailLink: `/activity/${item.activity_id}`,
    applyLink: '',
    activityType: ACTIVITY_TYPE_LABELS[item.activity_type] ?? item.activity_type,
    source: '',
    title: item.title,
    organizer: item.organizer,
    companyType: '',
    target: '',
    registrationPeriod: '',
    activityPeriod: '',
    recruitment: '',
    region: '',
    homepage: '',
    contestField: '',
    activityField: '',
    costPrize: '',
    description: '',
    thumbnailImage: item.thumbnail_url ?? '/imgs/cat.jpg',
    detailImage: '',
    badgeText: '',
    viewCount: 0,
    saveCount: 0,
    isBookmarked: false,
  };
}

export default function ActivityChangeModal({ onClose, onApply }: ActivityChangeModalProps) {
  // 데이터 소스: GET /api/activity-participations/results (리뷰 작성 대상). 작성 가능(can_write_review)만 노출.
  const { data, loading } = useActivityParticipationResults();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const items = data.filter((item) => item.can_write_review);
  const selected = items.find((item) => item.participation_id === selectedId) ?? null;

  const handleApply = () => {
    if (!selected) return;
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (!selected) return;
    onApply(toActivityCardItem(selected), String(selected.activity_id), selected.participation_id);
    setConfirmOpen(false);
    onClose();
  };

  return (
    <>
      <ModalShell title="어떤 활동으로 바꾸실 건가요?" onClose={onClose} className="w-full max-w-[720px]">
        <div className="flex flex-col gap-4 px-space-24 pb-space-24 pt-space-16">
          <div className="rounded-lg border border-gray-20">
            <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] border-b border-gray-20 bg-gray-5 px-4 py-3">
              {['활동명', '주체기관·단체명', '활동구분', '수료여부'].map((h) => (
                <Typography key={h} type="Body3Semibold" className="text-gray-70">
                  {h}
                </Typography>
              ))}
            </div>
            {/* 행 단일 선택. 최대 6개 표출, 6개 이상이면 스크롤(행 약 52px × 6 = 312px) */}
            <div className="max-h-[312px] overflow-y-auto">
              {loading ? (
                <div className="flex h-[160px] items-center justify-center">
                  <Typography type="Body3Regular" className="text-gray-40">
                    불러오는 중이에요...
                  </Typography>
                </div>
              ) : items.length === 0 ? (
                <div className="flex h-[160px] items-center justify-center">
                  <Typography type="Body3Regular" className="text-gray-40">
                    리뷰를 작성할 수 있는 활동이 없어요
                  </Typography>
                </div>
              ) : (
                items.map((item) => (
                  <button
                    key={item.participation_id}
                    type="button"
                    onClick={() => setSelectedId(item.participation_id)}
                    className={clsx(
                      'grid h-[52px] w-full grid-cols-[2fr_1.5fr_1fr_1fr] items-center border-b border-gray-10 px-4 text-left transition-colors last:border-b-0',
                      selectedId === item.participation_id ? 'bg-primary-5' : 'hover:bg-gray-5',
                    )}
                    aria-pressed={selectedId === item.participation_id}
                  >
                    <Typography
                      type="Body3Medium"
                      className={clsx(
                        'truncate pr-2',
                        selectedId === item.participation_id ? 'text-primary-60' : 'text-gray-90',
                      )}
                    >
                      {item.title}
                    </Typography>
                    <Typography type="Body3Regular" className="truncate pr-2 text-gray-50">
                      {item.organizer || '-'}
                    </Typography>
                    <Typography type="Body3Regular" className="text-gray-50">
                      {ACTIVITY_TYPE_LABELS[item.activity_type] ?? item.activity_type}
                    </Typography>
                    <Typography type="Body3Regular" className="text-gray-50">
                      {PROGRESS_LABELS[item.progress_status] ?? '-'}
                    </Typography>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="h-space-48 w-full rounded-small bg-gray-5 hover:bg-gray-10">
              <Typography type="Body2Medium" className="text-gray-90">
                나가기
              </Typography>
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!selected}
              className="h-space-48 w-full rounded-small bg-primary-50 hover:bg-primary-60 disabled:bg-gray-10"
            >
              <Typography type="Body2Medium" className={selected ? 'text-gray-0' : 'text-gray-60'}>
                적용하기
              </Typography>
            </button>
          </div>
        </div>
      </ModalShell>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="활동을 변경할까요?"
        description="입력하신 정보는 저장되지 않습니다."
        cancelLabel="취소"
        confirmLabel="변경하기"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
