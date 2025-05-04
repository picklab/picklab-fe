import React, { ButtonHTMLAttributes } from 'react';

import clsx from 'clsx';
import Typography from '@/components/common/Typography';

// PaginationNumberButtonProps
// - ButtonHTMLAttributes를 확장하여 button 요소의 기본 속성을 모두 포함
// - active: 현재 페이지 버튼인지 여부를 나타내는 플래그
interface PaginationNumberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const PaginationNumberButton = ({ active, className, children, ...props }: PaginationNumberButtonProps) => {
  // 🎨 버튼의 상태에 따라 클래스 동적으로 설정
  const buttonClass = clsx(
    'flex justify-center items-center size-space-32 text-gray-40 rounded p-2',
    'hover:bg-gray-10 active:bg-primary-50 active:text-white',
    {
      // ✅ active일 때 스타일 오버라이드
      'bg-primary-50 text-white hover:bg-primary-50 hover:text-white': active === true,
    },
    className,
  );

  return (
    <button className={buttonClass} {...props}>
      <Typography type="Heading2Medium">{children}</Typography>
    </button>
  );
};

export default PaginationNumberButton;
