import type { CardChipProps } from '@/components/common/Card/CardChip';

/** 백엔드 activity_type 코드 → 화면 라벨 (CardChip text) */
export const ACTIVITY_TYPE_LABELS: Record<string, CardChipProps['text']> = {
  EXTRACURRICULAR: '대외활동',
  EDUCATION: '교육',
  COMPETITION: '공모전/해커톤',
  SEMINAR: '강연/세미나',
};

/** 코드를 라벨로. 모르는 코드는 '대외활동'으로 표시 */
export function activityTypeLabel(code?: string | null): CardChipProps['text'] {
  return (code && ACTIVITY_TYPE_LABELS[code]) || '대외활동';
}
