import Icon, { IconProps } from '@/components/common/Icon/Icon';
import Typography, { TypographyProps } from '@/components/common/Typography';
import clsx from 'clsx';
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

const sizeStyleClass: {
  [key: string]: {
    label: string;
    labelIconLeft: string;
    labelIconRight: string;
    typographyType: TypographyProps['type'];
    iconSize: number;
  };
} = {
  xl: {
    label: 'px-space-24 py-space-16 h-space-56 min-w-[90px]',
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

const buttonStyleClass = {
  filled: {
    active: {
      label: 'bg-primary-50 hover:bg-primary-60 active:bg-primary-70 cursor-pointer',
      textColor: 'text-white',
      iconColor: 'text-white',
    },
    disabled: {
      label: 'bg-gray-10 cursor-not-allowed',
      textColor: 'text-gray-50',
      iconColor: 'text-gray-50',
    },
  },
  // outline: {
  //   active: 'bg-primary-50 hover:bg-primary-60 active:bg-primary-70',
  //   disabled: '',
  // },
  // standard: {
  //   active: 'bg-primary-50 hover:bg-primary-60 active:bg-primary-70',
  //   disabled: '',
  // },
};

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  label: string;
  size: keyof typeof sizeStyleClass;
  buttonStyle: keyof typeof buttonStyleClass;
  icon?: {
    icon: IconProps['icon'];
    position: 'left' | 'right';
  };
  //   status: keyof typeof styleClass; // 버튼 스타일 타입 (filled | outlined | standard)
}

const Button = ({ label, id, disabled, icon, size, buttonStyle, ...props }: ButtonProps) => {
  // 버튼과 label을 연결하기 위한 id 설정 (없으면 기본값 사용)
  const buttonId = id || 'icon-button';
  // console.log(icon?.position === 'left' && sizeStyleClass[size].labelIconLeft);
  // console.log(sizeStyleClass[size].label);
  return (
    <label
      htmlFor={buttonId} // label이 연결될 button id
      className={clsx(
        'flex justify-center items-center rounded-small transition-all gap-1 ',
        sizeStyleClass[size].label,
        icon?.position === 'left' && sizeStyleClass[size].labelIconLeft,
        icon?.position === 'right' && sizeStyleClass[size].labelIconRight,
        disabled ? buttonStyleClass[buttonStyle].disabled.label : buttonStyleClass[buttonStyle].active.label,
      )}
    >
      {icon?.position === 'left' && (
        <Icon
          icon={icon.icon}
          size={sizeStyleClass[size].iconSize}
          className={
            disabled ? buttonStyleClass[buttonStyle].disabled.iconColor : buttonStyleClass[buttonStyle].active.iconColor
          }
        />
      )}
      <Typography
        type={sizeStyleClass[size].typographyType}
        className={
          disabled ? buttonStyleClass[buttonStyle].disabled.iconColor : buttonStyleClass[buttonStyle].active.textColor
        }
      >
        {label}
      </Typography>
      {/* 스크린 리더를 위한 실제 버튼 (화면에는 안 보임) */}
      <button
        id={buttonId}
        className="sr-only" // 화면에 보이지 않게 숨김
        {...props} // 나머지 버튼 속성 전달
      />
      {icon?.position === 'right' && (
        <Icon
          icon={icon.icon}
          size={sizeStyleClass[size].iconSize}
          className={buttonStyleClass[buttonStyle].active.iconColor}
        />
      )}
    </label>
  );
};

export default Button;
