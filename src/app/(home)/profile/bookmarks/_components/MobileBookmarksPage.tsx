'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import Card from '@/components/common/Card/mobile/Card';
import type { CardChipProps } from '@/components/common/Card/CardChip';
import { Divider } from '@/components/common/Divider/Divider';
import Icon from '@/components/common/Icon/Icon';
import LargeChevronLeft from '@/components/common/Icon/assets/Large/LargeChevronLeft';
import BottomSheet from '@/components/common/Modal/BottomSheet';
import Pagination from '@/components/common/Pagination/Pagination';
import Select from '@/components/common/Select/Select';
import Typography from '@/components/common/Typography';
import { JOB_TYPE_OPTIONS } from '@/constants/filters';
import useBookmarks from '@/hooks/useBookmarks';
import { toggleBookmark } from '@/lib/bookmarks';

const CARDS_PER_PAGE = 16;
const JOB_TYPES = ['기획', '디자인', '개발', '마케팅', 'AI'] as const;
type JobType = (typeof JOB_TYPES)[number];

const CATEGORY_OPTIONS = [
  { label: '대외활동', value: 'external_activity' },
  { label: '강연/세미나', value: 'seminar' },
  { label: '교육', value: 'education' },
  { label: '공모전/해커톤', value: 'contest' },
];

// figma 1136:75171: 진행중 / 마감 완료
const STATUS_OPTIONS = [
  { label: '진행중', value: 'ongoing' },
  { label: '마감 완료', value: 'closed' },
];

const CATEGORY_TO_API = {
  external_activity: 'EXTRACURRICULAR',
  seminar: 'SEMINAR',
  education: 'EDUCATION',
  contest: 'COMPETITION',
} as const;

const JOB_CODE_TO_LABEL: Record<string, string> = {
  planning: '기획',
  design: '디자인',
  development: '개발',
  marketing: '마케팅',
  ai: 'AI',
};

const ACTIVITY_TYPE_TO_CODE: Record<string, string> = {
  '공모전/해커톤': 'contest',
  교육: 'education',
  '강연/세미나': 'seminar',
};

type FilterKey = 'category' | 'job' | 'status';

const FILTER_TABS: { key: FilterKey; label: string; options: { label: string; value: string }[] }[] = [
  { key: 'category', label: '활동유형', options: CATEGORY_OPTIONS },
  { key: 'job', label: '직무유형', options: JOB_TYPE_OPTIONS },
  { key: 'status', label: '진행여부', options: STATUS_OPTIONS },
];

const EMPTY_FILTERS: Record<FilterKey, string[]> = { category: [], job: [], status: [] };

/** 모바일 저장한 공고 (figma 1136:75047, 필터 바텀시트 1136:75130). PC는 page.tsx. */
export default function MobileBookmarksPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [bookmarkMap, setBookmarkMap] = useState<Record<string, boolean>>({});
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // 활동유형은 백엔드가 단일 카테고리만 받으므로 1개 선택 시만 전송(그 외엔 클라 필터)
  const activityType =
    filters.category.length === 1
      ? CATEGORY_TO_API[filters.category[0] as keyof typeof CATEGORY_TO_API]
      : undefined;
  // 진행여부 필터를 위해 마감 공고도 포함해서 받는다(카드별 isClosed로 구분).
  const { data, loading } = useBookmarks({
    activityType,
    sortType: 'RECENTLY_BOOKMARKED',
    size: 100,
    includeClosed: true,
  });

  const setFilter = (key: FilterKey, value: string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const cards = useMemo(() => {
    const jobLabels = filters.job.map((code) => JOB_CODE_TO_LABEL[code]).filter(Boolean);
    return data.filter((item) => {
      const code = ACTIVITY_TYPE_TO_CODE[item.activityType] ?? 'external_activity';
      const matchCategory = filters.category.length === 0 || filters.category.includes(code);
      const matchJob = jobLabels.length === 0 || item.jobs.some((job) => jobLabels.includes(job));
      const matchStatus =
        filters.status.length === 0 ||
        (filters.status.includes('ongoing') && !item.isClosed) ||
        (filters.status.includes('closed') && item.isClosed);
      return matchCategory && matchJob && matchStatus;
    });
  }, [data, filters]);

  const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);
  const activePage = Math.min(page, Math.max(totalPages, 1));
  const pagedCards = cards.slice((activePage - 1) * CARDS_PER_PAGE, activePage * CARDS_PER_PAGE);

  return (
    <div className="flex w-full flex-col pt-10 pb-20 pc:hidden">
      {/* 헤더: 뒤로가기(32) + 가운데 제목 + 구분선 */}
      <div className="relative flex h-8 items-center justify-center">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로가기"
          className="absolute left-0 flex size-8 items-center justify-center text-gray-90"
        >
          <LargeChevronLeft width={11} height={19} />
        </button>
        <Typography tag="h1" type="Headline1SemiBold" className="text-black">
          저장한 공고
        </Typography>
      </div>
      <Divider className="mt-[18px] !w-full" />

      {/* 필터: 필터 아이콘(바텀시트) + 드롭다운 3개, 가로 스크롤 */}
      <div className="mt-5 flex w-full items-center gap-2 overflow-x-auto hide-scrollbar">
        <button
          type="button"
          onClick={() => setIsSheetOpen(true)}
          aria-label="필터 전체"
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#A5ADBB] bg-gray-0"
        >
          <Icon icon="filter" size={20} className="text-[#383838]" />
        </button>
        {FILTER_TABS.map(({ key, label, options }) => (
          <Select
            key={key}
            size="small"
            width="medium"
            type="checkbox"
            functionOptionType="reset"
            portalDropdown
            wrapperClassName="!w-[111px] shrink-0"
            className={clsx(
              '!w-[111px] !rounded-full !pl-[18px] !pr-[13px] [&_span]:text-[15px] [&_span]:font-medium [&_span]:!text-[#101828]',
              // figma 기본 상태 테두리 gray/40(#A5ADBB). 열림·선택 상태는 Select 기본 유지
              filters[key].length === 0 && 'aria-[expanded=false]:!border-[#A5ADBB]',
            )}
            placeholder={label}
            options={options}
            value={filters[key]}
            onChange={(value) => setFilter(key, Array.isArray(value) ? value : [])}
          />
        ))}
      </div>

      {/* 카드 2열 (간격 20 / 줄 22) */}
      <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-[22px]">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[301px] rounded-[10px] bg-gray-10 animate-pulse" />
          ))
        ) : pagedCards.length === 0 ? (
          <div className="col-span-2 flex h-[240px] items-center justify-center rounded-lg bg-gray-5">
            <Typography type="Body2Medium" className="text-gray-50">
              저장한 공고가 없습니다.
            </Typography>
          </div>
        ) : (
          pagedCards.map((item) => {
            const jobs = item.jobs.filter((job): job is JobType => JOB_TYPES.includes(job as JobType));
            const isBookmarked = bookmarkMap[item.id] ?? item.isBookmarked ?? true;
            return (
              <Card
                key={item.id}
                imageUrl={item.thumbnailImage || '/imgs/cat.jpg'}
                chipText={(item.activityType as CardChipProps['text']) || '대외활동'}
                badgeText={item.registrationPeriod || '모집중'}
                badgeVariant="default"
                isBookmarked={isBookmarked}
                companyName={item.organizer || ''}
                title={item.title}
                jobs={jobs.length > 0 ? jobs : ['기획']}
                onBookmarkClick={async () => {
                  setBookmarkMap((m) => ({ ...m, [item.id]: !isBookmarked }));
                  try {
                    await toggleBookmark({ activityId: item.id, isBookmarked });
                  } catch (error) {
                    setBookmarkMap((m) => ({ ...m, [item.id]: isBookmarked }));
                    window.alert(error instanceof Error ? error.message : '북마크 처리 중 오류가 발생했습니다.');
                  }
                }}
                onCardClick={() => item.detailLink && router.push(item.detailLink)}
              />
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination totalPage={totalPages} activePage={activePage} onPageChange={setPage} />
        </div>
      )}

      <BookmarkFilterSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        filters={filters}
        onToggle={(key, value) =>
          setFilter(
            key,
            filters[key].includes(value) ? filters[key].filter((v) => v !== value) : [...filters[key], value],
          )
        }
        onReset={() => {
          setFilters(EMPTY_FILTERS);
          setPage(1);
        }}
      />
    </div>
  );
}

/** '필터 전체' 바텀시트 (figma 1136:75130 / 75150 / 75171). 선택 즉시 반영, 적용하기는 닫기. */
function BookmarkFilterSheet({
  isOpen,
  onClose,
  filters,
  onToggle,
  onReset,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: Record<FilterKey, string[]>;
  onToggle: (key: FilterKey, value: string) => void;
  onReset: () => void;
}) {
  const [currentTab, setCurrentTab] = useState<FilterKey>('category');
  const options = FILTER_TABS.find((tab) => tab.key === currentTab)?.options ?? [];

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      classNames={{
        overlay: '!bg-[rgba(0,0,0,0.85)]',
        sheet:
          '!rounded-t-[20px] !shadow-[0px_16px_20px_0px_rgba(0,0,0,0.12),0px_8px_16px_0px_rgba(0,0,0,0.08),0px_0px_8px_0px_rgba(0,0,0,0.08)]',
        handle: '!mt-[14.28px] !h-[3px] !w-[28.92px] !rounded-[10px] !bg-[#A5ADBB]',
      }}
    >
      {/* 시트 높이 502 = 손잡이 영역 17.28 + 본문 484.72 (본문 시작 28, 아래 여백 50.17) */}
      <div className="flex h-[484.72px] flex-col px-5 pb-[50.17px] pt-[10.72px]">
        <div className="relative flex h-7 items-end justify-center">
          <span className="text-[18px] font-semibold leading-[21px] text-[#373737]">필터 전체</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute right-0 top-0 flex size-7 items-center justify-center"
          >
            {/* figma icon/base 28 (선 1.127, #101828) */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path
                d="M21 7L14 14M14 14L7 21M14 14L7 7M14 14L21 21"
                stroke="#101828"
                strokeWidth="1.12684"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 탭 3등분: 활성 3px(초록) / 비활성 1.5px(회색) */}
        <div className="mt-7 flex">
          {FILTER_TABS.map(({ key, label }) => {
            const isActive = key === currentTab;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setCurrentTab(key)}
                className="flex min-w-0 flex-1 flex-col gap-2"
              >
                <Typography type="Body2Semibold" className="text-center text-gray-90">
                  {label}
                </Typography>
                <div className="flex h-[3px] w-full items-center">
                  <div className={clsx('w-full', isActive ? 'h-[3px] rounded-full bg-primary-50' : 'h-[1.5px] bg-gray-30')} />
                </div>
              </button>
            );
          })}
        </div>

        {/* 옵션 칩 (간격 10 / 줄 16) */}
        <div className="mt-5 flex flex-1 flex-wrap content-start gap-x-[10px] gap-y-4 overflow-y-auto">
          {options.map((option) => {
            const isSelected = filters[currentTab].includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onToggle(currentTab, option.value)}
                className={clsx(
                  'flex h-10 items-center justify-center rounded-full px-4',
                  isSelected ? 'bg-primary-50' : 'bg-gray-10',
                )}
              >
                <Typography type="Body2Medium" className={isSelected ? 'text-gray-0' : 'text-gray-50'}>
                  {option.label}
                </Typography>
              </button>
            );
          })}
        </div>

        <div className="mt-[37px] flex gap-[11px]">
          <button type="button" onClick={onReset} className="h-[52px] w-[110px] shrink-0 rounded-[6px] bg-gray-20">
            <Typography type="Headline2Medium" className="text-gray-90">
              초기화
            </Typography>
          </button>
          <button type="button" onClick={onClose} className="h-[52px] flex-1 rounded-[6px] bg-primary-50">
            <Typography type="Headline2Medium" className="text-gray-0">
              적용하기
            </Typography>
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
