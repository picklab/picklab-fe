'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button/Button';
import CheckBoxLabel from '@/components/common/CheckBox/CheckBoxLabel';
import RadioLabel from '@/components/common/Control/RadioLabel';
import Typography from '@/components/common/Typography';
import { useAuthClient } from '@/contexts/AuthContext';

type WithdrawalReason =
  | 'LACK_OF_CONTENT'
  | 'LOW_TRUST'
  | 'HARD_TO_USE'
  | 'USING_OTHER_SERVICE'
  | 'TOO_MANY_ERRORS'
  | 'ETC';

const REASONS: { id: string; value: WithdrawalReason; label: string }[] = [
  { id: 'reason-1', value: 'LACK_OF_CONTENT', label: '원하는 활동 정보가 부족해요' },
  { id: 'reason-2', value: 'LOW_TRUST', label: '리뷰/정보 신뢰도가 낮다고 느꼈어요.' },
  { id: 'reason-3', value: 'HARD_TO_USE', label: '이용 방법이 복잡하거나 불편했어요.' },
  { id: 'reason-4', value: 'USING_OTHER_SERVICE', label: '비슷한 다른 서비스를 이용하고 있어요.' },
  { id: 'reason-5', value: 'TOO_MANY_ERRORS', label: '서비스 오류나 버그가 많았어요.' },
  { id: 'reason-6', value: 'ETC', label: '기타' },
];

export default function WithdrawPage() {
  const router = useRouter();
  const { clientLogout } = useAuthClient();
  const [agreed, setAgreed] = useState(false);
  const [reason, setReason] = useState<WithdrawalReason | ''>('');
  const [submitting, setSubmitting] = useState(false);

  const handleWithdraw = async () => {
    if (submitting) return;
    if (!agreed) {
      window.alert('안내사항을 확인하고 동의해 주세요.');
      return;
    }
    if (!reason) {
      window.alert('탈퇴 사유를 선택해 주세요.');
      return;
    }
    if (!window.confirm('정말 탈퇴하시겠어요? 탈퇴 후에는 계정을 복구할 수 없습니다.')) return;

    setSubmitting(true);
    try {
      // 1) 탈퇴 설문 제출
      const surveyRes = await fetch('/api/members/withdrawal-survey', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!surveyRes.ok) throw new Error('탈퇴 설문 제출에 실패했습니다.');

      // 2) 회원 탈퇴
      const deleteRes = await fetch('/api/members', { method: 'DELETE', credentials: 'include' });
      if (!deleteRes.ok) throw new Error('회원 탈퇴에 실패했습니다.');

      // 3) 세션 정리 후 로그인 화면으로
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      clientLogout();
      router.push('/signin');
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '회원 탈퇴 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-[1440px]">
      <div className="w-full max-w-[460px] flex flex-col gap-10 pt-10 pb-30 mx-auto">
        <div className="w-full flex flex-col gap-12">
          {/*회원 탈퇴 안내 */}
          <section className="flex flex-col w-full gap-[38px] pc:pb-12 pc:border-b pc:border-gray-20">
            <div className="w-full flex flex-col items-center gap-2">
              <Typography type="Title2Bold">탈퇴안내</Typography>
              <Typography type="Body2Medium">PICKLAB 회원탈퇴를 신청하기 전 안내사항을 꼭 확인해주세요!</Typography>
            </div>
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex flex-col gap-1 py-[22px] px-5 rounded-[8px] bg-gray-10">
                <Typography type="Body2Semibold">탈퇴한 계정은 복구 및 재사용이 불가능</Typography>
                <Typography type="Caption2Regular">
                  본인을 포함해 누구도 다시 사용할 수 없으니 신중하게 결정해 주세요.
                </Typography>
              </div>
              <div className="w-full flex flex-col gap-1 py-[22px] px-5 rounded-[8px] bg-gray-10">
                <Typography type="Body2Semibold">개인정보 및 이용 기록 복구 불가능</Typography>
                <Typography type="Caption2Regular">
                  회원님의 개인정보 및 이용 기록은 모두 삭제되며 복구할 수 없습니다.
                </Typography>
              </div>
              <div className="w-full flex flex-col gap-1 py-[22px] px-5 rounded-[8px] bg-gray-10">
                <Typography type="Body2Semibold">리뷰와 댓글은 직접 삭제</Typography>
                <Typography type="Caption2Regular">
                  PICKLAB에 작성하신 리뷰와 댓글은 탈퇴 후에도 남아 있으니 필요한 경우 직접 삭제해 주세요.
                </Typography>
              </div>
              <div className="w-full flex flex-col gap-1 py-[22px] px-5 rounded-[8px] bg-gray-10">
                <Typography type="Body2Semibold">개인정보는 탈퇴 후 30일간만 보관</Typography>
                <Typography type="Caption2Regular">
                  개인정보는 탈퇴일로부터 30일간 보관 후 개인정보처리방침에 따라 안전하게 삭제됩니다.
                </Typography>
              </div>
            </div>
            <CheckBoxLabel
              id="withdrawal-agreement"
              value="agree"
              label="위 안내사항을 확인했으며, 동의합니다."
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
          </section>

          {/*회원 탈퇴 사유 */}
          <section className="flex flex-col w-full gap-12">
            <div className="w-full flex flex-col gap-2 items-center">
              <Typography type="Title2Bold">탈퇴사유</Typography>
              <Typography type="Body2Medium">PICKLAB을 탈퇴하시는 이유를 알려주세요.</Typography>
            </div>
            <div className="flex flex-col gap-5 w-full">
              {REASONS.map((item) => (
                <RadioLabel
                  key={item.id}
                  label={item.label}
                  id={item.id}
                  name="withdrawal-reason"
                  value={item.value}
                  checked={reason === item.value}
                  onChange={() => setReason(item.value)}
                />
              ))}
            </div>
          </section>
          <div className="w-full flex flex-row gap-[10px]">
            <Button
              size="lg"
              buttonStyle="outlined"
              label="취소"
              className="flex-grow"
              onClick={() => router.push('/profile/account/info')}
            />
            <Button
              size="lg"
              buttonStyle="filled"
              label="탈퇴하기"
              className="flex-grow"
              disabled={submitting}
              onClick={handleWithdraw}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
