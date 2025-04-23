'use client';

import React from 'react';

import clsx from 'clsx';
import Dot, { DotProps } from '@/components/common/Pagination/Dot';

// DotPaginationProps
// - DotProps: 각 도트에 전달할 공통 속성 (예: onClick 등)
// - totalDots: 도트의 총 개수
// - activeDot: 현재 활성화된 도트 index (0부터 시작)
// - col: true일 경우 세로 방향 정렬 (기본은 가로 정렬)
interface DotPaginationProps extends Omit<DotProps, 'active'> {
  totalDots: number;
  activeDot: number;
  col?: boolean;
}

const DotPagination = ({ totalDots, activeDot, col, ...props }: DotPaginationProps) => {
  // 🎯 도트를 총 개수만큼 생성
  // - 각 도트의 index가 activeDot과 같으면 active 상태로 렌더링
  const generateDotPagination = Array.from({ length: totalDots }, (_, i) => {
    return <Dot key={i} active={i === activeDot} {...props} />;
  });

  return (
    <div
      // 📐 layout 설정
      // - 기본 가로 정렬, col이 true면 세로 정렬
      // - gap-space-8: 도트 사이 간격 8px
      className={clsx('flex flex-wrap justify-center gap-space-8', col && 'flex-col')}
    >
      {generateDotPagination}
    </div>
  );
};

export default DotPagination;
