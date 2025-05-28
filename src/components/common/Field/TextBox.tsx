'use client';

import { IconType } from '@/components/common/Icon/assets';
import Icon from '@/components/common/Icon/Icon';
import clsx from 'clsx';
import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

const scaleStyleClass = {
  input: {
    base: 'h-space-48 px-[18px] py-[13px]',
    sm: 'h-[34px] px-[18px] py-[7px]',
  },
  textarea: {
    base: 'h-space-48 px-[18px] py-[13px]',
    sm: 'h-[34px] px-[18px] py-[7px]',
  },
};

// 공통 Props 정의
type CommonProps = {
  error?: boolean; // 에러 스타일 여부
  rounded?: boolean; // 둥근 테두리 적용 여부
  className?: string; // 추가 클래스
  scale?: 'base' | 'sm'; // 크기 옵션
  icon?: IconType; // 우측 아이콘
  textBoxType: keyof typeof scaleStyleClass;
};

// input 전용 Props
export type InputTextBoxProps = CommonProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

// textarea 전용 Props
export type TextareaTextBoxProps = CommonProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

// TextBoxProps는 input과 textarea 타입을 모두 포함하는 유니온 타입
type TextBoxProps = InputTextBoxProps | TextareaTextBoxProps;

// 메인 컴포넌트
const TextBox = (props: TextBoxProps) => {
  const {
    error: originalError = false, // 기본값 false
    rounded = false,
    scale = 'base',
    icon,
    className,
    textBoxType = 'input',
    disabled,
    ...rest
  } = props;

  // 비활성화 시 error 스타일 제거
  const error = disabled ? false : originalError;

  // 공통 스타일 클래스
  const baseClass = clsx(
    `w-60 rounded-md border text-gray-90
    border-gray-30  
    hover:border-gray-40 hover:placeholder:text-gray-50
    active:border-gray-50 
    disabled:bg-gray-5 disabled:border-gray-30 disabled:placeholder:text-gray-40 disabled:cursor-not-allowed
    focus:outline-none
    text-[15px]`,
    error && '!border-danger-50 placeholder:!text-gray-90', // 에러 시 강조
    rounded && '!rounded-full', // 둥근 테두리 적용
    scale && textBoxType && scaleStyleClass[textBoxType][scale], // 스케일 클래스 적용
    className, // 사용자 추가 클래스
  );

  return (
    <div className="relative w-fit">
      {/* input 또는 textarea 분기 렌더링 */}
      {textBoxType === 'input' ? (
        <input type="text" className={baseClass} {...(rest as InputTextBoxProps)} />
      ) : (
        <textarea className={clsx(baseClass, 'overflow-hidden resize-none')} {...(rest as TextareaTextBoxProps)} />
      )}
      {/* 아이콘 렌더링 */}
      {icon && <Icon className="absolute top-1/2 -translate-y-1/2 right-4" icon={icon} size={24} />}
    </div>
  );
};

export default TextBox;
