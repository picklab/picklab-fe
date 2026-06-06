'use client';

import { useState } from 'react';
import Button from '@/components/common/Button/Button';
import Switch from '@/components/common/Control/Switch';
import SNB from '@/components/common/SNB/SNB';
import TextLink from '@/components/common/TextLink/TextLink';
import Typography from '@/components/common/Typography';
import { useMe } from '@/hooks/useMe';
import { useRouter } from 'next/navigation';

/**
 * 이메일 마케팅 수신 동의.
 * ⚠️ 백엔드에 현재 동의 여부를 읽을 GET이 없어(me 응답에도 없음) 초기 스위치 상태는
 *    기본 off로 시작한다. 백엔드가 조회를 제공하면 마운트 시 초기값을 채울 것.
 */
export default function PcAccountPage() {
  const router = useRouter();
  const { data: me, loading } = useMe();

  const [emailAgreement, setEmailAgreement] = useState(false);
  const [pending, setPending] = useState(false);

  const toggleEmailAgreement = async (next: boolean) => {
    if (pending) return;
    setEmailAgreement(next); // 낙관적 업데이트
    setPending(true);
    try {
      const res = await fetch('/api/members/email-agreement', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_agreement: next }),
      });
      if (!res.ok) throw new Error('이메일 마케팅 수신 동의 변경에 실패했습니다.');
    } catch (error) {
      setEmailAgreement(!next); // 실패 시 롤백
      window.alert(error instanceof Error ? error.message : '이메일 마케팅 수신 동의 변경 중 오류가 발생했습니다.');
    } finally {
      setPending(false);
    }
  };

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
                  {loading ? '' : (me?.email ?? '')}
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
              <Switch
                checked={emailAgreement}
                disabled={pending}
                onChange={(e) => toggleEmailAgreement(e.target.checked)}
              />
            </div>
          </div>
        </div>
        <TextLink text="회원 탈퇴" href="/profile/account/withdraw" />
      </section>
    </div>
  );
}
