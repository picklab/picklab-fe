export function extractActivityId(detailLink: string): string | null {
  const id = detailLink.split('/').filter(Boolean).pop();
  return id ?? null;
}

type ToggleBookmarkParams = {
  activityId: string;
  isBookmarked: boolean;
};

function readErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== 'object') return fallback;
  const record = payload as Record<string, unknown>;
  if (typeof record.message === 'string') return record.message;
  if (typeof record.error === 'string') return record.error;
  return fallback;
}

export async function toggleBookmark({ activityId, isBookmarked }: ToggleBookmarkParams) {
  const method = isBookmarked ? 'DELETE' : 'POST';
  const response = await fetch(`/api/activities/${activityId}/bookmarks`, { method });
  const payload = await response.json().catch(() => ({}));

  if (response.status === 401) {
    throw new Error('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
  }

  if (!response.ok) {
    throw new Error(readErrorMessage(payload, '북마크 처리에 실패했습니다.'));
  }

  return {
    isBookmarked: !isBookmarked,
    payload,
  };
}

