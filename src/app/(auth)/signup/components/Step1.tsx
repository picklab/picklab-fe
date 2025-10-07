import CheckBoxLabel from '@/components/common/CheckBox/CheckBoxLabel';
import type { StepProps } from '../types';
import TitleTypography from './TitleTypography';

export default function Step1({ signupData, setSignupData }: StepProps) {
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

        <CheckBoxLabel
          label="(필수) 만 14세 이상입니다."
          id="signup-terms-age"
          value="age"
          scale="sm"
          color="primary"
          checked={signupData.terms.age}
          onChange={handleTermChange('age')}
        />
        <CheckBoxLabel
          label="(필수) 이용약관 동의"
          id="signup-terms-service"
          value="service"
          scale="sm"
          color="primary"
          checked={signupData.terms.service}
          onChange={handleTermChange('service')}
        />
        <CheckBoxLabel
          label="(필수) 개인정보 수집 및 이용 목적"
          id="signup-terms-privacy"
          value="privacy"
          scale="sm"
          color="primary"
          checked={signupData.terms.privacy}
          onChange={handleTermChange('privacy')}
        />
        <CheckBoxLabel
          label="(선택) 마케팅 수신 동의"
          id="signup-terms-marketing"
          value="marketing"
          scale="sm"
          color="primary"
          checked={signupData.terms.marketing}
          onChange={handleTermChange('marketing')}
        />
      </div>
    </>
  );
}
