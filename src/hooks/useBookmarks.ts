'use client';

import { useEffect, useState } from 'react';
import {
  isClosedBackendActivity,
  mapBackendActivityToApiItem,
  type ApiActivityItem,
  type BackendActivityItem,
} from './useActivities';

type BookmarkCategory = 'EXTRACURRICULAR' | 'SEMINAR' | 'EDUCATION' | 'COMPETITION';
type BookmarkSortType = 'RECENTLY_BOOKMARKED' | 'LATEST' | 'DEADLINE_ASC' | 'DEADLINE_DESC';

interface BackendBookmarkListResponse {
  code?: number;
  data?: {
    items?: BackendActivityItem[];
    page?: number;
    size?: number;
    total_pages?: number;
    total_elements?: number;
  };
}

type UseBookmarksParams = {
  activityType?: BookmarkCategory;
  sortType?: BookmarkSortType;
  size?: number;
};

export function useBookmarks({ activityType, sortType = 'RECENTLY_BOOKMARKED', size = 100 }: UseBookmarksParams = {}) {
  const [data, setData] = useState<ApiActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchBookmarks = async () => {
      setLoading(true);
      setError(null);

      try {
        const searchParams = new URLSearchParams({
          page: '0',
          size: String(size),
          sortType,
        });

        if (activityType) {
          searchParams.append('activityTypes', activityType);
        }

        const response = await fetch(`/api/bookmarks?${searchParams.toString()}`, {
          credentials: 'include',
        });

        if (response.status === 401) {
          throw new Error('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
        }

        if (!response.ok) {
          throw new Error('북마크 목록을 불러오지 못했습니다.');
        }

        const payload = (await response.json()) as BackendBookmarkListResponse;
        const items = payload.data?.items ?? [];

        if (!cancelled) {
          setData(
            items
              .filter((item) => !isClosedBackendActivity(item))
              .map((item) => ({
                ...mapBackendActivityToApiItem(item),
                isBookmarked: item.is_bookmarked ?? true,
              })),
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setData([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBookmarks();

    return () => {
      cancelled = true;
    };
  }, [activityType, size, sortType]);

  return { data, loading, error };
}

export default useBookmarks;
