import Switch from '@/components/common/Control/Switch';
import SNB from '@/components/common/SNB/SNB';
import Typography from '@/components/common/Typography';
import clsx from 'clsx';

export default function AlarmPage({ isStorybook = false }: { isStorybook?: boolean }) {
  return (
    <div className={clsx('gap-12.5 flex-row w-[1100px] px-5', isStorybook ? 'flex' : 'hidden pc:flex')}>
      <SNB Jobs={[]} />

      {/* 알림 관리 섹션 */}
      <section className="flex flex-col gap-12 items-end">
        <div className="w-[750px] ml-10 px-10 py-8 border border-gray-20 rounded-[10px] flex flex-col gap-8">
          <div className="w-full flex flex-col pb-3 border-b border-gray-20">
            <Typography type="Heading1Semibold" className="text-gray-90">
              알림 관리
            </Typography>
          </div>
          <div className="w-full flex flex-col gap-5">
            <div className="w-full flex flex-row justify-between py-1">
              <div className="w-full flex flex-col gap-1">
                <Typography type="Headline2SemiBold" className="text-gray-100">
                  인기 공고
                </Typography>
                <Typography type="Caption1Regular" className="text-gray-60">
                  사용자의 관심 직무 관련 인기 공고의 알림입니다.
                </Typography>
              </div>
              <Switch />
            </div>
            <div className="flex flex-row justify-between py-1 w-full">
              <div className="w-full flex flex-col gap-1">
                <Typography type="Headline2SemiBold">저장한 공고</Typography>
                <Typography type="Caption1Regular" className="text-gray-60">
                  사용자의 관심 직무 관련 인기 공고의 알림입니다.
                </Typography>
              </div>
              <Switch />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
