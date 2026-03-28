import activitiesJson from '../../data/activities.latest.json';
import type { ActivityCardItem } from '@/app/(home)/_components/constant';

export type LocalActivity = (typeof activitiesJson)[number];

const JOB_MAPPINGS = [
  { label: '기획', keywords: ['기획', 'pm', 'po', '전략', '운영', '멘토링', '기자단'] },
  { label: '개발', keywords: ['개발', '프론트', '백엔드', '해커톤', '엔지니어', '코딩'] },
  { label: '마케팅', keywords: ['마케팅', '홍보', 'sns', '콘텐츠', '서포터즈', '브랜드'] },
  { label: '디자인', keywords: ['디자인', 'ui', 'ux', '영상', '편집'] },
  { label: 'AI', keywords: ['ai', '인공지능', '머신러닝', '데이터'] },
] as const;

export interface LocalApiActivityItem {
  id: string;
  title: string;
  organizer: string;
  activityType: string;
  thumbnailImage: string;
  registrationPeriod: string;
  activityPeriod: string;
  detailLink: string;
  activityField: string;
  companyType: string;
  jobs: string[];
  saveCount: number;
  viewCount: number;
}

export type LocalActivityEndpoint = 'recommendations' | 'popular' | 'recently-viewed' | 'latest';
export type ActivityRouteSlug = 'activities' | 'seminar' | 'education' | 'contest';
export type ActivityMenuId = 'all' | 'external-activity' | 'seminar' | 'education' | 'contest';
export type ActivityPageSort = 'latest' | 'soon' | 'remain';
export type ActivityPageFilters = Record<string, string[]>;
const RECENTLY_VIEWED_STORAGE_KEY = 'picklab-recently-viewed';
const REGION_OPTIONS = [
  '온라인',
  '서울',
  '경기',
  '인천',
  '강원',
  '대전',
  '세종',
  '충남',
  '충북',
  '광주',
  '전남',
  '전북',
  '대구',
  '경북',
  '부산',
  '울산',
  '경남',
  '제주',
] as const;

function containsAny(text: string, keywords: readonly string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function formatDateRange(start?: string | null, end?: string | null): string {
  if (!start && !end) return '';
  const s = start ?? '';
  const e = end ?? '';
  if (s && e) return `${s.replace(/-/g, '.')} ~ ${e.replace(/-/g, '.')}`;
  return (s || e).replace(/-/g, '.');
}

function getCardBadgeText(endDate?: string | null): string {
  if (!endDate) return '모집중';

  const today = new Date();
  const end = new Date(endDate);
  const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (Number.isNaN(diffDays)) return '모집중';
  if (diffDays < 0) return '마감';
  if (diffDays === 0) return 'D-Day';
  return `D-${String(diffDays).padStart(2, '0')}`;
}

function parseDate(value?: string | null): number {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function extractSection(content: string, labels: string[]): string {
  if (!content) return '';

  const escaped = labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(
    `(?:○|■|▶)?\\s*(?:${escaped.join('|')})\\s*[-:：]?\\s*(.+?)(?=(?:○|■|▶)\\s*[가-힣A-Za-z0-9].*?[-:：]|$)`,
    'is',
  );
  const match = content.match(pattern);
  return match ? normalizeWhitespace(match[1]) : '';
}

function extractRegion(content?: string | null): string {
  if (!content) return '지역 제한없음';

  const section = extractSection(content, ['진행 장소', '모임지역', '활동 지역']);
  if (section) return section;

  const locationMatch = content.match(
    /(서울|경기|인천|부산|대구|광주|대전|울산|세종|제주|강원|충북|충남|전북|전남|경북|경남)[^○■▶]{0,30}/,
  );
  return locationMatch ? normalizeWhitespace(locationMatch[0]) : '지역 제한없음';
}

function extractRecruitment(content?: string | null): string {
  if (!content) return '-';
  return extractSection(content, ['모집인원']) || '-';
}

function extractBenefit(content?: string | null, fallback?: string | null): string {
  if (!content) return fallback ?? '';
  return (
    extractSection(content, ['혜택내역', '대외활동 혜택', '활동 혜택', '혜택']) ||
    fallback ||
    ''
  );
}

function normalizeJobTags(tags?: string[] | null): string[] {
  const sourceTags = Array.isArray(tags) ? tags : [];
  const joined = sourceTags.join(' ').toLowerCase();

  const normalized = JOB_MAPPINGS.filter(({ keywords }) =>
    keywords.some((keyword) => joined.includes(keyword.toLowerCase())),
  ).map(({ label }) => label);

  if (normalized.length > 0) {
    return normalized.slice(0, 3);
  }

  return ['기타'];
}

function buildDetailImages(raw: LocalActivity): string {
  const images = [raw.thumbnail, raw.imageUrl, raw.raw?.thumbnailUrl]
    .filter((image): image is string => Boolean(image))
    .map((image) => image.trim());

  return [...new Set(images)].join('; ');
}

function createStableMetric(seed: string, min: number, max: number): number {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return min + (hash % (max - min + 1));
}

function getCategoryLabelBySlug(slug: ActivityRouteSlug | 'all'): string | null {
  if (slug === 'all') return null;
  if (slug === 'activities') return '대외활동';
  if (slug === 'seminar') return '강연/세미나';
  if (slug === 'education') return '교육';
  return '공모전/해커톤';
}

function inferOrganizerType(raw: LocalActivity): string {
  const text = `${raw.organization ?? ''} ${raw.companyName ?? ''} ${raw.raw?.organizer ?? ''} ${raw.title ?? ''}`.toLowerCase();

  if (containsAny(text, ['은행', '보험', '증권', '카드', '캐피탈', '금융', '농협손해보험', 'nh'])) return '금융권';
  if (containsAny(text, ['병원', '의료원', '치과', '한의원', '메디컬'])) return '병원';
  if (
    containsAny(text, [
      '공단',
      '공사',
      '청',
      '시청',
      '구청',
      '도청',
      '교육청',
      '진흥원',
      '중앙회',
      '국립',
      '정부',
      '위원회',
      '재외동포청',
      '소방청',
      '문화예술위원회',
      '공제중앙회',
    ])
  ) {
    return '공공기관/공기업';
  }
  if (containsAny(text, ['재단', '협회', '학회', '비영리', '굿네이버스', 'ngo'])) return '비영리단체/협회/재단';
  if (containsAny(text, ['스타트업', '벤처'])) return '스타트업';
  if (containsAny(text, ['삼성', 'lg', '현대', 'sk', '롯데', 'cj', '한화', '포스코', '카카오', '네이버', '쿠팡', '이랜드'])) {
    return '대기업';
  }
  if (containsAny(text, ['미래에셋', '펄어비스', '윌라', '윈스펙'])) {
    return '중견기업';
  }
  if (containsAny(text, ['주식회사', '(주)', '회사', 'corp', 'inc'])) {
    return '중소기업';
  }
  return '기타';
}

function inferTargetGroups(raw: LocalActivity): string[] {
  const text = `${raw.raw?.category ?? ''} ${raw.raw?.content ?? ''} ${raw.summary ?? ''}`.toLowerCase();
  const groups = new Set<string>();

  if (containsAny(text, ['제한 없음', '누구나', '신청자격 제한 없음', '국민 누구나', '일반인'])) {
    groups.add('제한 없음');
  }
  if (containsAny(text, ['대학생', '대학원생', '재학생', '휴학생', '학부생'])) groups.add('대학생');
  if (containsAny(text, ['직장인', '재직자', '현직자', '실무자'])) groups.add('직장인');

  if (groups.size === 0) {
    groups.add('기타');
  }

  return [...groups];
}

function inferFieldGroups(raw: LocalActivity): string[] {
  const text = `${raw.title} ${raw.summary ?? ''} ${raw.raw?.content ?? ''} ${(raw.jobs ?? []).join(' ')}`.toLowerCase();
  const groups = new Set<string>();

  if (/(서포터즈|supporters?)/.test(text)) groups.add('서포터즈');
  if (/(마케터|마케팅|홍보|브랜드|sns|콘텐츠)/.test(text)) groups.add('마케터');
  if (/(멘토링|멘토|코칭)/.test(text)) groups.add('멘토링');
  if (/(기자단|에디터|취재)/.test(text)) groups.add('기자단');
  if (/(해외봉사|국외봉사|글로벌봉사|해외 volunteer)/.test(text)) groups.add('해외봉사');
  if (/(국내봉사단|국내봉사|봉사단|사회공헌|캠페인|교육기부)/.test(text)) groups.add('국내봉사단');

  return [...groups];
}

function inferRegionGroups(raw: LocalActivity): string[] {
  const content = `${raw.raw?.content ?? ''} ${raw.summary ?? ''}`.toLowerCase();
  const region = extractRegion(raw.raw?.content ?? raw.summary ?? '');
  const groups = REGION_OPTIONS.filter((option) => region.includes(option));
  if (containsAny(content, ['온라인', '비대면', 'zoom', '화상', '구글 meet'])) {
    groups.unshift('온라인');
  }
  return [...new Set(groups)];
}

function inferRelatedJobs(raw: LocalActivity): string[] {
  const jobs = normalizeJobTags(raw.jobs);
  return jobs.includes('기타') ? ['기타'] : jobs;
}

function matchesSelectedFilters(raw: LocalActivity, selectedFilters: ActivityPageFilters = {}): boolean {
  const organizerType = inferOrganizerType(raw);
  const targets = inferTargetGroups(raw);
  const fields = inferFieldGroups(raw);
  const regions = inferRegionGroups(raw);
  const jobs = inferRelatedJobs(raw);

  return Object.entries(selectedFilters).every(([category, options]) => {
    const activeOptions = options.filter((option) => option !== '전체');
    if (activeOptions.length === 0) return true;

    if (category === '주최기관') {
      return activeOptions.includes(organizerType);
    }
    if (category === '참여대상') {
      return activeOptions.some((option) => targets.includes(option));
    }
    if (category === '활동분야') {
      return activeOptions.some((option) => fields.includes(option));
    }
    if (category === '모집지역') {
      return activeOptions.some((option) => regions.includes(option));
    }
    if (category === '관련직무') {
      return activeOptions.some((option) => jobs.includes(option));
    }

    return true;
  });
}

function sortForActivityPage(items: LocalActivity[], sort: ActivityPageSort): LocalActivity[] {
  if (sort === 'soon') {
    return sortByDeadline(items);
  }
  if (sort === 'remain') {
    return [...sortByDeadline(items)].reverse();
  }
  return sortByLatest(items);
}

function readRecentlyViewedIds(): string[] {
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

function sortByLatest(items: LocalActivity[]) {
  return [...items].sort((a, b) => {
    const aDate = parseDate(a.startDate ?? a.raw?.applicationStartAt);
    const bDate = parseDate(b.startDate ?? b.raw?.applicationStartAt);
    return bDate - aDate;
  });
}

function sortByDeadline(items: LocalActivity[]) {
  return [...items].sort((a, b) => {
    const aDate = parseDate(a.endDate ?? a.raw?.applicationEndAt);
    const bDate = parseDate(b.endDate ?? b.raw?.applicationEndAt);
    return aDate - bDate;
  });
}

export function getAllActivities(): LocalActivity[] {
  return activitiesJson as LocalActivity[];
}

export function getActivitiesByEndpoint(endpoint: LocalActivityEndpoint, size = 20): LocalActivity[] {
  const items = getAllActivities();

  switch (endpoint) {
    case 'popular':
      return sortByDeadline(items).slice(0, Math.min(size, 10));
    case 'recently-viewed': {
      const recentIds = readRecentlyViewedIds();
      return recentIds
        .map((id) => items.find((item) => item.id === id))
        .filter((item): item is LocalActivity => Boolean(item))
        .slice(0, size);
    }
    case 'latest':
      return sortByLatest(items).slice(0, size);
    case 'recommendations':
    default:
      return sortByLatest(items)
        .filter((item) => item.categoryKey === 'EXTRACURRICULAR')
        .slice(0, size);
  }
}

export function getActivitiesForCategoryPage(params: {
  slug: ActivityRouteSlug | 'all';
  selectedFilters?: ActivityPageFilters;
  sort?: ActivityPageSort;
  size?: number;
}): LocalApiActivityItem[] {
  const {
    slug,
    selectedFilters = {},
    sort = 'latest',
    size,
  } = params;

  const categoryLabel = getCategoryLabelBySlug(slug);
  const filtered = getAllActivities().filter((item) => {
    const matchesCategory = categoryLabel ? item.categoryLabel === categoryLabel : true;
    return matchesCategory && matchesSelectedFilters(item, selectedFilters);
  });

  const sorted = sortForActivityPage(filtered, sort);
  const sliced = typeof size === 'number' ? sorted.slice(0, size) : sorted;

  return sliced.map(mapActivityToApiItem);
}

export function getActivityCountForCategoryPage(params: {
  slug: ActivityRouteSlug | 'all';
  selectedFilters?: ActivityPageFilters;
}): number {
  return getActivitiesForCategoryPage({ ...params }).length;
}

export function findActivityById(id: string): LocalActivity | undefined {
  return getAllActivities().find((item) => item.id === id);
}

export function recordRecentlyViewedActivity(id: string) {
  if (typeof window === 'undefined' || !id) return;

  const nextIds = [id, ...readRecentlyViewedIds().filter((currentId) => currentId !== id)].slice(0, 20);
  window.localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(nextIds));
}

export function mapActivityToApiItem(raw: LocalActivity): LocalApiActivityItem {
  const jobs = normalizeJobTags(raw.jobs);
  const saveCount = Number(raw.saveCount ?? 0) || createStableMetric(`${raw.id}-save`, 12, 180);
  const viewCount = Number(raw.viewCount ?? 0) || createStableMetric(`${raw.id}-view`, 120, 980);

  return {
    id: String(raw.id),
    title: raw.title ?? '',
    organizer: raw.organization ?? raw.companyName ?? '',
    activityType: raw.categoryLabel ?? '',
    thumbnailImage: raw.thumbnail ?? raw.imageUrl ?? '',
    registrationPeriod: getCardBadgeText(raw.endDate ?? raw.raw?.applicationEndAt),
    activityPeriod: formatDateRange(
      raw.activityStartDate ?? raw.raw?.activityStartAt,
      raw.activityEndDate ?? raw.raw?.activityEndAt,
    ),
    detailLink: `/activity/${raw.id}`,
    activityField: jobs.join('; '),
    companyType: raw.source ?? '',
    jobs,
    saveCount,
    viewCount,
  };
}

export function mapActivityToDetailItem(raw: LocalActivity): ActivityCardItem {
  const content = raw.raw?.content ?? raw.summary ?? '';
  const jobs = normalizeJobTags(raw.jobs);

  return {
    detailLink: `/activity/${raw.id}`,
    applyLink: raw.raw?.homepageUrl ?? raw.sourceUrl ?? '',
    activityType: raw.categoryLabel ?? '대외활동',
    source: raw.source ?? '',
    title: raw.title ?? '',
    organizer: raw.organization ?? raw.companyName ?? '',
    companyType: raw.source ?? '',
    target: raw.raw?.category ?? '대상 제한 없음',
    registrationPeriod: formatDateRange(raw.startDate, raw.endDate),
    activityPeriod: formatDateRange(raw.activityStartDate, raw.activityEndDate),
    recruitment: extractRecruitment(content),
    region: extractRegion(content),
    homepage: raw.raw?.homepageUrl ?? raw.sourceUrl ?? '',
    contestField: '',
    activityField: jobs.join('; '),
    costPrize: extractBenefit(content, raw.summary),
    description: content,
    thumbnailImage: raw.thumbnail ?? raw.imageUrl ?? '/imgs/default-activity.png',
    detailImage: buildDetailImages(raw),
  };
}
