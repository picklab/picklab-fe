'use client';

import { useState, useEffect } from 'react';
import { getActivitiesByEndpoint, mapActivityToApiItem } from '@/lib/activity-data';

export type ActivityEndpoint =
  | 'recommendations'
  | 'popular'
  | 'recently-viewed'
  | 'latest';

export type ApiActivityItem = ReturnType<typeof mapActivityToApiItem>;

export function useActivities(
  endpoint: ActivityEndpoint,
  params?: Record<string, string>,
) {
  const [data, setData] = useState<ApiActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const paramsKey = params ? JSON.stringify(params) : '';

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const parsedParams = paramsKey ? JSON.parse(paramsKey) : undefined;
        const size = Number(parsedParams?.size ?? 20);
        const selected = getActivitiesByEndpoint(endpoint, size);
        const mapped = selected.map(mapActivityToApiItem);

        if (!cancelled) {
          setData(mapped);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [endpoint, paramsKey]);

  return { data, loading, error };
}

export default useActivities;
