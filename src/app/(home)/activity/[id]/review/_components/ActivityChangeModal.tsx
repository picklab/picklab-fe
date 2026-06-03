'use client';

import { useState } from 'react';
import clsx from 'clsx';
import Typography from '@/components/common/Typography';
import type { ActivityCardItem } from '@/app/(home)/_components/constant';
import useArchiveActivities, { type ArchiveActivityItem } from '@/hooks/useArchiveActivities';
import { ConfirmDialog, ModalShell } from './ReviewWriteShared';

interface ActivityChangeModalProps {
  onClose: () => void;
  onApply: (activity: ActivityCardItem, activityId: string) => void;
}

/** 아카이브 항목을 리뷰 작성용 ActivityCardItem(부분)으로 변환. 데이터 구조 불확실하여 방어적 매핑. */
function toActivityCardItem(item: ArchiveActivityItem): ActivityCardItem {
  return {
    detailLink: `/activity/${item.activityId}`,
    applyLink: '',
    activityType: typeof item.chipTitle === 'string' ? item.chipTitle : '대외활동',
    source: '',
    title: item.title,
    organizer: item.organization,
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
    thumbnailImage: item.thumbnail,
    detailImage: '',
    badgeText: '',
    viewCount: 0,
    saveCount: 0,
    isBookmarked: false,
  };
}

export default function ActivityChangeModal({ onClose, onApply }: ActivityChangeModalProps) {
  // 데이터 소스: GET /api/archive?sort=LATEST (useArchiveActivities). 응답 항목 매핑은 확인 필요.
  const { data, loading } = useArchiveActivities();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const selected = data.find((item) => item.id === selectedId) ?? null;

  const handleApply = () => {
    if (!selected) return;
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (!selected) return;
    onApply(toActivityCardItem(selected), selected.activityId);
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
              ) : data.length === 0 ? (
                <div className="flex h-[160px] items-center justify-center">
                  <Typography type="Body3Regular" className="text-gray-40">
                    활동이 없어요
                  </Typography>
                </div>
              ) : (
                data.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={clsx(
                      'grid h-[52px] w-full grid-cols-[2fr_1.5fr_1fr_1fr] items-center border-b border-gray-10 px-4 text-left transition-colors last:border-b-0',
                      selectedId === item.id ? 'bg-primary-5' : 'hover:bg-gray-5',
                    )}
                    aria-pressed={selectedId === item.id}
                  >
                    <Typography
                      type="Body3Medium"
                      className={clsx('truncate pr-2', selectedId === item.id ? 'text-primary-60' : 'text-gray-90')}
                    >
                      {item.title}
                    </Typography>
                    <Typography type="Body3Regular" className="truncate pr-2 text-gray-50">
                      {item.organization || '-'}
                    </Typography>
                    <Typography type="Body3Regular" className="text-gray-50">
                      {item.chipTitle}
                    </Typography>
                    {/* 수료여부: 백엔드가 수료여부(수료완료/중도하차) 필드를 내려주기 전까지 비워둠 */}
                    <div aria-hidden />
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
