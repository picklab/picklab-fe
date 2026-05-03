import Typography from "@/components/common/Typography";
import Link from "next/link";
import React from "react";

interface FooterMenuGroupProps {
  title: string;
  menus: { label: string; href?: string }[];
}

const FooterMenuGroup = ({ title, menus }: FooterMenuGroupProps) => {
  return (
    <nav aria-label={title}>
      <ul className="flex flex-col gap-space-16 m-0">
        {menus.map((menu) => (
          <li key={menu.label}>
            <Link href={menu.href || "/"}>
              <Typography
                type="Body4Regular"
                className="text-gray-50 px-space-10 cursor-pointer hover:text-gray-70"
                tag="p"
              >
                {menu.label}
              </Typography>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FooterMenuGroup;
