'use client';

import { useRouter } from 'next/navigation';
import Avatar from '@/components/common/GNB/pc/Avatar';
import ChevronRight from '@/components/common/Icon/assets/ChevronRight';
import Typography from '@/components/common/Typography';
import { useMe } from '@/hooks/useMe';

export default function MobileProfile() {
  const { data: meData } = useMe();
  const router = useRouter();

  return (
    <section className="flex flex-row gap-6 items-center">
      <Avatar className="w-20 h-20" scale="lg" />
      <div className="flex flex-col w-[238.5px]">
        <button
          type="button"
          onClick={() => router.push('/profile/account/info')}
          className="flex flex-row items-center gap-2 w-full py-4 text-gray-90"
        >
          <Typography type="Heading2Semibold">{meData?.nickname || '사용자'}</Typography>
          <ChevronRight width={7.5} height={13.5} />
        </button>
        <div className="flex flex-row flex-wrap gap-1 w-full text-primary-60">
          {(meData?.jobs && meData.jobs.length > 0
            ? meData.jobs
            : ['서비스기획', 'PM/PO', '프론트엔드', '사업개발', '데이터분석']
          ).map((job, index, arr) => (
            <span
              key={job}
              className={`flex items-center h-[20px] pr-3 ${index < arr.length - 1 ? 'border-r border-gray-20' : ''}`}
            >
              <Typography type="Caption1Regular">{job}</Typography>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
