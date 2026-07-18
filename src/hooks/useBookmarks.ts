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
  /** true면 마감 공고도 포함해서 반환(진행여부 필터용). 기본 false=마감 제외(기존 동작). */
  includeClosed?: boolean;
};

/** 북마크 카드 + 마감 여부 플래그(진행여부 필터용) + 저장일·모집기간(일정관리용). */
export type BookmarkItem = ApiActivityItem & {
  isClosed: boolean;
  bookmarkedAt?: string; // 저장한 날짜 (YYYY-MM-DD)
  recruitmentStartDate?: string; // 지원 시작일
  recruitmentEndDate?: string; // 지원 마감일
};

export function useBookmarks({
  activityType,
  sortType = 'RECENTLY_BOOKMARKED',
  size = 100,
  includeClosed = false,
}: UseBookmarksParams = {}) {
  const [data, setData] = useState<BookmarkItem[]>([]);
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
          const mapped: BookmarkItem[] = items.map((item) => ({
            ...mapBackendActivityToApiItem(item),
            isBookmarked: item.is_bookmarked ?? true,
            isClosed: isClosedBackendActivity(item),
            bookmarkedAt: item.bookmarked_at ?? undefined,
            recruitmentStartDate: item.recruitment_start_date ?? undefined,
            recruitmentEndDate: item.recruitment_end_date ?? undefined,
          }));
          // 기본은 마감 제외(기존 동작), includeClosed면 전체 반환
          setData(includeClosed ? mapped : mapped.filter((m) => !m.isClosed));
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
  }, [activityType, size, sortType, includeClosed]);

  return { data, loading, error };
}

export default useBookmarks;
