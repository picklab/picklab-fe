'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  MyReviewDetail,
  MyReviewListData,
  ReviewApiWrapper,
  ReviewUpdatePayload,
} from '@/types/review.types';

interface QueryOptions {
  enabled?: boolean;
}

interface QueryResult<T> {
  data: T;
  loading: boolean;
  error: Error | null;
  /** 수동 재조회 (수정/삭제 후 목록 갱신용) */
  refetch: () => void;
}

async function fetchJson<T>(url: string): Promise<ReviewApiWrapper<T>> {
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) {
    throw new Error(`요청 실패: ${response.status}`);
  }
  return (await response.json()) as ReviewApiWrapper<T>;
}

/** GET /api/reviews — 내가 작성한 리뷰 목록(기획 3-5) */
export function useMyReviews(
  { enabled = true, page = 1, size = 10 }: QueryOptions & { page?: number; size?: number } = {},
): QueryResult<MyReviewListData | null> {
  const [data, setData] = useState<MyReviewListData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    fetchJson<MyReviewListData>(`/api/reviews?${params.toString()}`)
      .then((res) => {
        if (!cancelled) {
          setData(res.data ?? null);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, page, size, reloadKey]);

  return { data, loading, error, refetch };
}

/** GET /api/reviews/[id] — 내 리뷰 단건(수정 폼 프리필). 타인 리뷰 접근 시 서버가 403 반환 */
export function useMyReview(
  id: string | number | null,
  { enabled = true }: QueryOptions = {},
): QueryResult<MyReviewDetail | null> {
  const [data, setData] = useState<MyReviewDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    if (!enabled || id == null || id === '') return;
    let cancelled = false;
    setLoading(true);
    fetchJson<MyReviewDetail>(`/api/reviews/${id}`)
      .then((res) => {
        if (!cancelled) {
          setData(res.data ?? null);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, id, reloadKey]);

  return { data, loading, error, refetch };
}

/** PUT /api/reviews/[id] — 리뷰 수정 */
export async function updateReview(id: string | number, payload: ReviewUpdatePayload): Promise<void> {
  const response = await fetch(`/api/reviews/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const message =
      (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string'
        ? err.message
        : null) ?? '리뷰 수정에 실패했습니다.';
    throw new Error(message);
  }
}

/** DELETE /api/reviews/[id] — 리뷰 삭제 */
export async function deleteReview(id: string | number): Promise<void> {
  const response = await fetch(`/api/reviews/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const message =
      (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string'
        ? err.message
        : null) ?? '리뷰 삭제에 실패했습니다.';
    throw new Error(message);
  }
}
