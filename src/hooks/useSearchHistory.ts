'use client';

import { useCallback, useEffect, useState } from 'react';

/** 검색 기록 단건 */
export type SearchHistoryItem = {
  id: number;
  keyword: string;
  searched_at: string;
};

/** GET /api/search/history 응답 래퍼 */
type SearchHistoryResponse = {
  data?: {
    items?: SearchHistoryItem[];
  };
};

interface UseSearchHistoryOptions {
  enabled?: boolean;
}

interface UseSearchHistoryResult {
  items: SearchHistoryItem[];
  loading: boolean;
  error: Error | null;
  /** 수동 재조회 (삭제 후 목록 갱신용) */
  refetch: () => void;
}

/** GET /api/search/history — 최근 검색기록 목록 */
export function useSearchHistory(
  { enabled = true }: UseSearchHistoryOptions = {},
): UseSearchHistoryResult {
  const [items, setItems] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams({ page: '1', size: '10' });
    fetch(`/api/search/history?${params.toString()}`, { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`검색 기록 조회 실패: ${response.status}`);
        }
        return (await response.json()) as SearchHistoryResponse;
      })
      .then((res) => {
        if (!cancelled) {
          setItems(res.data?.items ?? []);
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
  }, [enabled, reloadKey]);

  return { items, loading, error, refetch };
}

/** DELETE /api/search/history/[id] — 개별 검색 기록 삭제 */
export async function deleteSearchHistory(id: number): Promise<void> {
  const response = await fetch(`/api/search/history/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const message =
      (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string'
        ? err.message
        : null) ?? '검색 기록 삭제에 실패했습니다.';
    throw new Error(message);
  }
}

/** DELETE /api/search/history — 검색 기록 전체 삭제 */
export async function deleteAllSearchHistory(): Promise<void> {
  const response = await fetch('/api/search/history', {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const message =
      (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string'
        ? err.message
        : null) ?? '검색 기록 전체 삭제에 실패했습니다.';
    throw new Error(message);
  }
}

/**
 * POST /api/search/history — 검색 실행 시 기록 저장.
 * 검색 흐름을 방해하지 않도록 실패해도 조용히 무시한다.
 */
export async function createSearchHistory(keyword: string): Promise<void> {
  try {
    await fetch('/api/search/history', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword }),
    });
  } catch (err) {
    console.error('검색 기록 저장 실패:', err);
  }
}
