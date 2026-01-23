'use client';

import Button from '@/components/common/Button/Button';
import Switch from '@/components/common/Control/Switch';
import SNB from '@/components/common/SNB/SNB';
import TextLink from '@/components/common/TextLink/TextLink';
import Typography from '@/components/common/Typography';
import { useRouter } from 'next/navigation';

export default function PcAccountPage() {
  const router = useRouter();

  return (
    <div className="hidden pc:flex gap-12.5 flex-row w-[1100px] px-5">
      <SNB Jobs={[]} />

      {/* 계정 관리 섹션 */}
      <section className="flex flex-col gap-12 items-end">
        <div className="w-[750px] ml-10 px-10 py-8 border border-gray-20 rounded-[10px] flex flex-col gap-8">
          <div className="w-full flex flex-col pb-3 border-b border-gray-20">
            <Typography type="Heading1Semibold" className="text-gray-90">
              계정 관리
            </Typography>
          </div>
          <div className="w-full flex flex-col gap-5">
            <div className="w-full flex flex-row justify-between py-1">
              <div className="w-full flex flex-col gap-1">
                <Typography type="Headline2SemiBold" className="text-gray-100">
                  이메일
                </Typography>
                <Typography type="Body3Medium" className="text-gray-60">
                  kjyook01@gmail.com
                </Typography>
              </div>
              <Button
                size="sm"
                buttonStyle="outlined"
                label="변경하기"
                isFullRounded={true}
                onClick={() => router.push('/change-email')}
              />
            </div>
            <div className="flex flex-row justify-between py-1 w-full">
              <div className="w-full flex flex-col gap-1">
                <Typography type="Headline2SemiBold">이메일 마케팅 수신 동의</Typography>
                <Typography type="Caption1Regular" className="text-gray-60">
                  이벤트, 혜택, 신규 서비스를 알려드립니다.
                </Typography>
              </div>
              <Switch />
            </div>
          </div>
        </div>
        <TextLink text="회원 탈퇴" href="/profile/account/withdraw" />
      </section>
    </div>
  );
}
