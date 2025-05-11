import clsx from 'clsx';
import React from 'react';

const scaleClass = {
  base: 'size-space-24', // 기본값
  lg: 'size-14',
};

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 추가 클래스 */
  className?: string;
  /** 크기 프리셋 또는 커스텀 크기 */
  scale?: keyof typeof scaleClass;
}

const Avatar = ({ scale = 'base', className, ...props }: AvatarProps) => {
  return (
    <div
      role="img"
      aria-label="아바타"
      className={clsx(
        'rounded-full border border-gray-30 bg-center bg-no-repeat bg-cover',
        scaleClass[scale],
        className,
      )}
      style={{ backgroundImage: 'url("/imgs/avatar.jpg")' }}
      {...props}
    />
  );
};

export default Avatar;
