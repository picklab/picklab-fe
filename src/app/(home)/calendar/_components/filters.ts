// 공통 Select(width="small"=140px, size="small"=40px) 옵션 형태
export interface FilterOption<T extends string> {
  value: T;
  label: string;
}

// 일정관리 상단 탭 / 토글 / 필터 타입 정의 (figma 2527-24643)
export type ScheduleTab = 'SCHEDULE' | 'RESULT'; // 일정 관리 / 활동 결과
export type ScheduleViewMode = 'LIST' | 'CALENDAR'; // 목록형 / 캘린더형
export type ProgressFilter = 'ALL' | 'ONGOING' | 'CLOSED'; // 전체 / 진행중 / 마감
export type ApplyFilter = 'ALL' | 'APPLIED' | 'NOT_APPLIED'; // 전체 / 지원완료 / 미지원

export const PROGRESS_OPTIONS: FilterOption<ProgressFilter>[] = [
  { value: 'ALL', label: '전체' },
  { value: 'ONGOING', label: '진행 중' },
  { value: 'CLOSED', label: '마감' },
];

export const APPLY_OPTIONS: FilterOption<ApplyFilter>[] = [
  { value: 'ALL', label: '지원여부' },
  { value: 'APPLIED', label: '지원완료' },
  { value: 'NOT_APPLIED', label: '미지원' },
];
