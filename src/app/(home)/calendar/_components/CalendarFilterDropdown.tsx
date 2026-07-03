'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import type { FilterOption } from './filters';

/** 드롭다운 옵션용 체크박스 사각형 (리뷰 필터와 동일 디자인) */
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

interface CalendarFilterDropdownProps<T extends string> {
  /** 선택 없음(빈 배열)일 때 트리거에 노출할 라벨 */
  placeholder: string;
  /** 패널 상단 '전체'/'모든 활동' 체크박스 라벨 */
  allLabel: string;
  options: FilterOption<T>[];
  selected: T[];
  onChange: (next: T[]) => void;
}

/** 일정관리 목록형 필터(진행여부/지원여부) — 체크박스 다중선택 드롭다운 (figma 2696-34096) */
export default function CalendarFilterDropdown<T extends string>({
  placeholder,
  allLabel,
  options,
  selected,
  onChange,
}: CalendarFilterDropdownProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

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
        <div className="absolute right-0 z-30 mt-2 w-[160px] rounded-lg border border-gray-20 bg-gray-0 p-3 shadow-md">
          <button
            type="button"
            onClick={() => onChange([])}
            className="flex w-full items-center gap-2 rounded px-2 py-2"
          >
            <CheckSquare selected={!active} />
            <Typography type="Body3Medium" className={!active ? 'text-gray-90' : 'text-gray-70'}>
              {allLabel}
            </Typography>
          </button>
          {options.map((option) => {
            const isSelected = selected.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleOption(option.value)}
                className="flex w-full items-center gap-2 rounded px-2 py-2"
              >
                <CheckSquare selected={isSelected} />
                <Typography type="Body3Medium" className={isSelected ? 'text-gray-90' : 'text-gray-70'}>
                  {option.label}
                </Typography>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
