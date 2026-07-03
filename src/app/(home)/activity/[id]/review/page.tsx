import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import PcReviewWritePage from './_components/PcReviewWritePage';
import MobileReviewWritePage from './_components/MobileReviewWritePage';
import { findActivityById, mapActivityToDetailItem } from '@/lib/activity-data';
import type { ActivityCardItem } from '@/app/(home)/_components/constant';
import type { MyReviewDetail } from '@/types/review.types';

interface ReviewWritePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}

const BACKEND_URL = process.env.EXTERNAL_API_BASE_URL || 'http://161.153.21.86:8080';

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

interface BackendActivityDetail {
  id: number | string;
  title?: string | null;
  organization?: string | null;
  organizer_type?: string | null;
  organizerType?: string | null;
  category?: string | null;
  thumbnail?: string | null;
  application_url?: string | null;
  homepage_url?: string | null;
}

interface BackendActivityDetailResponse {
  code?: number;
  data?: BackendActivityDetail;
}

/** 활동 상세를 리뷰 작성에 필요한 최소 필드로 매핑 (activity/[id]/page.tsx 패턴 참고). */
function mapBackendDetailToActivity(raw: BackendActivityDetail): ActivityCardItem {
  const organizerType = raw.organizer_type ?? raw.organizerType;
  const companyType = organizerType ? ORGANIZATION_LABELS[organizerType] ?? organizerType : '';

  return {
    detailLink: `/activity/${raw.id}`,
    applyLink: raw.application_url ?? raw.homepage_url ?? '',
    activityType: raw.category ? CATEGORY_LABELS[raw.category] ?? raw.category : '대외활동',
    source: '',
    title: raw.title ?? '',
    organizer: raw.organization ?? '',
    companyType,
    target: '',
    registrationPeriod: '',
    activityPeriod: '',
    recruitment: '',
    region: '',
    homepage: raw.homepage_url ?? '',
    contestField: '',
    activityField: '',
    costPrize: '',
    description: '',
    thumbnailImage: raw.thumbnail ?? '/imgs/cat.jpg',
    detailImage: '',
    badgeText: '',
    viewCount: 0,
    saveCount: 0,
    isBookmarked: false,
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

/** 수정 모드 프리필용: 내 리뷰 단건 조회. (비로그인/타인 리뷰면 null) */
async function fetchReviewDetail(reviewId: string): Promise<MyReviewDetail | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    if (!accessToken) return null;
    const response = await fetch(`${BACKEND_URL}/v1/reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const json = (await response.json()) as { data?: MyReviewDetail };
    return json.data ?? null;
  } catch {
    return null;
  }
}

/** 수료여부 저장용 participationId: 활동 결과 목록에서 activity_id 매칭. (미참여/비로그인이면 null) */
async function fetchParticipationId(activityId: string): Promise<number | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    if (!accessToken) return null;
    const response = await fetch(`${BACKEND_URL}/v1/activity-participations/results?size=100`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const json = (await response.json()) as { data?: { items?: { participation_id?: number; activity_id?: number }[] } };
    const match = json.data?.items?.find((it) => Number(it?.activity_id) === Number(activityId));
    return match?.participation_id ?? null;
  } catch {
    return null;
  }
}

export default async function ReviewWritePage({ params, searchParams }: ReviewWritePageProps) {
  const { id } = await params;
  const { edit: editReviewId } = await searchParams;
  const [apiActivity, participationId, reviewDetail] = await Promise.all([
    fetchActivityDetail(id),
    fetchParticipationId(id),
    editReviewId ? fetchReviewDetail(editReviewId) : Promise.resolve(null),
  ]);
  const rawActivity = apiActivity ? null : findActivityById(id);

  if (!apiActivity && !rawActivity) {
    return notFound();
  }

  const activity = apiActivity ?? mapActivityToDetailItem(rawActivity!);
  // edit 모드는 리뷰 단건 조회 성공 시에만 활성화(실패하면 일반 작성 모드로 폴백)
  const editProps =
    editReviewId && reviewDetail
      ? { mode: 'edit' as const, reviewId: editReviewId, initialReviewDetail: reviewDetail }
      : {};

  return (
    <>
      <PcReviewWritePage activity={activity} activityId={id} participationId={participationId ?? undefined} {...editProps} />
      <MobileReviewWritePage activity={activity} activityId={id} participationId={participationId ?? undefined} {...editProps} />
    </>
  );
}
