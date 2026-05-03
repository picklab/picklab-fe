import FooterMenuGroup from "@/components/common/Footer/FooterMenuGroup";
import Typography from "@/components/common/Typography";
import { FOOTER_MENUS } from "@/constants/menus";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = ({ className }: { className: string }) => {
  const firstColMenus = FOOTER_MENUS.slice(0, 2);
  const secondColMenus = FOOTER_MENUS.slice(2, 4);
  const thirdColMenus = FOOTER_MENUS.slice(4, 5);

  return (
    <footer
      className={clsx(
        "w-full bg-gray-5 max-w-[1440px] mx-auto pt-[53px] pb-[53px] flex flex-col items-center gap-[64px]",
        className,
      )}
    >
      <div className="w-[1040px] flex justify-between items-start">
        {/* Logo + Navigation */}
        <div className="flex gap-[70px]">
          <Link href="/" aria-label="홈으로 가기">
            <Image
              src="/imgs/footer_Logo.png"
              width={90}
              height={40}
              alt="Picklab 로고"
            />
          </Link>

          {/* Navigation Groups */}
          <nav className="flex gap-[76px]">
            <FooterMenuGroup title="회사 소개 및 정보" menus={firstColMenus} />
            <FooterMenuGroup
              title="서비스 및 이용약관"
              menus={secondColMenus}
            />
            <FooterMenuGroup title="기타" menus={thirdColMenus} />
          </nav>
        </div>

        {/* Contact Info */}
        <address className="not-italic flex flex-col gap-space-6">
          <Typography type="Body3Medium" className="text-gray-60">
            Contact
          </Typography>
          <div className="flex flex-col gap-space-2">
            <div className="flex items-center">
              <Typography
                type="Caption2Regular"
                className="w-[71px] text-gray-50"
              >
                E-mail
              </Typography>
              <Typography type="Caption2Regular" className="text-gray-50">
                pick.lab.studio@gmail.com
              </Typography>
            </div>
            <div className="flex items-center">
              <Typography
                type="Caption2Regular"
                className="w-[71px] text-gray-50"
              >
                Instagram
              </Typography>
              <Typography type="Caption2Regular" className="text-gray-50">
                @picklab.official
              </Typography>
            </div>
          </div>
        </address>
      </div>

      {/* Copyright */}
      <Typography type="Caption2Regular" className="text-gray-40">
        Copyright © PICKLAB. All rights reserved
      </Typography>
    </footer>
  );
};

export default Footer;
