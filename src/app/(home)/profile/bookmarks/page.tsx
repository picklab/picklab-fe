'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/common/Card/Card';
import Typography from '@/components/common/Typography';
import SortTab from '@/components/common/Tab/SortTab';
import Select from '@/components/common/Select/Select';
import Pagination from '@/components/common/Pagination/Pagination';
import Icon from '@/components/common/Icon/Icon';
import useBookmarks from '@/hooks/useBookmarks';
import { toggleBookmark } from '@/lib/bookmarks';
import { JOB_TYPE_OPTIONS } from '@/constants/filters';

const CARDS_PER_PAGE = 16;
const JOB_TYPES = ['기획', '디자인', '개발', '마케팅', 'AI'] as const;

const SORT_TO_API = {
  recent: 'RECENTLY_BOOKMARKED',
  latest: 'LATEST',
  soon: 'DEADLINE_ASC',
  remain: 'DEADLINE_DESC',
} as const;

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

export default function BookmarksPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<keyof typeof SORT_TO_API>('recent');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [bookmarkMap, setBookmarkMap] = useState<Record<string, boolean>>({});

  // 활동유형은 백엔드가 단일 카테고리만 받으므로 1개 선택 시만 전송(그 외엔 클라 필터)
  const activityType =
    selectedCategories.length === 1
      ? CATEGORY_TO_API[selectedCategories[0] as keyof typeof CATEGORY_TO_API]
      : undefined;
  const { data, loading } = useBookmarks({ activityType, sortType: SORT_TO_API[sort], size: 100 });

  const resetAll = () => {
    setSelectedCategories([]);
    setSelectedJobs([]);
    setSelectedStatus([]);
    setSort('recent');
    setPage(1);
  };

  const cards = useMemo(() => {
    const jobLabels = selectedJobs.map((code) => JOB_CODE_TO_LABEL[code]).filter(Boolean);
    return data.filter((item) => {
      const code = ACTIVITY_TYPE_TO_CODE[item.activityType] ?? 'external_activity';
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(code);
      const matchJob = jobLabels.length === 0 || item.jobs.some((job) => jobLabels.includes(job));
      // 진행여부: 마감 카드는 useBookmarks에서 이미 제외 → '진행중'만 존재. '마감' 선택 시 결과 없음
      const matchStatus = selectedStatus.length === 0 || selectedStatus.includes('ongoing');
      return matchCategory && matchJob && matchStatus;
    });
  }, [data, selectedCategories, selectedJobs, selectedStatus]);

  const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);
  const activePage = Math.min(page, Math.max(totalPages, 1));
  const pagedCards = cards.slice((activePage - 1) * CARDS_PER_PAGE, activePage * CARDS_PER_PAGE);

  return (
    <div className="w-full flex flex-col gap-8 pt-10 pb-20">
      <Typography type="Heading1Bold">저장한 공고</Typography>

      <div className="flex items-end justify-between w-full">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetAll}
            aria-label="필터 초기화"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50"
          >
            <Icon icon="largeRefresh" color="white" size={20} />
          </button>
          <Select
            size="small"
            width="medium"
            type="checkbox"
            functionOptionType="reset"
            portalDropdown
            className="!rounded-full [&_span]:text-[14px] [&_span]:font-medium [&_span]:!text-[#101828]"
            placeholder="활동 유형"
            options={[
              { label: '대외활동', value: 'external_activity' },
              { label: '강연/세미나', value: 'seminar' },
              { label: '교육', value: 'education' },
              { label: '공모전/해커톤', value: 'contest' },
            ]}
            value={selectedCategories}
            onChange={(value) => {
              setSelectedCategories(Array.isArray(value) ? value : []);
              setPage(1);
            }}
          />
          <Select
            size="small"
            width="medium"
            type="checkbox"
            functionOptionType="reset"
            portalDropdown
            className="!rounded-full [&_span]:text-[14px] [&_span]:font-medium [&_span]:!text-[#101828]"
            placeholder="직무 유형"
            options={JOB_TYPE_OPTIONS}
            value={selectedJobs}
            onChange={(value) => {
              setSelectedJobs(Array.isArray(value) ? value : []);
              setPage(1);
            }}
          />
          <Select
            size="small"
            width="medium"
            type="checkbox"
            functionOptionType="reset"
            portalDropdown
            className="!rounded-full [&_span]:text-[14px] [&_span]:font-medium [&_span]:!text-[#101828]"
            placeholder="진행 여부"
            options={[
              { label: '진행중', value: 'ongoing' },
              { label: '마감', value: 'closed' },
            ]}
            value={selectedStatus}
            onChange={(value) => {
              setSelectedStatus(Array.isArray(value) ? value : []);
              setPage(1);
            }}
          />
        </div>
        <SortTab
          options={[
            { label: '최근 저장순', value: 'recent' },
            { label: '최신순', value: 'latest' },
            { label: '마감 임박순', value: 'soon' },
            { label: '여유 있는순', value: 'remain' },
          ]}
          currentValue={sort}
          onTabClick={(value) => {
            setSort(value as keyof typeof SORT_TO_API);
            setPage(1);
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-5 pc:grid-cols-4">
        {loading ? (
          Array.from({ length: CARDS_PER_PAGE }).map((_, i) => (
            <div key={i} className="h-[280px] rounded-lg bg-gray-10 animate-pulse" />
          ))
        ) : pagedCards.length === 0 ? (
          <div className="col-span-2 flex h-[240px] items-center justify-center rounded-lg bg-gray-5 pc:col-span-4">
            <Typography type="Body2Medium" className="text-gray-50">
              저장한 공고가 없습니다.
            </Typography>
          </div>
        ) : (
          pagedCards.map((item) => {
            const jobs = item.jobs.filter((job): job is (typeof JOB_TYPES)[number] =>
              JOB_TYPES.includes(job as (typeof JOB_TYPES)[number]),
            );
            const isBookmarked = bookmarkMap[item.id] ?? (item.isBookmarked ?? true);
            return (
              <Card
                key={item.id}
                imageUrl={item.thumbnailImage || '/imgs/cat.jpg'}
                chipText={(item.activityType as '대외활동' | '강연/세미나' | '교육' | '공모전/해커톤') || '대외활동'}
                badgeText={item.registrationPeriod || '모집중'}
                badgeVariant="default"
                isBookmarked={isBookmarked}
                companyName={item.organizer || ''}
                title={item.title}
                jobs={(jobs.length > 0 ? jobs : ['기획']) as ('기획' | '디자인' | '개발' | '마케팅' | 'AI')[]}
                onBookmarkClick={async () => {
                  setBookmarkMap((m) => ({ ...m, [item.id]: !isBookmarked }));
                  try {
                    await toggleBookmark({ activityId: item.id, isBookmarked });
                  } catch (error) {
                    setBookmarkMap((m) => ({ ...m, [item.id]: isBookmarked }));
                    const message = error instanceof Error ? error.message : '북마크 처리 중 오류가 발생했습니다.';
                    window.alert(message);
                  }
                }}
                onCardClick={() => item.detailLink && router.push(item.detailLink)}
              />
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination totalPage={totalPages} activePage={activePage} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
