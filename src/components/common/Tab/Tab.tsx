'use client';

import Link, { LinkProps } from 'next/link';
import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import React from 'react';

// LinkProps + a 태그의 기본 속성을 조합한 타입
export interface TabProps extends LinkProps {
  children: React.ReactNode;
  active: boolean;
  id: string;
  panelId: string;
}

const Tab = ({ children, href, active, id, panelId, ...props }: TabProps) => {
  return (
    <Link
      href={href}
      role="tab"
      aria-selected={active}
      aria-controls={`panel-${panelId}`}
      tabIndex={active ? 0 : -1}
      id={id}
      className={clsx(
        'box-border flex w-[246px] px-space-10 h-space-48 justify-center border-b-2 border-gray-30',
        active && '!border-gray-90 !border-b-4',
      )}
      {...props}
    >
      <Typography type="Title3Medium">{children}</Typography>
    </Link>
  );
};

export default Tab;
