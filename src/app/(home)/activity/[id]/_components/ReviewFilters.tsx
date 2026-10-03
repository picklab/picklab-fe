'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import {
  JOB_DETAIL_BY_GROUP,
  JOB_GROUP_OPTIONS,
  RATING_RANGE_OPTIONS,
  REVIEW_STATUS_OPTIONS,
  countActiveFilters,
  jobDetailLabel,
  jobGroupLabel,
} from '@/types/review.types';
import type { ReviewFilterValue, ReviewJobDetail, ReviewJobGroup, ReviewProgressStatus } from '@/types/review.types';

type DropdownKey = 'job' | 'rating' | 'status';

const SHEET_TITLES: Record<DropdownKey, string> = { job: '관심직무', rating: '총 평점', status: '수료여부' };

/** 옵션 칩 (Figma 3011-36698 / 선택 3011-36717) */
function OptionChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex h-10 items-center justify-center whitespace-nowrap rounded-full border px-4',
        selected ? 'border-primary-60 bg-[#E5F7EF] text-primary-60' : 'border-[#A5ADBB] bg-gray-0 text-gray-90',
      )}
    >
      <Typography type="Body2Medium">{label}</Typography>
    </button>
  );
}

/** 직군 텍스트 탭 (Figma 3011-36691) */
function JobGroupTabs({ value, onChange }: { value: ReviewJobGroup; onChange: (group: ReviewJobGroup) => void }) {
  return (
    <div className="flex w-full items-center">
      {JOB_GROUP_OPTIONS.map((group) => {
        const active = value === group;
        return (
          <button key={group} type="button" onClick={() => onChange(group)} className="flex min-w-0 flex-1 flex-col gap-2">
            <Typography type="Body2Medium" className={clsx('w-full text-center', active ? 'text-gray-90' : 'text-[#A5ADBB]')}>
              {jobGroupLabel(group)}
            </Typography>
            <span
              className={clsx('w-full', active ? 'h-[3px] rounded-full bg-primary-80' : 'h-[1.5px] bg-gray-30')}
            />
          </button>
        );
      })}
    </div>
  );
}

/** 하단 초기화 / 적용하기 (Figma 3011-36704) */
function PanelFooter({ onReset, onApply }: { onReset: () => void; onApply: () => void }) {
  return (
    <div className="flex w-full items-center justify-between">
      <button
        type="button"
        onClick={onReset}
        className="flex w-[132px] items-center gap-2 rounded-[4px] bg-gray-0 py-3 pl-3 pr-4 text-[#1E2939]"
      >
        <Icon icon="largeRefresh" size={24} />
        <Typography type="Body1Medium">초기화</Typography>
      </button>
      <button
        type="button"
        onClick={onApply}
        className="flex h-12 w-[120px] items-center justify-center rounded-[6px] bg-primary-70 px-[18px]"
      >
        <Typography type="Headline2Medium" className="text-gray-0">
          적용하기
        </Typography>
      </button>
    </div>
  );
}

interface ReviewFiltersProps {
  value: ReviewFilterValue;
  onChange: (next: ReviewFilterValue) => void;
  onReset: () => void;
  variant?: 'pc' | 'mobile';
}

/**
 * 리뷰 목록 필터 (Figma 드롭다운 변경사항 3011-36687).
 * - 관심 직무: 직군 탭 + 세부직무 칩 / 총 평점·수료여부: 칩
 * - 선택은 임시 상태로 두고 "적용하기" 시 반영. "전체" 칩 = 선택 해제
 * - PC: 드롭다운 패널(428px, 필터 줄 우측 정렬) / 모바일: 바텀시트
 */
export default function ReviewFilters({ value, onChange, onReset, variant = 'pc' }: ReviewFiltersProps) {
  const isMobile = variant === 'mobile';
  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<DropdownKey | null>(null);

  // 적용하기 전까지의 임시 선택 상태
  const [tempGroup, setTempGroup] = useState<ReviewJobGroup>(value.jobGroup ?? 'PLANNING');
  const [tempDetails, setTempDetails] = useState<ReviewJobDetail[]>(value.jobDetails);
  const [tempRating, setTempRating] = useState<number[]>(value.rating);
  const [tempStatus, setTempStatus] = useState<ReviewProgressStatus[]>(value.status);

  useEffect(() => {
    if (!open) return;
    const handle = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || sheetRef.current?.contains(target)) return;
      setOpen(null);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  // 모바일 바텀시트가 열려 있는 동안 배경 스크롤 잠금
  useEffect(() => {
    if (!open || !isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, isMobile]);

  // 열 때만 현재 적용값으로 임시 상태 초기화 (열린 동안 초기화로 value가 바뀌어도 탭 유지)
  const toggle = (key: DropdownKey) => {
    if (open === key) {
      setOpen(null);
      return;
    }
    setTempGroup(value.jobGroup ?? 'PLANNING');
    setTempDetails(value.jobDetails);
    setTempRating(value.rating);
    setTempStatus(value.status);
    setOpen(key);
  };

  // 트리거: 모바일 Figma 3011-38998 (128px, border #A5ADBB) / PC 3011-36710 (120px, border gray-30·활성 primary-50)
  const triggerClass = clsx(
    'h-10 rounded-full border bg-gray-0 pl-[18px] pr-[13px] inline-flex items-center justify-between gap-1 shrink-0',
    isMobile ? 'w-[128px]' : 'w-[120px] transition-colors hover:bg-gray-5',
  );

  const renderTrigger = (key: DropdownKey, label: string, active: boolean) => (
    <button
      type="button"
      onClick={() => toggle(key)}
      className={clsx(triggerClass, active ? 'border-primary-50' : isMobile ? 'border-[#A5ADBB]' : 'border-gray-30')}
    >
      <Typography
        type="Body2Medium"
        className={clsx('truncate', isMobile && active ? 'text-primary-60' : 'text-gray-90')}
      >
        {label}
      </Typography>
      <Icon
        icon="chevronDown"
        size={24}
        className={clsx('shrink-0', isMobile && active ? 'text-primary-60' : 'text-gray-90')}
      />
    </button>
  );

  const jobActive = Boolean(value.jobGroup) || value.jobDetails.length > 0;
  const jobTitle = isMobile ? '관심직무' : '관심 직무';
  const jobLabel =
    value.jobDetails.length > 0
      ? `${jobTitle} ${value.jobDetails.length}`
      : value.jobGroup
        ? jobGroupLabel(value.jobGroup)
        : jobTitle;
  // 평점은 칩 하나가 여러 값([5,4])을 가지므로 선택된 칩 개수로 표시
  const ratingChipCount = RATING_RANGE_OPTIONS.filter((option) =>
    option.values.every((v) => value.rating.includes(v)),
  ).length;
  const ratingLabel = ratingChipCount > 0 ? `총 평점 ${ratingChipCount}` : '총 평점';
  const statusLabel = value.status.length > 0 ? `수료여부 ${value.status.length}` : '수료여부';

  const toggleItem = <T,>(list: T[], items: T[]) =>
    items.every((item) => list.includes(item)) ? list.filter((v) => !items.includes(v)) : [...list, ...items.filter((item) => !list.includes(item))];

  const handleReset = () => {
    if (open === 'job') {
      setTempDetails([]);
      onChange({ ...value, jobGroup: null, jobDetails: [] });
    } else if (open === 'rating') {
      setTempRating([]);
      onChange({ ...value, rating: [] });
    } else if (open === 'status') {
      setTempStatus([]);
      onChange({ ...value, status: [] });
    }
  };

  const handleApply = () => {
    // 세부직무 '전체'(미선택)로 적용하면 직군 필터 없이 전체 리뷰
    if (open === 'job')
      onChange({ ...value, jobGroup: tempDetails.length > 0 ? tempGroup : null, jobDetails: tempDetails });
    else if (open === 'rating') onChange({ ...value, rating: tempRating });
    else if (open === 'status') onChange({ ...value, status: tempStatus });
    setOpen(null);
  };

  const renderChips = () => {
    if (open === 'job') {
      return (
        <>
          <OptionChip label="전체" selected={tempDetails.length === 0} onClick={() => setTempDetails([])} />
          {JOB_DETAIL_BY_GROUP[tempGroup].map((detail) => (
            <OptionChip
              key={detail}
              label={jobDetailLabel(detail)}
              selected={tempDetails.includes(detail)}
              onClick={() => setTempDetails((cur) => toggleItem(cur, [detail]))}
            />
          ))}
        </>
      );
    }
    if (open === 'rating') {
      return (
        <>
          <OptionChip label="전체" selected={tempRating.length === 0} onClick={() => setTempRating([])} />
          {RATING_RANGE_OPTIONS.map((option) => (
            <OptionChip
              key={option.label}
              label={option.label}
              selected={option.values.every((v) => tempRating.includes(v))}
              onClick={() => setTempRating((cur) => toggleItem(cur, option.values))}
            />
          ))}
        </>
      );
    }
    return (
      <>
        <OptionChip label="전체" selected={tempStatus.length === 0} onClick={() => setTempStatus([])} />
        {REVIEW_STATUS_OPTIONS.map((option) => (
          <OptionChip
            key={option.value}
            label={option.label}
            selected={tempStatus.includes(option.value)}
            onClick={() => setTempStatus((cur) => toggleItem(cur, [option.value]))}
          />
        ))}
      </>
    );
  };

  const chipGrid = <div className="grid w-full grid-cols-4 gap-3">{renderChips()}</div>;
  const tabs = open === 'job' && <JobGroupTabs value={tempGroup} onChange={setTempGroup} />;
  const divider = <div className="h-px w-full bg-gray-20" />;
  const footer = <PanelFooter onReset={handleReset} onApply={handleApply} />;

  return (
    <div ref={rootRef} className="relative flex items-center gap-2">
      {renderTrigger('job', jobLabel, jobActive)}
      {renderTrigger('rating', ratingLabel, value.rating.length > 0)}
      {renderTrigger('status', statusLabel, value.status.length > 0)}

      {/* PC: 초기화 (적용된 필터가 있을 때만, 우측). 모바일은 새로고침 버튼 삭제(Figma 3011-37592) */}
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

      {/* PC 패널: Figma 3011-36689 (428px, p24, gap16, radius12, 필터 줄 하단 9px·우측 정렬) */}
      {open && !isMobile && (
        <div className="absolute right-0 top-full z-30 mt-[9px] flex w-[428px] flex-col gap-4 rounded-[12px] bg-gray-0 p-6 shadow-[0px_0px_4px_0px_#00000014,0px_4px_8px_0px_#00000014,0px_6px_12px_0px_#0000001F]">
          <div className="flex w-full flex-col gap-4">
            {tabs}
            {chipGrid}
            {divider}
          </div>
          {footer}
        </div>
      )}

      {/* 모바일 바텀시트: Figma 3011-36810 (radius-t20, p20, 내용 높이 321 — 칩 3줄 이상(개발 직군)은 늘어나도록 min) */}
      {open &&
        isMobile &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-end bg-[rgba(0,0,0,0.85)]">
            <div ref={sheetRef} className="w-full rounded-t-[20px] bg-gray-0 p-5">
              <div className="flex min-h-[321px] flex-col items-center gap-5">
                <span className="h-[3px] w-[39px] rounded-[10px] bg-[#A5ADBB]" />
                <div className="flex min-h-0 w-full flex-1 flex-col justify-between">
                  <div className="flex w-full flex-col gap-6">
                    <Typography type="Heading2Semibold" className="text-[#1E2939]">
                      {SHEET_TITLES[open]}
                    </Typography>
                    {tabs}
                    {chipGrid}
                  </div>
                  <div className="flex w-full flex-col gap-6">
                    {divider}
                    {footer}
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
