'use client';

// import { TabProps } from '@/components/common/Tab/Tab';
import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';
import React from 'react';

interface BoxTabProps extends LinkProps {
  label: string;
  notiNumber: string;
  href: string;
  id: string;
  active: boolean;
  panelId: string;
}

const BoxTab = ({ label, notiNumber, href, id, panelId, active, ...props }: BoxTabProps) => {
  const activeTypoType = active ? 'Title3Bold' : 'Title3Medium';

  return (
    <Link
      href={href}
      className={clsx(
        'box-tab flex flex-col justify-center items-center box-border w-60 h-[120px] p-[3px] pr-0 bg-gray-40',
        active && '!bg-black',
      )}
      role="tab"
      aria-selected={active}
      aria-controls={`panel-${panelId}`}
      tabIndex={active ? 0 : -1}
      id={id}
      {...props}
    >
      <span
        className={clsx(
          'flex flex-col justify-center items-center text-gray-50 bg-white w-full h-full',
          active && '!border-gray-90  !text-black',
        )}
      >
        <Typography type={activeTypoType}>{label}</Typography>
        <Typography type={activeTypoType}>{`+${notiNumber}`}</Typography>
      </span>
    </Link>
  );
};

export default BoxTab;
