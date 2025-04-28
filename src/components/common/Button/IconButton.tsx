import Icon, { IconProps } from '@/components/common/Icon/Icon';
import clsx from 'clsx';
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

// 버튼 스타일 클래스 (상태별 스타일링)
const styleClass = {
  filled: {
    active: 'bg-primary-50 hover:bg-primary-60 active:bg-primary-70',
    disable: 'bg-gray-20',
    readonly: 'bg-primary-50',
  },
  outlined: {
    active: 'border border-gray-40 hover:bg-gray-10 active:bg-gray-20',
    disable: 'border border-gray-30',
    readonly: 'border border-gray-40',
  },
  standard: {
    active: 'hover:bg-gray-10 active:bg-gray-20',
    disable: '',
    readonly: '',
  },
};

// 아이콘 색상 클래스 (상태별)
const iconStyleClass = {
  filled: 'text-white',
  outlined: 'text-black',
  standard: 'text-black',
};

// IconButton 컴포넌트 props 타입 정의
interface IconButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  buttonStyles: keyof typeof styleClass; // 버튼 스타일 타입 (filled | outlined | standard)
  icon: IconProps['icon'];
  readonly?: boolean;
}

// IconButton 컴포넌트 정의
const IconButton = ({ buttonStyles, icon, disabled, readonly = false, ...props }: IconButtonProps) => {
  const getStyleClass = () => {
    if (disabled) {
      return styleClass[buttonStyles]?.disable;
    } else {
      return readonly ? styleClass[buttonStyles]?.readonly : styleClass[buttonStyles]?.active;
    }
  };
  return (
    <button
      type={props.type || 'button'}
      aria-disabled={disabled || readonly} // 비활성화 또는 읽기 전용 상태일 때 속성 추가
      className={clsx(
        'flex items-center justify-center size-space-48 rounded-full', // 기본 스타일
        readonly && 'cursor-default',
        disabled && 'cursor-not-allowed', // 비활성화 시 커서 스타일 변경
      )}
      {...props}
    >
      <div
        className={clsx(
          'flex items-center justify-center size-space-40 rounded-full', // 버튼 안쪽 스타일
          getStyleClass(),
        )}
      >
        {/* 아이콘 렌더링 */}
        <Icon
          icon={icon}
          size={24}
          className={clsx(
            iconStyleClass[buttonStyles], // 스타일에 따라 색상 변경
            disabled && '!text-gray-40', // 비활성화 시 색상 회색으로
          )}
        />
      </div>
    </button>
  );
};

export default IconButton;
