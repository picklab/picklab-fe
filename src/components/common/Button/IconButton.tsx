import Icon, { IconProps } from '@/components/common/Icon/Icon';
import clsx from 'clsx';
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

// 버튼 스타일 클래스 (상태별 스타일링)
const styleClass = {
  filled: {
    active: 'bg-primary-50 hover:bg-primary-60 active:bg-primary-70',
    disable: 'bg-gray-10',
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
  filled: {
    active: 'text-gray-0 group-active:text-primary-90',
    readonly: 'text-gray-0',
    disable: 'text-gray-30',
  },
  outlined: { active: 'text-gray-90 group-active:text-gray-50 ', readonly: 'text-gray-90', disable: 'text-gray-40' },
  standard: { active: 'text-gray-90 group-active:text-gray-50', readonly: 'text-gray-90', disable: 'text-gray-40' },
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
  const getIconStyleClass = () => {
    if (disabled) {
      return iconStyleClass[buttonStyles]?.disable;
    } else {
      return readonly ? iconStyleClass[buttonStyles]?.readonly : iconStyleClass[buttonStyles]?.active;
    }
  };
  return (
    <button
      type={props.type || 'button'}
      aria-disabled={disabled || readonly} // 비활성화 또는 읽기 전용 상태일 때 속성 추가
      className={clsx(
        'group flex items-center justify-center size-space-48 rounded-full', // 기본 스타일
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
        <Icon icon={icon} size={24} className={clsx(getIconStyleClass())} />
      </div>
    </button>
  );
};

export default IconButton;
