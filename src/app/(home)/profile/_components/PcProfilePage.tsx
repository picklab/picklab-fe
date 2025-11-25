import SNB from '@/components/common/SNB/SNB';
import Typography from '@/components/common/Typography';
import ChevronRight from '@/components/common/Icon/assets/ChevronRight';

import ListItem from '@/components/common/List/ListItem';
import Card from '@/components/common/Card/Card';
import clsx from 'clsx';

export default function PcProfile({ isStorybook = false }: { isStorybook?: boolean }) {
  return (
    <div className={clsx('gap-[62px] w-[1100px] px-5', isStorybook ? 'flex' : 'hidden pc:flex')}>
      <SNB Jobs={[]} />
      <section className="max-w-[758px] w-full flex flex-col gap-[58px]">
        <div className="flex flex-col gap-4">
          <ContentHeader title="활동 결과" onClick={() => {}} />
          <div className="flex justify-between">
            {Array.from(['지원완료', '최종합격', '불합격', '수료완료']).map((title, index) => (
              <div
                key={index}
                className="w-[178px] h-[102px] flex flex-col justify-center items-center border border-gray-30 rounded-[6px]"
              >
                <Typography type="Body3Medium" className="text-gray-50">
                  {title}
                </Typography>
                <Typography type="Heading1Semibold">50</Typography>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <ContentHeader title="아카이브" onClick={() => {}} />
          <div className="grid grid-cols-2 gap-x-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <ListItem
                key={index}
                className="border-none"
                thumbnail="/imgs/cat.jpg"
                title="리스트 아이템 제목"
                isFinished={true}
                chipTitle="대외활동"
                organization="삼양 그룹"
                startDate={new Date('2025-05-01')}
                endDate={new Date('2025-05-15')}
                onListClick={() => {}}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <ContentHeader title="저장한 공고" onClick={() => {}} />
          <div className="flex gap-[14px] overflow-x-scroll hide-scrollbar">
            {Array.from(['지원완료', '최종합격', '불합격', '수료완료']).map((item, index) => (
              <Card
                key={index}
                imageUrl="/imgs/cat.jpg"
                badgeText="대외활동"
                badgeVariant="default"
                isBookmarked={false}
                chipText="대외활동"
                companyName="삼양 그룹"
                title="리스트 아이템 제목"
                jobs={['기획', '개발', '마케팅', '디자인', 'AI']}
                onBookmarkClick={() => {}}
                onCardClick={() => {}}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ContentHeader({ title, onClick }: { title: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className="w-full flex justify-between cursor-pointer">
      <Typography type="Headline2SemiBold">{title}</Typography>
      <div className="flex flex-row items-center gap-1">
        <Typography type="Body4Medium">더보기</Typography> <ChevronRight width={18} height={18} />
      </div>
    </div>
  );
}
