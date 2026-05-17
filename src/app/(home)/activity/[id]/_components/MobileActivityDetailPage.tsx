'use client';

import { useMemo, useState } from 'react';
import { ActivityCardItem } from '@/app/(home)/_components/constant';
import CardDayBadge from '@/components/common/Card/CardDayBadge';
import CardChip from '@/components/common/Card/CardChip';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { extractActivityId, toggleBookmark } from '@/lib/bookmarks';

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
    <Typography type="Caption1Regular" className="min-w-[54px] text-gray-50">
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
      <div className="h-full rounded-full bg-primary-50" style={{ width: `${value}%` }} />
    </div>
  </div>
);

const ReviewListCard = () => (
  <div className="rounded-lg border border-gray-20 bg-gray-0 px-4 py-4">
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

    <button type="button" className="mt-2 h-6 rounded-full bg-primary-5 px-3 inline-flex items-center">
      <Typography type="Caption2Medium" className="text-primary-60">
        도움이 돼요 2
      </Typography>
    </button>

    <div className="mt-3 flex items-center gap-2">
      <Typography type="Heading2Semibold" className="text-gray-90">
        총 평점:
      </Typography>
      <RatingStars value={4} />
    </div>

    <div className="mt-2 flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Typography type="Caption1Regular" className="text-gray-50 min-w-[42px]">
          직무경험
        </Typography>
        <RatingStars value={4} outOf={5} />
      </div>
      <div className="flex items-center gap-2">
        <Typography type="Caption1Regular" className="text-gray-50 min-w-[42px]">
          혜택 및복지
        </Typography>
        <RatingStars value={4} outOf={5} />
      </div>
      <div className="flex items-center gap-2">
        <Typography type="Caption1Regular" className="text-gray-50 min-w-[42px]">
          활동강도
        </Typography>
        <RatingStars value={3} outOf={5} />
      </div>
    </div>

    <Typography type="Heading2Semibold" className="mt-4 text-primary-50 break-keep">
      “최근에 방문한 카페는 분위기가 아늑하고 조용해서 너무 좋았어요. ”
    </Typography>

    <div className="mt-4 flex flex-col gap-3">
      <div>
        <Typography type="Body3Semibold" className="text-gray-90">
          활동 장점
        </Typography>
        <Typography type="Body3Regular" className="text-gray-70 break-keep">
          최근에 방문한 카페는 분위기가 아늑하고 조용해서 너무 좋았어요. 커피 맛도 좋고 친절해서 만족스러웠습니다. 직원들도 친절하게 응대해주셔서 기분 좋은 시간이었습니다. 다음에 또 방문하고 싶은 곳이에요!
        </Typography>
      </div>
      <div>
        <Typography type="Body3Semibold" className="text-gray-90">
          활동 단점
        </Typography>
        <Typography type="Body3Regular" className="text-gray-70 break-keep">
          최근에 방문한 카페는 분위기가 아늑하고 조용해서 너무 좋았어요. 커피 맛도 좋고 친절해서 만족스러웠습니다. 직원들도 친절하게 응대해주셔서 기분 좋은 시간이었습니다. 다음에 또 방문하고 싶은 곳이에요!
        </Typography>
      </div>
      <div>
        <Typography type="Body3Semibold" className="text-gray-90">
          합격 꿀팁
        </Typography>
        <Typography type="Body3Regular" className="text-gray-70 break-keep">
          최근에 방문한 카페는 분위기가 아늑하고 조용해서 너무 좋았어요. 커피 맛도 좋고 친절해서 만족스러웠습니다. 직원들도 친절하게 응대해주셔서 기분 좋은 시간이었습니다. 다음에 또 방문하고 싶은 곳이에요!
        </Typography>
      </div>
    </div>
  </div>
);

const MobileRadarChart = () => (
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
        90
      </Typography>
    </div>
    <div className="absolute right-0 top-[40%] text-center">
      <Typography type="Caption1Regular" className="text-gray-50">
        개발
      </Typography>
    </div>
    <div className="absolute right-2 bottom-1 text-center">
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
    <div className="absolute left-0 top-[40%] text-center">
      <Typography type="Caption1Regular" className="text-gray-50">
        디자인
      </Typography>
    </div>
  </div>
);

export default function MobileActivityDetailPage({ activity }: MobileActivityDetailPageProps) {
  const [tab, setTab] = useState<MobileTab>('detail');
  const [isBookmarked, setIsBookmarked] = useState(Boolean(activity.isBookmarked));
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const applyLink = getApplyLink(activity);
  const detailImages = splitDetailImages(activity.detailImage);
  const tags = getActivityTags(activity.activityField);
  const activityId = extractActivityId(activity.detailLink);
  const reviewCards = useMemo(() => [1, 2], []);

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
    <div className="pc:hidden flex flex-col gap-4 pb-10">
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <CardDayBadge text={activity.badgeText ?? '모집중'} variant="default" />
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
            <Icon icon={isBookmarked ? 'bookmarkFill' : 'bookmarkLine'} size={18} className="text-gray-50" />
          </button>
        </div>

        <Typography type="Heading1Semibold" className="text-gray-90 break-keep">
          {activity.title}
        </Typography>

        <Typography type="Body4Medium" className="text-gray-50">
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
        <InfoItem label="모집기간" value={activity.registrationPeriod} />
        <InfoItem label="모집인원" value={activity.recruitment} />
        <InfoItem label="모임지역" value={activity.region} />
        <InfoItem label="활동분야" value={activity.activityField} />
        <InfoItem label="활동기간" value={activity.activityPeriod} />
        <div className="flex items-start gap-4">
          <Typography type="Caption1Regular" className="min-w-[54px] text-gray-50">
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
              <Typography type="Caption1Regular" className="text-gray-50">
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

          <div className="-mt-[54px] px-3 relative z-10">
            <div className="grid grid-cols-2 gap-1 rounded border border-gray-20 bg-gray-0 p-1 shadow-sm">
              <Link
                href={activity.homepage || '#'}
                target={activity.homepage ? '_blank' : undefined}
                className="h-space-40 rounded-small bg-gray-5 inline-flex items-center justify-center"
              >
                <Typography type="Body2Medium" className="text-gray-90">
                  홈페이지
                </Typography>
              </Link>
              <Link
                href={applyLink}
                target="_blank"
                className="h-space-40 rounded-small bg-primary-50 inline-flex items-center justify-center"
              >
                <Typography type="Body2Medium" className="text-gray-0">
                  지원하기
                </Typography>
              </Link>
            </div>
          </div>

          {detailImages.map((image) => (
            <div key={image} className="relative w-full h-[430px] rounded-lg overflow-hidden bg-gray-10">
              <Image src={image} alt="공고 상세 이미지" fill sizes="335px" unoptimized className="object-contain" />
            </div>
          ))}

          <section className="flex flex-col gap-6 pt-1">
            <div className="flex flex-col gap-2">
              <Typography type="Heading2Semibold" className="text-gray-90">
                활동 내용
              </Typography>
              <Typography type="Body2Regular" className="text-gray-70 whitespace-pre-line">
                {activity.description || `${activity.title}\n참여대상: ${activity.target || '대상 제한 없음'}\n주최기관: ${activity.organizer}`}
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
          </section>
        </section>
      ) : (
        <section className="flex flex-col gap-4">
          <div>
            <Typography type="Body1Semibold" className="text-gray-90">
              직무 연관성
            </Typography>
            <div className="relative mt-2">
              <MobileRadarChart />
              <div className="absolute left-0 right-0 top-[58px] px-3">
                <div className="grid grid-cols-2 gap-1 rounded border border-gray-20 bg-gray-0 p-1 shadow-sm">
                  <Link
                    href={activity.homepage || '#'}
                    target={activity.homepage ? '_blank' : undefined}
                    className="h-space-40 rounded-small bg-gray-5 inline-flex items-center justify-center"
                  >
                    <Typography type="Body2Medium" className="text-gray-90">
                      홈페이지
                    </Typography>
                  </Link>
                  <Link
                    href={applyLink}
                    target="_blank"
                    className="h-space-40 rounded-small bg-primary-50 inline-flex items-center justify-center"
                  >
                    <Typography type="Body2Medium" className="text-gray-0">
                      지원하기
                    </Typography>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Typography type="Body1Semibold" className="text-gray-90 mb-2">
              활동 만족도 평가
            </Typography>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {['전체', '프론트엔드', 'PM/PO', '머신러닝 엔지니어'].map((item, index) => (
                <button
                  key={item}
                  type="button"
                  className={clsx(
                    'h-[28px] rounded-full border px-3 whitespace-nowrap',
                    index === 0 ? 'bg-primary-50 border-primary-50 text-gray-0' : 'bg-gray-0 border-gray-20 text-gray-70',
                  )}
                >
                  <Typography type="Caption2Medium">{item}</Typography>
                </button>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Typography type="Heading2Semibold" className="text-gray-90">
                4.2
              </Typography>
              <RatingStars value={4} />
            </div>

            <div className="mt-3 flex flex-col gap-3">
              <ProgressRow label="직무 경험" value={60} />
              <ProgressRow label="활동 강도" value={60} />
              <ProgressRow label="혜택 및 복지" value={60} />
            </div>
          </div>

          <div className="rounded-lg border border-primary-20 bg-primary-5 px-4 py-4">
            <Typography type="Body3Semibold" className="text-gray-90">
              이 활동에 참여하신 경험이 있으신가요?
            </Typography>
            <Typography type="Body3Regular" className="text-gray-70 mt-1 break-keep">
              간단한 리뷰로 다음 참가자에게 인사이트를 공유해 주세요!
            </Typography>
            <button
              type="button"
              className="mt-3 w-full h-space-40 rounded-small bg-primary-50 inline-flex items-center justify-center"
            >
              <Icon icon="pencil" size={16} className="text-gray-0" />
              <Typography type="Body2Medium" className="text-gray-0 ml-2">
                리뷰 작성하기
              </Typography>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <Typography type="Heading1Semibold" className="text-gray-90">
              리뷰 253
            </Typography>

            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
              <button
                type="button"
                className="h-[30px] w-[30px] rounded-full bg-primary-50 inline-flex items-center justify-center shrink-0"
                aria-label="정렬 초기화"
              >
                <Icon icon="largeRefresh" size={14} className="text-gray-0" />
              </button>
              <button
                type="button"
                className="h-[30px] rounded-full border border-gray-20 px-3 inline-flex items-center gap-1 shrink-0"
              >
                <Typography type="Caption2Medium" className="text-gray-70">
                  관심직무
                </Typography>
                <Icon icon="chevronDown" size={12} className="text-gray-50" />
              </button>
              <button
                type="button"
                className="h-[30px] rounded-full border border-gray-20 px-3 inline-flex items-center gap-1 shrink-0"
              >
                <Typography type="Caption2Medium" className="text-gray-70">
                  총 평점
                </Typography>
                <Icon icon="chevronDown" size={12} className="text-gray-50" />
              </button>
              <button
                type="button"
                className="h-[30px] rounded-full border border-gray-20 px-3 inline-flex items-center gap-1 shrink-0"
              >
                <Typography type="Caption2Medium" className="text-gray-70">
                  수료여부
                </Typography>
                <Icon icon="chevronDown" size={12} className="text-gray-50" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {reviewCards.map((item) => (
                <ReviewListCard key={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
