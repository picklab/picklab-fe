'use client';

import clsx from 'clsx';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';

/** 경량 확인 다이얼로그. Modal 컴포넌트는 버튼 라벨/스타일 커스텀이 안 되므로 동일 스타일로 직접 구현. */
export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-100/40 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex w-[360px] flex-col gap-space-32 rounded-2xl bg-gray-0 px-space-32 pb-space-28 pt-space-32">
        <div className="flex flex-col items-center justify-center gap-space-6 text-center">
          <Typography tag="h2" type="Heading1Semibold" className="text-gray-90">
            {title}
          </Typography>
          <Typography tag="p" type="Body3Regular" className="text-gray-50">
            {description}
          </Typography>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-space-48 w-full rounded-small bg-gray-5 hover:bg-gray-10"
          >
            <Typography type="Body2Medium" className="text-gray-90">
              {cancelLabel}
            </Typography>
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-space-48 w-full rounded-small bg-primary-50 hover:bg-primary-60"
          >
            <Typography type="Body2Medium" className="text-gray-0">
              {confirmLabel}
            </Typography>
          </button>
        </div>
      </div>
    </div>
  );
}

/** 공통 모달 셸 (제목 + X + 본문). */
export interface ModalShellProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function ModalShell({ title, onClose, children, className }: ModalShellProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-100/40 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className={clsx('flex max-h-[85vh] flex-col rounded-2xl bg-gray-0', className)}>
        <div className="flex items-center justify-between px-space-24 pt-space-24">
          <Typography tag="h2" type="Heading1Semibold" className="text-gray-90">
            {title}
          </Typography>
          <button type="button" onClick={onClose} aria-label="닫기" className="flex size-6 items-center justify-center">
            <Icon icon="xMark" size={20} className="text-gray-90" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** 헤더: 모바일 = 좌측 뒤로가기 + 가운데 제목, PC = 가운데 제목 + 우측 X. */
export function ReviewWriteHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative flex h-space-56 items-center justify-center border-b border-gray-20">
      {/* 모바일: 좌측 뒤로가기 (PC 숨김) */}
      <button
        type="button"
        onClick={onClose}
        aria-label="뒤로가기"
        className="absolute left-4 flex size-6 items-center justify-center pc:hidden"
      >
        <Icon icon="chevronLeft" size={24} className="text-gray-90" />
      </button>
      <Typography type="Heading1Semibold" className="text-gray-90">
        리뷰쓰기
      </Typography>
      {/* PC: 우측 X (모바일 숨김) */}
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="absolute right-4 hidden size-6 items-center justify-center pc:flex"
      >
        <Icon icon="xMark" size={24} className="text-gray-90" />
      </button>
    </div>
  );
}

/** 별점 5개. value 1~5, 0=미선택. */
export function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n}점`}>
          <Icon icon="starFill" size={40} className={n <= value ? 'text-[#FFC95C]' : 'text-gray-20'} />
        </button>
      ))}
    </div>
  );
}

/** 별점 라벨 칩 문구 (추정 — 디자인 확인 필요). */
const STAR_LABELS: Record<number, string> = {
  1: '별로예요',
  2: '아쉬워요',
  3: '보통이에요',
  4: '만족스러워요',
  5: '매우 만족스러워요',
};

export function StarRatingLabel({ value }: { value: number }) {
  if (!value) return null;
  return (
    <span className="inline-flex items-center rounded-full bg-[#DBEAFE] px-3 py-1">
      <Typography type="Body3Medium" className="text-[#155DFC]">
        {STAR_LABELS[value]}
      </Typography>
    </span>
  );
}

/** 5단계 라디오 (원형 점 5개 + 연결선 + 라벨). value 1~5, 0=미선택. */
export interface RatingRadioProps {
  question: string;
  labels: [string, string, string, string, string];
  value: number;
  onChange: (v: number) => void;
  error?: string;
}

export function RatingRadio({ question, labels, value, onChange, error }: RatingRadioProps) {
  return (
    <div className="flex flex-col gap-space-12">
      <Typography type="Body1Semibold" className="text-gray-90">
        {question}
      </Typography>
      <div className="relative flex items-start justify-between px-2">
        {/* 연결선 */}
        <div className="absolute left-[10%] right-[10%] top-[10px] h-px bg-gray-20" aria-hidden />
        {labels.map((label, idx) => {
          const score = idx + 1;
          const selected = value === score;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onChange(score)}
              className="relative z-10 flex flex-1 flex-col items-center gap-2"
              aria-pressed={selected}
            >
              <span
                className={clsx(
                  'size-5 rounded-full border-2 bg-gray-0 transition-colors',
                  selected ? 'border-primary-50 bg-primary-50' : 'border-gray-30',
                )}
              />
              <Typography type="Body4Regular" className={selected ? 'text-primary-60' : 'text-gray-50'}>
                {label}
              </Typography>
            </button>
          );
        })}
      </div>
      {error && (
        <Typography type="Body4Regular" className="text-danger-50">
          {error}
        </Typography>
      )}
    </div>
  );
}

/** 에러 메시지 (경고 아이콘 + 텍스트). */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-1">
      <Icon icon="alertCircle" size={16} className="text-danger-50" />
      <Typography type="Body4Regular" className="text-danger-50">
        {message}
      </Typography>
    </div>
  );
}
