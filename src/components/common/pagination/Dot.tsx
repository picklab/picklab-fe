import clsx from 'clsx';
import React, { HTMLAttributes } from 'react';

//  DotProps는 기본 HTMLDivElement 속성 외에,
// 'active'라는 boolean 값을 추가로 받을 수 있습니다.
export interface DotProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
}

const Dot = ({ active, ...props }: DotProps) => {
  return (
    <div
      // - active가 true면 검정색 배경, 아니면 회색 배경
      className={clsx('size-space-8 cursor-pointer rounded-full', active ? 'bg-black' : 'bg-gray-20')}
      {...props}
    />
  );
};

export default Dot;
