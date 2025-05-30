'use client';

import { IconType } from '@/components/common/Icon/assets';
import Icon from '@/components/common/Icon/Icon';

import clsx from 'clsx';
import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

// input 크기(scale)에 따라 적용할 클래스 정의
const scaleStyleClass = {
  input: {
    base: 'h-space-48 py-[13px]',
    sm: 'h-[34px]  py-[7px]',
  },
};

// input, textarea 공통 Props 정의
type CommonProps = {
  error?: boolean; // 에러 상태
  className?: string; // 사용자 정의 클래스
  textBoxType: 'input' | 'textarea'; // input 또는 textarea 타입 지정
  disabled?: boolean; // 비활성화 여부
};

// input 전용 Props
type InputOnlyProps = {
  rounded?: boolean; // 둥근 테두리 여부
  scale?: 'base' | 'sm'; // 사이즈
  icon?: IconType; // 우측 아이콘
};

// input 전용 전체 Props (공통 + 전용 + 기본 input props)
export type InputTextBoxProps = CommonProps & InputOnlyProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

// textarea 전용 전체 Props (공통 + 기본 textarea props)
export type TextareaTextBoxProps = CommonProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

// input 또는 textarea 중 하나의 Props를 받을 수 있도록 유니온 타입으로 정의
type TextBoxProps = InputTextBoxProps | TextareaTextBoxProps;

// 메인 컴포넌트
const TextBox = (props: TextBoxProps) => {
  // 공통 Props 디스트럭처링
  const { error: originalError = false, className, disabled, textBoxType, ...rest } = props;

  // 비활성화 시에는 error 비활성화
  const error = disabled ? false : originalError;

  // input/textarea 공통 스타일 클래스 정의
  const baseClass = clsx(
    `w-60 rounded-md border text-gray-90
    border-gray-30
    placeholder:text-gray-40
    hover:border-gray-40 hover:placeholder:text-gray-50
    active:border-gray-50
    disabled:bg-gray-5 disabled:border-gray-30 disabled:cursor-not-allowed
    disabled:placeholder:text-gray-30 disabled:text-gray-30
    focus:outline-none`,
    error && '!border-danger-50 placeholder:!text-gray-90', // 에러 상태일 때 스타일
    className,
  );

  // input인 경우 렌더링
  if (textBoxType === 'input') {
    // input 전용 Props 디스트럭처링
    const { rounded = false, scale = 'base', icon, ...inputRest } = rest as InputOnlyProps & InputTextBoxProps;

    // input 전용 클래스
    const inputClass = clsx(
      `text-[15px] px-[18px]`,
      scale && scaleStyleClass['input'][scale], // 스케일별 높이/패딩 적용
      rounded && '!rounded-full', // 둥근 테두리 적용
    );

    return (
      <div className="flex relative w-fit">
        {/* input 요소 렌더링 */}
        <input type="text" className={clsx(baseClass, inputClass)} disabled={disabled} {...inputRest} />
        {/* 아이콘이 있을 경우 렌더링 */}
        {icon && <Icon className=" absolute top-1/2 -translate-y-1/2 right-4" icon={icon} size={24} />}
      </div>
    );
  }

  // textarea 전용 클래스 정의
  const textareaClass = clsx(
    `w-[430px] resize-none px-space-14 py-[13px] text-5xs h-20 !rounded
     placeholder:text-gray-40
     hover:border-gray-30 hover:placeholder:text-gray-40
     active:border-gray-40 active:placeholder:text-gray-90`,
  );

  return (
    <div className="flex relative w-fit">
      {/* textarea 요소 렌더링 */}
      <textarea className={clsx(baseClass, textareaClass)} disabled={disabled} {...(rest as TextareaTextBoxProps)} />
    </div>
  );
};

export default TextBox;
