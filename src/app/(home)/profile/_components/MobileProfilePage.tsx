'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';
import Typography from '@/components/common/Typography';
import ChevronRight from '@/components/common/Icon/assets/ChevronRight';
import ListItem from '@/components/common/List/ListItem';
import Card from '@/components/common/Card/mobile/Card';
import type { CardChipProps } from '@/components/common/Card/CardChip';
import MobileProfile from './MobileProfile';
import useParticipationSummary from '@/hooks/useParticipationSummary';
import useArchiveActivities from '@/hooks/useArchiveActivities';
import useBookmarks from '@/hooks/useBookmarks';
import { toggleBookmark } from '@/lib/bookmarks';

type CardJobs = ('기획' | '개발' | '마케팅' | '디자인' | 'AI')[];

export default function MobileProfilePage() {
  const router = useRouter();
  const [snbMenu, setSnbMenu] = useState<'my-activity' | 'my-post' | 'account'>('my-activity');
  const { data: summary } = useParticipationSummary();
  const { data: archives } = useArchiveActivities();
  const { data: bookmarks } = useBookmarks();
  const [removed, setRemoved] = useState<Record<string, boolean>>({});

  const results = [
    { title: '지원완료', value: summary.applied_count },
    { title: '최종합격', value: summary.accepted_count },
    { title: '불합격', value: summary.rejected_count },
    { title: '수료완료', value: summary.completed_count },
  ];
  const archiveItems = archives.slice(0, 2);
  const savedItems = bookmarks.filter((b) => !removed[b.id]).slice(0, 4);

  const handleUnbookmark = async (id: string, isBookmarked: boolean) => {
    setRemoved((prev) => ({ ...prev, [id]: true }));
    try {
      await toggleBookmark({ activityId: id, isBookmarked });
    } catch {
      setRemoved((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="mobile:flex pc:hidden flex-col gap-5 justify-center pt-4">
      <div className="flex flex-col gap-8">
        <MobileProfile />
        {/*snb menu */}
        <div className="flex flex-row w-full h-[35px]">
          <Link
            href="#1"
            className={clsx(
              'box-border w-full flex px-space-10 justify-center border-b-[1.5px] border-gray-30',
              snbMenu === 'my-activity' && '!border-primary-50 !border-b-[3px]',
            )}
            onClick={() => setSnbMenu('my-activity')}
          >
            <Typography type="Headline2SemiBold">MY 활동</Typography>
          </Link>
          <Link
            href="/profile/posts"
            className="box-border w-full flex px-space-10 justify-center border-b-[1.5px] border-gray-30"
          >
            <Typography type="Headline2SemiBold">작성글</Typography>
          </Link>
          <Link
            href="/profile/account/info"
            className="box-border w-full flex px-space-10 justify-center border-b-[1.5px] border-gray-30"
          >
            <Typography type="Headline2SemiBold">계정</Typography>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-[52px]">
        {/* 활동 결과 */}
        <div className="flex flex-col gap-4">
          <ContentHeader title="활동 결과" onClick={() => router.push('/calendar?tab=result')} />
          <div className="flex justify-between">
            {results.map(({ title, value }) => (
              <div
                key={title}
                className="w-[77.75px] h-[80px] flex flex-col justify-center items-center border border-gray-30 rounded-[6px]"
              >
                <Typography type="Body3Medium" className="text-gray-50">
                  {title}
                </Typography>
                <Typography type="Heading1Semibold">{value}</Typography>
              </div>
            ))}
          </div>
        </div>

        {/* 아카이브 */}
        <div className="flex flex-col gap-4">
          <ContentHeader title="아카이브" onClick={() => router.push('/profile/archive')} />
          {archiveItems.length > 0 ? (
            <div className="flex flex-col gap-[3px]">
              {archiveItems.map((item) => (
                <ListItem
                  key={item.id}
                  className="border-none"
                  thumbnail={item.thumbnail || '/imgs/cat.jpg'}
                  title={item.title}
                  isFinished
                  chipTitle={item.chipTitle}
                  organization={item.organization}
                  onListClick={() => router.push(`/profile/archive/${item.id}`)}
                />
              ))}
            </div>
          ) : (
            <EmptyText text="아직 아카이브가 없어요" />
          )}
        </div>

        {/* 저장한 공고 */}
        <div className="flex flex-col gap-4">
          <ContentHeader title="저장한 공고" onClick={() => router.push('/profile/bookmarks')} />
          {savedItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {savedItems.map((item) => (
                <Card
                  key={item.id}
                  imageUrl={item.thumbnailImage || '/imgs/cat.jpg'}
                  badgeText={item.registrationPeriod || '모집중'}
                  badgeVariant="default"
                  isBookmarked={item.isBookmarked ?? true}
                  chipText={item.activityType as CardChipProps['text']}
                  companyName={item.organizer}
                  title={item.title}
                  jobs={item.jobs as CardJobs}
                  onBookmarkClick={() => handleUnbookmark(item.id, item.isBookmarked ?? true)}
                  onCardClick={() => router.push(item.detailLink)}
                />
              ))}
            </div>
          ) : (
            <EmptyText text="저장한 공고가 없어요" />
          )}
        </div>
      </div>
    </div>
  );
}

function ContentHeader({ title, onClick }: { title: string; onClick?: () => void }) {
  return (
    <div className="w-full flex justify-between">
      <Typography type="Headline2SemiBold">{title}</Typography>
      {onClick && (
        <button type="button" onClick={onClick} className="flex flex-row items-center gap-1 cursor-pointer">
          <Typography type="Body4Medium">더보기</Typography>
          <ChevronRight width={9} height={9} />
        </button>
      )}
    </div>
  );
}

function EmptyText({ text }: { text: string }) {
  return (
    <div className="flex h-[100px] items-center justify-center">
      <Typography type="Body3Regular" className="text-gray-40">
        {text}
      </Typography>
    </div>
  );
}
