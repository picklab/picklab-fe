'use client';

import { useState } from 'react';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import { ActivityCardItem } from '@/app/(home)/_components/constant';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { extractActivityId, toggleBookmark } from '@/lib/bookmarks';

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

const FilterButton = ({ label }: { label: string }) => (
  <button
    type="button"
    className="h-space-40 w-[132px] rounded-full border border-gray-30 bg-gray-0 px-[18px] py-space-8 inline-flex items-center justify-between"
  >
    <Typography type="Body3Medium" className="text-gray-90">
      {label}
    </Typography>
    <Icon icon="chevronDown" size={24} className="text-gray-90" />
  </button>
);

const JobFilterChip = ({ label, isActive = false }: { label: string; isActive?: boolean }) => (
  <button
    type="button"
    className={clsx(
      'h-[26px] rounded-full border px-3 inline-flex items-center justify-center',
      isActive ? 'border-primary-50 bg-primary-50 text-gray-0' : 'border-gray-40 bg-gray-0 text-gray-90',
    )}
  >
    <Typography type="Caption1Medium">{label}</Typography>
  </button>
);

const ReviewCard = () => (
  <div className="relative h-[520px] rounded-[10px] border border-gray-20 bg-gray-0 px-10 py-7 overflow-hidden">
    <div className="flex items-center justify-between">
      <div className="flex h-[26px] items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="h-[22px] rounded bg-danger-5 px-space-8 inline-flex items-center">
            <Typography type="Caption1Medium" className="text-danger-50">
              기획
            </Typography>
          </span>
          <Typography type="Caption1Medium" className="text-gray-50">
            서비스 기획
          </Typography>
        </div>
        <span className="h-[13px] w-px bg-gray-90" aria-hidden="true" />
        <Typography type="Caption1Medium" className="text-gray-50">
          2025.06 참여
        </Typography>
        <span className="h-[13px] w-px bg-gray-90" aria-hidden="true" />
        <Typography type="Caption1Medium" className="text-gray-50">
          수료 완료
        </Typography>
      </div>
      <button type="button" className="h-[26px] rounded-full bg-[#DBEAFE] px-[10px] py-1 inline-flex items-center">
        <Typography type="Caption1Medium" className="text-[#155DFC]">
          도움이 돼요 2
        </Typography>
      </button>
    </div>

    <div className="mt-5 flex items-center gap-2">
      <Typography type="Title3Bold" className="text-gray-90">
        총 평점 :
      </Typography>
      <RatingStars value={4} size={40} gapClassName="gap-0" />
    </div>

    <div className="mt-1 flex h-10 items-center gap-[10px]">
      {[
        ['직무경험', 4],
        ['혜택 및 복지', 4],
        ['활동강도', 4],
      ].map(([label, value], index) => (
        <div key={label} className="flex items-center gap-1">
          {index > 0 && <span className="mr-[6px] h-3 w-px bg-gray-40" aria-hidden="true" />}
          <Typography type="Caption1Medium" className="text-gray-70">
            {label}
          </Typography>
          <RatingStars value={Number(value)} outOf={5} size={24} gapClassName="gap-0" />
        </div>
      ))}
    </div>

    <div className="mt-6 blur-[6px] select-none">
      <Typography type="Heading1Bold" className="text-xl leading-[140%] text-primary-50">
        “최근에 방문한 카페는 분위기가 아늑하고 조용해서 너무 좋았어요. “
      </Typography>

      <div className="mt-6 flex flex-col gap-6 text-gray-70">
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

    <div className="absolute inset-x-0 top-[278px] flex justify-center">
      <button type="button" className="h-space-56 rounded-[6px] border border-gray-40 bg-gray-0 px-space-24 py-space-16 inline-flex items-center justify-center">
        <Typography type="Heading2Medium" className="text-gray-90">
          리뷰 작성하고 전체보기
        </Typography>
      </button>
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
  const [isBookmarked, setIsBookmarked] = useState(Boolean(activity.isBookmarked));
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const applyLink = getApplyLink(activity);
  const detailImages = splitDetailImages(activity.detailImage);
  const hasThumbnail = Boolean(activity.thumbnailImage);
  const tags = getActivityTags(activity.activityField);
  const activityId = extractActivityId(activity.detailLink);

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
            <div className="flex flex-col gap-3">
              <Typography type="Title3Bold" className="text-gray-90">
                활동 내용
              </Typography>
              <Typography type="Body2Regular" className="text-gray-70 whitespace-pre-line">
                {activity.description || `${activity.title}\n주최기관: ${activity.organizer}\n참여대상: ${activity.target || '대상 제한 없음'}`}
              </Typography>
            </div>

            <div className="flex flex-col gap-3">
              <Typography type="Title3Bold" className="text-gray-90">
                혜택
              </Typography>
              <Typography type="Body2Regular" className="text-gray-70">
                {activity.costPrize || '상세 혜택 정보는 홈페이지 또는 지원 링크에서 확인해 주세요.'}
              </Typography>
            </div>

            <div className="flex flex-col gap-3">
              <Typography type="Title3Bold" className="text-gray-90">
                지원 안내
              </Typography>
              <Typography type="Body2Regular" className="text-gray-70">
                별도 첨부파일은 수집되지 않았습니다. 지원서 양식과 제출 방식은 홈페이지 또는 지원하기 링크에서 확인해 주세요.
              </Typography>
            </div>
          </div>
        </section>
      ) : (
        <section className="mt-[60px]">
          <div className="flex w-full items-start gap-20">
            <div className="flex h-[351px] w-[382px] shrink-0 items-center justify-center rounded-[20px] border border-gray-20 bg-gray-0 px-9 py-4">
              <JobRadarChart />
            </div>
            <div className="flex w-[438px] flex-col gap-6">
              <div className="flex flex-col gap-5">
                <Typography type="Body1Semibold" className="text-lg leading-[144.5%] text-gray-90">
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
                  4.2
                </Typography>
                <RatingStars value={4} size={36} gapClassName="gap-0.5" />
              </div>

              <div className="flex flex-col gap-3">
                <ProgressRow label="직무 경험" value={75} />
                <ProgressRow label="활동 강도" value={48} />
                <ProgressRow label="혜택 및 복지" value={80} />
              </div>
            </div>
          </div>

          <div className="mt-[49px] h-px w-full bg-gray-20" />

          <div className="mt-[50px] flex flex-col gap-6">
            <div className="flex h-space-40 items-center justify-between">
              <Typography type="Heading1Semibold" className="text-gray-90">
                리뷰 253
              </Typography>
              <div className="flex items-center gap-2">
                <FilterButton label="관심 직무" />
                <FilterButton label="총 평점" />
                <FilterButton label="수료여부" />
              </div>
            </div>

            <ReviewCard />
          </div>
        </section>
      )}
    </div>
  );
}
