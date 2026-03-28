'use client';

import Typography from '@/components/common/Typography';
import { clsx } from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

const SOCIAL_LOGIN_IMAGES = [
  {
    src: '/imgs/kakao_icon.svg',
    alt: 'Kakao',
    text: '카카오톡으로 로그인',
    color: 'text-gray-80',
    className: 'bg-[#FFE812]',
  },
  {
    src: '/imgs/naver_icon.svg',
    alt: 'Naver',
    text: '네이버로 로그인',
    color: 'text-gray-0',
    className: 'bg-[#00C300]',
  },
  {
    src: '/imgs/google_icon.svg',
    alt: 'Google',
    text: 'Google로 로그인',
    color: 'text-gray-90',
    className: 'border border-gray-40',
  },
  {
    src: '/imgs/github_icon.svg',
    alt: 'Github',
    text: 'Github로 로그인',
    color: 'text-gray-90',
    className: 'border border-gray-40',
  },
];

export default function AuthPage() {
  return (
    <div className="flex flex-col items-center gap-[72px]">
      <AuthHeader />
      <AuthContent />
    </div>
  );
}

function AuthHeader() {
  return (
    <div className="flex flex-col gap-4 items-center mt-[120px]">
      <Image src="/imgs/logo_mobile.png" alt="Auth Header" width={86} height={22} />
      <div className="flex flex-col gap-[10px] items-center">
        <Typography tag="h1" type="Title2Bold" id="auth-header-title">
          간편 로그인
        </Typography>
        <Typography tag="p" type="Body2Regular" id="auth-header-description" className="text-gray-50">
          소셜 로그인으로 간편하게 로그인할 수 있습니다.
        </Typography>
      </div>
    </div>
  );
}

function AuthContent() {
  return (
    <div className="flex flex-col gap-12 items-center">
      <div className="flex flex-col gap-3">
        {SOCIAL_LOGIN_IMAGES.map((image) => (
          <button
            key={image.alt}
            className={clsx(
              'flex gap-[10px] items-center justify-center w-[335px] h-[56px] rounded-md',
              image.className,
            )}
            onClick={() => {
              window.location.href = `/api/auth/login/${image.alt.toUpperCase()}`;
            }}
          >
            <Image src={image.src} alt={image.alt} width={24} height={24} />
            <Typography tag="p" type="Headline2Medium" id="auth-content-description" className={image.color}>
              {image.text}
            </Typography>
          </button>
        ))}
      </div>
      <Link href="/auth/signup" className="underline underline-offset-4 decoration-[#A5ADBB]">
        <Typography tag="p" type="Body3Medium" id="auth-content-signup" className="text-gray-50">
          PICKLAB 회원가입
        </Typography>
      </Link>
    </div>
  );
}
