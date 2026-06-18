'use client';

import Button from '@/components/common/Button/Button';
import Typography from '@/components/common/Typography';
import { useState, useEffect } from 'react';
import PcJobEditSection from './PcJobEditSection';
import { SignupData } from '@/app/(auth)/signup/types';
import MobileJobEditSection from './MobileJobEditSection';
import { useMe } from '@/hooks/useMe';

const JOB_CATEGORY_MAP: Record<string, { group: string; detail: string }> = {
  'service-planning': { group: 'PLANNING', detail: 'SERVICE_PLANNING' },
  'business-development': { group: 'PLANNING', detail: 'BUSINESS_DEVELOPMENT' },
  'data-analysis': { group: 'PLANNING', detail: 'DATA_ANALYSIS' },
  'pm-po': { group: 'PLANNING', detail: 'PM_PO' },
  'ux-design': { group: 'DESIGN', detail: 'UX_DESIGN' },
  'ui-design': { group: 'DESIGN', detail: 'UI_DESIGN' },
  'web-design': { group: 'DESIGN', detail: 'WEB_DESIGN' },
  'graphic-design': { group: 'DESIGN', detail: 'GRAPHIC_DESIGN' },
  'brand-design': { group: 'DESIGN', detail: 'BRAND_DESIGN' },
  frontend: { group: 'DEVELOPMENT', detail: 'FRONTEND' },
  backend: { group: 'DEVELOPMENT', detail: 'BACKEND' },
  fullstack: { group: 'DEVELOPMENT', detail: 'FULLSTACK' },
  security: { group: 'DEVELOPMENT', detail: 'SECURITY' },
  devops: { group: 'DEVELOPMENT', detail: 'DEVOPS' },
  ios: { group: 'DEVELOPMENT', detail: 'IOS' },
  android: { group: 'DEVELOPMENT', detail: 'ANDROID' },
  blockchain: { group: 'DEVELOPMENT', detail: 'BLOCKCHAIN' },
  game: { group: 'DEVELOPMENT', detail: 'GAME' },
  'brand-marketing': { group: 'MARKETING', detail: 'BRAND_MARKETING' },
  'content-marketing': { group: 'MARKETING', detail: 'CONTENT_MARKETING' },
  'growth-marketing': { group: 'MARKETING', detail: 'GROWTH_MARKETING' },
  'performance-marketing': { group: 'MARKETING', detail: 'PERFORMANCE_MARKETING' },
  pr: { group: 'MARKETING', detail: 'PR' },
  ml: { group: 'AI', detail: 'MACHINE_LEARNING' },
  dl: { group: 'AI', detail: 'DEEP_LEARNING' },
  cv: { group: 'AI', detail: 'COMPUTER_VISION' },
  nlp: { group: 'AI', detail: 'NLP' },
  data: { group: 'AI', detail: 'DATA_SCIENCE' },
};

// API 응답의 detail enum → 컴포넌트 내부 value 키로 역변환
const DETAIL_TO_VALUE: Record<string, string> = Object.fromEntries(
  Object.entries(JOB_CATEGORY_MAP).map(([value, { detail }]) => [detail, value]),
);

const JobSection = () => {
  const { data: meData, loading: meLoading } = useMe();
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

  // useMe 로드 완료 후 기존 관심직무를 초기값으로 세팅
  useEffect(() => {
    if (meLoading || !meData) return;
    // selectedInterestedJobs: API에서 오는 detail enum 코드 (e.g. 'FRONTEND')
    const initialInterests = meData.selectedInterestedJobs
      .map((code) => DETAIL_TO_VALUE[code])
      .filter(Boolean);
    setSignupData((prev) => ({ ...prev, interests: initialInterests }));
    setSavedInterests(initialInterests);
  }, [meLoading, meData]);

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
      const unsupportedInterests = signupData.interests.filter((interest) => !JOB_CATEGORY_MAP[interest]);
      if (unsupportedInterests.length > 0) {
        window.alert(`현재 API에서 지원하지 않는 직무가 포함되어 있습니다: ${unsupportedInterests.join(', ')}`);
        return;
      }

      const response = await fetch('/api/members/job-categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interested_job_categories: signupData.interests.map((interest) => JOB_CATEGORY_MAP[interest]),
        }),
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
      <div className="flex flex-col items-center gap-4 pc:gap-12 w-[335px] pc:w-[536px]">
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
