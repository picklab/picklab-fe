'use client';

import { useState, useEffect } from 'react';
import { getActivitiesByEndpoint, mapActivityToApiItem } from '@/lib/activity-data';

export type ActivityEndpoint =
  | 'recommendations'
  | 'popular'
  | 'recently-viewed'
  | 'latest';

export type ApiActivityItem = ReturnType<typeof mapActivityToApiItem>;

type BackendActivityCategory = 'EXTRACURRICULAR' | 'EDUCATION' | 'COMPETITION' | 'SEMINAR';
type BackendRecruitmentEndType = 'FIXED' | 'ALWAYS_OPEN' | 'CLOSE_ON_HIRE';

export interface BackendActivityItem {
  id: number | string;
  title?: string | null;
  organization?: string | null;
  organizer_type?: string | null;
  organizerType?: string | null;
  start_date?: string | null;
  category?: BackendActivityCategory | string | null;
  job_tags?: string[] | null;
  thumbnail_url?: string | null;
  view_count?: number | null;
  recruitment_end_type?: BackendRecruitmentEndType | string | null;
  is_bookmarked?: boolean | null;
  dday?: number | null;
}

interface BackendActivityListResponse {
  code?: number;
  data?: {
    items?: BackendActivityItem[];
  };
}

const ACTIVITY_CATEGORIES: BackendActivityCategory[] = ['EXTRACURRICULAR', 'EDUCATION', 'COMPETITION', 'SEMINAR'];

const CATEGORY_LABELS: Record<BackendActivityCategory, ApiActivityItem['activityType']> = {
  EXTRACURRICULAR: '대외활동',
  EDUCATION: '교육',
  COMPETITION: '공모전/해커톤',
  SEMINAR: '강연/세미나',
};

const ORGANIZATION_LABELS: Record<string, string> = {
  LARGE_CORPORATION: '대기업',
  MEDIUM_CORPORATION: '중견기업',
  SMALL_CORPORATION: '중소기업',
  STARTUP: '스타트업',
  PUBLIC_ORGANIZATION: '공공기관/공기업',
  NON_PROFIT: '비영리단체/협회/재단',
  FINANCIAL: '금융권',
  FINANCIAL_INSTITUTION: '금융권',
  FOREIGN_CORPORATION: '외국계기업',
  HOSPITAL: '병원',
  ETC: '기타',
};

const JOB_LABELS: Record<string, string> = {
  PLANNING: '기획',
  DESIGN: '디자인',
  DEVELOPMENT: '개발',
  MARKETING: '마케팅',
  AI: 'AI',
};

function getEndpointPath(endpoint: ActivityEndpoint) {
  if (endpoint === 'latest') return '/api/activities';
  return `/api/activities/${endpoint}`;
}

function getBadgeText(item: BackendActivityItem) {
  if (item.recruitment_end_type === 'ALWAYS_OPEN') return '상시모집';
  if (item.recruitment_end_type === 'CLOSE_ON_HIRE') return '모집 시 마감';

  if (typeof item.dday === 'number') {
    if (item.dday < 0) return '마감';
    if (item.dday === 0) return 'D-Day';
    return `D-${String(item.dday).padStart(2, '0')}`;
  }

  return '모집중';
}

export function isClosedBackendActivity(item: BackendActivityItem) {
  return item.recruitment_end_type === 'FIXED' && typeof item.dday === 'number' && item.dday < 0;
}

export function mapBackendActivityToApiItem(item: BackendActivityItem): ApiActivityItem {
  const category = item.category && item.category in CATEGORY_LABELS
    ? CATEGORY_LABELS[item.category as BackendActivityCategory]
    : '대외활동';
  const organizerType = item.organizer_type ?? item.organizerType;
  const companyType = organizerType ? ORGANIZATION_LABELS[organizerType] ?? organizerType : '';
  const jobs = (item.job_tags ?? [])
    .map((job) => JOB_LABELS[job] ?? job)
    .filter((job) => ['기획', '개발', '마케팅', '디자인', 'AI'].includes(job));

  return {
    id: String(item.id),
    title: item.title ?? '',
    organizer: item.organization ?? '',
    activityType: category,
    thumbnailImage: item.thumbnail_url ?? '',
    registrationPeriod: getBadgeText(item),
    activityPeriod: item.start_date?.replace(/-/g, '.') ?? '',
    detailLink: `/activity/${item.id}`,
    activityField: jobs.join('; '),
    companyType,
    jobs: jobs.length > 0 ? jobs : ['기타'],
    saveCount: 0,
    viewCount: Number(item.view_count ?? 0),
  };
}

function readBackendItems(response: BackendActivityListResponse): BackendActivityItem[] {
  return response.data?.items ?? [];
}

async function fetchBackendActivities(
  endpoint: ActivityEndpoint,
  params?: Record<string, string>,
): Promise<ApiActivityItem[]> {
  const size = params?.size ?? '20';
  const sort = params?.sort ?? 'LATEST';
  const path = getEndpointPath(endpoint);

  if (endpoint === 'latest') {
    const category = params?.category as BackendActivityCategory | undefined;
    const categories = category ? [category] : ACTIVITY_CATEGORIES;
    const results = await Promise.all(
      categories.map(async (activityCategory) => {
        const searchParams = new URLSearchParams({
          category: activityCategory,
          sort,
          size,
          page: params?.page ?? '1',
        });
        const response = await fetch(`${path}?${searchParams.toString()}`, { credentials: 'include' });
        if (!response.ok) return [];
        const json = await response.json() as BackendActivityListResponse;
        return readBackendItems(json);
      }),
    );

    return results.flat().filter((item) => !isClosedBackendActivity(item)).map(mapBackendActivityToApiItem);
  }

  const searchParams = new URLSearchParams(params ?? { size });
  const query = searchParams.toString();
  const response = await fetch(query ? `${path}?${query}` : path, { credentials: 'include' });
  if (!response.ok) return [];

  const json = await response.json() as BackendActivityListResponse;
  return readBackendItems(json).filter((item) => !isClosedBackendActivity(item)).map(mapBackendActivityToApiItem);
}

export function useActivities(
  endpoint: ActivityEndpoint,
  params?: Record<string, string>,
) {
  const [data, setData] = useState<ApiActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const paramsKey = params ? JSON.stringify(params) : '';

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const parsedParams = paramsKey ? JSON.parse(paramsKey) : undefined;
        const size = Number(parsedParams?.size ?? 20);
        const fallbackOnEmpty = parsedParams?.fallbackOnEmpty !== 'false';
        const backendItems = await fetchBackendActivities(endpoint, parsedParams);
        const mapped = backendItems.length > 0
          ? backendItems
          : fallbackOnEmpty
            ? getActivitiesByEndpoint(endpoint, size).map(mapActivityToApiItem)
            : [];

        if (!cancelled) {
          setData(mapped);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          const parsedParams = paramsKey ? JSON.parse(paramsKey) : undefined;
          const size = Number(parsedParams?.size ?? 20);
          setData(getActivitiesByEndpoint(endpoint, size).map(mapActivityToApiItem));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [endpoint, paramsKey]);

  return { data, loading, error };
}

export default useActivities;
