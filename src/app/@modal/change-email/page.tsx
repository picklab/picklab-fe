'use client';

import { useState } from 'react';
import Button from '@/components/common/Button/Button';
import TextField from '@/components/common/Field/TextField';
import CustomModal from '@/components/common/Modal/CustomModal';
import useModal from '@/hooks/useModal';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldState = { status: 'default' | 'error' | 'success'; message?: string };

/**
 * 이메일 변경: 인증요청(POST /api/members/email/code/send) → 확인하기(POST /api/members/email/code/verify)
 * 검증 성공 시 곧바로 변경 적용(POST /api/members/email) 후 모달을 닫는다.
 * ※ footer 취소/확인(CustomModal 기본)은 모두 닫기 동작. 최종 변경은 "확인하기"에서 처리한다.
 */
export default function Page() {
  const { closeModal } = useModal();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailField, setEmailField] = useState<FieldState>({ status: 'default' });
  const [codeField, setCodeField] = useState<FieldState>({ status: 'default' });

  const handleSendCode = async () => {
    if (!EMAIL_RE.test(email.trim())) {
      setEmailField({ status: 'error', message: '올바른 이메일 형식을 입력해주세요.' });
      return;
    }
    setSending(true);
    setEmailField({ status: 'default' });
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

  const handleVerifyAndChange = async () => {
    if (!code.trim()) {
      setCodeField({ status: 'error', message: '인증번호를 입력해주세요.' });
      return;
    }
    setSubmitting(true);
    setCodeField({ status: 'default' });
    try {
      const verifyRes = await fetch('/api/members/email/code/verify', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      if (!verifyRes.ok) {
        setCodeField({ status: 'error', message: '인증번호가 일치하지 않아요.' });
        return;
      }
      const changeRes = await fetch('/api/members/email', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!changeRes.ok) throw new Error('이메일 변경에 실패했습니다.');
      window.alert('이메일이 변경되었어요.');
      closeModal();
    } catch (error) {
      setCodeField({ status: 'error', message: error instanceof Error ? error.message : '오류가 발생했습니다.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomModal isOpen onClose={closeModal} onSuccess={() => {}} title="이메일 변경" width={532} backdropClose={false}>
      <div className="flex flex-col w-full gap-5">
        <div className="flex flex-row gap-[7px] items-start w-full">
          <TextField
            id="change-email-address"
            labelStatus="default"
            status={emailField.status}
            label="이메일 인증"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            helpMessage={emailField.message}
          />
          <Button
            label={codeSent ? '재요청' : '인증요청'}
            size="lg"
            buttonStyle="outlined"
            disabled={sending || email.trim().length === 0}
            onClick={handleSendCode}
          />
        </div>
      </div>

      <div className="flex flex-col w-full gap-5">
        <div className="flex flex-row gap-[7px] items-start w-full">
          <TextField
            id="change-email-code"
            labelStatus="default"
            status={codeField.status}
            label="인증번호"
            placeholder="인증번호를 입력해주세요"
            value={code}
            disabled={!codeSent}
            onChange={(e) => setCode(e.target.value)}
            helpMessage={codeField.message}
          />
          <Button
            label="확인하기"
            size="lg"
            buttonStyle="outlined"
            disabled={!codeSent || submitting || code.trim().length === 0}
            onClick={handleVerifyAndChange}
          />
        </div>
      </div>
    </CustomModal>
  );
}
