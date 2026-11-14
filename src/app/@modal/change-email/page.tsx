'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/common/Button/Button';
import TextField from '@/components/common/Field/TextField';
import Typography from '@/components/common/Typography';
import useModal from '@/hooks/useModal';
import { useQueryClient } from '@tanstack/react-query';
import { ME_QUERY_KEY } from '@/hooks/useMe';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 공용 Button lg 라벨은 20px이라 시안 버튼(17px, Headline/2/Medium)에 맞춰 이 팝업에서만 덮어쓴다
const BUTTON_LABEL_17 = '[&>*]:!text-sm [&>*]:!leading-[1.412]';

type FieldState = { status: 'default' | 'error' | 'success'; message?: string };

/**
 * 이메일 변경 팝업 (PC figma 3025:44912 / 모바일 3025:45017)
 * 인증요청(POST /api/members/email/code/send) → 확인하기(POST /api/members/email/code/verify)
 * → 변경 완료(POST /api/members/email). 인증이 확인돼야 변경 완료를 누를 수 있다.
 */
export default function Page() {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailField, setEmailField] = useState<FieldState>({ status: 'default' });
  const [codeField, setCodeField] = useState<FieldState>({ status: 'default' });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeModal]);

  const handleSendCode = async () => {
    if (!EMAIL_RE.test(email.trim())) {
      setEmailField({ status: 'error', message: '올바른 이메일 형식을 입력해주세요.' });
      return;
    }
    setSending(true);
    setEmailField({ status: 'default' });
    // 이메일을 다시 보내면 이전 인증은 무효
    setVerified(false);
    setCode('');
    setCodeField({ status: 'default' });
    try {
      const res = await fetch('/api/members/email/code/send', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error('인증번호 전송에 실패했습니다.');
      setCodeSent(true);
      setEmailField({ status: 'success', message: '인증번호를 전송했어요.' });
    } catch (error) {
      setEmailField({ status: 'error', message: error instanceof Error ? error.message : '오류가 발생했습니다.' });
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    if (!code.trim()) {
      setCodeField({ status: 'error', message: '인증번호를 입력해주세요.' });
      return;
    }
    setVerifying(true);
    setCodeField({ status: 'default' });
    try {
      const res = await fetch('/api/members/email/code/verify', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      if (!res.ok) {
        setCodeField({ status: 'error', message: '인증번호가 일치하지 않아요.' });
        return;
      }
      setVerified(true);
      setCodeField({ status: 'success', message: '인증되었어요.' });
    } catch (error) {
      setCodeField({ status: 'error', message: error instanceof Error ? error.message : '오류가 발생했습니다.' });
    } finally {
      setVerifying(false);
    }
  };

  const handleChange = async () => {
    if (!verified) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/members/email', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error('이메일 변경에 실패했습니다.');
      // 계정 관리 화면의 이메일에 바로 반영
      queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
      window.alert('이메일이 변경되었어요.');
      closeModal();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-dimmed-85"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-email-title"
    >
      <div className="flex w-[532px] flex-col items-center gap-11 rounded-[12px] bg-gray-0 px-14 py-[26px] mobile:w-[335px] mobile:gap-5 mobile:px-[22.5px]">
        <Typography
          tag="h1"
          type="Heading1Semibold"
          id="change-email-title"
          className="text-gray-90 mobile:!text-lg mobile:!leading-[1.4]"
        >
          이메일 변경
        </Typography>

        <div className="flex w-full flex-col gap-5">
          <div className="flex h-[104px] w-full flex-row items-center gap-[7px] mobile:h-auto mobile:items-start">
            <div className="h-full min-w-0 flex-1">
              <TextField
                id="change-email-address"
                labelStatus="default"
                status={emailField.status}
                label="이메일 인증"
                placeholder="이메일을 입력해주세요"
                value={email}
                onChange={(e) => {
                  // 이메일을 바꾸면 이전 이메일로 받은 인증번호·인증 결과를 버리고 인증요청부터 다시 하게 한다
                  setEmail(e.target.value);
                  setCodeSent(false);
                  setVerified(false);
                  setCode('');
                  setCodeField({ status: 'default' });
                  setEmailField({ status: 'default' });
                }}
                helpMessage={emailField.message}
                className="!w-full"
              />
            </div>
            <Button
              label={codeSent ? '재요청' : '인증요청'}
              size="lg"
              buttonStyle="outlined"
              className={`shrink-0 mobile:mt-6 ${BUTTON_LABEL_17}`}
              disabled={sending || email.trim().length === 0}
              onClick={handleSendCode}
            />
          </div>

          <div className="flex h-[104px] w-full flex-row items-center gap-[7px] mobile:h-auto mobile:items-start">
            <div className="h-full min-w-0 flex-1">
              <TextField
                id="change-email-code"
                labelStatus="default"
                status={codeField.status}
                label="인증번호"
                placeholder="인증번호를 입력해주세요"
                value={code}
                disabled={!codeSent || verified}
                onChange={(e) => setCode(e.target.value)}
                helpMessage={codeField.message}
                className="!w-full"
              />
            </div>
            <Button
              label="확인하기"
              size="lg"
              buttonStyle="outlined"
              className={`shrink-0 mobile:mt-6 ${BUTTON_LABEL_17}`}
              disabled={!codeSent || verified || verifying || code.trim().length === 0}
              onClick={handleVerify}
            />
          </div>
        </div>

        <div className="flex flex-row items-center justify-center gap-[10px] mobile:w-full">
          <button
            type="button"
            onClick={closeModal}
            className="flex h-12 w-[110px] items-center justify-center rounded-small bg-gray-10 mobile:w-auto mobile:flex-1"
          >
            <Typography type="Headline2Medium" className="text-gray-50">
              취소하기
            </Typography>
          </button>
          <Button
            label="변경 완료"
            size="lg"
            buttonStyle="filled"
            className={`w-[110px] mobile:w-auto mobile:flex-1 ${BUTTON_LABEL_17}`}
            disabled={!verified || submitting}
            onClick={handleChange}
          />
        </div>
      </div>
    </div>
  );
}
