'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import {
  JOB_DETAIL_BY_GROUP,
  JOB_GROUP_OPTIONS,
  RATING_OPTIONS,
  REVIEW_STATUS_OPTIONS,
  countActiveFilters,
  jobDetailLabel,
  jobGroupLabel,
} from '@/types/review.types';
import type { ReviewFilterValue, ReviewJobDetail, ReviewJobGroup } from '@/types/review.types';

type DropdownKey = 'job' | 'rating' | 'status';

/** 드롭다운 옵션용 체크박스 사각형 */
function CheckSquare({ selected }: { selected: boolean }) {
  return (
    <span
      className={clsx(
        'flex size-5 shrink-0 items-center justify-center rounded border',
        selected ? 'border-primary-50 bg-primary-50' : 'border-gray-30 bg-gray-0',
      )}
    >
      {selected && <Icon icon="check" size={12} className="text-gray-0" />}
    </span>
  );
}

/** 드롭다운 패널 하단 초기화(파란 새로고침) */
function PanelResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="mt-1 flex w-full items-center gap-1 px-2 py-2">
      <Icon icon="largeRefresh" size={16} className="text-info-60" />
      <Typography type="Body3Medium" className="text-info-60">
        초기화
      </Typography>
    </button>
  );
}

interface ReviewFiltersProps {
  value: ReviewFilterValue;
  onChange: (next: ReviewFilterValue) => void;
  onReset: () => void;
  variant?: 'pc' | 'mobile';
}

/**
 * 리뷰 목록 필터.
 * - 관심 직무: PC(2409-27595)=직군 탭 + 세부직무 칩 + 적용하기 / 모바일(2-25064)=직군 플랫 체크박스
 * - 총 평점 / 수료 여부: 양쪽 동일한 체크박스 다중 선택
 * - 트리거 크기: PC 132×40 / 모바일 128×40
 */
export default function ReviewFilters({ value, onChange, onReset, variant = 'pc' }: ReviewFiltersProps) {
  const isMobile = variant === 'mobile';
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<DropdownKey | null>(null);

  // PC 관심 직무: 임시 선택 상태 (적용하기 전까지 반영하지 않음)
  const [tempGroup, setTempGroup] = useState<ReviewJobGroup>(value.jobGroup ?? 'PLANNING');
  const [tempDetails, setTempDetails] = useState<ReviewJobDetail[]>(value.jobDetails);

  useEffect(() => {
    if (!open) return;
    const handle = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(null);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  // PC 관심 직무 드롭다운을 열 때 현재 적용값으로 임시 상태 초기화
  useEffect(() => {
    if (open === 'job' && !isMobile) {
      setTempGroup(value.jobGroup ?? 'PLANNING');
      setTempDetails(value.jobDetails);
    }
  }, [open, isMobile, value.jobGroup, value.jobDetails]);

  const toggle = (key: DropdownKey) => setOpen((cur) => (cur === key ? null : key));

  const triggerClass = isMobile
    ? 'h-10 w-[128px] rounded-full border bg-gray-0 px-3 inline-flex items-center justify-between gap-1 shrink-0'
    : 'h-space-40 w-[132px] rounded-full border bg-gray-0 px-[18px] inline-flex items-center justify-between gap-1 transition-colors hover:bg-gray-5';

  const renderTrigger = (key: DropdownKey, label: string, active: boolean) => (
    <button
      type="button"
      onClick={() => toggle(key)}
      className={clsx(triggerClass, active ? 'border-primary-50' : 'border-gray-30')}
    >
      <Typography type="Body2Medium" className={active ? 'text-primary-60' : 'text-gray-90'}>
        {label}
      </Typography>
      <Icon icon="chevronDown" size={20} className={active ? 'text-primary-60' : 'text-gray-50'} />
    </button>
  );

  const panelClass = clsx(
    'absolute z-30 mt-2 rounded-lg border border-gray-20 bg-gray-0 p-3 shadow-md',
    isMobile ? 'left-0' : 'right-0',
  );

  const jobActive = isMobile ? value.jobGroups.length > 0 : Boolean(value.jobGroup) || value.jobDetails.length > 0;
  const jobLabel = isMobile
    ? value.jobGroups.length > 0
      ? `관심직무 ${value.jobGroups.length}`
      : '관심직무'
    : value.jobDetails.length > 0
      ? `관심 직무 ${value.jobDetails.length}`
      : value.jobGroup
        ? jobGroupLabel(value.jobGroup)
        : '관심 직무';
  const ratingLabel = value.rating.length > 0 ? `총 평점 ${value.rating.length}` : '총 평점';
  const statusLabel = value.status.length > 0 ? `수료여부 ${value.status.length}` : '수료여부';

  return (
    <div ref={rootRef} className="flex items-center gap-2">
      {/* 모바일: 초기화 아이콘 좌측 상시 노출 (primary) */}
      {isMobile && (
        <button
          type="button"
          onClick={onReset}
          aria-label="필터 초기화"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-50 bg-gray-0"
        >
          <Icon icon="largeRefresh" size={18} className="text-primary-50" />
        </button>
      )}

      {/* 관심 직무 */}
      <div className="relative">
        {renderTrigger('job', jobLabel, jobActive)}
        {open === 'job' &&
          (isMobile ? (
            /* 모바일: 직군 플랫 체크박스 (다중) */
            <div className={clsx(panelClass, 'w-[140px]')}>
              {JOB_GROUP_OPTIONS.map((group) => {
                const selected = value.jobGroups.includes(group);
                return (
                  <button
                    key={group}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...value,
                        jobGroups: selected
                          ? value.jobGroups.filter((g) => g !== group)
                          : [...value.jobGroups, group],
                      })
                    }
                    className="flex w-full items-center gap-2 rounded px-2 py-2"
                  >
                    <CheckSquare selected={selected} />
                    <Typography type="Body3Medium" className={selected ? 'text-gray-90' : 'text-gray-70'}>
                      {jobGroupLabel(group)}
                    </Typography>
                  </button>
                );
              })}
              <PanelResetButton onClick={() => onChange({ ...value, jobGroups: [] })} />
            </div>
          ) : (
            /* PC: 직군 탭 + 세부직무 멀티칩 + 적용하기 */
            <div className={clsx(panelClass, 'w-[320px]')}>
              <div className="flex gap-1 border-b border-gray-10 pb-2">
                {JOB_GROUP_OPTIONS.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setTempGroup(group)}
                    className={clsx('rounded px-2 py-1', tempGroup === group ? 'text-primary-60' : 'text-gray-50')}
                  >
                    <Typography type="Caption1Medium">{jobGroupLabel(group)}</Typography>
                  </button>
                ))}
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTempDetails([])}
                  className={clsx(
                    'h-[28px] rounded-full border px-3 inline-flex items-center',
                    tempDetails.length === 0
                      ? 'border-primary-50 bg-primary-5 text-primary-60'
                      : 'border-gray-20 text-gray-70',
                  )}
                >
                  <Typography type="Caption1Medium">전체</Typography>
                </button>
                {JOB_DETAIL_BY_GROUP[tempGroup].map((detail) => {
                  const selected = tempDetails.includes(detail);
                  return (
                    <button
                      key={detail}
                      type="button"
                      onClick={() =>
                        setTempDetails((cur) => (selected ? cur.filter((d) => d !== detail) : [...cur, detail]))
                      }
                      className={clsx(
                        'h-[28px] rounded-full border px-3 inline-flex items-center gap-1',
                        selected ? 'border-primary-50 bg-primary-5 text-primary-60' : 'border-gray-20 text-gray-70',
                      )}
                    >
                      <Typography type="Caption1Medium">{jobDetailLabel(detail)}</Typography>
                      {selected && <Icon icon="xMark" size={12} className="text-primary-60" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onChange({ ...value, jobGroup: tempGroup, jobDetails: tempDetails });
                    setOpen(null);
                  }}
                  className="h-space-40 rounded-small bg-primary-50 px-space-24 inline-flex items-center hover:bg-primary-60"
                >
                  <Typography type="Body2Medium" className="text-gray-0">
                    적용하기
                  </Typography>
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* 총 평점 (다중 선택, 체크박스 — PC/모바일 동일) */}
      <div className="relative">
        {renderTrigger('rating', ratingLabel, value.rating.length > 0)}
        {open === 'rating' && (
          <div className={clsx(panelClass, 'w-[140px]')}>
            {RATING_OPTIONS.map((rating) => {
              const selected = value.rating.includes(rating);
              return (
                <button
                  key={rating}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...value,
                      rating: selected ? value.rating.filter((r) => r !== rating) : [...value.rating, rating],
                    })
                  }
                  className="flex w-full items-center gap-2 rounded px-2 py-2"
                >
                  <CheckSquare selected={selected} />
                  <Typography type="Body3Medium" className={selected ? 'text-gray-90' : 'text-gray-70'}>
                    {rating}점
                  </Typography>
                </button>
              );
            })}
            <PanelResetButton onClick={() => onChange({ ...value, rating: [] })} />
          </div>
        )}
      </div>

      {/* 수료 여부 (다중 선택, 체크박스 — PC/모바일 동일) */}
      <div className="relative">
        {renderTrigger('status', statusLabel, value.status.length > 0)}
        {open === 'status' && (
          <div className={clsx(panelClass, 'w-[140px]')}>
            {REVIEW_STATUS_OPTIONS.map((option) => {
              const selected = value.status.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...value,
                      status: selected
                        ? value.status.filter((s) => s !== option.value)
                        : [...value.status, option.value],
                    })
                  }
                  className="flex w-full items-center gap-2 rounded px-2 py-2"
                >
                  <CheckSquare selected={selected} />
                  <Typography type="Body3Medium" className={selected ? 'text-gray-90' : 'text-gray-70'}>
                    {option.label}
                  </Typography>
                </button>
              );
            })}
            <PanelResetButton onClick={() => onChange({ ...value, status: [] })} />
          </div>
        )}
      </div>

      {/* PC: 초기화 (적용된 필터가 있을 때만, 우측). 모바일은 좌측 상시 노출로 대체 */}
      {!isMobile && countActiveFilters(value) > 0 && (
        <button
          type="button"
          onClick={onReset}
          aria-label="필터 초기화"
          className="inline-flex h-space-40 w-space-40 shrink-0 items-center justify-center rounded-full bg-primary-50"
        >
          <Icon icon="largeRefresh" size={18} className="text-gray-0" />
        </button>
      )}
    </div>
  );
}
