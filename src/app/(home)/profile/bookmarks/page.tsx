'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/common/Card/Card';
import Typography from '@/components/common/Typography';
import Icon from '@/components/common/Icon/Icon';
import Select from '@/components/common/Select/Select';
import Pagination from '@/components/common/Pagination/Pagination';
import useBookmarks from '@/hooks/useBookmarks';
import { toggleBookmark } from '@/lib/bookmarks';
import { JOB_TYPE_OPTIONS } from '@/constants/filters';
import MobileBookmarksPage from './_components/MobileBookmarksPage';

const CARDS_PER_PAGE = 16;
// 드롭다운 열림 상태 (figma 3025:36883): 폭 132, 버튼과 간격 14.6, 안쪽 여백 4, 행 여백 12/8, 체크박스 16(테두리 gray/30), 14px #101828
const DROPDOWN_CLASS =
  '[&_ul]:!w-[132px] [&_ul]:!mt-[14.6px] [&_ul]:!p-1 [&_li]:!py-2 [&_li_label]:!size-4 [&_li_label]:border-gray-30 [&_li_span]:!leading-[1.429] [&_li_span]:text-gray-90 [&_li_span]:whitespace-nowrap';
const JOB_TYPES = ['기획', '디자인', '개발', '마케팅', 'AI'] as const;

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [bookmarkMap, setBookmarkMap] = useState<Record<string, boolean>>({});

  // 활동유형은 백엔드가 단일 카테고리만 받으므로 1개 선택 시만 전송(그 외엔 클라 필터)
  const activityType =
    selectedCategories.length === 1
      ? CATEGORY_TO_API[selectedCategories[0] as keyof typeof CATEGORY_TO_API]
      : undefined;
  // 진행여부 필터를 위해 마감 공고도 포함해서 받는다(카드별 isClosed로 구분).
  const { data, loading } = useBookmarks({ activityType, sortType: 'RECENTLY_BOOKMARKED', size: 100, includeClosed: true });

  const cards = useMemo(() => {
    const jobLabels = selectedJobs.map((code) => JOB_CODE_TO_LABEL[code]).filter(Boolean);
    return data.filter((item) => {
      const code = ACTIVITY_TYPE_TO_CODE[item.activityType] ?? 'external_activity';
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(code);
      const matchJob = jobLabels.length === 0 || item.jobs.some((job) => jobLabels.includes(job));
      // 진행여부: 카드별 isClosed로 진행중/마감 구분 (includeClosed로 마감도 받아옴)
      const matchStatus =
        selectedStatus.length === 0 ||
        (selectedStatus.includes('ongoing') && !item.isClosed) ||
        (selectedStatus.includes('closed') && item.isClosed);
      return matchCategory && matchJob && matchStatus;
    });
  }, [data, selectedCategories, selectedJobs, selectedStatus]);

  const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);
  const activePage = Math.min(page, Math.max(totalPages, 1));
  const pagedCards = cards.slice((activePage - 1) * CARDS_PER_PAGE, activePage * CARDS_PER_PAGE);

  return (
    <>
      {/* PC: figma 1136:74929 / 모바일: MobileBookmarksPage (figma 1136:75047) */}
      <div className="w-full flex flex-col gap-8 pt-10 pb-20 mobile:hidden pc:gap-10 pc:px-5">
        <div className="flex flex-row items-center gap-2">
          <button type="button" onClick={() => router.push('/profile')} aria-label="마이페이지로 이동">
            <Icon icon="chevronLeft" size={16} />
          </button>
          <Typography type="Heading1Bold" className="pc:font-semibold pc:text-[#1E2939]">
            저장한 공고
          </Typography>
        </div>

        <div className="flex items-end justify-between w-full">
          <div className="flex items-center gap-2 pc:gap-[10px]">
            {/* figma PC: 초기화 버튼·정렬 탭 숨김 */}
            <Select
              size="small"
              width="medium"
              type="checkbox"
              portalDropdown
              dropdownClassName={DROPDOWN_CLASS}
              wrapperClassName="pc:!w-[132px]"
              className="!rounded-full [&_span]:text-[14px] [&_span]:font-medium [&_span]:!text-[#101828] pc:!w-[132px] pc:!pr-[13px] pc:[&_span]:text-[15px]"
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
              portalDropdown
              dropdownClassName={DROPDOWN_CLASS}
              wrapperClassName="pc:!w-[132px]"
              className="!rounded-full [&_span]:text-[14px] [&_span]:font-medium [&_span]:!text-[#101828] pc:!w-[132px] pc:!pr-[13px] pc:[&_span]:text-[15px]"
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
              portalDropdown
              dropdownClassName={DROPDOWN_CLASS}
              wrapperClassName="pc:!w-[132px]"
              className="!rounded-full [&_span]:text-[14px] [&_span]:font-medium [&_span]:!text-[#101828] pc:!w-[132px] pc:!pr-[13px] pc:[&_span]:text-[15px]"
              placeholder="진행 여부"
              options={[
                { label: '진행 중', value: 'ongoing' },
                { label: '마감 완료', value: 'closed' },
              ]}
              value={selectedStatus}
              onChange={(value) => {
                setSelectedStatus(Array.isArray(value) ? value : []);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 pc:grid-cols-4 pc:gap-y-3">
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
          <div className="mt-8 flex justify-center pc:mt-0">
            <Pagination totalPage={totalPages} activePage={activePage} onPageChange={setPage} />
          </div>
        )}
      </div>
      <MobileBookmarksPage />
    </>
  );
}
