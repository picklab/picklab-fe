import React, { ReactNode, ElementType } from 'react';
import { clsx } from 'clsx';

// 🔤 텍스트의 두께를 정해요 (얇게, 보통, 굵게 등)
const weightClasses = {
  normal: 'font-normal', // 보통 두께
  medium: 'font-medium', // 중간 두께
  semibold: 'font-semibold', // 조금 굵게
  bold: 'font-bold', // 굵게
};

// 📏 텍스트 줄의 높이를 정해요 (줄 간격)
const lineHeightClasses = {
  normal: 'leading-normal', // 보통 간격
  relaxed: 'leading-relaxed', // 넓은 간격
};

// 🔤 글자 사이의 간격을 정해요
const letterSpacingClasses = {
  tight: 'tracking-tight', // 좁은 간격
  wide: 'tracking-wide', // 넓은 간격
};

// 📏 텍스트의 크기를 정해요 (작게, 보통, 크게 등)
const sizeClasses = {
  '6xl': 'text-6xl', // 엄청 크게
  '4xl': 'text-4xl', // 매우 크게
  '3xl': 'text-3xl', // 아주 크게
  '2xl': 'text-2xl', // 크게
  xl: 'text-xl', // 조금 크게
  lg: 'text-lg', // 약간 크게
  base: 'text-base', // 보통 크기
  sm: 'text-sm', // 약간 작게
  xs: 'text-xs', // 작게
  '2xs': 'text-2xs', // 아주 작게
  '3xs': 'text-3xs', // 매우 작게
  '4xs': 'text-4xs', // 엄청 작게
  '5xs': 'text-5xs', // 미니 사이즈
  '6xs': 'text-6xs', // 초미니 사이즈
  '7xs': 'text-7xs', // 극초미니 사이즈
};

// 🏷️ 이 컴포넌트가 사용할 수 있는 모든 종류의 태그예요
type TypographyTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

// 📏 텍스트 크기 옵션
type TypographySize = keyof typeof sizeClasses;

// 📏 위에서 정의한 스타일들을 컴포넌트에서 사용할 수 있게 타입으로 만들어요
type TypographyWeight = keyof typeof weightClasses;
type TypographyLineHeight = keyof typeof lineHeightClasses;
type TypographyLetterSpacing = keyof typeof letterSpacingClasses;

// 🎁 이 컴포넌트가 받을 수 있는 모든 속성들을 정의해요
type TypographyProps = {
  tag?: TypographyTag; // 어떤 태그로 보여줄지 (h1, p, span 등)
  size?: TypographySize; // 텍스트 크기
  children: ReactNode; // 보여줄 내용
  weight?: TypographyWeight; // 텍스트 두께
  lineHeight?: TypographyLineHeight; // 줄 간격
  spacing?: TypographyLetterSpacing; // 글자 간격
  className?: string; // 추가 스타일
} & Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'className'>;

// 🎨 이제 실제로 텍스트를 보여주는 컴포넌트를 만들어요!
const Typography = ({
  tag = 'span', // 기본값은 span 태그
  children, // 보여줄 내용
  size = 'base', // 기본 크기는 base
  weight = 'normal', // 기본 두께는 normal
  lineHeight = 'normal', // 기본 줄 간격은 normal
  spacing, // 글자 간격 (선택사항)
  className = '', // 추가 스타일 (선택사항)
  ...props // 다른 HTML 속성들
}: TypographyProps) => {
  // 선택한 태그를 컴포넌트로 변환해요
  const Component = tag as ElementType;

  // 🎨 모든 스타일을 합쳐서 하나의 클래스 이름으로 만들어요
  return (
    <Component
      className={clsx(
        sizeClasses[size], // 크기 스타일
        weightClasses[weight], // 두께 스타일
        lineHeightClasses[lineHeight], // 줄 간격 스타일
        spacing && letterSpacingClasses[spacing], // 글자 간격 스타일 (있을 때만)
        className, // 추가 스타일
      )}
      {...props} // 다른 HTML 속성들 적용
    >
      {children} {/* 보여줄 내용 */}
    </Component>
  );
};

export default Typography;
