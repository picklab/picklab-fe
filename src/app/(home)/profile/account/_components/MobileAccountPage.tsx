'use client';

import { useState } from 'react';
import Button from '@/components/common/Button/Button';
import Switch from '@/components/common/Control/Switch';
import Avatar from '@/components/common/GNB/pc/Avatar';
import ChevronRight from '@/components/common/Icon/assets/ChevronRight';
import TextLink from '@/components/common/TextLink/TextLink';
import Typography from '@/components/common/Typography';
import { useMe } from '@/hooks/useMe';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/**
 * 이메일 마케팅 수신 동의.
 * ⚠️ 백엔드에 현재 동의 여부를 읽을 GET이 없어(me 응답에도 없음) 초기 스위치 상태는
 *    기본 off로 시작한다. 백엔드가 조회를 제공하면 마운트 시 초기값을 채울 것.
 */
export default function MobileAccountPage() {
  const [snbMenu, setSnbMenu] = useState<'my-activity' | 'my-post' | 'account'>('my-activity');
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
    <div className="block pc:hidden w-full flex flex-col items-center gap-8">
      {/* 프로필 */}
      <section className="flex flex-row gap-4 items-center">
        <Avatar className="w-20 h-20" scale="lg" />
        <div className="flex flex-col w-[238.5px]">
          <button className="flex flex-row items-center gap-2 w-full py-4 text-gray-90">
            <Typography type="Heading2Semibold">
              {loading ? '' : (me?.name ?? '')}
            </Typography>
            <ChevronRight width={7.5} height={13.5} />
          </button>
          {/*TODO: 메뉴 1,2,3.. 코딩 해둔거 수정하면서 마지막 menu만 map 함수에서 -> border 없이 or Divder 활용 && hidden */}
          <div className="flex flex-row flex-wrap gap-1 w-full text-primary-60">
            <span className="flex items-center h-[20px] pr-3 border-r border-gray-20">
              <Typography type="Caption1Regular">메뉴 1</Typography>
            </span>
            <span className="flex items-center h-[20px] pr-3 border-r border-gray-20">
              <Typography type="Caption1Regular">메뉴 2</Typography>
            </span>
            <span className="flex items-center h-[20px] pr-3 border-r border-gray-20">
              <Typography type="Caption1Regular">메뉴 3</Typography>
            </span>
            <span className="flex items-center h-[20px] pr-3 border-r border-gray-20">
              <Typography type="Caption1Regular">메뉴 4</Typography>
            </span>
            <span className="flex items-center h-[20px] pr-3">
              <Typography type="Caption1Regular">메뉴 5</Typography>
            </span>
          </div>
        </div>
      </section>

      {/*snb menu */}
      <div className="flex flex-row w-full">
        <Link
          href="#1"
          id="my-activity"
          className={clsx(
            'box-border w-full flex px-space-10 h-space-48 justify-center border-b-[1.5px] border-gray-30',
            snbMenu === 'my-activity' && '!border-primary-50 !border-b-[3px]',
          )}
          onClick={() => setSnbMenu('my-activity')}
        >
          <Typography type="Headline2SemiBold">MY 활동</Typography>
        </Link>
        <Link
          href="#2"
          id="my-post"
          className={clsx(
            'box-border w-full flex px-space-10 h-space-48 justify-center border-b-[1.5px] border-gray-30',
            snbMenu === 'my-post' && '!border-primary-50 !border-b-[3px]',
          )}
          onClick={() => setSnbMenu('my-post')}
        >
          <Typography type="Headline2SemiBold">게시물</Typography>
        </Link>
        <Link
          href="#3"
          id="account"
          className={clsx(
            'box-border w-full flex px-space-10 h-space-48 justify-center border-b-[1.5px] border-gray-30',
            snbMenu === 'account' && '!border-primary-50 !border-b-[3px]',
          )}
          onClick={() => setSnbMenu('account')}
        >
          <Typography type="Headline2SemiBold">계정</Typography>
        </Link>
      </div>

      {/*알림 관리 */}
      <section className="w-full flex flex-col gap-5 w-full p-4 border border-gray-20 rounded-[10px]">
        <div className="pb-3 border-b border-gray-20">
          <Typography type="Heading2Semibold">알림 관리</Typography>
        </div>
        <div className="flex flex-col gap-5">
          <div className="w-full flex flex-row justify-between py-1">
            <div className="flex flex-col gap-1">
              <Typography type="Headline2SemiBold">인기 공고</Typography>
              <Typography type="Caption1Regular" className="text-gray-60">
                사용자의 관심 직무 관련 인기 공고의 알림입니다.
              </Typography>
            </div>
            <div>
              <Switch />
            </div>
          </div>
          <div className="w-full flex flex-row justify-between py-1">
            <div className="flex flex-col gap-1">
              <Typography type="Headline2SemiBold">저장한 공고</Typography>
              <Typography type="Caption1Regular" className="text-gray-60">
                사용자의 관심 직무 관련 저장한 공고의 알림입니다.
              </Typography>
            </div>
            <div>
              <Switch />
            </div>
          </div>
        </div>
      </section>

      {/*계정 관리 */}
      <section className="w-full flex flex-col gap-7 items-end">
        <div className="flex flex-col gap-5 w-full p-4 border border-gray-20 rounded-[10px]">
          <div className="pb-3 border-b border-gray-20">
            <Typography type="Heading2Semibold">계정 관리</Typography>
          </div>
          <div className="flex flex-col gap-5">
            <div className="w-full flex flex-row justify-between py-1">
              <div className="flex flex-col gap-1">
                <Typography type="Headline2SemiBold">이메일</Typography>
                <Typography type="Body3Medium" className="text-gray-60">
                  {loading ? '' : (me?.email ?? '')}
                </Typography>
              </div>
              <div>
                <Button
                  size="sm"
                  buttonStyle="outlined"
                  label="변경하기"
                  isFullRounded={true}
                  onClick={() => router.push('/change-email')}
                />
              </div>
            </div>
            <div className="w-full flex flex-row justify-between py-1">
              <div className="flex flex-col gap-1">
                <Typography type="Headline2SemiBold">이메일 마케팅 수신 동의</Typography>
                <Typography type="Caption1Regular" className="text-gray-60">
                  이벤트, 혜택, 신규 서비스를 알려드립니다.
                </Typography>
              </div>
              <div>
                <Switch
                  checked={emailAgreement}
                  disabled={pending}
                  onChange={(e) => toggleEmailAgreement(e.target.checked)}
                />
              </div>
            </div>
          </div>
        </div>
        <TextLink text="회원 탈퇴" href="/profile/account/withdraw" />
      </section>
    </div>
  );
}
