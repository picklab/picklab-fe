'use client';

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import type { FilterOption } from './filters';

/** 드롭다운 옵션용 체크박스 사각형 (figma OptionGroup pc 2696-34577 / mobile 1136-82764 공통: 16px, radius 4) */
function CheckSquare({ selected }: { selected: boolean }) {
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
  /** 옵션그룹 스타일. pc: figma 2696-34577 / mobile: figma 1136-82764(14px, 옵션 py 8px) */
  variant?: 'pc' | 'mobile';
  /** 트리거 크기 등 화면별 덮어쓰기용 클래스 */
  triggerClassName?: string;
}

/** 일정관리 목록형 필터(진행여부/지원여부) — 체크박스 다중선택 드롭다운 (figma 2696-34096) */
export default function CalendarFilterDropdown<T extends string>({
  placeholder,
  allLabel,
  options,
  selected,
  onChange,
  variant = 'mobile',
  triggerClassName,
}: CalendarFilterDropdownProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [portalStyle, setPortalStyle] = useState<CSSProperties>();
  const isPc = variant === 'pc';

  useEffect(() => {
    if (!open) return;
    const handle = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!ref.current?.contains(target) && !panelRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  // mobile: 필터 줄(overflow-x-auto)에 옵션그룹이 잘려 body로 portal + 트리거 기준 fixed 배치.
  // 트리거 포커스 시 필터 줄이 가로 스크롤되므로 스크롤/리사이즈마다 위치를 다시 계산해 트리거를 따라감.
  useLayoutEffect(() => {
    if (!open || isPc) return;
    const updatePosition = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setPortalStyle({
        position: 'fixed',
        top: rect.bottom,
        left: rect.left,
        width: rect.width, // 옵션그룹 너비 = 트리거 너비 (PIC-162)
        zIndex: 80,
      });
    };
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, isPc]);

  const active = selected.length > 0;
  const triggerLabel = active
    ? options
        .filter((o) => selected.includes(o.value))
        .map((o) => o.label)
        .join(', ')
    : placeholder;

  const toggleOption = (value: T) =>
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);

  // pc: 옵션그룹 너비 = 트리거 너비(140px) (PIC-162)
  const panelClass = isPc
    ? 'absolute left-0 z-30 mt-1 flex w-[140px] flex-col rounded-[6px] bg-gray-0 p-1 shadow-optionGroup'
    : 'mt-1 flex flex-col rounded-[6px] bg-gray-0 p-1 shadow-optionGroup';
  const optionClass = isPc
    ? 'flex w-full items-center gap-2 rounded-[4px] py-3 pl-3 pr-4'
    : 'flex w-full items-center gap-2 rounded-[4px] px-3 py-2';
  const renderLabel = (label: string) => (
    <Typography type={isPc ? 'Body1Medium' : 'Body3Medium'} className="text-gray-90">
      {label}
    </Typography>
  );

  const renderPanel = (panel: ReactNode) => (isPc ? panel : createPortal(panel, document.body));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((cur) => !cur)}
        className={clsx(
          'inline-flex h-10 w-[140px] items-center justify-between gap-1 rounded-full border bg-gray-0 px-[18px] transition-colors hover:bg-gray-5',
          active ? 'border-primary-50' : 'border-gray-30',
          triggerClassName,
        )}
      >
        <Typography type="Body2Medium" className={clsx('truncate', active ? 'text-primary-60' : 'text-gray-90')}>
          {triggerLabel}
        </Typography>
        <Icon icon="chevronDown" size={20} className={active ? 'text-primary-60' : 'text-gray-50'} />
      </button>

      {open && renderPanel(
        <div ref={panelRef} className={panelClass} style={isPc ? undefined : portalStyle}>
          <button type="button" onClick={() => onChange([])} className={optionClass}>
            <CheckSquare selected={!active} />
            {renderLabel(allLabel)}
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
                <CheckSquare selected={isSelected} />
                {renderLabel(option.label)}
              </button>
            );
          })}
        </div>,
      )}
    </div>
  );
}
