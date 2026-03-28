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
    'flex justify-center items-center size-space-24 text-gray-40 rounded p-1',
    'hover:bg-gray-10 active:bg-primary-50 active:text-white',
    {
      // ✅ active일 때 스타일 오버라이드
      'bg-primary-50 text-white hover:bg-primary-50 hover:text-white': active === true,
    },
    className,
  );

  return (
    <button className={buttonClass} {...props}>
      {/* 💬 숫자 텍스트를 가운데 정렬하기 위해 absolute 래퍼 사용 */}
      <div className="absolute">
        {/* 숫자 폰트 스타일 지정 및 약간의 위치 보정 */}
        <Typography type="Body3Medium" className="relative top-[.5px]">
          {children}
        </Typography>
      </div>
    </button>
  );
};

export default PaginationNumberButton;
