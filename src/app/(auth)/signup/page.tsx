'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LeaveConfirmModal from '@/components/common/Modal/LeaveConfirmModal';
import Typography from '@/components/common/Typography';
import type { SignupData } from './types';
import { SIGNUP_ICONS } from './constants';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';

// NOTE: 아래 라벨은 백엔드로 전송되는 값. 새 항목(대학교(2,3년)/중퇴/휴직)은 백엔드 enum 확인 필요.
const EDUCATION_LABELS: Record<string, string> = {
  high_school: '고등학교',
  college: '대학교(2,3년)', // 백엔드 enum 확인 필요
  university: '대학교(4년)',
  graduate: '대학원',
};

const GRADUATION_LABELS: Record<string, string> = {
  graduated: '졸업',
  enrolled: '재학 중',
  on_leave: '휴학',
  dropped_out: '중퇴', // 백엔드 enum 확인 필요
};

const EMPLOYMENT_LABELS: Record<string, string> = {
  employed: '재직 중',
  job_seeking: '구직 중',
  freelancer: '프리랜서',
  student: '학생',
  on_leave: '휴직', // 백엔드 enum 확인 필요
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

const getNextButtonLabel = (currentStep: number, isSubmitting: boolean) => {
  if (currentStep === 4) return '홈으로';
  if (isSubmitting) return '저장 중';
  if (currentStep === 3) return '가입하기';
  return '다음으로';
};

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
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

  const handleLeaveConfirm = () => {
    router.push('/signin');
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
  const nextButtonLabel = getNextButtonLabel(currentStep, isSubmitting);

  return (
    <div className="flex flex-col gap-12 items-center max-w-[429px] mx-auto pt-12">
      {/* Step Indicator */}
      <div className="relative flex justify-center gap-[14px]">
        <div className="absolute left-6 right-6 top-[14px] h-px bg-gray-20" aria-hidden="true" />
        {SIGNUP_ICONS.map((icon, index) => {
          const isCurrent = currentStep === index + 1;

          return (
            <div key={index} className="relative z-10 flex w-12 flex-col items-center justify-center gap-[5.5px] bg-white">
              <Image src={isCurrent ? icon.activeSrc : icon.src} alt={icon.alt} width={28} height={28} />
              <Typography
                tag="p"
                type="Caption2Regular"
                id="signup-icon-text"
                className={isCurrent ? 'text-gray-60' : 'text-gray-40'}
              >
                {icon.alt}
              </Typography>
            </div>
          );
        })}
      </div>

      {/* Current Step Content */}
      {renderStep()}

      {/* Navigation Buttons */}
      <div className="flex h-space-48 w-[420px] gap-2">
        <button
          type="button"
          className="flex h-space-48 w-[140px] items-center justify-center rounded-small bg-gray-10 px-[18px] py-[14px]"
          onClick={() => setIsLeaveModalOpen(true)}
        >
          <Typography type="Heading2Medium" className="text-gray-50">
            나가기
          </Typography>
        </button>
        <button
          type="button"
          className={`flex h-space-48 w-[272px] items-center justify-center rounded-small px-[18px] py-[14px] ${
            canProceed ? 'bg-primary-50 hover:bg-primary-60 active:bg-primary-70' : 'bg-gray-10'
          }`}
          onClick={handleNext}
          disabled={!canProceed}
        >
          <Typography type="Heading2Medium" className={canProceed ? 'text-gray-0' : 'text-gray-50'}>
            {nextButtonLabel}
          </Typography>
        </button>
      </div>
      <LeaveConfirmModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={handleLeaveConfirm}
        title="지금 나가시면 작성한 내용이 사라져요!"
        description="입력하신 정보는 저장되지 않습니다."
      />
    </div>
  );
}
