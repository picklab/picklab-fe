'use client';

import { useEffect, useState } from 'react';
import {
  isClosedBackendActivity,
  mapBackendActivityToApiItem,
  type ApiActivityItem,
  type BackendActivityItem,
} from './useActivities';

type SearchResponse = {
  data?: {
    items?: BackendActivityItem[];
    page?: number;
    size?: number;
    total_pages?: number;
    total_elements?: number;
  };
};

const SEARCH_ACTIVITY_TYPES = ['EXTRACURRICULAR', 'SEMINAR', 'EDUCATION', 'COMPETITION'] as const;
const SEARCH_PAGE_SIZE = 100;

function readSearchPage(payload: SearchResponse) {
  return {
    items: payload.data?.items ?? [],
    totalPages: payload.data?.total_pages ?? 1,
  };
}

export function useSearchActivities(keyword: string) {
  const [data, setData] = useState<ApiActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    const trimmedKeyword = keyword.trim();

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      if (!trimmedKeyword) {
        setData([]);
        setLoading(false);
        return;
      }

      try {
        const fetchSearchPage = async (type: (typeof SEARCH_ACTIVITY_TYPES)[number], page: number) => {
          const searchParams = new URLSearchParams({
            keyword: trimmedKeyword,
            type,
            page: String(page),
            size: String(SEARCH_PAGE_SIZE),
          });
          const response = await fetch(`/api/search/activities?${searchParams.toString()}`, {
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error('검색 결과를 불러오지 못했습니다.');
          }

          return readSearchPage((await response.json()) as SearchResponse);
        };

        const categoryResults = await Promise.all(
          SEARCH_ACTIVITY_TYPES.map(async (type) => {
            const firstPage = await fetchSearchPage(type, 1);
            const restPages =
              firstPage.totalPages > 1
                ? await Promise.all(
                    Array.from({ length: firstPage.totalPages - 1 }, (_, index) => fetchSearchPage(type, index + 2)),
                  )
                : [];

            return [firstPage, ...restPages].flatMap((page) => page.items);
          }),
        );
        const items = categoryResults.flat();

        if (!cancelled) {
          setData(items.filter((item) => !isClosedBackendActivity(item)).map(mapBackendActivityToApiItem));
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

    fetchSearchResults();

    return () => {
      cancelled = true;
    };
  }, [keyword]);

  return { data, loading, error };
}

export default useSearchActivities;
