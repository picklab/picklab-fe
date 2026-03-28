'use client';

import Button from '@/components/common/Button/Button';
import Typography from '@/components/common/Typography';
import { useState } from 'react';
import PcJobEditSection from './PcJobEditSection';
import { SignupData } from '@/app/(auth)/signup/types';
import MobileJobEditSection from './MobileJobEditSection';

const JobSection = () => {
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupData, setSignupData] = useState<SignupData>({
    terms: {
      all: false,
      age: false,
      service: false,
      privacy: false,
      marketing: false,
    },
    userInfo: {
      name: '',
      education: '',
      schoolName: '',
      major: '',
      graduationStatus: '',
      employmentStatus: '',
      companyName: '',
    },
    interests: [],
  });
  const [savedInterests, setSavedInterests] = useState<string[]>([]);

  const handleCancel = () => {
    setSignupData((prev) => ({
      ...prev,
      interests: savedInterests,
    }));
    setEditMode(false);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/members/job-categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobCategories: signupData.interests }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message =
          typeof payload?.message === 'string'
            ? payload.message
            : typeof payload?.error === 'string'
            ? payload.error
            : '관심 직무 저장에 실패했습니다.';
        window.alert(message);
        return;
      }

      setSavedInterests(signupData.interests);
      setEditMode(false);
      window.alert('관심 직무가 저장되었습니다.');
    } catch (error) {
      console.error('관심 직무 저장 중 오류 발생:', error);
      window.alert('관심 직무 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col items-center pc:rounded-[10px] pc:border pc:border-gray-30 pc:pt-[20px] pc:px-[58px] pc:pb-[45px]">
      <div className="flex flex-col items-center gap-4 pc:gap-12 w-[335px] pc:w-[420px]">
        <Typography type="Headline2SemiBold" className="w-full text-gray-90 pc:pb-[10px] pc:border-b pc:border-gray-20">
          관심 직무
        </Typography>
        {editMode ? (
          <>
            <div className="hidden pc:block">
              <PcJobEditSection signupData={signupData} setSignupData={setSignupData} />
            </div>
            <div className="block pc:hidden">
              <MobileJobEditSection signupData={signupData} setSignupData={setSignupData} />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-row flex-wrap gap-[10px]">
              {signupData.interests.map((interest, index) => (
                <span key={index} className="py-2 px-4 rounded-[100px] bg-primary-5">
                  <Typography type="Body4Medium" className="text-primary-70">
                    {interest}
                  </Typography>
                </span>
              ))}
            </div>
          </>
        )}

        {editMode ? (
          <div className="flex flex-row justify-center gap-[10px]">
            <Button label="취소하기" size="sm" buttonStyle="outlined" onClick={handleCancel} disabled={isSubmitting} />
            <Button
              label={isSubmitting ? '저장 중...' : '등록하기'}
              size="sm"
              buttonStyle="filled"
              onClick={handleSubmit}
              disabled={isSubmitting}
            />
          </div>
        ) : (
          <Button label="수정하기" size="sm" buttonStyle="outlined" onClick={() => setEditMode(true)} />
        )}
      </div>
    </section>
  );
};

export default JobSection;
