export const ROLE_OPTIONS = [
  { label: '기획', value: 'PLANNING' },
  { label: '디자인', value: 'DESIGN' },
  { label: '개발', value: 'DEVELOPMENT' },
  { label: '마케팅', value: 'MARKETING' },
  { label: 'AI', value: 'AI' },
] as const;

export const DETAIL_ROLE_OPTIONS = {
  PLANNING: [
    { label: '서비스 기획', value: 'SERVICE_PLANNING' },
    { label: '사업 개발', value: 'BUSINESS_DEVELOPMENT' },
    { label: '데이터 분석', value: 'DATA_ANALYSIS' },
    { label: 'PM/PO', value: 'PM_PO' },
    { label: '기획 기타', value: 'PLANNING_ETC' },
  ],
  DESIGN: [
    { label: 'UX 디자인', value: 'UX_DESIGN' },
    { label: 'UI 디자인', value: 'UI_DESIGN' },
    { label: '웹 디자인', value: 'WEB_DESIGN' },
    { label: '그래픽 디자인', value: 'GRAPHIC_DESIGN' },
    { label: '브랜드 디자인', value: 'BRAND_DESIGN' },
    { label: '디자인 기타', value: 'DESIGN_ETC' },
  ],
  DEVELOPMENT: [
    { label: '프론트엔드', value: 'FRONTEND' },
    { label: '백엔드', value: 'BACKEND' },
    { label: '풀스택', value: 'FULLSTACK' },
    { label: '보안', value: 'SECURITY' },
    { label: 'DevOps', value: 'DEVOPS' },
    { label: 'iOS', value: 'IOS' },
    { label: '안드로이드', value: 'ANDROID' },
    { label: '블록체인', value: 'BLOCKCHAIN' },
    { label: '게임', value: 'GAME' },
    { label: '개발 기타', value: 'DEVELOPMENT_ETC' },
  ],
  MARKETING: [
    { label: '브랜드 마케팅', value: 'BRAND_MARKETING' },
    { label: '콘텐츠 마케팅', value: 'CONTENT_MARKETING' },
    { label: '그로스 마케팅', value: 'GROWTH_MARKETING' },
    { label: '퍼포먼스 마케팅', value: 'PERFORMANCE_MARKETING' },
    { label: 'PR', value: 'PR' },
    { label: '마케팅 기타', value: 'MARKETING_ETC' },
  ],
  AI: [
    { label: '머신러닝', value: 'MACHINE_LEARNING' },
    { label: '딥러닝', value: 'DEEP_LEARNING' },
    { label: '컴퓨터 비전', value: 'COMPUTER_VISION' },
    { label: 'NLP', value: 'NLP' },
    { label: '데이터 사이언스', value: 'DATA_SCIENCE' },
    { label: 'AI 기타', value: 'AI_ETC' },
  ],
} as const;

export type ArchiveRole = keyof typeof DETAIL_ROLE_OPTIONS;

export function toDateString(date?: Date | null) {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function readApiErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== 'object') return fallback;
  const record = payload as Record<string, unknown>;
  if (typeof record.message === 'string') return record.message;
  if (typeof record.error === 'string') return record.error;
  return fallback;
}

function unwrapData(payload: unknown) {
  if (!payload || typeof payload !== 'object') return payload;
  const record = payload as Record<string, unknown>;
  return record.data ?? payload;
}

type PresignedUploadInfo = {
  uploadUrl: string;
  fileUrl?: string;
};

export function parsePresignedUploadInfo(payload: unknown): PresignedUploadInfo | null {
  const candidates: unknown[] = [payload, unwrapData(payload)];

  for (const item of candidates) {
    if (!item || typeof item !== 'object') continue;
    const record = item as Record<string, unknown>;

    const uploadUrl =
      (typeof record.uploadUrl === 'string' && record.uploadUrl) ||
      (typeof record.presignedUrl === 'string' && record.presignedUrl) ||
      (typeof record.presigned_url === 'string' && record.presigned_url) ||
      (typeof record.putUrl === 'string' && record.putUrl) ||
      (typeof record.url === 'string' && record.url);

    if (!uploadUrl) continue;

    const fileUrl =
      (typeof record.fileUrl === 'string' && record.fileUrl) ||
      (typeof record.publicUrl === 'string' && record.publicUrl) ||
      (typeof record.downloadUrl === 'string' && record.downloadUrl) ||
      undefined;

    return {
      uploadUrl,
      fileUrl,
    };
  }

  return null;
}
