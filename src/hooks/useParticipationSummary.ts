'use client';

import { useQuery } from '@tanstack/react-query';

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
  const query = useQuery({
    queryKey: ['participationSummary'],
    queryFn: async (): Promise<ParticipationSummary> => {
      const r = await fetch('/api/activity-participations/summary', { credentials: 'include' });
      if (!r.ok) throw new Error(String(r.status));
      const json = (await r.json()) as SummaryWrapper;
      return { ...EMPTY, ...(json.data ?? {}) };
    },
    enabled,
  });
  // 화면 이동 직후 이전 화면의 캐시를 쓰지 않고 이 화면에서 받은 응답부터 쓴다(기존 동작과 같음)
  const ready = query.isFetchedAfterMount;

  // 기존 반환값 유지: 비활성·실패 시 빈 카운트, loading은 요청 중일 때만 true
  return {
    data: enabled && ready && !query.isError && query.data ? query.data : EMPTY,
    loading: enabled && (query.isPending || !ready),
  };
}
