// 최근 본 활동 id 목록(localStorage).
const RECENTLY_VIEWED_STORAGE_KEY = 'picklab-recently-viewed';

export function readRecentlyViewedIds(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : [];
  } catch {
    return [];
  }
}

export function recordRecentlyViewedActivity(id: string) {
  if (typeof window === 'undefined' || !id) return;

  const nextIds = [id, ...readRecentlyViewedIds().filter((currentId) => currentId !== id)].slice(0, 20);
  window.localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(nextIds));
}
