'use client';

import { useState } from 'react';
import Switch from '@/components/common/Control/Switch';
import SNB from '@/components/common/SNB/SNB';
import Typography from '@/components/common/Typography';
import clsx from 'clsx';

type NotificationType = 'POPULAR' | 'BOOKMARKED';

/**
 * 알림 설정. PATCH /api/members/notifications 는 { type } 을 받아 서버가 on/off를 토글한다.
 * ⚠️ 백엔드에 현재 알림 on/off 값을 읽을 GET이 없어(me 응답에도 없음) 초기 스위치 상태는
 *    표시하지 못한다(기본 off). 백엔드가 조회를 제공하면 마운트 시 초기값을 채울 것.
 */
export default function AlarmPage({ isStorybook = false }: { isStorybook?: boolean }) {
  const [popular, setPopular] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [pending, setPending] = useState<NotificationType | null>(null);

  const toggle = async (type: NotificationType, next: boolean) => {
    if (pending) return;
    const setLocal = type === 'POPULAR' ? setPopular : setBookmarked;
    setLocal(next); // 낙관적 업데이트
    setPending(type);
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
      setPending(null);
    }
  };

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
              <Switch
                checked={popular}
                disabled={pending === 'POPULAR'}
                onChange={(e) => toggle('POPULAR', e.target.checked)}
              />
            </div>
            <div className="flex flex-row justify-between py-1 w-full">
              <div className="w-full flex flex-col gap-1">
                <Typography type="Headline2SemiBold">저장한 공고</Typography>
                <Typography type="Caption1Regular" className="text-gray-60">
                  사용자의 관심 직무 관련 인기 공고의 알림입니다.
                </Typography>
              </div>
              <Switch
                checked={bookmarked}
                disabled={pending === 'BOOKMARKED'}
                onChange={(e) => toggle('BOOKMARKED', e.target.checked)}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
