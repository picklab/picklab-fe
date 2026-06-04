import { useState } from 'react';
import CheckBoxLabel from '@/components/common/CheckBox/CheckBoxLabel';
import Icon from '@/components/common/Icon/Icon';
import LegalDocument from '@/app/(home)/_components/LegalDocument';
import type { StepProps } from '../types';
import { SIGNUP_TERMS } from '../constants';
import TitleTypography from './TitleTypography';

export default function Step1({ signupData, setSignupData }: StepProps) {
  // 본문 아코디언 펼침 상태 (약관 key별)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggleExpanded = (key: string) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleAllTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const newTerms = {
      all: checked,
      age: checked,
      service: checked,
      privacy: checked,
      marketing: checked,
    };
    setSignupData((prev) => ({ ...prev, terms: newTerms }));
  };

  const handleTermChange = (key: keyof typeof signupData.terms) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const newTerms = { ...signupData.terms, [key]: checked };
    newTerms.all = newTerms.age && newTerms.service && newTerms.privacy;
    setSignupData((prev) => ({ ...prev, terms: newTerms }));
  };

  return (
    <>
      <TitleTypography
        title="약관내용을 확인하신 후, 동의해주세요!"
        description="동의 후 회원가입을 진행할 수 있습니다."
      />

      <div className="flex flex-col gap-6 w-full px-1">
        <div className="h-[47px] border-b border-gray-20">
          <CheckBoxLabel
            label="전체 동의합니다."
            id="signup-terms-all"
            value="all"
            scale="md"
            color="primary"
            checked={signupData.terms.all}
            onChange={handleAllTermsChange}
          />
        </div>

        {SIGNUP_TERMS.map((term) => {
          const isOpen = !!expanded[term.key];
          return (
            <div key={term.key} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <CheckBoxLabel
                  label={term.label}
                  id={`signup-terms-${term.key}`}
                  value={term.key}
                  scale="sm"
                  color="primary"
                  checked={signupData.terms[term.key]}
                  onChange={handleTermChange(term.key)}
                />
                {term.doc && (
                  <button
                    type="button"
                    onClick={() => toggleExpanded(term.key)}
                    aria-expanded={isOpen}
                    aria-controls={`signup-terms-${term.key}-body`}
                    aria-label={`${term.label} 전문 ${isOpen ? '접기' : '펼치기'}`}
                    className="flex h-6 w-6 shrink-0 items-center justify-center text-gray-50 hover:text-gray-80"
                  >
                    <Icon icon={isOpen ? 'chevronUp' : 'chevronDown'} size={20} />
                  </button>
                )}
              </div>
              {term.doc && (
                <div
                  id={`signup-terms-${term.key}-body`}
                  hidden={!isOpen}
                  className="max-h-[150px] overflow-y-auto rounded-md border border-gray-20 bg-gray-5 p-4"
                >
                  <LegalDocument doc={term.doc} variant="embed" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
