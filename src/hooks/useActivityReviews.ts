'use client';

import { useState, useEffect } from 'react';
import type {
  ReviewListData,
  SatisfactionAvgScores,
  JobRelevanceStats,
  ReviewApiWrapper,
  ReviewFilterValue,
} from '@/types/review.types';

interface ReviewQueryOptions {
  /** 리뷰 탭이 활성화됐을 때만 호출하기 위한 플래그 */
  enabled?: boolean;
  page?: number;
  size?: number;
  filter?: ReviewFilterValue;
}

interface ReviewQueryResult<T> {
  data: T;
  loading: boolean;
  error: Error | null;
}

async function fetchJson<T>(url: string): Promise<ReviewApiWrapper<T>> {
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) {
    throw new Error(`요청 실패: ${response.status}`);
  }
  return (await response.json()) as ReviewApiWrapper<T>;
}

/** GET /api/activities/[id]/reviews — 리뷰 목록(페이지네이션) */
export function useActivityReviews(
  activityId: string,
  { enabled = true, page = 1, size = 20, filter }: ReviewQueryOptions = {},
): ReviewQueryResult<ReviewListData | null> {
  const [data, setData] = useState<ReviewListData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // 필터 객체 참조가 매 렌더 바뀌어도 값이 같으면 재요청하지 않도록 직렬화 키로 비교
  const filterKey = filter ? JSON.stringify(filter) : '';

  useEffect(() => {
    if (!enabled || !activityId) return;
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        const parsedFilter: ReviewFilterValue | undefined = filterKey ? JSON.parse(filterKey) : undefined;
        if (parsedFilter?.rating) params.set('rating', String(parsedFilter.rating));
        // jobGroup/jobDetail은 api-spec상 array 파라미터 → 반복 파라미터로 전달
        if (parsedFilter?.jobGroup) params.append('jobGroup', parsedFilter.jobGroup);
        parsedFilter?.jobDetails?.forEach((detail) => params.append('jobDetail', detail));
        if (parsedFilter?.status) params.set('status', parsedFilter.status);

        const json = await fetchJson<ReviewListData>(`/api/activities/${activityId}/reviews?${params.toString()}`);
        if (!cancelled) setData(json.data ?? null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [activityId, enabled, page, size, filterKey]);

  return { data, loading, error };
}

/** GET /api/reviews/statistics/satisfaction/[id] — 만족도 평균 통계(직무별 items) */
export function useReviewSatisfactionStats(
  activityId: string,
  { enabled = true }: Pick<ReviewQueryOptions, 'enabled'> = {},
): ReviewQueryResult<SatisfactionAvgScores[]> {
  const [data, setData] = useState<SatisfactionAvgScores[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled || !activityId) return;
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const json = await fetchJson<{ items?: SatisfactionAvgScores[] }>(
          `/api/reviews/statistics/satisfaction/${activityId}`,
        );
        if (!cancelled) setData(json.data?.items ?? []);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setData([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [activityId, enabled]);

  return { data, loading, error };
}

/** GET /api/reviews/statistics/job-relevance/[id] — 직무 연관성 평균 통계 */
export function useReviewJobRelevanceStats(
  activityId: string,
  { enabled = true }: Pick<ReviewQueryOptions, 'enabled'> = {},
): ReviewQueryResult<JobRelevanceStats | null> {
  const [data, setData] = useState<JobRelevanceStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled || !activityId) return;
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const json = await fetchJson<JobRelevanceStats>(`/api/reviews/statistics/job-relevance/${activityId}`);
        if (!cancelled) setData(json.data ?? null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [activityId, enabled]);

  return { data, loading, error };
}
