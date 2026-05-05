'use client';

import { useEffect, useMemo, useState } from 'react';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import { ActivityCardItem } from '@/app/(home)/_components/constant';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { extractActivityId, toggleBookmark } from '@/lib/bookmarks';
import { recordRecentlyViewedActivity } from '@/lib/activity-data';

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
    <Typography type="Caption1Regular" className="text-gray-50 min-w-[72px]">
      {label}
    </Typography>
    <Typography type="Caption1Medium" className="text-gray-90 break-keep">
      {value || '-'}
    </Typography>
  </div>
);

const RatingStars = ({ value, outOf = 5 }: { value: number; outOf?: number }) => {
  const filled = Math.round(value);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: outOf }).map((_, index) => (
        <Icon
          key={index}
          icon="starFill"
          size={24}
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
      <div className="h-full rounded-full bg-primary-50" style={{ width: `${value}%` }} />
    </div>
  </div>
);

const ReviewCard = ({ isPinned = false }: { isPinned?: boolean }) => (
  <div className="rounded-lg border border-gray-20 bg-gray-0 px-6 py-5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="h-5 rounded bg-danger-5 px-2 inline-flex items-center">
          <Typography type="Caption2Medium" className="text-danger-50">
            기획
          </Typography>
        </span>
        <Typography type="Caption1Regular" className="text-gray-50">
          서비스 기획 | 2025.06 참여 | 수료 완료
        </Typography>
      </div>
      {!isPinned && (
        <button type="button" className="h-6 rounded-full bg-primary-5 px-3 inline-flex items-center">
          <Typography type="Caption2Medium" className="text-primary-60">
            도움이 돼요 2
          </Typography>
        </button>
      )}
    </div>

    <div className="mt-4 flex items-center gap-2">
      <Typography type="Heading2Semibold" className="text-gray-90">
        총 평점:
      </Typography>
      <RatingStars value={4} />
    </div>

    <div className="mt-2 flex items-center gap-4">
      <Typography type="Caption1Regular" className="text-gray-50">
        직무경험
      </Typography>
      <RatingStars value={4} outOf={5} />
      <Typography type="Caption1Regular" className="text-gray-50">
        혜택 및 복지
      </Typography>
      <RatingStars value={4} outOf={5} />
      <Typography type="Caption1Regular" className="text-gray-50">
        활동강도
      </Typography>
      <RatingStars value={3} outOf={5} />
    </div>

    <Typography type="Heading2Semibold" className="mt-4 text-primary-50">
      “최근에 방문한 카페는 분위기가 아늑하고 조용해서 너무 좋았어요.”
    </Typography>

    <div className="mt-4 flex flex-col gap-3 text-gray-70">
      <div>
        <Typography type="Body3Semibold" className="text-gray-90">
          활동 장점
        </Typography>
        <Typography type="Body3Regular">
          최근에 방문한 카페는 분위기가 아늑하고 조용해서 너무 좋았어요. 커피 맛도 좋고 친절해서 만족스러웠습니다.
          직원들도 친절하게 응대해주셔서 기분 좋은 시간이었습니다. 다음에 또 방문하고 싶은 곳이에요!
        </Typography>
      </div>
      <div>
        <Typography type="Body3Semibold" className="text-gray-90">
          활동 단점
        </Typography>
        <Typography type="Body3Regular">
          최근에 방문한 카페는 분위기가 아늑하고 조용해서 너무 좋았어요. 커피 맛도 좋고 친절해서 만족스러웠습니다.
          직원들도 친절하게 응대해주셔서 기분 좋은 시간이었습니다. 다음에 또 방문하고 싶은 곳이에요!
        </Typography>
      </div>
      <div>
        <Typography type="Body3Semibold" className="text-gray-90">
          합격 꿀팁
        </Typography>
        <Typography type="Body3Regular">
          최근에 방문한 카페는 분위기가 아늑하고 조용해서 너무 좋았어요. 커피 맛도 좋고 친절해서 만족스러웠습니다.
          직원들도 친절하게 응대해주셔서 기분 좋은 시간이었습니다. 다음에 또 방문하고 싶은 곳이에요!
        </Typography>
      </div>
    </div>
  </div>
);

const JobRadarChart = () => (
  <div className="relative h-[230px] w-[260px]">
    <svg viewBox="0 0 260 230" className="h-full w-full">
      <polygon points="130,20 210,70 180,170 80,170 50,70" fill="none" stroke="#E5E7EB" strokeWidth="1" />
      <polygon points="130,45 186,80 164,150 96,150 74,80" fill="none" stroke="#E5E7EB" strokeWidth="1" />
      <polygon points="130,70 162,90 148,130 112,130 98,90" fill="none" stroke="#E5E7EB" strokeWidth="1" />
      <polygon points="130,58 195,78 176,150 108,161 66,84" fill="#10B981" fillOpacity="0.7" stroke="#10B981" />
      <line x1="130" y1="20" x2="130" y2="170" stroke="#E5E7EB" strokeWidth="1" />
      <line x1="50" y1="70" x2="210" y2="70" stroke="#E5E7EB" strokeWidth="1" />
      <line x1="80" y1="170" x2="210" y2="70" stroke="#E5E7EB" strokeWidth="1" />
      <line x1="50" y1="70" x2="180" y2="170" stroke="#E5E7EB" strokeWidth="1" />
    </svg>
    <div className="absolute left-1/2 top-0 -translate-x-1/2 text-center">
      <Typography type="Caption1Regular" className="text-gray-50">
        기획
      </Typography>
      <Typography type="Body2Semibold" className="text-primary-50">
        90
      </Typography>
    </div>
    <div className="absolute right-0 top-[44%] text-center">
      <Typography type="Body2Semibold" className="text-primary-50">
        90
      </Typography>
      <Typography type="Caption1Regular" className="text-gray-50">
        개발
      </Typography>
    </div>
    <div className="absolute right-4 bottom-1 text-center">
      <Typography type="Body2Semibold" className="text-primary-50">
        90
      </Typography>
      <Typography type="Caption1Regular" className="text-gray-50">
        마케팅
      </Typography>
    </div>
    <div className="absolute left-1/2 bottom-0 -translate-x-1/2 text-center">
      <Typography type="Body2Semibold" className="text-primary-50">
        90
      </Typography>
      <Typography type="Caption1Regular" className="text-gray-50">
        AI
      </Typography>
    </div>
    <div className="absolute left-1 top-[44%] text-center">
      <Typography type="Body2Semibold" className="text-primary-50">
        90
      </Typography>
      <Typography type="Caption1Regular" className="text-gray-50">
        디자인
      </Typography>
    </div>
  </div>
);

export default function PcActivityDetailPage({ activity }: PcActivityDetailPageProps) {
  const [tab, setTab] = useState<DetailTab>('detail');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const applyLink = getApplyLink(activity);
  const detailImages = splitDetailImages(activity.detailImage);
  const tags = getActivityTags(activity.activityField);
  const activityId = extractActivityId(activity.detailLink);

  const reviewCards = useMemo(() => [true, false, false], []);

  useEffect(() => {
    if (activityId) {
      recordRecentlyViewedActivity(activityId);
    }
  }, [activityId]);

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
    <div className="mobile:hidden w-full px-5 pb-20 pt-6">
      <div className="flex justify-between gap-10">
        <section className="flex-1 min-w-0">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1">
              <span className="h-[22px] rounded bg-gray-90 px-space-8 inline-flex items-center">
                <Typography type="Body3Medium" className="text-gray-0">
                  D-00
                </Typography>
              </span>
              <div className="inline-flex h-[22px] w-fit items-center rounded-full bg-gray-20 px-space-8">
                <Typography type="Body3Medium" className="text-gray-50">
                  {activity.activityType}
                </Typography>
              </div>
            </div>

            <Typography type="Heading1Bold" className="text-gray-90 break-keep">
              {activity.title}
            </Typography>

            <Typography type="Body4Medium" className="text-gray-50">
              {activity.organizer}
            </Typography>

            <div className="flex items-center gap-4 text-gray-40">
              <div className="flex items-center gap-1">
                <Icon icon="eye" size={16} className="text-gray-40" />
                <Typography type="Caption1Regular" className="text-gray-40">
                  6000
                </Typography>
              </div>
              <div className="flex items-center gap-1">
                <Icon icon="bookmarkLine" size={16} className="text-gray-40" />
                <Typography type="Caption1Regular" className="text-gray-40">
                  6000
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
              <Typography type="Caption1Regular" className="text-gray-50 min-w-[72px]">
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

        <section className="w-[244px] shrink-0">
          <div className="relative h-[324px] w-full overflow-hidden rounded-lg border border-gray-20 bg-gray-5">
            <Image
              src={activity.thumbnailImage || '/imgs/cat.jpg'}
              alt={`${activity.title} 썸네일`}
              fill
              sizes="244px"
              unoptimized
              className="object-cover"
            />
            <button
              type="button"
              aria-label="이미지 확대"
              className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-gray-90/70 text-gray-0 inline-flex items-center justify-center"
            >
              <Icon icon="search" size={16} className="text-gray-0" />
            </button>
          </div>
        </section>
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
          ) : (
            <div className="h-[720px] w-full rounded-md bg-gray-10 flex items-center justify-center">
              <Typography type="Body2Medium" className="text-gray-40">
                상세 이미지가 없습니다.
              </Typography>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Typography type="Heading2Semibold" className="text-gray-90">
                활동 내용
              </Typography>
              <Typography type="Body2Regular" className="text-gray-70 whitespace-pre-line">
                {activity.description || `${activity.title}\n주최기관: ${activity.organizer}\n참여대상: ${activity.target || '대상 제한 없음'}`}
              </Typography>
            </div>

            <div className="flex flex-col gap-2">
              <Typography type="Heading2Semibold" className="text-gray-90">
                혜택
              </Typography>
              <Typography type="Body2Regular" className="text-gray-70">
                {activity.costPrize || '상세 혜택 정보는 홈페이지 또는 지원 링크에서 확인해 주세요.'}
              </Typography>
            </div>

            <div className="flex flex-col gap-2">
              <Typography type="Heading2Semibold" className="text-gray-90">
                지원 안내
              </Typography>
              <Typography type="Body2Regular" className="text-gray-70">
                별도 첨부파일은 수집되지 않았습니다. 지원서 양식과 제출 방식은 홈페이지 또는 지원하기 링크에서 확인해 주세요.
              </Typography>
            </div>
          </div>
        </section>
      ) : (
        <section className="mt-6 flex flex-col gap-6">
          <div className="rounded-lg border border-gray-20 bg-gray-5 p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Typography type="Body1Semibold" className="text-gray-90 mb-4">
                  직무 연관성
                </Typography>
                <JobRadarChart />
              </div>
              <div className="border-l border-gray-20 pl-6">
                <Typography type="Body1Semibold" className="text-gray-90 mb-3">
                  활동 만족도 평가
                </Typography>

                <div className="flex flex-wrap gap-2">
                  {['전체', 'PM/PO', '프론트엔드', '머신러닝 엔지니어'].map((item, index) => (
                    <button
                      key={item}
                      type="button"
                      className={clsx(
                        'h-[24px] rounded-full border px-3 inline-flex items-center',
                        index === 0 ? 'bg-primary-50 text-gray-0 border-primary-50' : 'bg-gray-0 text-gray-70 border-gray-20',
                      )}
                    >
                      <Typography type="Caption2Medium">{item}</Typography>
                    </button>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <Typography type="Heading2Semibold" className="text-gray-90">
                    4.2
                  </Typography>
                  <RatingStars value={4} />
                </div>

                <div className="mt-4 flex flex-col gap-4">
                  <ProgressRow label="직무 경험" value={62} />
                  <ProgressRow label="활동 강도" value={62} />
                  <ProgressRow label="혜택 및 복지" value={62} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-primary-20 bg-primary-5 px-7 py-6 flex items-center justify-between">
            <div>
              <Typography type="Body2Semibold" className="text-gray-90">
                이 활동에 참여하셨다면?
              </Typography>
              <Typography type="Body3Regular" className="text-gray-70 mt-1">
                간단한 리뷰로 다음 참가자에게 인사이트를 공유해 주세요!
              </Typography>
            </div>
            <button
              type="button"
              className="h-space-40 rounded-small bg-primary-50 px-6 inline-flex items-center justify-center"
            >
              <Icon icon="pencil" size={16} className="text-gray-0" />
              <Typography type="Body2Medium" className="text-gray-0 ml-2">
                리뷰 작성하기
              </Typography>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Typography type="Heading1Semibold" className="text-gray-90">
                리뷰 253
              </Typography>
              <div className="flex items-center gap-2">
                <button type="button" className="h-[34px] rounded-full border border-gray-20 px-4 inline-flex items-center gap-2">
                  <Typography type="Body3Medium" className="text-gray-70">
                    관심 직무
                  </Typography>
                  <Icon icon="chevronDown" size={14} className="text-gray-50" />
                </button>
                <button type="button" className="h-[34px] rounded-full border border-gray-20 px-4 inline-flex items-center gap-2">
                  <Typography type="Body3Medium" className="text-gray-70">
                    총 평점
                  </Typography>
                  <Icon icon="chevronDown" size={14} className="text-gray-50" />
                </button>
                <button type="button" className="h-[34px] rounded-full border border-gray-20 px-4 inline-flex items-center gap-2">
                  <Typography type="Body3Medium" className="text-gray-70">
                    수료여부
                  </Typography>
                  <Icon icon="chevronDown" size={14} className="text-gray-50" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {reviewCards.map((isPinned, index) => (
                <ReviewCard key={index} isPinned={isPinned} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
