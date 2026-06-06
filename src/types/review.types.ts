// 공고 상세 리뷰 탭에서 사용하는 백엔드 응답 타입과 라벨/색상 매핑, 점수 정규화 유틸.
// 응답 래퍼는 공통 ApiResponse(success 분기)가 아니라 { code, message, data } 구조다.

export type ReviewJobGroup = 'PLANNING' | 'DESIGN' | 'DEVELOPMENT' | 'MARKETING' | 'AI';

export type ReviewJobDetail =
  | 'SERVICE_PLANNING'
  | 'BUSINESS_DEVELOPMENT'
  | 'DATA_ANALYSIS'
  | 'PM_PO'
  | 'UX_DESIGN'
  | 'UI_DESIGN'
  | 'WEB_DESIGN'
  | 'GRAPHIC_DESIGN'
  | 'BRAND_DESIGN'
  | 'FRONTEND'
  | 'BACKEND'
  | 'FULLSTACK'
  | 'SECURITY'
  | 'DEVOPS'
  | 'IOS'
  | 'ANDROID'
  | 'BLOCKCHAIN'
  | 'GAME'
  | 'BRAND_MARKETING'
  | 'CONTENT_MARKETING'
  | 'GROWTH_MARKETING'
  | 'PERFORMANCE_MARKETING'
  | 'PR'
  | 'MACHINE_LEARNING'
  | 'DEEP_LEARNING'
  | 'COMPUTER_VISION'
  | 'NLP'
  | 'DATA_SCIENCE';

export type ReviewProgressStatus = 'IN_PROGRESSING' | 'COMPLETED' | 'DROPPED';

/** GET /v1/activities/{id}/reviews 의 data.items[] 한 건 */
export interface ActivityReviewItem {
  id: number;
  overall_score: number;
  info_score: number;
  difficulty_score: number;
  benefit_score: number;
  job_group: ReviewJobGroup;
  job_detail: ReviewJobDetail;
  participation_date: string;
  progress_status: ReviewProgressStatus;
  summary: string;
  strength: string;
  weakness: string;
  tips?: string | null;
}

/** GET /v1/activities/{id}/reviews 의 data */
export interface ReviewListData {
  items: ActivityReviewItem[];
  page: number;
  size: number;
  total_pages: number;
  total_elements: number;
}

/** GET .../reviews/statistics/satisfaction 의 data.items[] 한 건 */
export interface SatisfactionAvgScores {
  job_group: ReviewJobGroup;
  job_detail: ReviewJobDetail;
  avg_total_score: number;
  avg_job_experience_score: number;
  avg_activity_intensity_score: number;
  avg_benefit_score: number;
}

/** GET .../reviews/statistics/job-relevance 의 data */
export interface JobRelevanceStats {
  planning_avg_score: number;
  development_avg_score: number;
  marketing_avg_score: number;
  ai_avg_score: number;
  design_avg_score: number;
}

/** 백엔드 공통 응답 래퍼 */
export interface ReviewApiWrapper<T> {
  code?: number;
  message?: string;
  data?: T;
}

export const JOB_GROUP_LABELS: Record<ReviewJobGroup, string> = {
  PLANNING: '기획',
  DESIGN: '디자인',
  DEVELOPMENT: '개발',
  MARKETING: '마케팅',
  AI: 'AI',
};

/** tailwind 직군 컬러 토큰 기반 배지 클래스 (bg / text) */
export const JOB_GROUP_BADGE_CLASS: Record<ReviewJobGroup, string> = {
  PLANNING: 'bg-planning-bg text-planning-text',
  DESIGN: 'bg-design-bg text-design-text',
  DEVELOPMENT: 'bg-development-bg text-development-text',
  MARKETING: 'bg-marketing-bg text-marketing-text',
  AI: 'bg-ai-bg text-ai-text',
};

export const JOB_DETAIL_LABELS: Record<ReviewJobDetail, string> = {
  SERVICE_PLANNING: '서비스 기획',
  BUSINESS_DEVELOPMENT: '사업 개발',
  DATA_ANALYSIS: '데이터 분석',
  PM_PO: 'PM/PO',
  UX_DESIGN: 'UX 디자인',
  UI_DESIGN: 'UI 디자인',
  WEB_DESIGN: '웹 디자인',
  GRAPHIC_DESIGN: '그래픽 디자인',
  BRAND_DESIGN: '브랜드 디자인',
  FRONTEND: '프론트엔드',
  BACKEND: '백엔드',
  FULLSTACK: '풀스택',
  SECURITY: '보안',
  DEVOPS: 'DevOps',
  IOS: 'iOS',
  ANDROID: '안드로이드',
  BLOCKCHAIN: '블록체인',
  GAME: '게임',
  BRAND_MARKETING: '브랜드 마케팅',
  CONTENT_MARKETING: '콘텐츠 마케팅',
  GROWTH_MARKETING: '그로스 마케팅',
  PERFORMANCE_MARKETING: '퍼포먼스 마케팅',
  PR: 'PR',
  MACHINE_LEARNING: '머신러닝',
  DEEP_LEARNING: '딥러닝',
  COMPUTER_VISION: '컴퓨터 비전',
  NLP: 'NLP',
  DATA_SCIENCE: '데이터 사이언스',
};

export const PROGRESS_STATUS_LABELS: Record<ReviewProgressStatus, string> = {
  IN_PROGRESSING: '진행 중',
  COMPLETED: '수료 완료',
  DROPPED: '중도 포기',
};

// ── 리뷰 필터(기획 3-4) ──────────────────────────────────────

/** 리뷰 목록 필터 상태 */
export interface ReviewFilterValue {
  rating: number | null; // 활동 총 평점 1~5
  jobGroup: ReviewJobGroup | null; // 관심 직군
  jobDetails: ReviewJobDetail[]; // 관심 세부 직무 (멀티)
  status: ReviewProgressStatus | null; // 수료 여부
}

export const EMPTY_REVIEW_FILTER: ReviewFilterValue = {
  rating: null,
  jobGroup: null,
  jobDetails: [],
  status: null,
};

export const RATING_OPTIONS = [5, 4, 3, 2, 1] as const;

export const REVIEW_STATUS_OPTIONS: { value: ReviewProgressStatus; label: string }[] = [
  { value: 'COMPLETED', label: '수료 완료' },
  { value: 'DROPPED', label: '중도 하차' },
];

export const JOB_GROUP_OPTIONS: ReviewJobGroup[] = ['PLANNING', 'DESIGN', 'DEVELOPMENT', 'MARKETING', 'AI'];

/** 직군별 세부 직무 (기획 3-4 기준, ETC 제외 / api jobDetail enum과 매칭) */
export const JOB_DETAIL_BY_GROUP: Record<ReviewJobGroup, ReviewJobDetail[]> = {
  PLANNING: ['SERVICE_PLANNING', 'BUSINESS_DEVELOPMENT', 'DATA_ANALYSIS', 'PM_PO'],
  DESIGN: ['UX_DESIGN', 'UI_DESIGN', 'WEB_DESIGN', 'GRAPHIC_DESIGN', 'BRAND_DESIGN'],
  DEVELOPMENT: ['FRONTEND', 'BACKEND', 'FULLSTACK', 'SECURITY', 'DEVOPS', 'IOS', 'ANDROID', 'BLOCKCHAIN', 'GAME'],
  MARKETING: ['BRAND_MARKETING', 'CONTENT_MARKETING', 'GROWTH_MARKETING', 'PERFORMANCE_MARKETING', 'PR'],
  AI: ['MACHINE_LEARNING', 'DEEP_LEARNING', 'COMPUTER_VISION', 'NLP', 'DATA_SCIENCE'],
};

/** 적용된 필터 개수 (활성 여부 판단용) */
export function countActiveFilters(filter: ReviewFilterValue): number {
  let count = 0;
  if (filter.rating) count += 1;
  if (filter.jobGroup) count += 1;
  count += filter.jobDetails.length;
  if (filter.status) count += 1;
  return count;
}

export function jobGroupLabel(value?: string | null): string {
  if (!value) return '';
  return JOB_GROUP_LABELS[value as ReviewJobGroup] ?? value;
}

export function jobGroupBadgeClass(value?: string | null): string {
  if (!value) return 'bg-gray-20 text-gray-50';
  return JOB_GROUP_BADGE_CLASS[value as ReviewJobGroup] ?? 'bg-gray-20 text-gray-50';
}

export function jobDetailLabel(value?: string | null): string {
  if (!value) return '';
  return JOB_DETAIL_LABELS[value as ReviewJobDetail] ?? value;
}

export function progressStatusLabel(value?: string | null): string {
  if (!value) return '';
  return PROGRESS_STATUS_LABELS[value as ReviewProgressStatus] ?? value;
}

/**
 * 점수를 0~100 퍼센트로 정규화한다.
 * 백엔드 점수 스케일(0~5 / 0~100)이 응답으로 확정되기 전이라 방어적으로 처리한다.
 * 0~5 범위 값은 ×20 하여 퍼센트로, 그 이상은 이미 퍼센트로 간주한다.
 */
export function toScorePercent(score?: number | null): number {
  const n = Number(score ?? 0);
  if (!Number.isFinite(n) || n <= 0) return 0;
  const percent = n <= 5 ? n * 20 : n;
  return Math.max(0, Math.min(100, Math.round(percent)));
}

/** 5점 만점 별점 표시용 값(0~5). 100점 스케일이 와도 5점 기준으로 환산한다. */
export function toFiveScale(score?: number | null): number {
  const n = Number(score ?? 0);
  if (!Number.isFinite(n) || n <= 0) return 0;
  const value = n > 5 ? n / 20 : n;
  return Math.max(0, Math.min(5, value));
}

/** 만족도 통계 items[]를 화면용 평균값으로 집계한 결과 */
export interface SatisfactionSummary {
  total: number;
  jobExperience: number;
  intensity: number;
  benefit: number;
  count: number;
}

/**
 * 만족도 통계는 직무(job_group/job_detail)별 items로 내려오므로,
 * "활동 만족도 평가" 섹션의 전체 평균을 단순 평균으로 집계한다.
 */
export function aggregateSatisfaction(items: SatisfactionAvgScores[]): SatisfactionSummary {
  if (!items.length) return { total: 0, jobExperience: 0, intensity: 0, benefit: 0, count: 0 };
  const sum = items.reduce(
    (acc, it) => ({
      total: acc.total + Number(it.avg_total_score ?? 0),
      jobExperience: acc.jobExperience + Number(it.avg_job_experience_score ?? 0),
      intensity: acc.intensity + Number(it.avg_activity_intensity_score ?? 0),
      benefit: acc.benefit + Number(it.avg_benefit_score ?? 0),
    }),
    { total: 0, jobExperience: 0, intensity: 0, benefit: 0 },
  );
  const n = items.length;
  return {
    total: sum.total / n,
    jobExperience: sum.jobExperience / n,
    intensity: sum.intensity / n,
    benefit: sum.benefit / n,
    count: n,
  };
}

/** participation_date(YYYY-MM / YYYY-MM-DD)를 "YYYY.MM 참여" 형태의 앞부분으로 변환 */
export function formatParticipationDate(value?: string | null): string {
  if (!value) return '';
  const match = value.match(/(\d{4})[-.](\d{2})/);
  if (match) return `${match[1]}.${match[2]}`;
  return value.replace(/-/g, '.');
}

// ── 내 리뷰: 조회·수정·삭제 (기획 3-5) ─────────────────────────────
// 주의: 공고 상세 리뷰 목록(ActivityReviewItem)에는 작성자 식별 필드가 없어
// "본인 리뷰" 판별이 불가능하다. 백엔드는 대신 본인 전용 엔드포인트를 제공한다:
//   GET /v1/reviews            내가 작성한 리뷰 목록    (MyReviewItem)
//   GET /v1/reviews/{id}       내 리뷰 단건(수정 프리필) (MyReviewDetail, 타인 접근 시 403)
//   PUT /v1/reviews/{id}       리뷰 수정               (ReviewUpdatePayload)
//   DELETE /v1/reviews/{id}    리뷰 삭제
// 따라서 수정/삭제 UI는 "내 리뷰" 컨텍스트에서 노출하는 것이 스펙 정합이다.

/** GET /v1/reviews item의 승인 상태 */
export type ReviewApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

/**
 * 디자인(PROFILE-004-001) 기준 라벨/색상:
 * - PENDING(증빙 검토 중)  → "승인중" (gray)
 * - APPROVED(증빙 승인)     → "승인"   (info/blue)
 * - REJECTED(미업로드/반려) → "미승인" (danger/red)
 */
export const REVIEW_APPROVAL_STATUS_LABELS: Record<ReviewApprovalStatus, string> = {
  PENDING: '승인중',
  APPROVED: '승인',
  REJECTED: '미승인',
};

/** 승인상태별 텍스트 색상 클래스 */
export const REVIEW_APPROVAL_STATUS_TEXT_CLASS: Record<ReviewApprovalStatus, string> = {
  PENDING: 'text-gray-50',
  APPROVED: 'text-info-50',
  REJECTED: 'text-danger-50',
};

export function reviewApprovalStatusLabel(status?: ReviewApprovalStatus | null): string {
  if (!status) return '';
  return REVIEW_APPROVAL_STATUS_LABELS[status] ?? status;
}

/** GET /v1/reviews 의 item — 내가 작성한 리뷰 목록 */
export interface MyReviewItem {
  id: number;
  title: string;
  organizer: string;
  organizer_type: string;
  activity_type: string;
  created_at: string;
  approval_status: ReviewApprovalStatus;
}

/** GET /v1/reviews 의 data (페이지네이션) */
export interface MyReviewListData {
  items: MyReviewItem[];
  page: number;
  size: number;
  total_pages: number;
  total_elements: number;
}

/** GET /v1/reviews/{id} 의 data — 수정 폼 프리필용 단건 */
export interface MyReviewDetail {
  job_group: ReviewJobGroup;
  job_detail: ReviewJobDetail;
  overall_score: number;
  info_score: number;
  difficulty_score: number;
  benefit_score: number;
  job_relevance_score: number;
  summary: string;
  strength: string;
  weakness: string;
  tips?: string | null;
  url?: string | null;
}

/** PUT /v1/reviews/{id} body (ReviewUpdateRequest). 작성 페이로드와 동일 구조. */
export interface ReviewUpdatePayload {
  activity_id: number;
  overall_score: number;
  info_score: number;
  difficulty_score: number;
  benefit_score: number;
  job_relevance_score: number;
  summary: string;
  strength: string;
  weakness: string;
  tips?: string;
  url?: string;
  job_category: {
    job_group: ReviewJobGroup;
    job_detail?: ReviewJobDetail;
  };
}
