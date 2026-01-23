import Typography from '@/components/common/Typography';
import Link, { LinkProps } from 'next/link';
import React from 'react';

interface GNBMenuProps extends LinkProps {
  children: React.ReactNode;
}

const GNBMenu = ({ children, ...props }: GNBMenuProps) => {
  return (
    <Link {...props}>
      <Typography className="text-gray-90 hover:text-gray-50 active:text-gray-40 h-[22px]" type="Body2Semibold">
        {children}
      </Typography>
    </Link>
  );
};

export default GNBMenu;
