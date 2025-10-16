import TextField from '@/components/common/Field/TextField';
import Select from '@/components/common/Select/Select';
import type { StepProps } from '../types';
import { EDUCATION_OPTIONS, GRADUATION_OPTIONS, EMPLOYMENT_OPTIONS } from '../constants';
import TitleTypography from './TitleTypography';

export default function Step2({ signupData, setSignupData }: StepProps) {
  const handleInputChange = (field: string, value: string | string[] | undefined) => {
    const stringValue = Array.isArray(value) ? value[0] || '' : value || '';
    setSignupData((prev) => ({
      ...prev,
      userInfo: { ...prev.userInfo, [field]: stringValue },
    }));
  };

  return (
    <>
      <TitleTypography title="회원관련 정보를 입력해주세요!" description="필수가 아닌 것은 넘어가셔도 됩니다." />

      <div className="w-full flex flex-col gap-4 px-[4.5px]">
        <TextField
          label="닉네임"
          id="signup-name"
          placeholder="최대 20자까지 입력"
          status="default"
          labelStatus="require"
          scale="base"
          className="w-full"
          value={signupData.userInfo.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
        <div className="flex gap-2">
          <Select
            label="최종학력"
            id="signup-education"
            options={EDUCATION_OPTIONS}
            value={signupData.userInfo.education}
            onChange={(value) => handleInputChange('education', value)}
            labelStatus="require"
            width="small"
          />
          <TextField
            label=" "
            labelStatus="default"
            id="signup-school"
            placeholder="학교명"
            status="default"
            scale="base"
            icon="search"
            className="w-full"
            value={signupData.userInfo.schoolName}
            onChange={(e) => handleInputChange('schoolName', e.target.value)}
          />
        </div>

        <TextField
          label="전공"
          id="signup-major"
          placeholder="전공명 입력"
          status="default"
          labelStatus="default"
          scale="base"
          className="w-full"
          value={signupData.userInfo.major}
          onChange={(e) => handleInputChange('major', e.target.value)}
        />

        <Select
          label="졸업여부"
          id="signup-graduation"
          className="w-full"
          options={GRADUATION_OPTIONS}
          value={signupData.userInfo.graduationStatus}
          onChange={(value) => handleInputChange('graduationStatus', value)}
          labelStatus="require"
          width="large"
        />

        <div className="flex gap-2">
          <Select
            label="재직상태"
            id="signup-employment"
            options={EMPLOYMENT_OPTIONS}
            value={signupData.userInfo.employmentStatus}
            onChange={(value) => handleInputChange('employmentStatus', value)}
            labelStatus="default"
            width="small"
            // className="w-full"
          />
          <TextField
            label=" "
            labelStatus="default"
            id="signup-company"
            placeholder="현재소속 및 재직명"
            status="default"
            scale="base"
            className="!w-full"
            value={signupData.userInfo.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
