'use client';

import { useEffect, useState } from 'react';
import type { CardChipProps } from '@/components/common/Card/CardChip';

type ArchiveCategory = 'EXTRACURRICULAR' | 'SEMINAR' | 'EDUCATION' | 'COMPETITION';

type BackendArchiveItem = {
  id?: number | string | null;
  archive_id?: number | string | null;
  archiveId?: number | string | null;
  activity_id?: number | string | null;
  activityId?: number | string | null;
  title?: string | null;
  activity_title?: string | null;
  activityTitle?: string | null;
  organization?: string | null;
  organizer?: string | null;
  organization_name?: string | null;
  organizationName?: string | null;
  activity_thumbnail_url?: string | null;
  activityThumbnailUrl?: string | null;
  thumbnail_url?: string | null;
  thumbnailUrl?: string | null;
  thumbnail?: string | null;
  activity_type?: ArchiveCategory | string | null;
  activityType?: ArchiveCategory | string | null;
  category?: ArchiveCategory | string | null;
  activity_start_date?: string | null;
  activityStartDate?: string | null;
  user_start_date?: string | null;
  userStartDate?: string | null;
  start_date?: string | null;
  startDate?: string | null;
  activity_end_date?: string | null;
  activityEndDate?: string | null;
  user_end_date?: string | null;
  userEndDate?: string | null;
  end_date?: string | null;
  endDate?: string | null;
  record_status?: string | null;
  recordStatus?: string | null;
  write_status?: string | null;
  writeStatus?: string | null;
  is_written?: boolean | null;
  isWritten?: boolean | null;
};

type ArchiveResponse = {
  data?: {
    items?: BackendArchiveItem[];
  } | BackendArchiveItem[];
};

export type ArchiveActivityItem = {
  id: string;
  activityId: string;
  title: string;
  organization: string;
  thumbnail: string;
  chipTitle: CardChipProps['text'];
  startDate: Date | null;
  endDate: Date | null;
  statusText: string;
};

const CATEGORY_LABELS: Record<string, CardChipProps['text']> = {
  EXTRACURRICULAR: '대외활동',
  SEMINAR: '강연/세미나',
  EDUCATION: '교육',
  COMPETITION: '공모전/해커톤',
};

function toDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getRecordStatus(item: BackendArchiveItem) {
  if (typeof item.is_written === 'boolean') return item.is_written ? '작성 완료' : '미작성';
  if (typeof item.isWritten === 'boolean') return item.isWritten ? '작성 완료' : '미작성';

  const status = item.write_status ?? item.writeStatus ?? item.record_status ?? item.recordStatus;
  if (status === 'NOT_WRITTEN') return '미작성';
  if (status === 'IN_PROGRESS') return '작성 중';
  if (status === 'WRITTEN' || status === 'COMPLETED') return '작성 완료';
  return '미작성';
}

function readItems(payload: ArchiveResponse): BackendArchiveItem[] {
  if (Array.isArray(payload.data)) return payload.data;
  return payload.data?.items ?? [];
}

function mapArchiveItem(item: BackendArchiveItem): ArchiveActivityItem {
  const archiveId = item.archive_id ?? item.archiveId ?? item.id ?? item.activity_id ?? item.activityId ?? '';
  const activityId = item.activity_id ?? item.activityId ?? '';
  const category = item.activity_type ?? item.activityType ?? item.category ?? 'EXTRACURRICULAR';

  return {
    id: String(archiveId),
    activityId: String(activityId),
    title: item.title ?? item.activity_title ?? item.activityTitle ?? '',
    organization: item.organizer ?? item.organization_name ?? item.organizationName ?? item.organization ?? '',
    thumbnail:
      item.activity_thumbnail_url ??
      item.activityThumbnailUrl ??
      item.thumbnail_url ??
      item.thumbnailUrl ??
      item.thumbnail ??
      '/imgs/cat.jpg',
    chipTitle: CATEGORY_LABELS[category] ?? '대외활동',
    startDate: toDate(
      item.user_start_date ?? item.userStartDate ?? item.activity_start_date ?? item.activityStartDate ?? item.start_date ?? item.startDate,
    ),
    endDate: toDate(
      item.user_end_date ?? item.userEndDate ?? item.activity_end_date ?? item.activityEndDate ?? item.end_date ?? item.endDate,
    ),
    statusText: getRecordStatus(item),
  };
}

export function useArchiveActivities() {
  const [data, setData] = useState<ArchiveActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchArchiveActivities = async () => {
      setLoading(true);
      setError(null);

      try {
        const searchParams = new URLSearchParams({
          sort: 'LATEST',
        });
        const response = await fetch(`/api/archive?${searchParams.toString()}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('아카이브 활동을 불러오지 못했습니다.');
        }

        const payload = (await response.json()) as ArchiveResponse;
        const items = readItems(payload).map(mapArchiveItem);

        if (!cancelled) {
          setData(items);
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

    fetchArchiveActivities();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}

export default useArchiveActivities;
