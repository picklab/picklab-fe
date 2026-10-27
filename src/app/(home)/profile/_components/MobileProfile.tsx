'use client';

import { Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@/components/common/GNB/pc/Avatar';
import { Divider } from '@/components/common/Divider/Divider';
import ChevronRight from '@/components/common/Icon/assets/ChevronRight';
import Typography from '@/components/common/Typography';
import { useMe } from '@/hooks/useMe';

export default function MobileProfile() {
  const { data: meData } = useMe();
  const router = useRouter();

  return (
    // figma Profile 3025:45063: 아바타 80 ↔ 텍스트 17, 닉네임 20 SemiBold + chevron 24, 직무 12 Regular primary-60 (p2, gap 4, 구분선 1×12 gray-20)
    <section className="flex flex-row gap-[17px] items-center">
      <Avatar className="w-20 h-20" scale="lg" />
      <div className="flex flex-col w-[238.5px]">
        <button
          type="button"
          onClick={() => router.push('/profile/account/info')}
          className="flex flex-row items-center w-full h-14 pr-5 py-4 text-gray-90"
        >
          <Typography type="Heading2Semibold">{meData?.nickname || '사용자'}</Typography>
          {/* figma icon/base 24 박스 안 chevron 7.5×13.5 (좌측 9.25) */}
          <span className="flex size-6 shrink-0 items-center pl-[9.25px]">
            <ChevronRight width={7.5} height={13.5} />
          </span>
        </button>
        <div className="flex flex-row flex-wrap items-center gap-x-1 w-full text-primary-60">
          {(meData?.jobs && meData.jobs.length > 0
            ? meData.jobs
            : ['서비스기획', 'PM/PO', '프론트엔드', '사업개발', '데이터분석']
          ).map((job, index, arr) => (
            <Fragment key={job}>
              <span className="flex items-center p-0.5">
                <Typography type="Caption1Regular">{job}</Typography>
              </span>
              {index < arr.length - 1 && <Divider vertical className="!h-3" />}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
