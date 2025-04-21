import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import React, { HTMLAttributes } from 'react';

export interface TabProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  active: boolean; // 현재 활성화된 탭인지 여부
  id: string; // 탭의 고유 ID (tabpanel과 aria-controls로 연결됨)
  panelId: string; // 연결된 tabpanel의 ID
}

const Tab = ({ children, id, panelId, active, ...props }: TabProps) => {
  return (
    <div
      role="tab" // 접근성을 위한 역할 지정
      aria-selected={`${active}`} // 현재 탭이 선택되었는지 여부
      aria-controls={panelId} // 연결된 tabpanel ID
      tabIndex={active ? 0 : -1} // 포커스 관리
      id={id} // 고유 ID
      className={clsx(
        'box-border flex w-[246px] px-space-10 h-space-48 justify-center border-b-2 border-gray-30',
        active && '!border-gray-90 !border-b-4', // 활성화 시 스타일
      )}
      {...props}
    >
      <Typography type="Title3Medium">{children}</Typography>
    </div>
  );
};

export default Tab;
