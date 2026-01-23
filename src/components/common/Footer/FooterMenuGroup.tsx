import Typography from '@/components/common/Typography';
import React from 'react';

interface FooterMenuGroupProps {
  title: string;
  menus: { label: string }[];
}

const FooterMenuGroup = ({ title, menus }: FooterMenuGroupProps) => {
  return (
    <nav aria-label={title}>
      <ul className="flex flex-col gap-space-12">
        {menus.map((menu) => (
          <li key={menu.label}>
            <Typography type="Body4Regular" className="text-gray-70" tag="p">
              {menu.label}
            </Typography>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FooterMenuGroup;
