'use client';

import { useEffect, useState } from 'react';
import type { ActivityParticipationResult } from '@/types/review.types';

interface ResultsWrapper {
  data?: { items?: ActivityParticipationResult[] };
}

/**
 * GET /api/activity-participations/results — 활동 결과 목록(리뷰 작성 대상).
 * 리뷰 작성/활동 변경 모달에서 participation_id·progress_status·can_write_review 활용.
 */
export default function useActivityParticipationResults({ enabled = true }: { enabled?: boolean } = {}) {
  const [data, setData] = useState<ActivityParticipationResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setLoading(true);
    fetch('/api/activity-participations/results?size=100', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json: ResultsWrapper) => {
        if (!cancelled) setData(json.data?.items ?? []);
      })
      .catch(() => {
        if (!cancelled) setData([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { data, loading };
}
