import { useMemo } from 'react';
import TextField from '@/components/common/Field/TextField';
import Select from '@/components/common/Select/Select';
import type { HelpMessageProps } from '@/components/common/Field/HelpMessage';
import type { StepProps } from '../types';
import {
  EDUCATION_OPTIONS,
  GRADUATION_OPTIONS,
  EMPLOYMENT_OPTIONS,
  EMPLOYED_STATUS_VALUE,
  // NICKNAME_DUPLICATE_MESSAGE, // 중복 체크 API 생기면 연결
} from '../constants';
import TitleTypography from './TitleTypography';

type FieldStatus = HelpMessageProps['status'];

const NICKNAME_ALLOWED_REGEX = /^[a-zA-Z0-9가-힣_.-]+$/;
const NICKNAME_MAX_LENGTH = 20;

interface NicknameValidation {
  status: Extract<FieldStatus, 'default' | 'success' | 'error'>;
  message?: string;
}

/** 닉네임 실시간 검증 (우선순위 순서대로 평가) */
function validateNickname(value: string): NicknameValidation {
  // 입력 전(초기, 값 없음)엔 메시지 없이 default
  if (value.length === 0) {
    return { status: 'default' };
  }
  if (value.trim().length === 0) {
    return { status: 'error', message: '닉네임을 입력해주세요.' };
  }
  if (/\s/.test(value)) {
    return { status: 'error', message: '띄어쓰기는 사용할 수 없습니다.' };
  }
  if (!NICKNAME_ALLOWED_REGEX.test(value)) {
    return {
      status: 'error',
      message: '영문, 숫자, 한글, 일부 특수 문자(_ , - , .) 만 사용 가능합니다.',
    };
  }
  if (value.length > NICKNAME_MAX_LENGTH) {
    return { status: 'error', message: '최대 20자까지 입력해주세요.' };
  }
  // 중복 체크 API 생기면 연결 (NICKNAME_DUPLICATE_MESSAGE 사용)
  return { status: 'success', message: '사용 가능한 닉네임입니다.' };
}

export default function Step2({ signupData, setSignupData }: StepProps) {
  const handleInputChange = (field: string, value: string | string[] | undefined) => {
    const stringValue = Array.isArray(value) ? value[0] || '' : value || '';
    setSignupData((prev) => ({
      ...prev,
      userInfo: { ...prev.userInfo, [field]: stringValue },
    }));
  };

  // 재직상태 변경 핸들러: "재직 중"이 아니면 직장명 값을 비운다
  const handleEmploymentChange = (value: string | string[] | undefined) => {
    const stringValue = Array.isArray(value) ? value[0] || '' : value || '';
    setSignupData((prev) => ({
      ...prev,
      userInfo: {
        ...prev.userInfo,
        employmentStatus: stringValue,
        companyName: stringValue === EMPLOYED_STATUS_VALUE ? prev.userInfo.companyName : '',
      },
    }));
  };

  const { name, education, schoolName, graduationStatus, employmentStatus } = signupData.userInfo;

  const nicknameValidation = useMemo(() => validateNickname(name), [name]);

  // 최종학력 + 학교명이 둘 다 입력되면 성공 메시지
  const isEducationComplete = education.trim().length > 0 && schoolName.trim().length > 0;
  const schoolStatus: FieldStatus = isEducationComplete ? 'success' : 'default';
  const schoolHelpMessage = isEducationComplete ? '최종학력이 입력되었습니다.' : undefined;

  // 졸업여부 선택 시 성공 메시지
  const isGraduationSelected = graduationStatus.trim().length > 0;

  // 재직상태가 "재직 중"일 때만 직장명 활성화
  const isCompanyEnabled = employmentStatus === EMPLOYED_STATUS_VALUE;

  return (
    <>
      <TitleTypography title="회원관련 정보를 입력해주세요!" description="필수가 아닌 것은 넘어가셔도 됩니다." />

      <div className="w-full flex flex-col gap-2 px-[4.5px]">
        <TextField
          label="닉네임"
          id="signup-name"
          placeholder="최대 20자까지 입력"
          status={nicknameValidation.status}
          helpMessage={nicknameValidation.message}
          labelStatus="require"
          scale="base"
          className="w-full"
          value={name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
        <div className="flex gap-2">
          <Select
            label="최종학력"
            id="signup-education"
            options={EDUCATION_OPTIONS}
            value={education}
            onChange={(value) => handleInputChange('education', value)}
            labelStatus="require"
            width="small"
          />
          <TextField
            label=" "
            labelStatus="default"
            id="signup-school"
            placeholder="학교명"
            status={schoolStatus}
            helpMessage={schoolHelpMessage}
            scale="base"
            icon="search"
            className="w-full"
            value={schoolName}
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
          width="full"
          wrapperClassName="mobile:w-[327px] pc:w-[420px]"
          options={GRADUATION_OPTIONS}
          value={graduationStatus}
          onChange={(value) => handleInputChange('graduationStatus', value)}
          labelStatus="require"
          helpMessage={isGraduationSelected ? '졸업여부가 입력되었습니다.' : undefined}
          helpMessageStatus="success"
        />

        <div className="flex gap-2">
          <Select
            label="재직상태"
            id="signup-employment"
            options={EMPLOYMENT_OPTIONS}
            value={employmentStatus}
            onChange={handleEmploymentChange}
            labelStatus="default"
            width="small"
          />
          <TextField
            label=" "
            labelStatus="default"
            id="signup-company"
            placeholder="현재소속 및 재직명"
            status="default"
            scale="base"
            className="!w-full"
            disabled={!isCompanyEnabled}
            value={signupData.userInfo.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
