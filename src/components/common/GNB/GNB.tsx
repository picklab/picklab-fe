'use client';
import Button from '@/components/common/Button/Button';
import Search from '@/components/common/Field/Search';
import Avatar from '@/components/common/GNB/Avatar';
import GNBMenu from '@/components/common/GNB/GNBMenu';
import Icon from '@/components/common/Icon/Icon';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

interface GNBProps {
  isLogin: boolean;
}

const GNB = ({ isLogin = false }: GNBProps) => {
  const options = [
    { value: 'label1', label: '아주대학교' },
    { value: 'label2', label: '아주아주대학교' },
    { value: 'label3', label: '아주초등학교' },
    { value: 'label4', label: '아주중학교' },
  ];
  const [selected, setSelected] = useState(options[0].value);

  return (
    <header className="w-full border">
      <div className="max-w-[1440px] h-[58px] mx-auto flex items-center justify-between px-[170px] py-3 gap-[46px]">
        {/* 로고 및 메뉴 */}
        <div className="flex items-center gap-[54px]">
          <Link href="/" aria-label="PickLab 홈">
            <Image src="/imgs/logo.png" width={93} height={22} alt="PickLab 로고" />
          </Link>
          <nav aria-label="메인 메뉴">
            <ul className="flex gap-9">
              <li>
                <GNBMenu href="/activity">대외활동</GNBMenu>
              </li>
              <li>
                <GNBMenu href="/seminar">강연/세미나</GNBMenu>
              </li>
              <li>
                <GNBMenu href="/education">교육</GNBMenu>
              </li>
              <li>
                <GNBMenu href="/contest">공모전/해커톤</GNBMenu>
              </li>
            </ul>
          </nav>
        </div>

        {/* 검색 및 아이콘 */}
        <div className="flex items-center gap-6">
          <Search
            status="default"
            optionGroupProps={{
              selectedValue: selected,
              onClickHandler: setSelected,
              options: options,
              className: 'w-[368px]',
            }}
            rounded
            scale="sm"
            className="w-[368px]"
          />
        </div>
        {isLogin ? (
          <nav aria-label="유저 메뉴">
            <ul className="flex items-center gap-5">
              <li>
                <Link href="/notes" aria-label="메모">
                  <Icon size={24} icon="largeNote" />
                </Link>
              </li>
              <li>
                <Link href="/notifications" aria-label="알림">
                  <Icon size={24} icon="largeCowBell" />
                </Link>
              </li>
              <li>
                <Link href="/profile" aria-label="프로필">
                  <Avatar />
                </Link>
              </li>
            </ul>
          </nav>
        ) : (
          <div className="flex gap-space-10">
            <Button label="로그인" buttonStyle="outlined" size="sm" />
            <Button label="회원가입" buttonStyle="filled" size="sm" />
          </div>
        )}
      </div>
    </header>
  );
};

export default GNB;
