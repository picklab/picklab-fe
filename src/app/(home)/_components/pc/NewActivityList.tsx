'use client';
import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Card from '@/components/common/Card/Card';
import Typography from '@/components/common/Typography';
import SortTab from '@/components/common/Tab/SortTab';
import Select from '@/components/common/Select/Select';
import ChevronIconButton from '@/components/common/Pagination/ChevronIconButton';
import { useActivities } from '@/hooks/useActivities';
import { getAllActivities, getActivitiesForCategoryPage, type ActivityPageFilters, type ActivityRouteSlug } from '@/lib/activity-data';

interface NewActivityListProps {
  title: string;
  categorySlug?: ActivityRouteSlug;
  selectedFilters?: ActivityPageFilters;
  showInlineFilters?: boolean;
  useExternalPagination?: boolean;
  showTitle?: boolean;
  resultCount?: number;
}

const CARDS_PER_PAGE = 12;
const JOB_TYPES = ['기획', '디자인', '개발', '마케팅', 'AI'] as const;

function getDeadlineRank(badgeText: string): number {
  if (badgeText === '마감') return Number.NEGATIVE_INFINITY;
  if (badgeText === 'D-Day') return 0;
  if (badgeText.startsWith('D-')) return Number(badgeText.slice(2));
  return 999;
}

export default function NewActivityList({
  title,
  categorySlug,
  selectedFilters = {},
  showInlineFilters = true,
  useExternalPagination = false,
  showTitle = true,
  resultCount,
}: NewActivityListProps) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('latest');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: apiData, loading } = useActivities('latest', { size: String(getAllActivities().length) });
  const effectiveLoading = categorySlug ? false : loading;

  const resetExternalPage = () => {
    if (!useExternalPagination) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const cards = useMemo(() => {
    const sourceItems = categorySlug
      ? getActivitiesForCategoryPage({
          slug: categorySlug,
          selectedFilters: {
            ...selectedFilters,
            ...(selectedCategories.length > 0 ? { 활동유형: selectedCategories } : {}),
            ...(selectedJobs.length > 0 ? { 관련직무: selectedJobs.map((job) => (
              job === 'planning'
                ? '기획'
                : job === 'design'
                  ? '디자인'
                  : job === 'development'
                    ? '개발'
                    : job === 'marketing'
                      ? '마케팅'
                      : '기타'
            )) } : {}),
          },
          sort: sort as 'latest' | 'soon' | 'remain',
        })
      : apiData;

    if (sourceItems.length === 0) {
      if (categorySlug) {
        return [];
      }

      return Array.from({ length: 10 }).map((_, index) => ({
        key: String(index),
        imageUrl: '/imgs/cat.jpg',
        chipText: '공모전/해커톤' as const,
        badgeText: 'D-01',
        badgeVariant: 'default' as const,
        isBookmarked: false,
        companyName: '삼양 그룹',
        title: '2025 삼양그룹 대학생 서포터즈 Samyang Seeds 9기',
        jobs: ['개발'] as ('개발')[],
        detailLink: '',
      }));
    }

    const filtered = sourceItems.filter((item) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(
          item.activityType === '공모전/해커톤'
            ? 'contest'
            : item.activityType === '교육'
              ? 'education'
              : item.activityType === '강연/세미나'
                ? 'seminar'
                : 'external_activity',
        );

      const matchesJob =
        selectedJobs.length === 0 ||
        item.jobs.some((job) =>
          selectedJobs.includes(
            job === '기획'
              ? 'planning'
              : job === '디자인'
                ? 'design'
                : job === '개발'
                  ? 'development'
                  : job === '마케팅'
                    ? 'marketing'
                    : 'ai',
          ),
        );

      return matchesCategory && matchesJob;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'soon') {
        return getDeadlineRank(a.registrationPeriod) - getDeadlineRank(b.registrationPeriod);
      }
      if (sort === 'remain') {
        return getDeadlineRank(b.registrationPeriod) - getDeadlineRank(a.registrationPeriod);
      }
      return 0;
    });

    return sorted.map((item) => {
      const jobs = item.jobs.filter((job): job is (typeof JOB_TYPES)[number] =>
        JOB_TYPES.includes(job as (typeof JOB_TYPES)[number]),
      );

      return {
        key: item.id,
        imageUrl: item.thumbnailImage || '/imgs/cat.jpg',
        chipText: (item.activityType as '대외활동' | '강연/세미나' | '교육' | '공모전/해커톤') || '공모전/해커톤',
        badgeText: item.registrationPeriod || 'D-01',
        badgeVariant: 'default' as const,
        isBookmarked: false,
        companyName: item.organizer || '',
        title: item.title,
        jobs: (jobs.length > 0 ? jobs : ['기획']) as ('기획' | '디자인' | '개발' | '마케팅' | 'AI')[],
        detailLink: item.detailLink,
      };
    });
  }, [apiData, categorySlug, selectedCategories, selectedFilters, selectedJobs, sort]);

  const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);
  const externalPage = Number(searchParams.get('page') ?? 1);
  const activePage =
    useExternalPagination && Number.isFinite(externalPage)
      ? Math.min(Math.max(externalPage, 1), Math.max(totalPages, 1))
      : page;
  const pagedCards = cards.slice((activePage - 1) * CARDS_PER_PAGE, activePage * CARDS_PER_PAGE);

  return (
    <div className="w-full flex flex-col gap-[2rem]">
      <div className="flex flex-col gap-4">
        {showTitle && <Typography type="Heading1Bold">{title}</Typography>}

        <div className="flex items-end justify-between w-full">
          {showInlineFilters ? (
            <div className="flex gap-2">
              <Select
                size="small"
                width="small"
                type="checkbox"
                functionOptionType="reset"
                portalDropdown
                className="!rounded-full [&_span]:text-[14px] [&_span]:font-medium [&_span]:!text-[#101828]"
                placeholder="활동유형"
                options={[
                  { label: '대외활동', value: 'external_activity' },
                  { label: '강연/세미나', value: 'seminar' },
                  { label: '교육', value: 'education' },
                  { label: '공모전/해커톤', value: 'contest' },
                ]}
                value={selectedCategories}
                onChange={(value) => {
                  setSelectedCategories(Array.isArray(value) ? value : []);
                  if (useExternalPagination) {
                    resetExternalPage();
                  } else {
                    setPage(1);
                  }
                }}
              />
              <Select
                size="small"
                width="small"
                type="checkbox"
                functionOptionType="reset"
                portalDropdown
                className="!rounded-full [&_span]:text-[14px] [&_span]:font-medium [&_span]:!text-[#101828]"
                placeholder="직무유형"
                options={[
                  { label: '기획', value: 'planning' },
                  { label: '디자인', value: 'design' },
                  { label: '개발', value: 'development' },
                  { label: '마케팅', value: 'marketing' },
                  { label: 'AI', value: 'ai' },
                ]}
                value={selectedJobs}
                onChange={(value) => {
                  setSelectedJobs(Array.isArray(value) ? value : []);
                  if (useExternalPagination) {
                    resetExternalPage();
                  } else {
                    setPage(1);
                  }
                }}
              />
            </div>
          ) : typeof resultCount === 'number' ? (
            <Typography type="Body2Medium" className="text-gray-60">
              공고 {resultCount}건
            </Typography>
          ) : (
            <div />
          )}
          <SortTab
            options={[
              { label: '최신순', value: 'latest' },
              { label: '마감임박순', value: 'soon' },
              { label: '여유 있는순', value: 'remain' },
            ]}
            currentValue={sort}
            onTabClick={(value) => {
              setSort(value);
              if (useExternalPagination) {
                resetExternalPage();
              } else {
                setPage(1);
              }
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-5">
        {effectiveLoading
          ? Array.from({ length: CARDS_PER_PAGE }).map((_, i) => (
              <div key={i} className="h-[280px] rounded-lg bg-gray-10 animate-pulse" />
            ))
          : pagedCards.length === 0
            ? (
              <div className="col-span-4 flex h-[240px] items-center justify-center rounded-lg bg-gray-5">
                <Typography type="Body2Medium" className="text-gray-50">
                  선택한 조건에 맞는 활동이 없습니다.
                </Typography>
              </div>
            )
          : pagedCards.map((card) => (
              <Card
                key={card.key}
                imageUrl={card.imageUrl}
                chipText={card.chipText}
                badgeText={card.badgeText}
                badgeVariant={card.badgeVariant}
                isBookmarked={card.isBookmarked}
                companyName={card.companyName}
                title={card.title}
                jobs={card.jobs}
                onBookmarkClick={() => {}}
                onCardClick={() => card.detailLink && router.push(card.detailLink)}
              />
            ))}
      </div>
      {!useExternalPagination && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <ChevronIconButton
            direction="left"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={activePage === 1}
          />
          <Typography type="Body3Medium" className="text-gray-60">
            {activePage} / {totalPages}
          </Typography>
          <ChevronIconButton
            direction="right"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={activePage === totalPages}
          />
        </div>
      )}
    </div>
  );
}
