'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import { ActivityCardItem } from '@/app/(home)/_components/constant';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { extractActivityId, toggleBookmark } from '@/lib/bookmarks';
import { useAuthClient } from '@/contexts/AuthContext';
import Pagination from '@/components/common/Pagination/Pagination';
import ReviewFilters from './ReviewFilters';
import {
  useActivityReviews,
  useReviewSatisfactionStats,
  useReviewJobRelevanceStats,
  useReviewHelpful,
} from '@/hooks/useActivityReviews';
import {
  aggregateSatisfaction,
  formatParticipationDate,
  jobDetailLabel,
  jobGroupBadgeClass,
  jobGroupLabel,
  progressStatusLabel,
  toFiveScale,
  toScorePercent,
  EMPTY_REVIEW_FILTER,
} from '@/types/review.types';
import type { ActivityReviewItem, JobRelevanceStats, ReviewFilterValue } from '@/types/review.types';

interface PcActivityDetailPageProps {
  activity: ActivityCardItem;
}

type DetailTab = 'detail' | 'review';

const getApplyLink = (activity: ActivityCardItem) => {
  const directLink = activity.applyLink || activity.homepage || activity.detailLink;

  if (directLink.startsWith('http')) {
    return directLink;
  }

  if (activity.source === '링커리어') {
    return `https://linkareer.com${directLink}`;
  }

  return directLink;
};

const splitDetailImages = (detailImage: string) =>
  detailImage
    .split(';')
    .map((image) => image.trim())
    .filter(Boolean);

const getActivityTags = (activityField: string) =>
  activityField
    .split(';')
    .map((tag) => tag.trim())
    .filter(Boolean);

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-4 items-start">
    <Typography type="Body3Medium" className="text-gray-50 min-w-[72px]">
      {label}
    </Typography>
    <Typography type="Body3Medium" className="text-gray-90 break-keep">
      {value || '-'}
    </Typography>
  </div>
);

const DetailSection = ({ title, value }: { title: string; value: string }) => (
  <div className="flex flex-col gap-3">
    <Typography type="Title3Bold" className="text-gray-90">
      {title}
    </Typography>
    <Typography type="Body2Regular" className="text-gray-70 whitespace-pre-line break-keep">
      {value}
    </Typography>
  </div>
);

const hasDetailValue = (value?: string) => Boolean(value && value.trim() && value.trim() !== '-');

const RatingStars = ({
  value,
  outOf = 5,
  size = 24,
  gapClassName = 'gap-1',
}: {
  value: number;
  outOf?: number;
  size?: number;
  gapClassName?: string;
}) => {
  const filled = Math.round(value);

  return (
    <div className={clsx('flex items-center', gapClassName)}>
      {Array.from({ length: outOf }).map((_, index) => (
        <Icon
          key={index}
          icon="starFill"
          size={size}
          className={index < filled ? 'text-[#FFC95C]' : 'text-gray-20'}
        />
      ))}
    </div>
  );
};

const ProgressRow = ({ label, value }: { label: string; value: number }) => (
  <div className="flex h-[22px] items-center gap-4">
    <Typography type="Body3Medium" className="w-[56px] shrink-0 text-gray-90">
      {label}
    </Typography>
    <div className="h-4 flex-1 rounded-full bg-gray-10 overflow-hidden">
      <div className="h-full rounded-full bg-gray-40" style={{ width: `${value}%` }} />
    </div>
  </div>
);

const JobFilterChip = ({ label, isActive = false }: { label: string; isActive?: boolean }) => (
  <button
    type="button"
    className={clsx(
      'h-[26px] rounded-full border px-3 inline-flex items-center justify-center',
      isActive ? 'border-primary-50 bg-primary-50 text-gray-0' : 'border-gray-40 bg-gray-0 text-gray-90',
    )}
  >
    <Typography type="Body4Medium">{label}</Typography>
  </button>
);

// 디자인: 비로그인(locked)은 본문 블러 + "리뷰 작성하고 전체보기"(2408-26558),
// 로그인은 본문 전체 공개(블러 없음).
const ReviewCard = ({
  review,
  locked = false,
  onWrite,
}: {
  review: ActivityReviewItem;
  locked?: boolean;
  onWrite?: () => void;
}) => {
  const { helpful, count, pending, toggle } = useReviewHelpful(review);
  return (
  <div
    className={clsx(
      'rounded-[10px] border border-gray-20 bg-gray-0 px-10 py-7',
      locked && 'relative h-[520px] overflow-hidden',
    )}
  >
    <div className="flex items-center justify-between">
      <div className="flex h-[26px] items-center gap-3">
        <div className="flex items-center gap-2">
          <span className={clsx('h-[22px] rounded px-space-8 inline-flex items-center', jobGroupBadgeClass(review.job_group))}>
            <Typography type="Caption1Medium">{jobGroupLabel(review.job_group)}</Typography>
          </span>
          <Typography type="Caption1Medium" className="text-gray-50">
            {jobDetailLabel(review.job_detail)}
          </Typography>
        </div>
        <span className="h-[13px] w-px bg-gray-90" aria-hidden="true" />
        <Typography type="Caption1Medium" className="text-gray-50">
          {formatParticipationDate(review.participation_date)} 참여
        </Typography>
        <span className="h-[13px] w-px bg-gray-90" aria-hidden="true" />
        <Typography type="Caption1Medium" className="text-gray-50">
          {progressStatusLabel(review.progress_status)}
        </Typography>
      </div>
      {/* helpful(도움이 돼요): is_helpful 토글 + helpful_count 표시. 잠금(비로그인) 카드에선 비활성 */}
      <button
        type="button"
        onClick={locked ? undefined : toggle}
        disabled={locked || pending}
        aria-pressed={helpful}
        className={clsx(
          'h-[26px] rounded-full px-[10px] py-1 inline-flex items-center disabled:opacity-60',
          helpful ? 'bg-[#155DFC]' : 'bg-[#DBEAFE]',
        )}
      >
        <Typography type="Caption1Medium" className={helpful ? 'text-gray-0' : 'text-[#155DFC]'}>
          {count > 0 ? `도움이 돼요 ${count}` : '도움이 돼요'}
        </Typography>
      </button>
    </div>

    <div className="mt-5 flex items-center gap-2">
      <Typography type="Title3Bold" className="text-gray-90">
        총 평점 :
      </Typography>
      <RatingStars value={toFiveScale(review.overall_score)} size={40} gapClassName="gap-0" />
    </div>

    <div className="mt-1 flex h-10 items-center gap-[10px]">
      {[
        ['직무경험', review.info_score],
        ['혜택 및 복지', review.benefit_score],
        ['활동강도', review.difficulty_score],
      ].map(([label, value], index) => (
        <div key={label as string} className="flex items-center gap-1">
          {index > 0 && <span className="mr-[6px] h-3 w-px bg-gray-40" aria-hidden="true" />}
          <Typography type="Caption1Medium" className="inline-block w-20 text-gray-70">
            {label}
          </Typography>
          <RatingStars value={toFiveScale(Number(value))} outOf={5} size={24} gapClassName="gap-0" />
        </div>
      ))}
    </div>

    <div className={clsx('mt-6', locked && 'blur-[6px] select-none')} aria-hidden={locked || undefined}>
      {review.summary && (
        <Typography type="Heading1Bold" className="text-xl leading-[140%] text-primary-50 break-keep">
          “{review.summary}”
        </Typography>
      )}

      <div className="mt-6 flex flex-col gap-6 text-gray-70">
        <div>
          <Typography type="Body3Semibold" className="text-gray-90">
            활동 장점
          </Typography>
          <Typography type="Body3Regular" className="break-keep">{review.strength}</Typography>
        </div>
        <div>
          <Typography type="Body3Semibold" className="text-gray-90">
            활동 단점
          </Typography>
          <Typography type="Body3Regular" className="break-keep">{review.weakness}</Typography>
        </div>
        {review.tips && (
          <div>
            <Typography type="Body3Semibold" className="text-gray-90">
              합격 꿀팁
            </Typography>
            <Typography type="Body3Regular" className="break-keep">{review.tips}</Typography>
          </div>
        )}
      </div>
    </div>

    {locked && (
      <div className="absolute inset-x-0 top-[278px] flex justify-center">
        <button
          type="button"
          onClick={onWrite}
          className="h-space-56 rounded-[6px] border border-gray-40 bg-gray-0 px-space-24 py-space-16 inline-flex items-center justify-center hover:bg-gray-5"
        >
          <Typography type="Heading2Medium" className="text-gray-90">
            리뷰 작성하고 전체보기
          </Typography>
        </button>
      </div>
    )}
  </div>
  );
};

const EmptyReview = ({ className }: { className?: string }) => (
  <div
    className={clsx(
      'flex flex-col items-center justify-center gap-2 rounded-[10px] border border-gray-20 bg-gray-0 text-center',
      className,
    )}
  >
    <Icon icon="pencil" size={28} className="text-gray-30" />
    <Typography type="Body2Medium" className="text-gray-50">
      아직 등록된 리뷰가 없어요
    </Typography>
    <Typography type="Body3Regular" className="text-gray-40">
      첫 리뷰를 남겨 다음 참가자에게 인사이트를 공유해 주세요!
    </Typography>
  </div>
);

// 직무 연관성 레이더: 12시(기획)부터 시계방향 72°씩 5축 정오각형 (figma 2409-26932)
const RADAR_AXES = [
  { key: 'planning_avg_score', label: '기획' },
  { key: 'development_avg_score', label: '개발' },
  { key: 'marketing_avg_score', label: '마케팅' },
  { key: 'ai_avg_score', label: 'AI' },
  { key: 'design_avg_score', label: '디자인' },
] as const;

const JobRadarChart = ({ stats }: { stats: JobRelevanceStats | null }) => {
  const CX = 170;
  const CY = 150;
  const R = 88;
  const LEVELS = 4;

  const angleAt = (i: number) => ((-90 + i * 72) * Math.PI) / 180;
  const pointAt = (i: number, radius: number) => ({
    x: CX + radius * Math.cos(angleAt(i)),
    y: CY + radius * Math.sin(angleAt(i)),
  });
  const CORNER = 13.85; // 오각형 모서리 둥글기
  const pointsOf = (radius: number) => RADAR_AXES.map((_, i) => pointAt(i, radius));

  // 둥근 모서리 폴리곤 path (각 꼭짓점을 corner 만큼 깎아 Q 베지어로 연결)
  const roundedPath = (pts: { x: number; y: number }[], corner: number) => {
    const n = pts.length;
    const unit = (from: { x: number; y: number }, to: { x: number; y: number }) => {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.hypot(dx, dy) || 1;
      return { x: dx / len, y: dy / len };
    };
    let d = '';
    for (let i = 0; i < n; i++) {
      const prev = pts[(i - 1 + n) % n];
      const curr = pts[i];
      const next = pts[(i + 1) % n];
      const half =
        Math.min(Math.hypot(prev.x - curr.x, prev.y - curr.y), Math.hypot(next.x - curr.x, next.y - curr.y)) / 2;
      const c = Math.min(corner, half);
      const toPrev = unit(curr, prev);
      const toNext = unit(curr, next);
      const a = { x: curr.x + toPrev.x * c, y: curr.y + toPrev.y * c };
      const b = { x: curr.x + toNext.x * c, y: curr.y + toNext.y * c };
      d += `${i === 0 ? 'M' : 'L'} ${a.x.toFixed(2)} ${a.y.toFixed(2)} `;
      d += `Q ${curr.x.toFixed(2)} ${curr.y.toFixed(2)} ${b.x.toFixed(2)} ${b.y.toFixed(2)} `;
    }
    return `${d}Z`;
  };

  const scoreOf = (key: (typeof RADAR_AXES)[number]['key']) =>
    stats ? toScorePercent(stats[key]) : 0;
  const dataPts = RADAR_AXES.map((axis, i) => {
    const ratio = Math.max(0, Math.min(1, scoreOf(axis.key) / 100));
    return pointAt(i, R * ratio);
  });

  // 동심 그리드(바깥→안) 4겹, 배경색을 번갈아 적용
  const gridFills = ['#F9FAFB', '#F3F4F6', '#F9FAFB', '#F3F4F6'];

  return (
    <div className="relative h-[230px] w-[260px]">
      <svg viewBox="0 0 340 300" className="h-full w-full">
        {/* 1. 그리드 음영(채움) — 데이터 아래 */}
        {Array.from({ length: LEVELS }, (_, level) => {
          const radius = (R * (LEVELS - level)) / LEVELS;
          return (
            <path
              key={`grid-fill-${level}`}
              d={roundedPath(pointsOf(radius), (CORNER * radius) / R)}
              fill={gridFills[level]}
              stroke="none"
            />
          );
        })}
        {/* 2. 데이터 폴리곤 (70% 투명) */}
        <path
          d={roundedPath(dataPts, CORNER)}
          fill="#00BC7D"
          fillOpacity="0.7"
          stroke="#00BC7D"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* 3. 그리드 오각형 윤곽선 — 데이터 위로 비치게 */}
        {Array.from({ length: LEVELS }, (_, level) => {
          const radius = (R * (LEVELS - level)) / LEVELS;
          return (
            <path
              key={`grid-line-${level}`}
              d={roundedPath(pointsOf(radius), (CORNER * radius) / R)}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          );
        })}
        {/* 4. 점선 축 — 데이터 위로 비치게 */}
        {RADAR_AXES.map((axis, i) => {
          const p = pointAt(i, R);
          return (
            <line
              key={axis.label}
              x1={CX}
              y1={CY}
              x2={p.x}
              y2={p.y}
              stroke="#D1D5DB"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}
        {RADAR_AXES.map((axis, i) => {
          const base = pointAt(i, R + 30);
          const labelFirst = i === 0; // 상단(기획)만 라벨 위·숫자 아래
          return (
            <g key={`label-${axis.label}`}>
              <text
                x={base.x}
                y={labelFirst ? base.y + 8 : base.y - 4}
                textAnchor="middle"
                fontSize="20"
                fontWeight="700"
                fill="#101828"
              >
                {scoreOf(axis.key)}
              </text>
              <text
                x={base.x}
                y={labelFirst ? base.y - 14 : base.y + 14}
                textAnchor="middle"
                fontSize="13"
                fontWeight="500"
                fill="#98A2B3"
              >
                {axis.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default function PcActivityDetailPage({ activity }: PcActivityDetailPageProps) {
  const router = useRouter();
  const [tab, setTab] = useState<DetailTab>('detail');
  const [isBookmarked, setIsBookmarked] = useState(Boolean(activity.isBookmarked));
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const applyLink = getApplyLink(activity);
  const detailImages = splitDetailImages(activity.detailImage);
  const hasThumbnail = Boolean(activity.thumbnailImage);
  const tags = getActivityTags(activity.activityField);
  const activityId = extractActivityId(activity.detailLink);

  const { isAuthenticated } = useAuthClient();
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilterValue>(EMPTY_REVIEW_FILTER);
  const reviewsEnabled = tab === 'review';
  const reviewActivityId = activityId ? String(activityId) : '';
  const { data: reviewList, loading: reviewLoading } = useActivityReviews(reviewActivityId, {
    enabled: reviewsEnabled,
    page: reviewPage,
    size: 10, // 기획: 리뷰 10개 단위 페이지네이션(로그인 전체 공개 시)
    filter: reviewFilter,
  });

  const goReviewWrite = () => router.push(`/activity/${activityId}/review`);
  const handleReviewFilterChange = (next: ReviewFilterValue) => {
    setReviewFilter(next);
    setReviewPage(1);
  };
  const handleReviewFilterReset = () => {
    setReviewFilter(EMPTY_REVIEW_FILTER);
    setReviewPage(1);
  };
  const { data: satisfaction } = useReviewSatisfactionStats(reviewActivityId, { enabled: reviewsEnabled });
  const { data: jobRelevance } = useReviewJobRelevanceStats(reviewActivityId, { enabled: reviewsEnabled });
  const satisfactionSummary = useMemo(() => aggregateSatisfaction(satisfaction), [satisfaction]);
  const reviews = reviewList?.items ?? [];
  const reviewCount = reviewList?.total_elements ?? 0;
  const reviewTotalPages = reviewList?.total_pages ?? 0;

  const handleBookmarkToggle = async () => {
    if (!activityId || isBookmarkLoading) return;
    try {
      setIsBookmarkLoading(true);
      const result = await toggleBookmark({ activityId, isBookmarked });
      setIsBookmarked(result.isBookmarked);
    } catch (error) {
      const message = error instanceof Error ? error.message : '북마크 처리 중 오류가 발생했습니다.';
      window.alert(message);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  return (
    <div className="mobile:hidden w-full px-5 pb-20 pt-10">
      <div className="flex justify-between gap-10">
        <section className="flex-1 min-w-0">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1">
              <span className="h-[22px] rounded bg-gray-90 px-space-8 inline-flex items-center">
                <Typography type="Body3Medium" className="text-gray-0">
                  {activity.badgeText ?? '모집중'}
                </Typography>
              </span>
              <div className="inline-flex h-[22px] w-fit items-center rounded-full bg-gray-20 px-space-8">
                <Typography type="Body3Medium" className="text-gray-50">
                  {activity.activityType}
                </Typography>
              </div>
            </div>

            <Typography type="Heading1Bold" className="text-[28px] font-bold leading-[1.35] text-gray-90 break-keep">
              {activity.title}
            </Typography>

            <Typography type="Heading2Medium" className="text-gray-50">
              {activity.organizer}
            </Typography>

            <div className="flex items-center gap-4 text-gray-40">
              <div className="flex items-center gap-1">
                <Icon icon="eye" size={16} className="text-gray-40" />
                <Typography type="Body3Medium" className="text-gray-40">
                  {activity.viewCount ?? 0}
                </Typography>
              </div>
              <div className="flex items-center gap-1">
                <Icon icon="bookmarkLine" size={16} className="text-gray-40" />
                <Typography type="Body3Medium" className="text-gray-40">
                  {activity.saveCount ?? 0}
                </Typography>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-3 max-w-[640px]">
            <InfoItem label="주최기관" value={activity.organizer} />
            <InfoItem label="접수기간" value={activity.registrationPeriod} />
            <InfoItem label="모집인원" value={activity.recruitment} />
            <InfoItem label="활동분야" value={activity.activityField} />
            <InfoItem label="마감일자" value={activity.registrationPeriod.split(' ~ ')[1] ?? '-'} />
            <InfoItem label="활동기간" value={activity.activityPeriod} />
            <InfoItem label="모임지역" value={activity.region} />
            <div className="flex gap-4 items-start">
              <Typography type="Body3Medium" className="text-gray-50 min-w-[72px]">
                공고직무
              </Typography>
              <div className="flex flex-wrap gap-1">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <span
                      key={tag}
                      className="h-[22px] rounded bg-primary-5 px-space-8 inline-flex items-center justify-center"
                    >
                      <Typography type="Body3Medium" className="text-primary-60">
                        {tag}
                      </Typography>
                    </span>
                  ))
                ) : (
                  <Typography type="Caption1Medium" className="text-gray-90">
                    -
                  </Typography>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2">
            <Link
              href={activity.homepage || '#'}
              target={activity.homepage ? '_blank' : undefined}
              className={clsx(
                'h-space-40 min-w-[96px] rounded-small border border-gray-40 px-space-16 inline-flex items-center justify-center',
                activity.homepage ? 'hover:bg-gray-5' : 'pointer-events-none opacity-50',
              )}
            >
              <Typography type="Body2Medium" className="text-gray-90">
                홈페이지
              </Typography>
            </Link>
            <Link
              href={applyLink}
              target="_blank"
              className="h-space-40 min-w-[96px] rounded-small bg-primary-50 px-space-16 inline-flex items-center justify-center hover:bg-primary-60"
            >
              <Typography type="Body2Medium" className="text-gray-0">
                지원하기
              </Typography>
            </Link>
            <button
              type="button"
              aria-label={isBookmarked ? '북마크 취소' : '북마크'}
              aria-pressed={isBookmarked}
              className="h-space-40 w-space-40 rounded-small border border-gray-40 inline-flex items-center justify-center hover:bg-gray-5"
              onClick={handleBookmarkToggle}
              disabled={!activityId || isBookmarkLoading}
            >
              <Icon icon={isBookmarked ? 'bookmarkFill' : 'bookmarkLine'} size={20} className="text-gray-50" />
            </button>
          </div>
        </section>

        {hasThumbnail && (
          <section className="w-[244px] shrink-0">
            <div className="relative h-[324px] w-full overflow-hidden rounded-lg border border-gray-20 bg-gray-5">
              <Image
                src={activity.thumbnailImage}
                alt={`${activity.title} 썸네일`}
                fill
                sizes="244px"
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                aria-label="이미지 확대"
                onClick={() => setIsImageZoomed(true)}
                className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-gray-90/70 text-gray-0 inline-flex items-center justify-center"
              >
                <Icon icon="search" size={16} className="text-gray-0" />
              </button>
            </div>
          </section>
        )}
      </div>

      <div className="mt-10 border-b border-gray-20 flex">
        <button
          type="button"
          onClick={() => setTab('detail')}
          className={clsx(
            'w-1/2 h-12 inline-flex items-center justify-center border-b-2',
            tab === 'detail' ? 'border-primary-50 text-gray-90' : 'border-transparent text-gray-40',
          )}
        >
          <Typography type="Body2Semibold">상세내용</Typography>
        </button>
        <button
          type="button"
          onClick={() => setTab('review')}
          className={clsx(
            'w-1/2 h-12 inline-flex items-center justify-center border-b-2',
            tab === 'review' ? 'border-primary-50 text-gray-90' : 'border-transparent text-gray-40',
          )}
        >
          <Typography type="Body2Semibold">리뷰</Typography>
        </button>
      </div>

      {tab === 'detail' ? (
        <section className="mt-5 rounded-lg bg-gray-5 p-5 border border-gray-20">
          {detailImages.length > 0 ? (
            <div className="flex flex-col gap-5">
              {detailImages.map((image) => (
                <div key={image} className="relative w-full h-[720px] rounded-md overflow-hidden bg-gray-10">
                  <Image src={image} alt="공고 상세 이미지" fill sizes="1060px" unoptimized className="object-contain" />
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-9">
            <DetailSection
              title="활동 내용"
              value={
                activity.description ||
                `${activity.title}\n주최기관: ${activity.organizer}\n참여대상: ${activity.target || '대상 제한 없음'}`
              }
            />

            {hasDetailValue(activity.target) && <DetailSection title="모집대상" value={activity.target} />}

            {hasDetailValue(activity.registrationPeriod) && (
              <DetailSection title="지원기간" value={activity.registrationPeriod} />
            )}

            <DetailSection
              title="혜택"
              value={activity.costPrize || '상세 혜택 정보는 홈페이지 또는 지원 링크에서 확인해 주세요.'}
            />

            <div className="flex flex-col gap-3">
              <Typography type="Title3Bold" className="text-gray-90">
                필수 지원서 양식
              </Typography>
              <div className="flex flex-wrap gap-2">
                {activity.requiredFiles && activity.requiredFiles.length > 0 ? (
                  activity.requiredFiles.map((file, index) => (
                    <a
                      key={`${file.url}-${index}`}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="h-space-40 inline-flex items-center gap-2 rounded-md border border-gray-20 bg-gray-0 px-space-16 hover:bg-gray-5"
                    >
                      <Typography type="Body2Medium" className="text-gray-70 underline">
                        {file.name || '지원서 양식'}
                      </Typography>
                    </a>
                  ))
                ) : (
                  <span className="h-space-40 inline-flex items-center rounded-md border border-gray-20 bg-gray-0 px-space-16">
                    <Typography type="Body2Medium" className="text-gray-50">
                      파일 없음
                    </Typography>
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="mt-[60px]">
          <div className="flex w-full items-start gap-20">
            <div className="flex h-[351px] w-[382px] shrink-0 items-center justify-center rounded-[20px] border border-gray-20 bg-gray-0 px-9 py-4">
              <JobRadarChart stats={jobRelevance} />
            </div>
            <div className="flex w-[438px] flex-col gap-6">
              <div className="flex flex-col gap-5">
                <Typography type="Body1Semibold" className="text-[18px] leading-[144.5%] text-gray-80">
                  활동 만족도 평가
                </Typography>
                <div className="flex gap-2">
                  {['전체', 'PM/PO', '프론트엔드', '머신러닝 엔지니어'].map((item, index) => (
                    <JobFilterChip key={item} label={item} isActive={index === 0} />
                  ))}
                </div>
              </div>

              <div className="h-px w-full bg-gray-20" />

              <div className="flex items-center gap-2">
                <Typography type="Title3Bold" className="text-gray-90">
                  {satisfactionSummary.total.toFixed(1)}
                </Typography>
                <RatingStars value={toFiveScale(satisfactionSummary.total)} size={36} gapClassName="gap-0.5" />
              </div>

              <div className="flex flex-col gap-3">
                <ProgressRow label="직무 경험" value={toScorePercent(satisfactionSummary.jobExperience)} />
                <ProgressRow label="활동 강도" value={toScorePercent(satisfactionSummary.intensity)} />
                <ProgressRow label="혜택 및 복지" value={toScorePercent(satisfactionSummary.benefit)} />
              </div>
            </div>
          </div>

          <div className="mt-[49px] h-px w-full bg-gray-20" />

          {/* 로그인 시에만 작성 유도 박스 노출 (2-25064) */}
          {isAuthenticated && (
            <div className="mt-8 flex items-center justify-between rounded-lg border border-primary-20 bg-primary-5 px-6 py-5">
              <div className="flex flex-col gap-1">
                <Typography type="Body1Semibold" className="text-gray-90">
                  이 활동에 참여하신 경험이 있으신가요?
                </Typography>
                <Typography type="Body3Regular" className="text-gray-70">
                  간단한 리뷰로 다음 참가자에게 인사이트를 공유해 주세요!
                </Typography>
              </div>
              <button
                type="button"
                onClick={goReviewWrite}
                className="h-space-40 rounded-small bg-primary-50 px-space-16 inline-flex items-center gap-2 hover:bg-primary-60"
              >
                <Icon icon="pencil" size={16} className="text-gray-0" />
                <Typography type="Body2Medium" className="text-gray-0">
                  리뷰 작성하기
                </Typography>
              </button>
            </div>
          )}

          <div className="mt-[50px] flex flex-col gap-6">
            <div className="flex h-space-40 items-center justify-between">
              <Typography type="Heading1Semibold" className="text-gray-90">
                리뷰 {reviewCount}
              </Typography>
              <ReviewFilters
                value={reviewFilter}
                onChange={handleReviewFilterChange}
                onReset={handleReviewFilterReset}
                variant="pc"
              />
            </div>

            {reviewLoading && reviews.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center rounded-[10px] border border-gray-20 bg-gray-0">
                <Typography type="Body2Medium" className="text-gray-40">
                  리뷰를 불러오는 중이에요...
                </Typography>
              </div>
            ) : reviews.length > 0 ? (
              isAuthenticated ? (
                // 로그인(2-25064): 전체 공개 — 다건 + 페이지네이션
                <>
                  <div className="flex flex-col gap-6">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                  {reviewTotalPages > 1 && (
                    <div className="mt-4 flex justify-center">
                      <Pagination totalPage={reviewTotalPages} activePage={reviewPage} onPageChange={setReviewPage} />
                    </div>
                  )}
                </>
              ) : (
                // 비로그인(2408-26558): 대표 1개 블러 + "리뷰 작성하고 전체보기"
                <ReviewCard review={reviews[0]} locked onWrite={goReviewWrite} />
              )
            ) : (
              <EmptyReview className="h-[200px]" />
            )}
          </div>
        </section>
      )}

      {/* 이미지 확대 팝업: 돋보기 클릭 시 2배수 노출, 딤드 클릭 시 닫기 (2510-23083) */}
      {isImageZoomed && hasThumbnail && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="공고 이미지 확대"
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-90/70"
          onClick={() => setIsImageZoomed(false)}
        >
          <div
            className="relative h-[648px] w-[488px] overflow-hidden rounded-lg bg-gray-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activity.thumbnailImage}
              alt={`${activity.title} 확대 이미지`}
              fill
              sizes="488px"
              unoptimized
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
