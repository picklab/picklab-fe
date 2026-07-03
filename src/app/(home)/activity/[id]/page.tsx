import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import PcActivityDetailPage from './_components/PcActivityDetailPage';
import MobileActivityDetailPage from './_components/MobileActivityDetailPage';
import ActivityViewRecorder from './_components/ActivityViewRecorder';
import { findActivityById, mapActivityToDetailItem } from '@/lib/activity-data';
import type { ActivityCardItem } from '@/app/(home)/_components/constant';

interface ActivityDetailPageProps {
  params: Promise<{ id: string }>;
}

const BACKEND_URL = process.env.EXTERNAL_API_BASE_URL || 'http://161.153.21.86:8080';

type BackendRecruitmentEndType = 'FIXED' | 'ALWAYS_OPEN' | 'CLOSE_ON_HIRE';

interface BackendActivityDetail {
  id: number | string;
  title?: string | null;
  organization?: string | null;
  organizer_type?: string | null;
  organizerType?: string | null;
  target?: string | null;
  recruit_period?: {
    start_date?: string | null;
    end_date?: string | null;
    recruitment_end_type?: BackendRecruitmentEndType | string | null;
  } | null;
  activity_period?: {
    start_date?: string | null;
    end_date?: string | null;
  } | null;
  category?: string | null;
  domains?: string[] | null;
  regions?: string[] | null;
  job_tags?: string[] | null;
  views?: number | null;
  bookmarks?: number | null;
  homepage_url?: string | null;
  application_url?: string | null;
  thumbnail?: string | null;
  apply_status?: string | null;
  is_bookmarked?: boolean | null;
  description?: string | null;
  benefits?: string | null;
  required_files?: Record<string, { name?: string | null; url?: string | null }> | null;
}

interface BackendActivityDetailResponse {
  code?: number;
  data?: BackendActivityDetail;
}

const CATEGORY_LABELS: Record<string, ActivityCardItem['activityType']> = {
  EXTRACURRICULAR: '대외활동',
  EDUCATION: '교육',
  COMPETITION: '공모전/해커톤',
  SEMINAR: '강연/세미나',
};

const ORGANIZATION_LABELS: Record<string, string> = {
  LARGE_CORPORATION: '대기업',
  MEDIUM_CORPORATION: '중견기업',
  SMALL_CORPORATION: '중소기업',
  STARTUP: '스타트업',
  PUBLIC_ORGANIZATION: '공공기관/공기업',
  NON_PROFIT: '비영리/협회/재단',
  FINANCIAL: '금융권',
  FINANCIAL_INSTITUTION: '금융권',
  FOREIGN_CORPORATION: '외국계',
  HOSPITAL: '병원',
  ETC: '기타',
};

const TARGET_LABELS: Record<string, string> = {
  UNIVERSITY_STUDENT: '대학생',
  OFFICE_WORKER: '직장인',
  GENERAL: '대상 제한 없음',
  ETC: '기타',
};

const JOB_LABELS: Record<string, string> = {
  PLANNING: '기획',
  DESIGN: '디자인',
  DEVELOPMENT: '개발',
  MARKETING: '마케팅',
  AI: 'AI',
};

function formatDate(value?: string | null) {
  return value ? value.replace(/-/g, '.') : '';
}

function formatPeriod(start?: string | null, end?: string | null, endType?: string | null) {
  const formattedStart = formatDate(start);

  if (endType === 'ALWAYS_OPEN') return formattedStart ? `${formattedStart} ~ 상시모집` : '상시모집';
  if (endType === 'CLOSE_ON_HIRE') return formattedStart ? `${formattedStart} ~ 모집 시 마감` : '모집 시 마감';

  const formattedEnd = formatDate(end);
  if (formattedStart && formattedEnd) return `${formattedStart} ~ ${formattedEnd}`;
  return formattedStart || formattedEnd || '-';
}

function getBadgeText(recruitPeriod?: BackendActivityDetail['recruit_period']) {
  const endType = recruitPeriod?.recruitment_end_type;
  if (endType === 'ALWAYS_OPEN') return '상시모집';
  if (endType === 'CLOSE_ON_HIRE') return '모집 시 마감';

  if (!recruitPeriod?.end_date) return '모집중';

  const today = new Date();
  const end = new Date(recruitPeriod.end_date);
  const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (Number.isNaN(diffDays)) return '모집중';
  if (diffDays < 0) return '마감';
  if (diffDays === 0) return 'D-Day';
  return `D-${String(diffDays).padStart(2, '0')}`;
}

function mapBackendDetailToActivity(raw: BackendActivityDetail): ActivityCardItem {
  const organizerType = raw.organizer_type ?? raw.organizerType;
  const companyType = organizerType ? ORGANIZATION_LABELS[organizerType] ?? organizerType : '';
  const jobs = (raw.job_tags ?? []).map((job) => JOB_LABELS[job] ?? job).filter(Boolean);
  const domains = (raw.domains ?? []).filter(Boolean);
  const activityFields = [...new Set([...domains, ...jobs])];
  // required_files: { key: { name, url } } → 다운로드 가능한 배열로 정규화
  const requiredFiles = Object.values(raw.required_files ?? {})
    .map((file) => ({ name: file?.name ?? '', url: file?.url ?? '' }))
    .filter((file) => file.url);

  return {
    detailLink: `/activity/${raw.id}`,
    applyLink: raw.application_url ?? raw.homepage_url ?? '',
    activityType: raw.category ? CATEGORY_LABELS[raw.category] ?? raw.category : '대외활동',
    source: '',
    title: raw.title ?? '',
    organizer: raw.organization ?? '',
    companyType,
    target: raw.target ? TARGET_LABELS[raw.target] ?? raw.target : '대상 제한 없음',
    registrationPeriod: formatPeriod(
      raw.recruit_period?.start_date,
      raw.recruit_period?.end_date,
      raw.recruit_period?.recruitment_end_type,
    ),
    activityPeriod: formatPeriod(raw.activity_period?.start_date, raw.activity_period?.end_date),
    recruitment: '-',
    region: raw.regions?.join(', ') || '-',
    homepage: raw.homepage_url ?? '',
    contestField: '',
    activityField: activityFields.join('; '),
    costPrize: raw.benefits ?? '',
    description: raw.description ?? '',
    thumbnailImage: raw.thumbnail ?? '/imgs/cat.jpg',
    detailImage: '',
    badgeText: getBadgeText(raw.recruit_period),
    viewCount: Number(raw.views ?? 0),
    saveCount: Number(raw.bookmarks ?? 0),
    isBookmarked: Boolean(raw.is_bookmarked),
    requiredFiles,
  };
}

async function fetchActivityDetail(id: string): Promise<ActivityCardItem | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const headers: HeadersInit = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    const response = await fetch(`${BACKEND_URL}/v1/activities/${id}`, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const json = (await response.json()) as BackendActivityDetailResponse;
    return json.data ? mapBackendDetailToActivity(json.data) : null;
  } catch {
    return null;
  }
}

export default async function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  const { id } = await params;
  const apiActivity = await fetchActivityDetail(id);
  const rawActivity = apiActivity ? null : findActivityById(id);

  if (!apiActivity && !rawActivity) {
    return notFound();
  }

  const activity = apiActivity ?? mapActivityToDetailItem(rawActivity!);

  return (
    <>
      <ActivityViewRecorder activityId={id} />
      <PcActivityDetailPage activity={activity} />
      <MobileActivityDetailPage activity={activity} />
    </>
  );
}
