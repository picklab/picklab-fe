'use client';

import { useState } from 'react';
import Typography from '@/components/common/Typography';
import type { ActivityCardItem } from '@/app/(home)/_components/constant';
import { useReviewWriteForm } from './useReviewWriteForm';
import { ConfirmDialog, ReviewWriteHeader } from './ReviewWriteShared';
import { Step1, Step2, Step3 } from './ReviewSteps';
import ActivityChangeModal from './ActivityChangeModal';
import CertificationUploadModal from './CertificationUploadModal';

interface ReviewWriteBodyProps {
  activity: ActivityCardItem;
  activityId: string;
}

function FooterButton({
  label,
  variant,
  onClick,
  disabled,
}: {
  label: string;
  variant: 'gray' | 'green';
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        variant === 'green'
          ? 'h-space-48 w-full rounded-small bg-primary-50 hover:bg-primary-60 disabled:bg-gray-10'
          : 'h-space-48 w-full rounded-small bg-gray-5 hover:bg-gray-10 disabled:opacity-60'
      }
    >
      <Typography type="Body2Medium" className={variant === 'green' ? 'text-gray-0' : 'text-gray-90'}>
        {label}
      </Typography>
    </button>
  );
}

export default function ReviewWriteBody({ activity, activityId }: ReviewWriteBodyProps) {
  const form = useReviewWriteForm({ activity, activityId });
  const { step, goNext, goPrev, leave, validateStep3, validateFile, uploadFile, submit, submitting } = form;

  const [leaveOpen, setLeaveOpen] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const handleRegisterWithoutCert = () => {
    if (validateStep3()) submit();
  };

  const handleOpenUpload = () => {
    if (validateStep3()) setUploadOpen(true);
  };

  const handleRegisterWithCert = async (file: File) => {
    const url = await uploadFile(file);
    if (!url) return;
    await submit(url);
    setUploadOpen(false);
  };

  return (
    <>
      <ReviewWriteHeader onClose={() => setLeaveOpen(true)} />

      <div className="mx-auto w-full max-w-[600px] px-4 py-8 pb-28 pc:pb-8">
        {step === 1 && <Step1 form={form} onOpenChangeModal={() => setChangeOpen(true)} />}
        {step === 2 && <Step2 form={form} />}
        {step === 3 && <Step3 form={form} />}

        {/* 모바일: 하단 고정 / PC: 인라인 */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-20 bg-gray-0 px-4 py-3 pc:static pc:mt-space-40 pc:border-0 pc:bg-transparent pc:p-0">
          <div className="mx-auto flex w-full max-w-[600px] gap-2">
            {step === 1 && (
              <>
                <FooterButton label="나가기" variant="gray" onClick={() => setLeaveOpen(true)} />
                <FooterButton label="다음" variant="green" onClick={goNext} />
              </>
            )}
            {step === 2 && (
              <>
                <FooterButton label="이전으로" variant="gray" onClick={goPrev} />
                <FooterButton label="다음" variant="green" onClick={goNext} />
              </>
            )}
            {step === 3 && (
              <>
                <FooterButton
                  label="인증없이 등록"
                  variant="gray"
                  onClick={handleRegisterWithoutCert}
                  disabled={submitting}
                />
                <FooterButton label="인증하기" variant="green" onClick={handleOpenUpload} disabled={submitting} />
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={leaveOpen}
        title="지금 나가면 내용이 사라져요!"
        description="입력하신 정보는 저장되지 않습니다."
        cancelLabel="나가기"
        confirmLabel="계속 작성하기"
        onCancel={leave}
        onConfirm={() => setLeaveOpen(false)}
      />

      {changeOpen && (
        <ActivityChangeModal
          onClose={() => setChangeOpen(false)}
          onApply={(nextActivity, nextActivityId) => form.changeActivity(nextActivity, nextActivityId)}
        />
      )}

      {uploadOpen && (
        <CertificationUploadModal
          submitting={submitting}
          validateFile={validateFile}
          onPrev={() => setUploadOpen(false)}
          onClose={() => setUploadOpen(false)}
          onRegister={handleRegisterWithCert}
        />
      )}
    </>
  );
}
