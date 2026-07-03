// 공통 Select(width="small"=140px, size="small"=40px) 옵션 형태
export interface FilterOption<T extends string> {
  value: T;
  label: string;
}

// 일정관리 상단 탭 / 토글 / 필터 타입 정의 (figma 2527-24643 / 드롭다운 2696-34096)
export type ScheduleTab = 'SCHEDULE' | 'RESULT'; // 일정 관리 / 활동 결과
export type ScheduleViewMode = 'LIST' | 'CALENDAR'; // 목록형 / 캘린더형
export type ProgressFilter = 'ONGOING' | 'CLOSED'; // 진행 중 / 마감 (빈 배열 = 전체)
export type ApplyFilter = 'APPLIED' | 'NOT_APPLIED'; // 지원 완료 / 미지원 (빈 배열 = 모든 활동)

// 드롭다운은 체크박스 다중선택. '전체'/'모든 활동'은 빈 배열(선택 없음)로 표현.
export const PROGRESS_OPTIONS: FilterOption<ProgressFilter>[] = [
  { value: 'ONGOING', label: '진행 중' },
  { value: 'CLOSED', label: '마감' },
];

export const APPLY_OPTIONS: FilterOption<ApplyFilter>[] = [
  { value: 'APPLIED', label: '지원 완료' },
  { value: 'NOT_APPLIED', label: '미지원' },
];

// 트리거 기본 라벨(placeholder) / 패널 상단 '전체' 체크박스 라벨
export const PROGRESS_TRIGGER_LABEL = '전체';
export const PROGRESS_ALL_LABEL = '전체';
export const APPLY_TRIGGER_LABEL = '지원여부';
export const APPLY_ALL_LABEL = '모든 활동';
