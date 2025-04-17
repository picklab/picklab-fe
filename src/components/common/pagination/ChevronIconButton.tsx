import Icon from '@/components/common/Icon/Icon';
import React, { ButtonHTMLAttributes } from 'react';

interface ChevronIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // 방향을 나타내는 prop: 'left' 또는 'right' 중 하나
  direction: 'left' | 'right';
}

const ChevronIconButton = ({ direction, ...props }: ChevronIconButtonProps) => {
  // 아이콘의 공통 클래스 설정
  // group-hover, group-active, group-disabled를 사용하여 버튼의 상태에 따라 색상이 변함
  const iconClassName = 'text-black group-hover:text-gray-60 group-active:text-gray-60 group-disabled:text-gray-30';

  return (
    <button
      // 그룹 클래스를 사용해 내부 아이콘에도 hover/active/disabled 상태를 전파
      // hover 시 밝은 회색 배경, active 시 좀 더 진한 회색 배경
      // disabled 상태일 경우 포인터 이벤트를 막아 클릭 차단
      className="group size-space-32 border border-gray-20 rounded p-[3px] hover:bg-gray-5 active:bg-gray-10 disabled:pointer-events-none"
      {...props}
    >
      {/* 아이콘을 버튼 가운데 정렬하기 위한 flex 컨테이너 */}
      <div className="flex justify-center items-center w-full h-full">
        {/* 방향이 left일 경우 왼쪽 아이콘 렌더링 */}
        {direction === 'left' && <Icon icon="chevronLeft" width={10} className={iconClassName} />}

        {/* 방향이 right일 경우 오른쪽 아이콘 렌더링 */}
        {direction === 'right' && <Icon icon="chevronRight" width={10} className={iconClassName} />}
      </div>
    </button>
  );
};

export default ChevronIconButton;
