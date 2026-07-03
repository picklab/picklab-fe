'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import Icon from '@/components/common/Icon/Icon';
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
  COMPLETED: '수료완료',
  DROPPED: '중도하차',
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
  const [query, setQuery] = useState('');

  const writable = useMemo(() => data.filter((item) => item.can_write_review), [data]);
  const items = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return writable;
    return writable.filter((item) => item.title.toLowerCase().includes(keyword));
  }, [writable, query]);
  const selected = writable.find((item) => item.participation_id === selectedId) ?? null;

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
      <ModalShell title="어떤 활동에 참여하셨나요?" onClose={onClose} className="w-full max-w-[720px]">
        <div className="flex flex-col gap-6 px-space-32 pb-space-32 pt-space-16">
          {/* 활동명 검색 (클라이언트 필터) */}
          <div className="flex items-center gap-2 rounded-xl border border-gray-20 px-5 py-4 focus-within:border-gray-40">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="활동명을 검색해 보세요!"
              className="min-w-0 flex-1 bg-transparent text-gray-90 placeholder:text-gray-40 outline-none"
            />
            <Icon icon="search" size={24} className="shrink-0 text-gray-90" />
          </div>

          {/* 테이블 (상하 divider만, 행 단일 선택) */}
          <div>
            <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] items-center border-b border-gray-20 px-2 py-3">
              <Typography type="Body3Medium" className="text-center text-gray-50">
                활동명
              </Typography>
              <Typography type="Body3Medium" className="text-center text-gray-50">
                주체기관/단체명
              </Typography>
              <Typography type="Body3Medium" className="text-center text-gray-50">
                활동구분
              </Typography>
              <Typography type="Body3Medium" className="text-center text-gray-50">
                수료여부
              </Typography>
            </div>
            {/* 6개 초과 시 스크롤 */}
            <div className="max-h-[360px] overflow-y-auto">
              {loading ? (
                <div className="flex h-[160px] items-center justify-center">
                  <Typography type="Body3Regular" className="text-gray-40">
                    불러오는 중이에요...
                  </Typography>
                </div>
              ) : items.length === 0 ? (
                <div className="flex h-[160px] items-center justify-center">
                  <Typography type="Body3Regular" className="text-gray-40">
                    {writable.length === 0 ? '리뷰를 작성할 수 있는 활동이 없어요' : '검색 결과가 없어요'}
                  </Typography>
                </div>
              ) : (
                items.map((item) => {
                  const isSelected = selectedId === item.participation_id;
                  return (
                    <button
                      key={item.participation_id}
                      type="button"
                      onClick={() => setSelectedId(item.participation_id)}
                      className={clsx(
                        'grid min-h-[64px] w-full grid-cols-[2fr_1.5fr_1fr_1fr] items-center border-b border-gray-10 px-2 py-3 text-left transition-colors last:border-b-0',
                        isSelected ? 'bg-primary-5' : 'hover:bg-gray-5',
                      )}
                      aria-pressed={isSelected}
                    >
                      <Typography
                        type={isSelected ? 'Body3Semibold' : 'Body3Medium'}
                        className="line-clamp-2 break-keep pr-2 text-gray-90"
                      >
                        {item.title}
                      </Typography>
                      <Typography type="Body3Regular" className="truncate px-2 text-center text-gray-50">
                        {item.organizer || '-'}
                      </Typography>
                      <div className="flex justify-center">
                        <span className="inline-flex items-center rounded-full bg-gray-10 px-2.5 py-1">
                          <Typography type="Caption1Medium" className="text-gray-50">
                            {ACTIVITY_TYPE_LABELS[item.activity_type] ?? item.activity_type}
                          </Typography>
                        </span>
                      </div>
                      <Typography type="Body3Regular" className="text-center text-gray-90">
                        {PROGRESS_LABELS[item.progress_status] ?? '-'}
                      </Typography>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* 하단 버튼 (가운데 정렬) */}
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-[56px] w-[200px] rounded-small bg-gray-5 hover:bg-gray-10"
            >
              <Typography type="Body1Medium" className="text-gray-50">
                나가기
              </Typography>
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!selected}
              className="h-[56px] w-[200px] rounded-small bg-primary-50 hover:bg-primary-60 disabled:bg-gray-10"
            >
              <Typography type="Body1Medium" className={selected ? 'text-gray-0' : 'text-gray-60'}>
                작성하기
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
