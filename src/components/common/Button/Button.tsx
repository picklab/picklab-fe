import Icon, { IconProps } from '@/components/common/Icon/Icon';
import Typography, { TypographyProps } from '@/components/common/Typography';
import clsx from 'clsx';
import React, { ButtonHTMLAttributes } from 'react';

// 버튼 사이즈 타입 정의
type SizeType = 'xl' | 'lg' | 'base' | 'sm';

// 버튼 사이즈별 스타일 정의
const sizeStyleClass: Record<
  SizeType,
  {
    label: string;
    labelIconLeft: string;
    labelIconRight: string;
    typographyType: TypographyProps['type'];
    iconSize: number;
  }
> = {
  xl: {
    label: 'px-space-24 py-space-16 h-space-56 min-w-[90px] gap-space-10',
    labelIconLeft: 'pl-space-20',
    labelIconRight: 'pr-space-20',
    typographyType: 'Heading2Medium',
    iconSize: 24,
  },
  lg: {
    label: 'px-[18px] py-space-12 h-space-48 min-w-[78px]',
    labelIconLeft: 'pl-space-14',
    labelIconRight: 'pr-space-14',
    typographyType: 'Heading2Medium',
    iconSize: 24,
  },
  base: {
    label: 'px-space-16 py-space-8 h-space-40 min-w-[70px]',
    labelIconLeft: 'pl-space-12',
    labelIconRight: 'pr-space-12',
    typographyType: 'Body2Medium',
    iconSize: 20,
  },
  sm: {
    label: 'px-space-12 py-space-6 h-[30px] min-w-[57px]',
    labelIconLeft: 'pl-space-10',
    labelIconRight: 'pr-space-10',
    typographyType: 'Body4Medium',
    iconSize: 18,
  },
};

// 버튼 스타일 타입 정의
type buttonStyle = 'filled' | 'outlined' | 'outline-filled';

// 버튼 스타일별 스타일 클래스 정의
const buttonStyleClass: Record<
  buttonStyle,
  {
    active: {
      // 활성화 상태
      label: string;
      textColor: string;
    };
    disabled: {
      // 비활성화 상태
      label: string;
      textColor: string;
    };
  }
> = {
  filled: {
    active: {
      label: 'bg-primary-50 hover:bg-primary-60 active:bg-primary-70 cursor-pointer',
      textColor: 'text-gray-0',
    },
    disabled: {
      label: 'bg-gray-10 cursor-not-allowed',
      textColor: 'text-gray-50',
    },
  },
  outlined: {
    active: {
      label: 'group bg-gray-0 border border-gray-40 hover:bg-gray-5 active:bg-gray-20 cursor-pointer',
      textColor: 'text-gray-90 group-hover:text-gray-70 group-active:text-gray-60',
    },
    disabled: {
      label: 'border border-gray-40 cursor-not-allowed',
      textColor: 'text-gray-50',
    },
  },
  ['outline-filled']: {
    active: {
      label: 'group bg-gray-0 border border-primary-60 hover:bg-primary-5 active:bg-primary-10 cursor-pointer',
      textColor: 'text-primary-60',
    },
    disabled: {
      label: 'border border-gray-40 cursor-not-allowed',
      textColor: 'text-gray-50',
    },
  },
};

// Button 컴포넌트 props 타입 정의
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string; // 버튼에 표시할 텍스트
  size: keyof typeof sizeStyleClass; // 버튼 사이즈
  buttonStyle: keyof typeof buttonStyleClass; // 버튼 스타일
  disabled?: boolean; // 비활성화 여부
  icon?: {
    // 아이콘 설정
    icon: IconProps['icon'];
    position: 'left' | 'right'; // 아이콘 위치 (왼쪽 or 오른쪽)
  };
  isFullRounded?: boolean; // 버튼을 완전 둥글게 만들지 여부
}

// Button 컴포넌트 정의
const Button = ({ label, disabled = false, icon, size, buttonStyle, isFullRounded = false, ...props }: ButtonProps) => {
  // 아이콘 스타일 클래스 설정 (활성/비활성 상태에 따라 다름)
  const iconStyleClass = disabled
    ? buttonStyleClass[buttonStyle].disabled.textColor
    : buttonStyleClass[buttonStyle].active.textColor;

  return (
    <button
      className={clsx(
        'flex justify-center items-center rounded-small transition-all gap-1', // 기본 버튼 스타일
        sizeStyleClass[size].label, // 사이즈별 버튼 스타일
        icon?.position === 'left' && sizeStyleClass[size].labelIconLeft, // 아이콘이 왼쪽일 때 패딩 조정
        icon?.position === 'right' && sizeStyleClass[size].labelIconRight, // 아이콘이 오른쪽일 때 패딩 조정
        disabled ? buttonStyleClass[buttonStyle].disabled.label : buttonStyleClass[buttonStyle].active.label, // 상태별 스타일
        isFullRounded && '!rounded-full', // rounded 옵션이 true면 완전 둥근 버튼
      )}
      {...props}
    >
      {/* 왼쪽 아이콘 렌더링 */}
      {icon?.position === 'left' && (
        <Icon icon={icon.icon} size={sizeStyleClass[size].iconSize} className={iconStyleClass} />
      )}

      {/* 버튼 텍스트 */}
      <Typography
        type={sizeStyleClass[size].typographyType}
        className={
          disabled ? buttonStyleClass[buttonStyle].disabled.textColor : buttonStyleClass[buttonStyle].active.textColor
        }
      >
        {label}
      </Typography>

      {/* 오른쪽 아이콘 렌더링 */}
      {icon?.position === 'right' && (
        <Icon icon={icon.icon} size={sizeStyleClass[size].iconSize} className={iconStyleClass} />
      )}
    </button>
  );
};

export default Button;
