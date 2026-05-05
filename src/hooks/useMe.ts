'use client';

import { useState, useEffect } from 'react';

type EmploymentInfo = {
  employmentStatus: string;
  company: string;
};

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
  };
}

export function useMe() {
  const [data, setData] = useState<MeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/members/me')
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(json => {
        setData(normalizeMeData(json));
      })
      .catch(() => {
        setData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
