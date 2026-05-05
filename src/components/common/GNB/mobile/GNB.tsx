"use client";
import Image from 'next/image';
import Link from 'next/link';
import Icon from '../../Icon/Icon';
import Avatar from '../pc/Avatar';
import Button from '../../Button/Button';

interface GNBProps {
  isLogin: boolean;
}

const GNB = ({ isLogin = false }: GNBProps) => {
  return (
    <header className="w-full max-w-[23.4375rem] h-[3.625rem] bg-gray-0 px-5 flex items-center justify-between ">
      <div className="flex items-center gap-3">
        <Link href="/" aria-label="PickLab 홈">
          <Image src="/imgs/logo_mobile.png" width={93} height={22} alt="PickLab 로고" />
        </Link>
      </div>

      {isLogin ? (
        <nav aria-label="유저 메뉴">
          <ul className="flex items-center gap-[0.625rem]">
            <li>
              <Link href="/calendar" aria-label="캘린더">
                <Icon size={24} icon="calendar" />
              </Link>
            </li>
            <li>
              <Link href="/notes" aria-label="메모">
                <Icon size={24} icon="pencil" />
              </Link>
            </li>
            <li>
              <Link href="/notifications" aria-label="알림">
                <Icon size={24} icon="cowBell" />
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
        <Link href="/signin" aria-label="로그인">
          <Button label="로그인" buttonStyle="outlined" size="sm" className="w-[3.125rem] h-[1.625rem] !px-2" />
        </Link>
      )}
    </header>
  );
};

export default GNB;
