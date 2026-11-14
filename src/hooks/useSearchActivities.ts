'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useReadyAfterMount } from './useReadyAfterMount';
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

const EMPTY_SEARCH: ApiActivityItem[] = [];

async function fetchSearchResults(trimmedKeyword: string): Promise<ApiActivityItem[]> {
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

  return categoryResults
    .flat()
    .filter((item) => !isClosedBackendActivity(item))
    .map(mapBackendActivityToApiItem);
}

export function useSearchActivities(keyword: string) {
  const trimmedKeyword = keyword.trim();
  const query = useQuery({
    queryKey: ['searchActivities', trimmedKeyword],
    queryFn: () => fetchSearchResults(trimmedKeyword),
    enabled: trimmedKeyword.length > 0,
    // 검색어를 바꾸는 동안 이전 결과를 유지(기존 동작과 같음)
    placeholderData: keepPreviousData,
  });
  const ready = useReadyAfterMount(query);

  if (!trimmedKeyword) {
    return { data: EMPTY_SEARCH, loading: false, error: null };
  }

  return {
    data: ready && !query.isError && query.data ? query.data : EMPTY_SEARCH,
    loading: query.isPending || !ready || query.isPlaceholderData,
    error: query.isPlaceholderData ? null : (query.error ?? null),
  };
}

export default useSearchActivities;
