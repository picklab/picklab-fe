import FooterMenuGroup from '@/components/common/Footer/FooterMenuGroup';
import Typography from '@/components/common/Typography';
import { FOOTER_MENUS } from '@/constants/menus';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
  const firstColMenus = FOOTER_MENUS.slice(0, 2);
  const secondColMenus = FOOTER_MENUS.slice(2, 4);
  const thirdColMenus = FOOTER_MENUS.slice(4, 5);

  return (
    <footer className="w-full flex flex-col items-center gap-[64px] max-w-[1440px] mx-auto px-[140px] py-space-40">
      <div className="flex items-start gap-[120px] w-full">
        <Link href="/" aria-label="홈으로 가기">
          <Image src="/imgs/footerLogo.png" width={166} height={40} alt="Picklab 로고" />
        </Link>

        <section className="flex gap-[240px]" aria-label="푸터 네비게이션">
          <div className="flex gap-[76px]">
            <FooterMenuGroup title="회사 소개 및 정보" menus={firstColMenus} />
            <FooterMenuGroup title="서비스 및 이용약관" menus={secondColMenus} />
            <FooterMenuGroup title="기타" menus={thirdColMenus} />
          </div>

          <address className="not-italic flex flex-col gap-space-6">
            <Typography type="Body3Medium" className="text-gray-60">
              Contact
            </Typography>
            <div className="flex flex-col gap-space-2">
              <div className="flex items-center">
                <Typography type="Caption2Regular" className="w-[71px] text-gray-50">
                  E-mail
                </Typography>
                <Typography type="Caption2Regular" className="text-gray-50">
                  pick.lab.studio@gmail.com
                </Typography>
              </div>
              <div className="flex items-center">
                <Typography type="Caption2Regular" className="w-[71px] text-gray-50">
                  Instagram
                </Typography>
                <Typography type="Caption2Regular" className="text-gray-50">
                  @picklab.official
                </Typography>
              </div>
            </div>
          </address>
        </section>
      </div>

      <Typography type="Caption2Regular" className="text-gray-40">
        Copyright © PICKLAB. All rights reserved
      </Typography>
    </footer>
  );
};

export default Footer;
