'use client';

import { useCallback, useEffect, useState } from 'react';

export type NotificationType = 'ACTIVITY_CREATED' | 'ACTIVITY_DEADLINE_REMINDER' | 'POPULAR_ACTIVITY';

// api-spec NotificationResponse
export interface NotificationItem {
  id: number;
  title: string;
  type: NotificationType;
  link: string;
  is_read: boolean;
  created_at: string;
}

interface Wrapper<T> {
  code: number;
  message: string;
  data: T;
}
interface NotificationPage {
  items: NotificationItem[];
  page: number;
  size: number;
  total_pages: number;
  total_elements: number;
}

/**
 * 알림 목록(GET /api/notifications, 최근 30일) + 전체삭제(DELETE) + 개별 닫기.
 * 개별 삭제 API가 없어(백엔드 미제공) X 버튼은 클라이언트 낙관적 제거로 처리한다.
 */
export default function useNotifications() {
  const [data, setData] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/notifications?page=1&size=30', { credentials: 'include' });
        if (!res.ok) throw new Error(`요청 실패: ${res.status}`);
        const json = (await res.json()) as Wrapper<NotificationPage>;
        if (!cancelled) setData(json.data?.items ?? []);
      } catch (e) {
        if (!cancelled) {
          setError(e as Error);
          setData([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 전체삭제 (낙관적 + 실패 시 롤백)
  const deleteAll = useCallback(async () => {
    setData((prev) => {
      const backup = prev;
      (async () => {
        try {
          const res = await fetch('/api/notifications', { method: 'DELETE', credentials: 'include' });
          if (!res.ok) throw new Error();
        } catch {
          setData(backup);
        }
      })();
      return [];
    });
  }, []);

  // 개별 닫기 — 백엔드 단건 삭제 API 없음 → 클라 제거만
  const dismiss = useCallback((id: number) => {
    setData((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { data, loading, error, deleteAll, dismiss };
}
