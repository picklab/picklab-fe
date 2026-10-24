'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import type { FilterOption } from './filters';

/**
 * 드롭다운 옵션용 체크박스 사각형.
 * pc: figma OptionGroup 2696-34577(16px, radius 4) / mobile: 기존 디자인(리뷰 필터와 동일)
 */
function CheckSquare({ selected, isPc }: { selected: boolean; isPc: boolean }) {
  if (!isPc) {
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
  return (
    <span className="flex shrink-0 items-center py-1">
      <span
        className={clsx(
          'flex size-4 items-center justify-center rounded-[4px]',
          selected ? 'bg-primary-50' : 'border-[1.5px] border-gray-30 bg-gray-0',
        )}
      >
        {selected && <Icon icon="check" size={16} className="text-gray-0" />}
      </span>
    </span>
  );
}

interface CalendarFilterDropdownProps<T extends string> {
  /** 선택 없음(빈 배열)일 때 트리거에 노출할 라벨 */
  placeholder: string;
  /** 패널 상단 '전체'/'모든 활동' 체크박스 라벨 */
  allLabel: string;
  options: FilterOption<T>[];
  selected: T[];
  onChange: (next: T[]) => void;
  /** 옵션그룹 스타일. QA(PIC-162)는 WEB만 반영 → pc만 figma 스타일, mobile은 기존 유지 */
  variant?: 'pc' | 'mobile';
}

/** 일정관리 목록형 필터(진행여부/지원여부) — 체크박스 다중선택 드롭다운 (figma 2696-34096) */
export default function CalendarFilterDropdown<T extends string>({
  placeholder,
  allLabel,
  options,
  selected,
  onChange,
  variant = 'mobile',
}: CalendarFilterDropdownProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const isPc = variant === 'pc';

  useEffect(() => {
    if (!open) return;
    const handle = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const active = selected.length > 0;
  const triggerLabel = active
    ? options
        .filter((o) => selected.includes(o.value))
        .map((o) => o.label)
        .join(', ')
    : placeholder;

  const toggleOption = (value: T) =>
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);

  // pc: 옵션그룹 너비 = 트리거 너비(140px), 그림자는 figma 실측(일치 토큰 없음) (PIC-162)
  const panelClass = isPc
    ? 'absolute left-0 z-30 mt-1 flex w-[140px] flex-col rounded-[6px] bg-gray-0 p-1 shadow-[0_0_4px_rgba(0,0,0,0.08),0_4px_8px_rgba(0,0,0,0.08),0_6px_12px_rgba(0,0,0,0.12)]'
    : 'absolute right-0 z-30 mt-2 w-[160px] rounded-lg border border-gray-20 bg-gray-0 p-3 shadow-md';
  const optionClass = isPc
    ? 'flex w-full items-center gap-2 rounded-[4px] py-3 pl-3 pr-4'
    : 'flex w-full items-center gap-2 rounded px-2 py-2';
  const renderLabel = (label: string, isSelected: boolean) =>
    isPc ? (
      <Typography type="Body1Medium" className="text-gray-90">
        {label}
      </Typography>
    ) : (
      <Typography type="Body3Medium" className={isSelected ? 'text-gray-90' : 'text-gray-70'}>
        {label}
      </Typography>
    );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((cur) => !cur)}
        className={clsx(
          'inline-flex h-10 w-[140px] items-center justify-between gap-1 rounded-full border bg-gray-0 px-[18px] transition-colors hover:bg-gray-5',
          active ? 'border-primary-50' : 'border-gray-30',
        )}
      >
        <Typography type="Body2Medium" className={clsx('truncate', active ? 'text-primary-60' : 'text-gray-90')}>
          {triggerLabel}
        </Typography>
        <Icon icon="chevronDown" size={20} className={active ? 'text-primary-60' : 'text-gray-50'} />
      </button>

      {open && (
        <div className={panelClass}>
          <button type="button" onClick={() => onChange([])} className={optionClass}>
            <CheckSquare selected={!active} isPc={isPc} />
            {renderLabel(allLabel, !active)}
          </button>
          {options.map((option) => {
            const isSelected = selected.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleOption(option.value)}
                className={optionClass}
              >
                <CheckSquare selected={isSelected} isPc={isPc} />
                {renderLabel(option.label, isSelected)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
