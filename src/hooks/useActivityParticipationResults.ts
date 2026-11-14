'use client';

import { useQuery } from '@tanstack/react-query';
import type { ActivityParticipationResult } from '@/types/review.types';

interface ResultsWrapper {
  data?: { items?: ActivityParticipationResult[] };
}

/**
 * GET /api/activity-participations/results — 활동 결과 목록(리뷰 작성 대상).
 * 리뷰 작성/활동 변경 모달에서 participation_id·progress_status·can_write_review 활용.
 */
const EMPTY_RESULTS: ActivityParticipationResult[] = [];

export default function useActivityParticipationResults({ enabled = true }: { enabled?: boolean } = {}) {
  const query = useQuery({
    queryKey: ['participationResults', 100],
    queryFn: async (): Promise<ActivityParticipationResult[]> => {
      const r = await fetch('/api/activity-participations/results?size=100', { credentials: 'include' });
      if (!r.ok) throw new Error(String(r.status));
      const json = (await r.json()) as ResultsWrapper;
      return json.data?.items ?? [];
    },
    enabled,
  });
  // 화면 이동 직후 이전 화면의 캐시를 쓰지 않고 이 화면에서 받은 응답부터 쓴다(기존 동작과 같음)
  const ready = query.isFetchedAfterMount;

  // 기존 반환값 유지: 비활성·실패 시 빈 목록, loading은 요청 중일 때만 true
  return {
    data: enabled && ready && !query.isError && query.data ? query.data : EMPTY_RESULTS,
    loading: enabled && (query.isPending || !ready),
  };
}
