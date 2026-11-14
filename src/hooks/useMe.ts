'use client';

import { useQuery } from '@tanstack/react-query';

type EmploymentInfo = {
  employmentStatus: string;
  company: string;
};

export interface NotificationPreferences {
  popular: boolean;
  bookmarked: boolean;
}

export interface MeData {
  name: string;
  nickname: string;
  email: string;
  profileImage: string | null;
  jobs: string[];
  selectedInterestedJobs: string[];
  jobFields: string[];
  educationLevel: string;
  birthDate: string;
  employment: EmploymentInfo | null;
  emailAgreement: boolean;
  notificationPreferences: NotificationPreferences;
}

const JOB_LABELS: Record<string, string> = {
  PLANNING: '기획',
  DESIGN: '디자인',
  DEVELOPMENT: '개발',
  MARKETING: '마케팅',
  AI: 'AI',
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
  ANDROID: 'Android',
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

function unwrapData(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== 'object') return {};
  const record = payload as Record<string, unknown>;
  const data = record.data;
  return data && typeof data === 'object' ? (data as Record<string, unknown>) : record;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
}

function toJobLabels(codes: string[]) {
  return codes.map((code) => JOB_LABELS[code] ?? code);
}

function normalizeMeData(payload: unknown): MeData {
  const d = unwrapData(payload);
  const selectedInterestedJobs = toStringArray(d.selected_interested_jobs ?? d.selectedInterestedJobs);
  const jobFields = toStringArray(d.job_fields ?? d.jobFields);
  const legacyJobs = toStringArray(d.jobs ?? d.job_categories ?? d.jobCategories);
  const jobCodes = selectedInterestedJobs.length > 0 ? selectedInterestedJobs : jobFields.length > 0 ? jobFields : legacyJobs;
  const employment = d.employment && typeof d.employment === 'object' ? (d.employment as Record<string, unknown>) : null;
  const prefs =
    d.notification_preferences && typeof d.notification_preferences === 'object'
      ? (d.notification_preferences as Record<string, unknown>)
      : d.notificationPreferences && typeof d.notificationPreferences === 'object'
        ? (d.notificationPreferences as Record<string, unknown>)
        : {};

  return {
    name: typeof d.name === 'string' ? d.name : '',
    nickname:
      (typeof d.nickname === 'string' && d.nickname) ||
      (typeof d.nick_name === 'string' && d.nick_name) ||
      (typeof d.name === 'string' && d.name) ||
      '',
    email: typeof d.email === 'string' ? d.email : '',
    profileImage:
      (typeof d.profile_image === 'string' && d.profile_image) ||
      (typeof d.profileImage === 'string' && d.profileImage) ||
      (typeof d.profile_image_url === 'string' && d.profile_image_url) ||
      null,
    jobs: toJobLabels(jobCodes),
    selectedInterestedJobs,
    jobFields,
    educationLevel:
      (typeof d.education_level === 'string' && d.education_level) ||
      (typeof d.educationLevel === 'string' && d.educationLevel) ||
      '',
    birthDate:
      (typeof d.birth_date === 'string' && d.birth_date) ||
      (typeof d.birthDate === 'string' && d.birthDate) ||
      '',
    employment: employment
      ? {
          employmentStatus:
            (typeof employment.employment_status === 'string' && employment.employment_status) ||
            (typeof employment.employmentStatus === 'string' && employment.employmentStatus) ||
            '',
          company: typeof employment.company === 'string' ? employment.company : '',
        }
      : null,
    emailAgreement: d.email_agreement === true || d.emailAgreement === true,
    notificationPreferences: {
      popular: prefs.popular === true,
      bookmarked: prefs.bookmarked === true,
    },
  };
}

/** 내 정보 캐시 키. 프로필·관심직무·이메일 등을 저장한 뒤 이 키를 invalidate하면 화면 전체에 반영된다. */
export const ME_QUERY_KEY = ['me'] as const;

async function fetchMe(): Promise<MeData> {
  const res = await fetch('/api/members/me');
  if (!res.ok) throw new Error('Not authenticated');
  return normalizeMeData(await res.json());
}

export function useMe() {
  const query = useQuery({ queryKey: ME_QUERY_KEY, queryFn: fetchMe });
  // 화면 이동 직후 이전 화면의 캐시를 그대로 보여주지 않고, 이 화면에서 받은 첫 응답부터 쓴다(기존 동작과 같음)
  const ready = query.isFetchedAfterMount;

  // 기존 반환값 유지: 실패 시 data는 null, loading은 첫 응답 전까지만 true
  return {
    data: ready && !query.isError ? (query.data ?? null) : null,
    loading: query.isPending || !ready,
  };
}
