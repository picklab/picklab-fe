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
// const lineHeightClasses = {
//   normal: 'leading-normal', // 보통 간격
//   relaxed: 'leading-relaxed', // 넓은 간격
// };

// 🔤 글자 사이의 간격을 정해요
// const letterSpacingClasses = {
//   tight: 'tracking-tight', // 좁은 간격
//   wide: 'tracking-wide', // 넓은 간격
// };

// 📏 텍스트의 크기를 정해요 (작게, 보통, 크게 등)
const sizeClasses = {
  '6xl': 'text-6xl', // 엄청 크게
  '5xl': 'text-5xl', // 매우 크게
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
};

export const TypographyTypes = {
  Display1Regular: clsx(sizeClasses['6xl'], weightClasses['normal']),
  Display1Medium: clsx(sizeClasses['6xl'], weightClasses['medium']),
  Display1Bold: clsx(sizeClasses['6xl'], weightClasses['bold']),

  Display2Regular: clsx(sizeClasses['5xl'], weightClasses['normal']),
  Display2Medium: clsx(sizeClasses['5xl'], weightClasses['medium']),
  Display2Bold: clsx(sizeClasses['5xl'], weightClasses['bold']),

  Title1Regular: clsx(sizeClasses['4xl'], weightClasses['normal']),
  Title1Medium: clsx(sizeClasses['4xl'], weightClasses['medium']),
  Title1Bold: clsx(sizeClasses['4xl'], weightClasses['bold']),

  Title2Regular: clsx(sizeClasses['3xl'], weightClasses['normal']),
  Title2Medium: clsx(sizeClasses['3xl'], weightClasses['medium']),
  Title2Bold: clsx(sizeClasses['3xl'], weightClasses['bold']),

  Title3Regular: clsx(sizeClasses['2xl'], weightClasses['normal']),
  Title3Medium: clsx(sizeClasses['2xl'], weightClasses['medium']),
  Title3Bold: clsx(sizeClasses['2xl'], weightClasses['bold']),

  Heading1Regular: clsx(sizeClasses['xl'], weightClasses['normal']),
  Heading1Medium: clsx(sizeClasses['xl'], weightClasses['medium']),
  Heading1Semibold: clsx(sizeClasses['xl'], weightClasses['semibold']),

  Heading2Regular: clsx(sizeClasses['lg'], weightClasses['normal']),
  Heading2Medium: clsx(sizeClasses['lg'], weightClasses['medium']),
  Heading2Semibold: clsx(sizeClasses['lg'], weightClasses['semibold']),

  Headline1Regular: clsx(sizeClasses['base'], weightClasses['normal']),
  Headline1Medium: clsx(sizeClasses['base'], weightClasses['medium']),
  Headline1Bold: clsx(sizeClasses['base'], weightClasses['bold']),

  Headline2Regular: clsx(sizeClasses['sm'], weightClasses['normal']),
  Headline2Medium: clsx(sizeClasses['sm'], weightClasses['medium']),
  Headline2Bold: clsx(sizeClasses['sm'], weightClasses['bold']),

  Body1Regular: clsx(sizeClasses['xs'], weightClasses['normal']),
  Body1Medium: clsx(sizeClasses['xs'], weightClasses['medium']),
  Body1Semibold: clsx(sizeClasses['xs'], weightClasses['semibold']),

  Body2Regular: clsx(sizeClasses['2xs'], weightClasses['normal']),
  Body2Medium: clsx(sizeClasses['2xs'], weightClasses['medium']),
  Body2Semibold: clsx(sizeClasses['2xs'], weightClasses['semibold']),

  Body3Regular: clsx(sizeClasses['3xs'], weightClasses['normal']),
  Body3Medium: clsx(sizeClasses['3xs'], weightClasses['medium']),
  Body3Semibold: clsx(sizeClasses['3xs'], weightClasses['semibold']),

  Body4Regular: clsx(sizeClasses['4xs'], weightClasses['normal']),
  Body4Medium: clsx(sizeClasses['4xs'], weightClasses['medium']),
  Body4Semibold: clsx(sizeClasses['4xs'], weightClasses['semibold']),

  Caption1Regular: clsx(sizeClasses['5xs'], weightClasses['normal']),
  Caption1Medium: clsx(sizeClasses['5xs'], weightClasses['medium']),
  Caption1Semibold: clsx(sizeClasses['5xs'], weightClasses['semibold']),

  Caption2Regular: clsx(sizeClasses['6xs'], weightClasses['normal']),
  Caption2Medium: clsx(sizeClasses['6xs'], weightClasses['medium']),
  Caption2Semibold: clsx(sizeClasses['6xs'], weightClasses['semibold']),
};

// // 🏷️ 이 컴포넌트가 사용할 수 있는 모든 종류의 태그예요
// type TypographyTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label';
// type TypographyType = keyof typeof TypographyTypes;

// // 🎁 이 컴포넌트가 받을 수 있는 모든 속성들을 정의해요
// export type TypographyProps = {
//   tag?: TypographyTag; // 어떤 태그로 보여줄지 (h1, p, span 등)
//   children: ReactNode; // 보여줄 내용
//   type: TypographyType;
//   className?: string; // 추가 스타일
// } & Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'className'>;

// 🏷️ 해당 컴포넌트가 사용할 수 있는 모든 종류의 태그의 타입
type TagMap = {
  label: React.LabelHTMLAttributes<HTMLLabelElement>;
  span: React.HTMLAttributes<HTMLSpanElement>;
  p: React.HTMLAttributes<HTMLParagraphElement>;
  h1: React.HTMLAttributes<HTMLHeadingElement>;
  h2: React.HTMLAttributes<HTMLHeadingElement>;
  h3: React.HTMLAttributes<HTMLHeadingElement>;
  h4: React.HTMLAttributes<HTMLHeadingElement>;
  h5: React.HTMLAttributes<HTMLHeadingElement>;
  h6: React.HTMLAttributes<HTMLHeadingElement>;
};

type TypographyTag = keyof TagMap;
type TypographyType = keyof typeof TypographyTypes;

export type TypographyProps<T extends TypographyTag = 'span'> = {
  tag?: T;
  type: TypographyType;
  className?: string;
  children: ReactNode;
} & Omit<TagMap[T], 'className' | 'children'>;

// 🎨 이제 실제로 텍스트를 보여주는 컴포넌트를 만들어요!
const Typography = <T extends TypographyTag = 'span'>({
  tag = 'span' as T, // 기본값은 span 태그
  children, // 보여줄 내용
  type,
  className = '', // 추가 스타일 (선택사항)
  ...props // 다른 HTML 속성들
}: TypographyProps<T>) => {
  // 선택한 태그를 컴포넌트로 변환해요
  const Component = tag as ElementType;

  // 🎨 모든 스타일을 합쳐서 하나의 클래스 이름으로 만들어요
  return (
    <Component
      className={clsx(
        TypographyTypes[type],
        className, // 추가 스타일
      )}
      {...props} // 다른 HTML 속성들 적용
    >
      {children} {/* 보여줄 내용 */}
    </Component>
  );
};

export default Typography;
