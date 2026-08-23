import { useEffect, useMemo, useRef, useState } from 'react';
import TextField from '@/components/common/Field/TextField';
import Select from '@/components/common/Select/Select';
import HelpMessage, { type HelpMessageProps } from '@/components/common/Field/HelpMessage';
import { OptionGroup } from '@/components/common/Option/OptionGroup';
import type { OptionType } from '@/components/common/Option/Option';
import type { StepProps } from '../types';
import {
  EDUCATION_OPTIONS,
  GRADUATION_OPTIONS,
  EMPLOYMENT_OPTIONS,
  EMPLOYED_STATUS_VALUE,
  NICKNAME_DUPLICATE_MESSAGE,
} from '../constants';
import TitleTypography from './TitleTypography';

type FieldStatus = HelpMessageProps['status'];

const NICKNAME_ALLOWED_REGEX = /^[a-zA-Z0-9가-힣_.-]+$/;
const NICKNAME_MAX_LENGTH = 20;

interface NicknameValidation {
  status: Extract<FieldStatus, 'default' | 'success' | 'error'>;
  message?: string;
}

/** 닉네임 형식 검증 (우선순위 순서대로 평가). 형식이 통과해야 중복 검사로 진행. */
function validateNicknameFormat(value: string): NicknameValidation {
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
  return { status: 'success' };
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

  const nicknameFormat = useMemo(() => validateNicknameFormat(name), [name]);

  // 중복 검사 결과(형식 통과 시에만 디바운스로 조회)
  const [availability, setAvailability] = useState<NicknameValidation>({ status: 'default' });

  useEffect(() => {
    // 형식이 통과하지 않으면 중복 검사 스킵
    if (nicknameFormat.status !== 'success') {
      setAvailability({ status: 'default' });
      return;
    }

    let active = true;
    setAvailability({ status: 'default', message: '닉네임 중복 확인 중...' });
    const timer = setTimeout(() => {
      fetch(`/api/members/nickname-availability?nickname=${encodeURIComponent(name)}`)
        .then((res) => {
          if (!res.ok) throw new Error('닉네임 중복 확인 실패');
          return res.json();
        })
        .then((json) => {
          if (!active) return;
          const available = (json?.data ?? json)?.available;
          setAvailability(
            available
              ? { status: 'success', message: '사용 가능한 닉네임입니다.' }
              : { status: 'error', message: NICKNAME_DUPLICATE_MESSAGE },
          );
        })
        .catch(() => {
          if (!active) return;
          // 조회 실패 시 형식만 통과한 상태로 둔다(가입 자체는 막지 않음)
          setAvailability({ status: 'default' });
        });
    }, 400);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [name, nicknameFormat.status]);

  // 형식 오류가 우선, 통과하면 중복 검사 결과를 표시
  const nicknameValidation: NicknameValidation =
    nicknameFormat.status === 'success' ? availability : nicknameFormat;

  // 최종학력 + 학교명이 둘 다 입력되면 성공 메시지
  const isEducationComplete = education.trim().length > 0 && schoolName.trim().length > 0;

  // PIC-82: 학교명 자동완성 — 입력 시 /v1/universities 검색, 목록에 없으면 '직접 추가하기'
  const [schoolOptions, setSchoolOptions] = useState<OptionType[]>([]);
  const [isSchoolOpen, setIsSchoolOpen] = useState(false);
  const suppressSchoolFetch = useRef(false);

  useEffect(() => {
    // 옵션 선택 직후엔 재검색/재오픈 방지
    if (suppressSchoolFetch.current) {
      suppressSchoolFetch.current = false;
      return;
    }
    const query = schoolName.trim();
    if (query === '') {
      setSchoolOptions([]);
      setIsSchoolOpen(false);
      return;
    }
    let active = true;
    const timer = setTimeout(() => {
      fetch(`/api/universities?query=${encodeURIComponent(query)}&size=20`)
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error('대학교 검색 실패'))))
        .then((json) => {
          if (!active) return;
          const items = (json?.data?.items ?? []) as { id: number; name: string }[];
          setSchoolOptions(items.map((u) => ({ value: u.name, label: u.name })));
          setIsSchoolOpen(true);
        })
        .catch(() => {
          if (active) setSchoolOptions([]);
        });
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [schoolName]);

  // 대학교 선택 또는 '직접 추가하기'(입력값 그대로) → 학교명 확정 후 드롭다운 닫기
  const handleSchoolSelect = (value?: string | string[]) => {
    const selected = Array.isArray(value) ? value[0] : value;
    suppressSchoolFetch.current = true;
    handleInputChange('schoolName', selected ?? '');
    setIsSchoolOpen(false);
  };

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
        {/* Figma 정합(1136:81054): '최종학력이 입력되었습니다.' 성공 메시지는 왼쪽 최종학력
            Select 아래에 위치. Select width="small"(140px)에 helpMessage로 넣으면 폭이 좁아
            메시지가 줄바꿈/잘림되므로, row를 묶고 그 아래에 직접 배치한다. */}
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-start">
            <Select
              label="최종학력"
              id="signup-education"
              options={EDUCATION_OPTIONS}
              value={education}
              onChange={(value) => handleInputChange('education', value)}
              labelStatus="require"
              width="small"
            />
            <div className="relative w-full">
              <TextField
                label=" "
                labelStatus="default"
                id="signup-school"
                placeholder="학교명"
                status="default"
                scale="base"
                icon="search"
                className="w-full placeholder:!text-[#A5ADBB]"
                value={schoolName}
                onChange={(e) => handleInputChange('schoolName', e.target.value)}
                onFocus={() => {
                  if (schoolName.trim() !== '') setIsSchoolOpen(true);
                }}
                onBlur={() => {
                  // 옵션 클릭이 먼저 처리되도록 지연 후 닫기
                  setTimeout(() => setIsSchoolOpen(false), 150);
                }}
              />
              {/* PIC-82: 검색어 있을 때만 드롭다운(연관 대학교 + 하단 '직접 추가하기'). figma 1136:81091 */}
              {isSchoolOpen && schoolName.trim() !== '' && (
                <div className="absolute left-0 right-0 top-full z-20">
                  <OptionGroup
                    width="full"
                    options={schoolOptions}
                    selectedValue={schoolName}
                    onClickHandler={handleSchoolSelect}
                    textFieldValue={schoolName}
                    functionOptionType="selfplus"
                    query={schoolName}
                  />
                </div>
              )}
            </div>
          </div>
          {isEducationComplete && (
            <HelpMessage title="최종학력이 입력되었습니다." status="success" />
          )}
        </div>

        {/* PIC-89: 최종학력 선택 시 전공 필드 자동 노출 */}
        {education.trim().length > 0 && (
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
        )}

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
            className={`!w-full ${isCompanyEnabled ? 'placeholder:!text-[#A5ADBB]' : ''}`}
            disabled={!isCompanyEnabled}
            value={signupData.userInfo.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
