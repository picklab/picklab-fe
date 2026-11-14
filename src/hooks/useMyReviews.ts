'use client';

import { useCallback } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useReadyAfterMount } from './useReadyAfterMount';
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
  const query = useQuery({
    queryKey: ['myReviews', page, size],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), size: String(size) });
      const res = await fetchJson<MyReviewListData>(`/api/reviews?${params.toString()}`);
      return res.data ?? null;
    },
    enabled,
    // 페이지를 바꾸는 동안 이전 목록을 유지(기존 동작과 같음)
    placeholderData: keepPreviousData,
  });
  const { refetch: queryRefetch } = query;
  const refetch = useCallback(() => {
    void queryRefetch();
  }, [queryRefetch]);
  const ready = useReadyAfterMount(query);

  return toQueryResult(query, ready, enabled, refetch);
}

/** GET /api/reviews/[id] — 내 리뷰 단건(수정 폼 프리필). 타인 리뷰 접근 시 서버가 403 반환 */
export function useMyReview(
  id: string | number | null,
  { enabled = true }: QueryOptions = {},
): QueryResult<MyReviewDetail | null> {
  const active = enabled && id != null && id !== '';
  const query = useQuery({
    queryKey: ['myReview', id],
    queryFn: async () => (await fetchJson<MyReviewDetail>(`/api/reviews/${id}`)).data ?? null,
    enabled: active,
    placeholderData: keepPreviousData,
  });
  const { refetch: queryRefetch } = query;
  const refetch = useCallback(() => {
    void queryRefetch();
  }, [queryRefetch]);
  const ready = useReadyAfterMount(query);

  return toQueryResult(query, ready, active, refetch);
}

// 기존 수제 훅과 같은 반환값으로 맞춘다.
// - 다시 불러오는 중(페이지 변경·refetch)에도 이전 데이터를 보여 주고 loading만 true
// - 실패해도 이전 데이터는 유지하고 error만 채운다
// - 화면 이동 직후 이전 화면의 캐시는 쓰지 않고, 이 화면에서 받은 응답부터 쓴다(ready, useReadyAfterMount 참고)
function toQueryResult<T>(
  query: { data: T | null | undefined; error: Error | null; isFetching: boolean },
  ready: boolean,
  active: boolean,
  refetch: () => void,
): QueryResult<T | null> {
  return {
    data: ready ? (query.data ?? null) : null,
    loading: active && (!ready || query.isFetching),
    error: query.error ?? null,
    refetch,
  };
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
