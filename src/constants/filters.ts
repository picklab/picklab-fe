/**
 * 직무유형 필터 공용 옵션 (Set A)
 * - 백엔드 jobTag 코드: PLANNING / DESIGN / DEVELOPMENT / MARKETING / AI
 * - 모든 직무유형 드롭다운(홈/검색/PC목록/저장공고/카테고리)에서 동일 값 사용
 */
export const JOB_TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: "기획", value: "planning" },
  { label: "디자인", value: "design" },
  { label: "개발", value: "development" },
  { label: "마케팅", value: "marketing" },
  { label: "AI", value: "ai" },
];
