import Typography from '@/components/common/Typography';
import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  // Badge에 표시할 텍스트
  text: string;
  // Variant 타입 (default, deadline, intended)
  variant?: 'default' | 'deadline' | 'intended';
}

const Badge = ({ text, variant = 'default', ...props }: BadgeProps) => {
  // 각 variant에 따라 배경 색상과 텍스트 색상을 설정합니다
  let bgColor: string;
  let textColor: string;

  // variant별로 달라지는 스타일들 swtich문으로 변경합니다
  switch (variant) {
    case 'deadline':
      bgColor = 'bg-danger-50';
      textColor = 'text-danger-5';
      break;
    case 'intended':
      bgColor = 'bg-gray-10';
      textColor = 'text-gray-50';
      break;
    case 'default':
    default:
      bgColor = 'bg-gray-90';
      textColor = 'text-gray-0';
      break;
  }

  return (
    <Typography
      type="Caption1Medium"
      className={`${bgColor} ${textColor} w-fit px-space-8 py-space-base rounded-md inline-block cursor-default`}
      aria-label={text} // 스크린 리더용 텍스트입니다
      {...props} // 추가적인 옵셔널 span태그의 속성들 적용합니다
    >
      {text}
    </Typography>
  );
};

export default Badge;
