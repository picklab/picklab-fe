import { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button/Button';
import Typography from '@/components/common/Typography';
import type { StepProps, JobParent } from '../types';
import { JOB_AREAS, JOB_CHILDREN } from '../constants';
import TitleTypography from './TitleTypography';

export default function Step3({ signupData, setSignupData }: StepProps) {
  const [selectedCategory, setSelectedCategory] = useState<JobParent | null>(null);

  const handleCategorySelect = (category: JobParent) => {
    setSelectedCategory(category);
  };

  const handleChildJobSelect = (childValue: string) => {
    if (signupData.interests.includes(childValue)) {
      setSignupData((prev) => ({
        ...prev,
        interests: prev.interests.filter((job) => job !== childValue),
      }));
    } else if (signupData.interests.length < 5) {
      setSignupData((prev) => ({
        ...prev,
        interests: [...prev.interests, childValue],
      }));
    }
  };

  const handleRemoveJob = (jobValue: string) => {
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
      <TitleTypography
        title="관심 있는 직무를 선택해 주세요!"
        description={`최대 5개까지 선택 가능합니다. (${signupData.interests.length}/5)`}
      />

      <div className="flex flex-col gap-7">
        {/* 선택한 관심직무 */}
        <div className="flex flex-col gap-5">
          <Typography tag="p" type="Body2Medium" id="signup-description">
            선택한 관심직무
          </Typography>
          <div className="flex flex-wrap gap-2">
            {signupData.interests.map((jobValue) => (
              <Button
                key={jobValue}
                buttonStyle="outline-filled"
                isFullRounded
                icon={{ icon: 'xMark', position: 'right' }}
                label={getJobLabel(jobValue)}
                className=""
                size="sm"
                onClick={() => handleRemoveJob(jobValue)}
              />
            ))}
            {signupData.interests.length === 0 && (
              <Typography tag="p" type="Body2Medium" className="text-gray-40">
                선택한 직무가 없습니다.
              </Typography>
            )}
          </div>
        </div>

        <div className="h-[1px] bg-gray-20" />

        {/* 카테고리 선택 */}
        <div className="flex flex-col gap-5">
          <Typography tag="p" type="Body2Medium" id="signup-description">
            직무 분야
          </Typography>

          <div className="flex flex-wrap pc:gap-[7.5px] mobile:gap-3 justify-center">
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
                  <Typography tag="p" type="Body2Medium" className={isSelected ? 'text-primary-50' : 'text-gray-60'}>
                    {job.alt}
                  </Typography>
                </div>
              );
            })}
          </div>
        </div>

        {/* 하위 직무 선택 */}
        {selectedCategory && (
          <>
            <div className="h-[1px] bg-gray-20" />
            <div className="flex flex-col gap-5">
              <Typography tag="p" type="Body2Medium" id="signup-description">
                {selectedCategory} 상세 직무
              </Typography>

              <div className="flex flex-wrap gap-2 justify-center">
                {JOB_CHILDREN[selectedCategory].map((child) => {
                  const isSelected = signupData.interests.includes(child.value);
                  const isDisabled = !isSelected && signupData.interests.length >= 5;

                  return (
                    <div
                      key={child.value}
                      className={`rounded-full flex items-center justify-center px-4 py-[9px] transition-colors ${
                        isSelected
                          ? 'bg-primary-50 cursor-pointer'
                          : isDisabled
                          ? 'bg-gray-10 opacity-50 cursor-not-allowed'
                          : 'bg-gray-10 cursor-pointer hover:bg-gray-20'
                      }`}
                      onClick={() => !isDisabled && handleChildJobSelect(child.value)}
                    >
                      <Typography tag="p" type="Body2Medium" className={isSelected ? 'text-white' : 'text-gray-50'}>
                        {child.label}
                      </Typography>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
