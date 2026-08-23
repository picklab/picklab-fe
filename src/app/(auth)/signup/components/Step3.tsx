import { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button/Button';
import Typography from '@/components/common/Typography';
import type { StepProps, JobParent } from '../types';
import { JOB_AREAS, JOB_CHILDREN } from '../constants';
import TitleTypography from './TitleTypography';

export default function Step3({ signupData, setSignupData }: StepProps) {
  const [selectedCategory, setSelectedCategory] = useState<JobParent | null>(null);
  const [showLimitError, setShowLimitError] = useState(false);

  const handleCategorySelect = (category: JobParent) => {
    setSelectedCategory(category);
  };

  const handleChildJobSelect = (childValue: string) => {
    if (signupData.interests.includes(childValue)) {
      setShowLimitError(false);
      setSignupData((prev) => ({
        ...prev,
        interests: prev.interests.filter((job) => job !== childValue),
      }));
      return;
    }

    if (signupData.interests.length >= 5) {
      setShowLimitError(true);
      return;
    }

    setShowLimitError(false);
    setSignupData((prev) => ({
      ...prev,
      interests: [...prev.interests, childValue],
    }));
  };

  const handleRemoveJob = (jobValue: string) => {
    setShowLimitError(false);
    setSignupData((prev) => ({
      ...prev,
      interests: prev.interests.filter((job) => job !== jobValue),
    }));
  };

  // 선택된 직무의 label 찾기
  const getJobLabel = (value: string) => {
    for (const category of Object.keys(JOB_CHILDREN) as JobParent[]) {
      const found = JOB_CHILDREN[category].find((child) => child.value === value);
      if (found) return found.label;
    }
    return value;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 서브텍스트: 평소 기본색, 5개 초과 선택 시도 시에만 빨간색 */}
      <TitleTypography
        title="관심 있는 직무를 선택해 주세요!"
        description="최대 5개까지 선택 가능합니다."
        descriptionClassName={showLimitError ? 'text-danger-50' : 'text-gray-50'}
      />

      {/* list 간격 10px */}
      <div className="mx-auto flex w-full max-w-[420px] flex-col gap-7">
        {/* 선택한 관심직무 (small-outlined-primary 칩, 8px 간격, 2줄) */}
        <div className="flex flex-col gap-5">
          <Typography tag="p" type="Body2Medium" id="signup-description">
            선택한 관심직무
          </Typography>
          <div className="flex min-h-[34px] flex-wrap gap-2">
            {signupData.interests.map((jobValue) => (
              <Button
                key={jobValue}
                buttonStyle="outline-filled"
                isFullRounded
                icon={{ icon: 'xMark', position: 'right' }}
                label={getJobLabel(jobValue)}
                size="sm"
                onClick={() => handleRemoveJob(jobValue)}
              />
            ))}
          </div>
        </div>

        <div className="h-[1px] bg-gray-20" />

        {/* 직무 분야: 대분류 카드 + 세부직무(바로 아래, 구분선/제목 없음) */}
        <div className="flex flex-col gap-5">
          <Typography tag="p" type="Body2Medium" id="signup-description">
            직무 분야
          </Typography>

          <div className="flex flex-wrap gap-3">
            {JOB_AREAS.map((job, index) => {
              const isSelected = selectedCategory === job.alt;
              return (
                <div
                  key={index}
                  className={`w-[78px] h-[96px] rounded-md flex flex-col items-center justify-center gap-2 border cursor-pointer transition-colors ${
                    isSelected ? 'border-primary-50 bg-primary-5' : 'border-gray-10 hover:border-primary-30'
                  }`}
                  onClick={() => handleCategorySelect(job.alt)}
                >
                  <Image src={job.src} alt={job.alt} width={48} height={48} />
                  <Typography
                    tag="p"
                    type={isSelected ? 'Headline2SemiBold' : 'Headline2Regular'}
                    className={isSelected ? 'text-gray-90' : 'text-gray-50'}>
                    {job.alt}
                  </Typography>
                </div>
              );
            })}
          </div>

          {selectedCategory && (
            <div className="flex flex-wrap gap-2">
              {JOB_CHILDREN[selectedCategory].map((child) => {
                const isSelected = signupData.interests.includes(child.value);
                const isDisabled = !isSelected && signupData.interests.length >= 5;
                return (
                  <button
                    type="button"
                    key={child.value}
                    disabled={isDisabled}
                    className={`rounded-full flex items-center justify-center px-4 py-[9px] transition-colors ${
                      isSelected
                        ? 'bg-primary-50 cursor-pointer'
                        : isDisabled
                        ? 'bg-gray-10 opacity-50 cursor-not-allowed'
                        : 'bg-gray-10 cursor-pointer hover:bg-gray-20'
                    }`}
                    onClick={() => handleChildJobSelect(child.value)}
                  >
                    <Typography tag="p" type="Body2Medium" className={isSelected ? 'text-white' : 'text-gray-50'}>
                      {child.label}
                    </Typography>
                  </button>
                );
              })}
            </div>
          )}

          {showLimitError && (
            <Typography tag="p" type="Body3Medium" className="text-danger-50">
              관심 직무는 최대 5개까지 선택할 수 있습니다.
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
}
