import clsx from 'clsx';
import Image from 'next/image';
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
    <div className={clsx('relative rounded-full border border-gray-30 ', scaleClass[scale], className)} {...props}>
      <Image src={'/imgs/avatar.jpg'} alt="아바타" fill className="absolute rounded-full" />
    </div>
  );
};

export default Avatar;
