import FunnelStep, { StepType } from '@/components/common/Funnel/FunnelStep';
import React from 'react';

interface ProgressBarProps {
  // currentStep을 회원가입 페이지의 searchParam으로 설정 후 가져오는 방식으로 진행
  currentStep: number;
  steps: StepType[];
}

const SignupFunnel = ({ steps, currentStep }: ProgressBarProps) => {
  return (
    <div className="flex w-[228px] h-[72px] gap-6">
      {steps.map((step, idx) => {
        const stepNumber = idx + 1;
        return (
          <FunnelStep
            key={`funnel-${idx}`}
            step={step}
            isActive={currentStep === stepNumber}
            isPast={currentStep > stepNumber}
            showLine={idx < steps.length - 1}
          />
        );
      })}
    </div>
  );
};

export default SignupFunnel;
