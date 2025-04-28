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
  status: keyof typeof styleClass; // 버튼 스타일 타입 (filled | outlined | standard)
  icon: IconProps['icon'];
  readonly?: boolean;
}

// IconButton 컴포넌트 정의
const IconButton = ({ status, icon, id, disabled, readonly = false, ...props }: IconButtonProps) => {
  // 버튼과 label을 연결하기 위한 id 설정 (없으면 기본값 사용)
  const buttonId = id || 'icon-button';

  const getStyleClass = () => {
    if (disabled) {
      return styleClass[status].disable;
    } else {
      return readonly ? styleClass[status].readonly : styleClass[status].active;
    }
  };
  return (
    <label
      htmlFor={buttonId} // label이 연결될 button id
      className={clsx(
        'flex items-center justify-center size-space-48 rounded-full', // 기본 스타일
        !readonly && disabled && 'cursor-not-allowed', // 비활성화 시 커서 스타일 변경
      )}
    >
      <div
        className={clsx(
          'flex items-center justify-center size-space-40 rounded-full', // 버튼 안쪽 스타일
          getStyleClass(),
        )}
      >
        {/* 아이콘 렌더링 */}
        <Icon
          icon={icon} // 현재 하드코딩된 아이콘 ("human")
          size={24}
          className={clsx(
            iconStyleClass[status], // 스타일에 따라 색상 변경
            disabled && '!text-gray-40', // 비활성화 시 색상 회색으로
          )}
        />
      </div>
      {/* 스크린 리더를 위한 실제 버튼 (화면에는 안 보임) */}
      <button
        id={buttonId}
        className="sr-only" // 화면에 보이지 않게 숨김
        aria-label={props['aria-label'] ?? '아이콘 버튼'} // 접근성 향상을 위한 라벨 (props에서 받아오거나 기본값)
        {...props} // 나머지 버튼 속성 전달
      />
    </label>
  );
};

export default IconButton;
