'use client';

import { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button/Button';
import Typography from '@/components/common/Typography';
import type { SignupData } from './types';
import { SIGNUP_ICONS } from './constants';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
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
        return signupData.userInfo.name.trim().length > 0;
      case 3:
        return signupData.interests.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isCurrentStepValid()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        // 회원가입 완료 처리
        handleSignupComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignupComplete = () => {
    console.log('회원가입 데이터:', signupData);
    // TODO: API 호출하여 회원가입 처리
    alert('회원가입이 완료되었습니다!');
  };

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
      <div className="flex gap-2 max-w-[420px] w-full mx-auto">
        <Button
          buttonStyle="filled"
          label={currentStep === 1 ? '나가기' : '이전'}
          className="w-[140px] mobile:!h-[52px] !bg-gray-10"
          size="lg"
          onClick={currentStep === 1 ? undefined : handlePrevious}
        />
        <Button
          buttonStyle="filled"
          label={currentStep === 4 ? '완료' : '다음으로'}
          className={`w-full mobile:!h-[52px]  ${isCurrentStepValid() ? '!bg-primary-50' : '!bg-gray-20'}`}
          size="lg"
          onClick={handleNext}
          disabled={!isCurrentStepValid()}
        />
      </div>
    </div>
  );
}
