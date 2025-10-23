'use client';

import SNB from '@/components/common/SNB/SNB';
import Typography from '@/components/common/Typography';
import ChevronRight from '@/components/common/Icon/assets/ChevronRight';

import ListItem from '@/components/common/List/ListItem';

export default function ProfilePage() {
  return (
    <div className="hidden pc:flex gap-12.5 flex-row w-[1100px] px-5">
      <SNB Jobs={[]} />
      <section className="w-full flex flex-col gap-[58px]">
        <div className="flex flex-col gap-4">
          <ContentHeader title="활동 결과" onClick={() => {}} />
          <div className="flex justify-between">
            {Array.from(['지원완료', '최종합격', '불합격', '수료완료']).map((item, index) => (
              <div className="w-[178px] h-[102px] flex flex-col justify-center items-center border border-gray-30 rounded-[6px]">
                <Typography type="Body3Medium">{item}</Typography>
                <Typography type="Heading1Semibold">50</Typography>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <ContentHeader title="아카이브" onClick={() => {}} />
          <div className="grid grid-cols-2 gap-x-4">
            {Array.from(['지원완료', '최종합격', '불합격', '수료완료']).map((item, index) => (
              <ListItem thumbnail="/imgs/cat.jpg" title="리스트 아이템 제목" isFinished={true} onListClick={() => {}} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <ContentHeader title="저장한 공고" onClick={() => {}} />
          <div className="flex justify-between">
            {Array.from(['지원완료', '최종합격', '불합격', '수료완료']).map((item, index) => (
              <div className="w-[178px] h-[102px] flex flex-col justify-center items-center border border-gray-30 rounded-[6px]">
                <Typography type="Body3Medium">{item}</Typography>
                <Typography type="Heading1Semibold">50</Typography>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function ContentHeader({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <div className="w-full flex justify-between">
      <Typography type="Headline2SemiBold">{title}</Typography>
      <div className="flex flex-row items-center gap-1">
        <Typography type="Body4Medium">더보기</Typography> <ChevronRight width={18} height={18} />
      </div>
    </div>
  );
}
