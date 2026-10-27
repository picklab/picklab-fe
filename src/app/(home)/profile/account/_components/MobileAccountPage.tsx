'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/common/Button/Button';
import Switch from '@/components/common/Control/Switch';
import TextLink from '@/components/common/TextLink/TextLink';
import Typography from '@/components/common/Typography';
import { useMe } from '@/hooks/useMe';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MobileProfile from '../../_components/MobileProfile';

/**
 * 이메일 마케팅 수신 동의 / 알림 설정.
 * 초기값은 GET /v1/members/me 의 email_agreement, notification_preferences 로 채운다(useMe).
 */
export default function MobileAccountPage() {
  const router = useRouter();
  const { data: me, loading } = useMe();

  const [emailAgreement, setEmailAgreement] = useState(false);
  const [pending, setPending] = useState(false);

  // 알림 설정(인기 공고/저장한 공고)
  const [popular, setPopular] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [notiPending, setNotiPending] = useState<'POPULAR' | 'BOOKMARKED' | null>(null);

  // me 로드 시 초기값 동기화
  useEffect(() => {
    if (!me) return;
    setEmailAgreement(me.emailAgreement);
    setPopular(me.notificationPreferences.popular);
    setBookmarked(me.notificationPreferences.bookmarked);
  }, [me]);

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

  // 알림 토글: 백엔드는 type 만 받아 현재값을 뒤집는다(PATCH /v1/members/notifications)
  const toggleNotification = async (type: 'POPULAR' | 'BOOKMARKED', next: boolean) => {
    if (notiPending) return;
    const setLocal = type === 'POPULAR' ? setPopular : setBookmarked;
    setLocal(next); // 낙관적 업데이트
    setNotiPending(type);
    try {
      const res = await fetch('/api/members/notifications', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      if (!res.ok) throw new Error('알림 설정 변경에 실패했습니다.');
    } catch (error) {
      setLocal(!next); // 실패 시 롤백
      window.alert(error instanceof Error ? error.message : '알림 설정 변경 중 오류가 발생했습니다.');
    } finally {
      setNotiPending(null);
    }
  };

  return (
    <div className="block pc:hidden w-full flex flex-col items-center gap-8">
      {/* 프로필 — 마이페이지 모바일과 같은 컴포넌트(닉네임·관심직무·회원정보 이동) */}
      <MobileProfile />

      {/*snb menu — 계정 페이지이므로 '계정' 탭 활성 */}
      <div className="flex flex-row w-full">
        {[
          { href: '/profile', label: 'MY 활동' },
          { href: '/profile/posts', label: '작성글' },
          { href: '/profile/account', label: '계정' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              'box-border w-full flex px-space-10 h-space-48 justify-center border-b-[1.5px] border-gray-30',
              href === '/profile/account' && '!border-primary-50 !border-b-[3px]',
            )}
          >
            <Typography type="Headline2SemiBold">{label}</Typography>
          </Link>
        ))}
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
              <Switch
                checked={popular}
                disabled={notiPending === 'POPULAR'}
                onChange={(e) => toggleNotification('POPULAR', e.target.checked)}
              />
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
              <Switch
                checked={bookmarked}
                disabled={notiPending === 'BOOKMARKED'}
                onChange={(e) => toggleNotification('BOOKMARKED', e.target.checked)}
              />
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
