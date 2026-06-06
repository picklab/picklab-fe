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

interface ReviewFiltersProps {
  value: ReviewFilterValue;
  onChange: (next: ReviewFilterValue) => void;
  onReset: () => void;
  variant?: 'pc' | 'mobile';
}

/** 리뷰 목록 필터(기획 3-4): 관심 직무 / 총 평점 / 수료 여부 + 초기화 */
export default function ReviewFilters({ value, onChange, onReset, variant = 'pc' }: ReviewFiltersProps) {
  const isMobile = variant === 'mobile';
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<DropdownKey | null>(null);

  // 관심 직무 임시 선택 상태 (적용하기 전까지 반영하지 않음)
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

  // 관심 직무 드롭다운을 열 때 현재 적용값으로 임시 상태 초기화
  useEffect(() => {
    if (open === 'job') {
      setTempGroup(value.jobGroup ?? 'PLANNING');
      setTempDetails(value.jobDetails);
    }
  }, [open, value.jobGroup, value.jobDetails]);

  const toggle = (key: DropdownKey) => setOpen((cur) => (cur === key ? null : key));

  const triggerClass = isMobile
    ? 'h-[30px] rounded-full border px-3 inline-flex items-center gap-1 shrink-0'
    : 'h-space-40 w-[132px] rounded-full border bg-gray-0 px-[18px] inline-flex items-center justify-between gap-1';

  const renderTrigger = (key: DropdownKey, label: string, active: boolean) => (
    <button
      type="button"
      onClick={() => toggle(key)}
      className={clsx(triggerClass, active ? 'border-primary-50' : 'border-gray-30')}
    >
      <Typography
        type={isMobile ? 'Caption2Medium' : 'Body2Medium'}
        className={active ? 'text-primary-60' : 'text-gray-90'}
      >
        {label}
      </Typography>
      <Icon icon="chevronDown" size={isMobile ? 12 : 20} className={active ? 'text-primary-60' : 'text-gray-50'} />
    </button>
  );

  const panelClass = clsx(
    'absolute z-30 mt-2 rounded-lg border border-gray-20 bg-gray-0 p-3 shadow-md',
    isMobile ? 'left-0' : 'right-0',
  );

  const ratingLabel = value.rating ? `총 평점 ${value.rating}점` : '총 평점';
  const statusLabel = value.status
    ? REVIEW_STATUS_OPTIONS.find((s) => s.value === value.status)?.label ?? '수료여부'
    : '수료여부';
  const jobLabel =
    value.jobDetails.length > 0
      ? `관심 직무 ${value.jobDetails.length}`
      : value.jobGroup
        ? jobGroupLabel(value.jobGroup)
        : '관심 직무';

  return (
    <div ref={rootRef} className="flex items-center gap-2">
      {/* 관심 직무 (직군 탭 + 세부직무 멀티칩 + 적용하기) */}
      <div className="relative">
        {renderTrigger('job', jobLabel, Boolean(value.jobGroup) || value.jobDetails.length > 0)}
        {open === 'job' && (
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
                  tempDetails.length === 0 ? 'border-primary-50 bg-primary-5 text-primary-60' : 'border-gray-20 text-gray-70',
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
        )}
      </div>

      {/* 총 평점 (단일 선택) */}
      <div className="relative">
        {renderTrigger('rating', ratingLabel, Boolean(value.rating))}
        {open === 'rating' && (
          <div className={clsx(panelClass, 'w-[140px]')}>
            {RATING_OPTIONS.map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => {
                  onChange({ ...value, rating: value.rating === rating ? null : rating });
                  setOpen(null);
                }}
                className={clsx(
                  'flex w-full items-center rounded px-2 py-2',
                  value.rating === rating ? 'text-primary-60' : 'text-gray-70',
                )}
              >
                <Typography type="Body3Medium">{rating}점</Typography>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 수료 여부 (단일 선택) */}
      <div className="relative">
        {renderTrigger('status', statusLabel, Boolean(value.status))}
        {open === 'status' && (
          <div className={clsx(panelClass, 'w-[140px]')}>
            {REVIEW_STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange({ ...value, status: value.status === option.value ? null : option.value });
                  setOpen(null);
                }}
                className={clsx(
                  'flex w-full items-center rounded px-2 py-2',
                  value.status === option.value ? 'text-primary-60' : 'text-gray-70',
                )}
              >
                <Typography type="Body3Medium">{option.label}</Typography>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 초기화 (적용된 필터가 있을 때만) */}
      {countActiveFilters(value) > 0 && (
        <button
          type="button"
          onClick={onReset}
          aria-label="필터 초기화"
          className={clsx(
            'inline-flex shrink-0 items-center justify-center rounded-full bg-primary-50',
            isMobile ? 'h-[30px] w-[30px]' : 'h-space-40 w-space-40',
          )}
        >
          <Icon icon="largeRefresh" size={isMobile ? 14 : 18} className="text-gray-0" />
        </button>
      )}
    </div>
  );
}
