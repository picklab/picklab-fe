'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button/Button';
import Typography from '@/components/common/Typography';
import type { SignupData } from './types';
import { SIGNUP_ICONS } from './constants';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';

const EDUCATION_LABELS: Record<string, string> = {
  high_school: '고등학교 졸업',
  university: '대학교 졸업',
  graduate: '대학원 졸업',
  other: '기타',
};

const GRADUATION_LABELS: Record<string, string> = {
  graduated: '졸업',
  enrolled: '재학중',
  on_leave: '휴학중',
};

const EMPLOYMENT_LABELS: Record<string, string> = {
  employed: '재직중',
  job_seeking: '구직중',
  freelancer: '프리랜서',
  student: '학생',
  other: '기타',
};

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

function readErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== 'object') return fallback;
  const record = payload as Record<string, unknown>;
  if (typeof record.message === 'string') return record.message;
  if (typeof record.error === 'string') return record.error;
  return fallback;
}

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 signupData={signupData} setSignupData={setSignupData} />;
      case 2:
        return <Step2 signupData={signupData} setSignupData={setSignupData} />;
      case 3:
        return <Step3 signupData={signupData} setSignupData={setSignupData} />;
      case 4:
        return <Step4 />;
      default:
        return <Step1 signupData={signupData} setSignupData={setSignupData} />;
    }
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return signupData.terms.age && signupData.terms.service && signupData.terms.privacy;
      case 2:
        return (
          signupData.userInfo.name.trim().length > 0 &&
          signupData.userInfo.education.trim().length > 0 &&
          signupData.userInfo.schoolName.trim().length > 0 &&
          signupData.userInfo.graduationStatus.trim().length > 0
        );
      case 3:
        return signupData.interests.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (isCurrentStepValid()) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else if (currentStep === 3) {
        await handleSignupComplete();
      } else {
        router.push('/');
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignupComplete = async () => {
    const unsupportedInterests = signupData.interests.filter((interest) => !JOB_CATEGORY_MAP[interest]);
    if (unsupportedInterests.length > 0) {
      window.alert(`현재 API에서 지원하지 않는 직무가 포함되어 있습니다: ${unsupportedInterests.join(', ')}`);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/members/signup/additional-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname: signupData.userInfo.name.trim(),
          education_level: EDUCATION_LABELS[signupData.userInfo.education] ?? signupData.userInfo.education,
          school: signupData.userInfo.schoolName.trim(),
          graduation_status: GRADUATION_LABELS[signupData.userInfo.graduationStatus] ?? signupData.userInfo.graduationStatus,
          employment_status: signupData.userInfo.employmentStatus
            ? EMPLOYMENT_LABELS[signupData.userInfo.employmentStatus] ?? signupData.userInfo.employmentStatus
            : '',
          company: signupData.userInfo.companyName.trim(),
          employment_type: 'NONE',
          interested_job_categories: signupData.interests.map((interest) => JOB_CATEGORY_MAP[interest]),
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        window.alert(readErrorMessage(payload, '회원 추가 정보 저장에 실패했습니다.'));
        return;
      }

      setCurrentStep(4);
    } catch (error) {
      console.error('회원 추가 정보 저장 중 오류 발생:', error);
      window.alert('회원 추가 정보 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = isCurrentStepValid() && !isSubmitting;

  return (
    <div className="flex flex-col gap-12 items-center max-w-[429px] mx-auto pt-12">
      {/* Step Indicator */}
      <div className="flex gap-[14px] justify-center">
        {SIGNUP_ICONS.map((icon, index) => (
          <div key={index} className="flex flex-col justify-center items-center gap-[5.5px] w-12">
            <Image src={currentStep >= index + 1 ? icon.activeSrc : icon.src} alt={icon.alt} width={28} height={28} />
            <Typography
              tag="p"
              type="Caption2Regular"
              id="signup-icon-text"
              className={currentStep >= index + 1 ? 'text-primary-50' : 'text-gray-40'}
            >
              {icon.alt}
            </Typography>
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      {renderStep()}

      {/* Navigation Buttons */}
      <div className="flex gap-2 w-full mx-auto">
        <Button
          buttonStyle="filled"
          label={currentStep === 1 ? '나가기' : '이전'}
          className="w-[140px] mobile:!h-[52px] !bg-gray-10"
          size="lg"
          onClick={currentStep === 1 ? undefined : handlePrevious}
        />
        <Button
          buttonStyle="filled"
          label={currentStep === 4 ? '홈으로' : isSubmitting ? '저장 중' : '다음으로'}
          className={`w-full mobile:!h-[52px]  ${canProceed ? '!bg-primary-50' : '!bg-gray-20'}`}
          size="lg"
          onClick={handleNext}
          disabled={!canProceed}
        />
      </div>
    </div>
  );
}
