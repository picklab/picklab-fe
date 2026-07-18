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
 * 알림 목록(GET /api/notifications, 최근 30일) + 전체삭제(DELETE) + 개별 삭제(DELETE /{id})
 * + 읽음 처리(PATCH /{id}/read) + 실시간 구독(SSE /subscribe).
 * 삭제/읽음은 낙관적 반영 후 실패 시 롤백.
 */
export default function useNotifications() {
  const [data, setData] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 목록 재조회 (최초 로드 + SSE push 시). notifications 목록은 0-based 페이징(page=1이면 빈 목록).
  const fetchList = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications?page=0&size=30', { credentials: 'include' });
      if (!res.ok) throw new Error(`요청 실패: ${res.status}`);
      const json = (await res.json()) as Wrapper<NotificationPage>;
      setData(json.data?.items ?? []);
      setError(null);
    } catch (e) {
      setError(e as Error);
      setData([]);
    }
  }, []);

  // 최초 로드
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchList().finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [fetchList]);

  // 실시간 알림 구독(SSE). 백엔드는 새 알림을 named event `notification`으로 push한다
  // (연결 직후 `connect` 핸드셰이크는 무시 — 초기 로드로 이미 최신 상태). push 시 목록 재조회.
  useEffect(() => {
    const es = new EventSource('/api/notifications/subscribe', { withCredentials: true });
    const onPush = () => {
      void fetchList();
    };
    es.addEventListener('notification', onPush);
    es.onerror = () => {
      // 로그아웃/네트워크 단절 시 재연결 폭주 방지 → 연결 종료(다음 진입 시 재구독)
      es.close();
    };
    return () => es.close();
  }, [fetchList]);

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

  // 개별 삭제 (낙관적 제거 + 실패 시 롤백)
  const dismiss = useCallback((id: number) => {
    setData((prev) => {
      const backup = prev;
      (async () => {
        try {
          const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE', credentials: 'include' });
          if (!res.ok) throw new Error();
        } catch {
          setData(backup);
        }
      })();
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  // 읽음 처리 (낙관적 반영 + 실패 시 롤백). 이미 읽음이면 no-op.
  const markRead = useCallback((id: number) => {
    setData((prev) => {
      if (!prev.some((n) => n.id === id && !n.is_read)) return prev;
      const backup = prev;
      (async () => {
        try {
          const res = await fetch(`/api/notifications/${id}/read`, { method: 'PATCH', credentials: 'include' });
          if (!res.ok) throw new Error();
        } catch {
          setData(backup);
        }
      })();
      return prev.map((n) => (n.id === id ? { ...n, is_read: true } : n));
    });
  }, []);

  return { data, loading, error, deleteAll, dismiss, markRead };
}
