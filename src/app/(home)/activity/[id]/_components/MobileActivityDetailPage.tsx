'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ActivityCardItem } from '@/app/(home)/_components/constant';
import CardDayBadge from '@/components/common/Card/CardDayBadge';
import CardChip from '@/components/common/Card/CardChip';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
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

interface MobileActivityDetailPageProps {
  activity: ActivityCardItem;
}

type MobileTab = 'detail' | 'review';

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
  <div className="flex items-start gap-4">
    <Typography type="Body3Regular" className="min-w-[54px] text-gray-50">
      {label}
    </Typography>
    <Typography type="Body3Medium" className="text-gray-90 break-keep">
      {value || '-'}
    </Typography>
  </div>
);

// 모집기간: "시작 ~ 마감" 문자열을 시작일/마감일 2줄로 표기 (figma 1223-17370)
const RecruitPeriodItem = ({ value }: { value: string }) => {
  const [start, end] = value.split('~').map((part) => part.trim());
  return (
    <div className="flex items-start gap-4">
      <Typography type="Body3Regular" className="min-w-[54px] text-gray-50">
        모집기간
      </Typography>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Typography type="Body3Medium" className="text-gray-90">
            시작일
          </Typography>
          <span className="text-gray-30">|</span>
          <Typography type="Body3Medium" className="text-gray-90">
            {start || '-'}
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <Typography type="Body3Medium" className="text-gray-90">
            마감일
          </Typography>
          <span className="text-gray-30">|</span>
          <Typography type="Body3Medium" className="text-gray-90">
            {end || start || '-'}
          </Typography>
        </div>
      </div>
    </div>
  );
};

const DetailSection = ({ title, value }: { title: string; value: string }) => (
  <div className="flex flex-col gap-2">
    <Typography type="Heading2Semibold" className="text-gray-90">
      {title}
    </Typography>
    <Typography type="Body2Regular" className="text-gray-70 whitespace-pre-line break-keep">
      {value}
    </Typography>
  </div>
);

const hasDetailValue = (value?: string) => Boolean(value && value.trim() && value.trim() !== '-');

const RatingStars = ({ value, outOf = 5 }: { value: number; outOf?: number }) => {
  const filled = Math.round(value);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: outOf }).map((_, index) => (
        <Icon
          key={index}
          icon="starFill"
          size={22}
          className={index < filled ? 'text-[#F7B731]' : 'text-gray-20'}
        />
      ))}
    </div>
  );
};

const ProgressRow = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col gap-2">
    <Typography type="Body3Medium" className="text-gray-70">
      {label}
    </Typography>
    <div className="h-3 rounded-full bg-gray-10 overflow-hidden">
      <div className="h-full rounded-full bg-[#A5ADBB]" style={{ width: `${value}%` }} />
    </div>
  </div>
);

const ReviewListCard = ({
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
  <div className="rounded-lg border border-gray-20 bg-gray-0 px-4 py-4">
    <div className="flex items-center gap-2">
      <span className={clsx('h-5 rounded px-2 inline-flex items-center', jobGroupBadgeClass(review.job_group))}>
        <Typography type="Caption2Medium">{jobGroupLabel(review.job_group)}</Typography>
      </span>
      <Typography type="Caption1Regular" className="text-gray-50">
        {[
          jobDetailLabel(review.job_detail),
          `${formatParticipationDate(review.participation_date)} 참여`,
          progressStatusLabel(review.progress_status),
        ]
          .filter(Boolean)
          .join(' | ')}
      </Typography>
    </div>

    {/* helpful(도움이 돼요): is_helpful 토글 + helpful_count. 잠금(비로그인) 카드에선 비활성 */}
    <button
      type="button"
      onClick={locked ? undefined : toggle}
      disabled={locked || pending}
      aria-pressed={helpful}
      className={clsx(
        'mt-2 h-6 rounded-full px-3 inline-flex items-center disabled:opacity-60',
        helpful ? 'bg-primary-50' : 'bg-primary-5',
      )}
    >
      <Typography type="Caption2Medium" className={helpful ? 'text-gray-0' : 'text-primary-60'}>
        {count > 0 ? `도움이 돼요 ${count}` : '도움이 돼요'}
      </Typography>
    </button>

    <div className="mt-3 flex items-center gap-2">
      <Typography type="Heading2Semibold" className="text-gray-90">
        총 평점:
      </Typography>
      <RatingStars value={toFiveScale(review.overall_score)} />
    </div>

    <div className="mt-2 flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Typography type="Caption1Regular" className="text-gray-50 min-w-[42px]">
          직무경험
        </Typography>
        <RatingStars value={toFiveScale(review.info_score)} outOf={5} />
      </div>
      <div className="flex items-center gap-2">
        <Typography type="Caption1Regular" className="text-gray-50 min-w-[42px]">
          혜택 및복지
        </Typography>
        <RatingStars value={toFiveScale(review.benefit_score)} outOf={5} />
      </div>
      <div className="flex items-center gap-2">
        <Typography type="Caption1Regular" className="text-gray-50 min-w-[42px]">
          활동강도
        </Typography>
        <RatingStars value={toFiveScale(review.difficulty_score)} outOf={5} />
      </div>
    </div>

    <div className="relative">
      <div className={clsx(locked && 'blur-[6px] select-none')} aria-hidden={locked || undefined}>
        {review.summary && (
          <Typography type="Heading2Semibold" className="mt-4 text-primary-50 break-keep">
            “{review.summary}”
          </Typography>
        )}

        <div className="mt-4 flex flex-col gap-3">
          <div>
            <Typography type="Body3Semibold" className="text-gray-90">
              활동 장점
            </Typography>
            <Typography type="Body3Regular" className="text-gray-70 break-keep">
              {review.strength}
            </Typography>
          </div>
          <div>
            <Typography type="Body3Semibold" className="text-gray-90">
              활동 단점
            </Typography>
            <Typography type="Body3Regular" className="text-gray-70 break-keep">
              {review.weakness}
            </Typography>
          </div>
          {review.tips && (
            <div>
              <Typography type="Body3Semibold" className="text-gray-90">
                합격 꿀팁
              </Typography>
              <Typography type="Body3Regular" className="text-gray-70 break-keep">
                {review.tips}
              </Typography>
            </div>
          )}
        </div>
      </div>
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            onClick={onWrite}
            className="h-space-48 inline-flex items-center justify-center rounded-[6px] border border-gray-40 bg-gray-0 px-space-16"
          >
            <Typography type="Body2Medium" className="text-gray-90">
              리뷰 작성하고 전체보기
            </Typography>
          </button>
        </div>
      )}
    </div>
  </div>
  );
};

const MobileRadarChart = ({ stats }: { stats: JobRelevanceStats | null }) => {
  const score = (value?: number) => (stats ? toScorePercent(value) : 0);
  return (
    <div className="relative mx-auto h-[170px] w-[190px]">
      <svg viewBox="0 0 190 170" className="h-full w-full">
        <polygon points="95,12 154,48 132,124 58,124 36,48" fill="none" stroke="#E5E7EB" strokeWidth="1" />
        <polygon points="95,30 138,56 122,108 68,108 52,56" fill="none" stroke="#E5E7EB" strokeWidth="1" />
        <polygon points="95,46 124,62 114,92 76,92 66,62" fill="none" stroke="#E5E7EB" strokeWidth="1" />
        <polygon points="95,34 141,56 126,113 79,118 49,60" fill="#10B981" fillOpacity="0.7" stroke="#10B981" />
        <line x1="95" y1="12" x2="95" y2="124" stroke="#E5E7EB" strokeWidth="1" />
        <line x1="36" y1="48" x2="154" y2="48" stroke="#E5E7EB" strokeWidth="1" />
        <line x1="58" y1="124" x2="154" y2="48" stroke="#E5E7EB" strokeWidth="1" />
        <line x1="36" y1="48" x2="132" y2="124" stroke="#E5E7EB" strokeWidth="1" />
      </svg>
      <div className="absolute left-1/2 top-0 -translate-x-1/2 text-center">
        <Typography type="Caption1Regular" className="text-gray-50">
          기획
        </Typography>
        <Typography type="Body2Semibold" className="text-primary-50">
          {score(stats?.planning_avg_score)}
        </Typography>
      </div>
      <div className="absolute right-0 top-[40%] text-center">
        <Typography type="Caption1Regular" className="text-gray-50">
          개발
        </Typography>
      </div>
      <div className="absolute right-2 bottom-1 text-center">
        <Typography type="Body2Semibold" className="text-primary-50">
          {score(stats?.marketing_avg_score)}
        </Typography>
        <Typography type="Caption1Regular" className="text-gray-50">
          마케팅
        </Typography>
      </div>
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 text-center">
        <Typography type="Body2Semibold" className="text-primary-50">
          {score(stats?.ai_avg_score)}
        </Typography>
        <Typography type="Caption1Regular" className="text-gray-50">
          AI
        </Typography>
      </div>
      <div className="absolute left-0 top-[40%] text-center">
        <Typography type="Caption1Regular" className="text-gray-50">
          디자인
        </Typography>
      </div>
    </div>
  );
};

export default function MobileActivityDetailPage({ activity }: MobileActivityDetailPageProps) {
  const router = useRouter();
  const [tab, setTab] = useState<MobileTab>('detail');
  const [isBookmarked, setIsBookmarked] = useState(Boolean(activity.isBookmarked));
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const applyLink = getApplyLink(activity);
  const detailImages = splitDetailImages(activity.detailImage);
  const tags = getActivityTags(activity.activityField);
  const activityId = extractActivityId(activity.detailLink);
  const { isAuthenticated } = useAuthClient();
  const goReviewWrite = () => router.push(`/activity/${activityId}/review`);

  const [reviewPage, setReviewPage] = useState(1);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilterValue>(EMPTY_REVIEW_FILTER);
  const reviewsEnabled = tab === 'review';
  const reviewActivityId = activityId ? String(activityId) : '';
  const { data: reviewList, loading: reviewLoading } = useActivityReviews(reviewActivityId, {
    enabled: reviewsEnabled,
    page: reviewPage,
    size: 10, // 기획: 리뷰 10개 단위 페이지네이션
    filter: reviewFilter,
  });

  const handleReviewFilterChange = (next: ReviewFilterValue) => {
    setReviewFilter(next);
    setReviewPage(1); // 필터 변경 시 첫 페이지로
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
    <div className="pc:hidden flex flex-col gap-4 pt-5 pb-[88px]">
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardDayBadge text={activity.badgeText ?? '모집중'} variant="default" typoType="Caption1Regular" />
            <CardChip text={activity.activityType as '대외활동' | '교육' | '공모전/해커톤' | '강연/세미나'} />
          </div>
          <button
            type="button"
            className="h-6 w-6 inline-flex items-center justify-center"
            aria-label={isBookmarked ? '북마크 취소' : '북마크'}
            aria-pressed={isBookmarked}
            onClick={handleBookmarkToggle}
            disabled={!activityId || isBookmarkLoading}
          >
            <Icon icon={isBookmarked ? 'bookmarkFill' : 'bookmarkLine'} size={20} className="text-gray-50" />
          </button>
        </div>

        <Typography type="Heading1Bold" className="text-gray-90 break-keep">
          {activity.title}
        </Typography>

        <Typography type="Body4Medium" className="text-gray-90">
          {activity.organizer}
        </Typography>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Icon icon="eye" size={14} className="text-gray-40" />
            <Typography type="Caption1Regular" className="text-gray-40">
              {activity.viewCount ?? 0}
            </Typography>
          </div>
          <div className="flex items-center gap-1">
            <Icon icon="bookmarkLine" size={14} className="text-gray-40" />
            <Typography type="Caption1Regular" className="text-gray-40">
              {activity.saveCount ?? 0}
            </Typography>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <InfoItem label="주최기관" value={activity.organizer} />
        <RecruitPeriodItem value={activity.registrationPeriod} />
        <InfoItem label="모집인원" value={activity.recruitment} />
        <InfoItem label="모임지역" value={activity.region} />
        <InfoItem label="활동분야" value={activity.activityField} />
        <InfoItem label="활동기간" value={activity.activityPeriod} />
        <div className="flex items-start gap-4">
          <Typography type="Body3Regular" className="min-w-[54px] text-gray-50">
            관심직무
          </Typography>
          <div className="flex flex-wrap gap-1">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <span key={tag} className="h-[20px] rounded bg-primary-5 px-space-8 inline-flex items-center">
                  <Typography type="Caption2Medium" className="text-primary-60">
                    {tag}
                  </Typography>
                </span>
              ))
            ) : (
              <Typography type="Body3Regular" className="text-gray-50">
                -
              </Typography>
            )}
          </div>
        </div>
      </section>

      <div className="border-b border-gray-20 flex mt-1">
        <button
          type="button"
          onClick={() => setTab('detail')}
          className={clsx(
            'w-1/2 h-10 inline-flex items-center justify-center border-b-2',
            tab === 'detail' ? 'border-primary-50 text-gray-90' : 'border-transparent text-gray-40',
          )}
        >
          <Typography type="Body2Semibold">상세내용</Typography>
        </button>
        <button
          type="button"
          onClick={() => setTab('review')}
          className={clsx(
            'w-1/2 h-10 inline-flex items-center justify-center border-b-2',
            tab === 'review' ? 'border-primary-50 text-gray-90' : 'border-transparent text-gray-40',
          )}
        >
          <Typography type="Body2Semibold">리뷰</Typography>
        </button>
      </div>

      {tab === 'detail' ? (
        <section className="flex flex-col gap-3">
          <div className="relative w-full h-[430px] rounded-lg overflow-hidden bg-gray-10">
            <Image
              src={activity.thumbnailImage || '/imgs/cat.jpg'}
              alt={`${activity.title} 썸네일`}
              fill
              sizes="335px"
              unoptimized
            />
            <button
              type="button"
              aria-label="이미지 확대"
              className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-gray-90/70 inline-flex items-center justify-center"
            >
              <Icon icon="search" size={16} className="text-gray-0" />
            </button>
          </div>

          {detailImages.map((image) => (
            <div key={image} className="relative w-full h-[430px] rounded-lg overflow-hidden bg-gray-10">
              <Image src={image} alt="공고 상세 이미지" fill sizes="335px" unoptimized className="object-contain" />
            </div>
          ))}

          <section className="flex flex-col gap-6 pt-1">
            <DetailSection
              title="활동 내용"
              value={
                activity.description ||
                `${activity.title}\n참여대상: ${activity.target || '대상 제한 없음'}\n주최기관: ${activity.organizer}`
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

            <div className="flex flex-col gap-2">
              <Typography type="Heading2Semibold" className="text-gray-90">
                필수 지원서 양식
              </Typography>
              {/* 지원서 첨부 파일 필드가 응답에 없어 현재는 "파일 없음"만 표시. 첨부 제공 시 다운로드 버튼으로 교체 */}
              <div className="flex gap-2">
                <span className="h-space-40 inline-flex items-center rounded-md border border-gray-20 bg-gray-0 px-space-16">
                  <Typography type="Body2Medium" className="text-gray-50">
                    파일 없음
                  </Typography>
                </span>
              </div>
            </div>
          </section>
        </section>
      ) : (
        <section className="flex flex-col gap-4">
          <div>
            <Typography type="Heading2Semibold" className="text-gray-90">
              직무 연관성
            </Typography>
            <div className="mt-2">
              <MobileRadarChart stats={jobRelevance} />
            </div>
          </div>

          <div>
            <Typography type="Heading2Semibold" className="text-gray-90 mb-2">
              활동 만족도 평가
            </Typography>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {['전체', '프론트엔드', 'PM/PO', '머신러닝 엔지니어'].map((item, index) => (
                <button
                  key={item}
                  type="button"
                  className={clsx(
                    'h-10 shrink-0 rounded-full border px-4 whitespace-nowrap',
                    index === 0 ? 'bg-primary-50 border-primary-50 text-gray-0' : 'bg-gray-0 border-gray-20 text-gray-70',
                  )}
                >
                  <Typography type="Body2Medium">{item}</Typography>
                </button>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Typography type="Heading2Semibold" className="text-gray-90">
                {satisfactionSummary.total.toFixed(1)}
              </Typography>
              <RatingStars value={toFiveScale(satisfactionSummary.total)} />
            </div>

            <div className="mt-3 flex flex-col gap-3">
              <ProgressRow label="직무 경험" value={toScorePercent(satisfactionSummary.jobExperience)} />
              <ProgressRow label="활동 강도" value={toScorePercent(satisfactionSummary.intensity)} />
              <ProgressRow label="혜택 및 복지" value={toScorePercent(satisfactionSummary.benefit)} />
            </div>
          </div>

          {/* 로그인 시에만 작성 유도 박스 노출 */}
          {isAuthenticated && (
            <div className="rounded-lg border border-primary-20 bg-primary-5 px-4 py-4">
              <Typography type="Body3Semibold" className="text-gray-90">
                이 활동에 참여하신 경험이 있으신가요?
              </Typography>
              <Typography type="Body3Regular" className="text-gray-70 mt-1 break-keep">
                간단한 리뷰로 다음 참가자에게 인사이트를 공유해 주세요!
              </Typography>
              <button
                type="button"
                onClick={goReviewWrite}
                className="mt-3 w-full h-space-40 rounded-small bg-primary-50 inline-flex items-center justify-center"
              >
                <Icon icon="pencil" size={16} className="text-gray-0" />
                <Typography type="Body2Medium" className="text-gray-0 ml-2">
                  리뷰 작성하기
                </Typography>
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Typography type="Heading1Semibold" className="!text-[18px] text-gray-90">
              리뷰 {reviewCount}
            </Typography>

            <div className="overflow-x-auto hide-scrollbar pb-1">
              <ReviewFilters
                value={reviewFilter}
                onChange={handleReviewFilterChange}
                onReset={handleReviewFilterReset}
                variant="mobile"
              />
            </div>

            <div className="flex flex-col gap-3">
              {reviewLoading && reviews.length === 0 ? (
                <div className="flex h-[120px] items-center justify-center rounded-lg border border-gray-20 bg-gray-0">
                  <Typography type="Body3Medium" className="text-gray-40">
                    리뷰를 불러오는 중이에요...
                  </Typography>
                </div>
              ) : reviews.length > 0 ? (
                isAuthenticated ? (
                  // 로그인: 전체 공개 — 다건 + 페이지네이션
                  <>
                    {reviews.map((review) => (
                      <ReviewListCard key={review.id} review={review} />
                    ))}
                    {reviewTotalPages > 1 && (
                      <div className="mt-2 flex justify-center">
                        <Pagination totalPage={reviewTotalPages} activePage={reviewPage} onPageChange={setReviewPage} />
                      </div>
                    )}
                  </>
                ) : (
                  // 비로그인: 대표 1개 블러 + "리뷰 작성하고 전체보기"
                  <ReviewListCard review={reviews[0]} locked onWrite={goReviewWrite} />
                )
              ) : (
                <div className="flex h-[120px] flex-col items-center justify-center gap-1 rounded-lg border border-gray-20 bg-gray-0 text-center">
                  <Typography type="Body3Medium" className="text-gray-50">
                    아직 등록된 리뷰가 없어요
                  </Typography>
                  <Typography type="Caption1Regular" className="text-gray-40">
                    첫 리뷰를 남겨 인사이트를 공유해 주세요!
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 하단 고정 플로팅 CTA (홈페이지/지원하기) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-20 bg-gray-0 px-5 py-3 pc:hidden">
        <div className="mx-auto flex max-w-[335px] gap-2">
          <Link
            href={activity.homepage || '#'}
            target={activity.homepage ? '_blank' : undefined}
            className="h-space-40 flex-1 rounded-small bg-gray-5 inline-flex items-center justify-center"
          >
            <Typography type="Body2Medium" className="text-gray-90">
              홈페이지
            </Typography>
          </Link>
          <Link
            href={applyLink}
            target="_blank"
            className="h-space-40 flex-1 rounded-small bg-primary-50 inline-flex items-center justify-center"
          >
            <Typography type="Body2Medium" className="text-gray-0">
              지원하기
            </Typography>
          </Link>
        </div>
      </div>
    </div>
  );
}
