'use client';

import { useEffect, useState } from 'react';

/** GET /v1/activity-participations/summary 의 data */
export interface ParticipationSummary {
  applied_count: number;
  accepted_count: number;
  rejected_count: number;
  completed_count: number;
}

interface SummaryWrapper {
  data?: Partial<ParticipationSummary>;
}

const EMPTY: ParticipationSummary = {
  applied_count: 0,
  accepted_count: 0,
  rejected_count: 0,
  completed_count: 0,
};

/** 활동 결과 카운트(지원완료/최종합격/불합격/수료완료) 조회 */
export default function useParticipationSummary({ enabled = true }: { enabled?: boolean } = {}) {
  const [data, setData] = useState<ParticipationSummary>(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setLoading(true);
    fetch('/api/activity-participations/summary', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json: SummaryWrapper) => {
        if (!cancelled) setData({ ...EMPTY, ...(json.data ?? {}) });
      })
      .catch(() => {
        if (!cancelled) setData(EMPTY);
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
