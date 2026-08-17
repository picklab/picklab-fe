"use client";

import Typography from "@/components/common/Typography";
import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";

// 간편회원가입 소셜 버튼 (간편로그인과 동일 OAuth, 텍스트만 "시작하기")
const SOCIAL_SIGNUP_BUTTONS = [
  {
    src: "/imgs/kakao_icon.svg",
    alt: "Kakao",
    provider: "KAKAO",
    text: "카카오톡으로 시작하기",
    color: "text-gray-80",
    className: "bg-[#FFE812]",
  },
  {
    src: "/imgs/naver_icon.svg",
    alt: "Naver",
    provider: "NAVER",
    text: "네이버로 시작하기",
    color: "text-gray-0",
    className: "bg-[#00C300]",
  },
  {
    src: "/imgs/google_icon.svg",
    alt: "Google",
    provider: "GOOGLE",
    text: "구글로 시작하기",
    color: "text-gray-90",
    className: "border border-gray-40",
  },
  {
    src: "/imgs/github_icon.svg",
    alt: "Github",
    provider: "GITHUB",
    text: "Github로 시작하기",
    color: "text-gray-90",
    className: "border border-gray-40",
  },
];

// 간편회원가입 화면 (PIC-100) — figma 195-37. 간편로그인 화면과 대칭.
export default function SignupPage() {
  return (
    <div className="flex flex-col items-center gap-[72px]">
      <SignupHeader />
      <SignupContent />
    </div>
  );
}

function SignupHeader() {
  return (
    <div className="flex flex-col gap-4 items-center mobile:mt-[60px] pc:mt-[120px]">
      <Image src="/imgs/logo_mobile.png" alt="PICKLAB" width={86} height={22} />
      <div className="flex flex-col gap-[10px] items-center">
        <Typography tag="h1" type="Title2Bold" id="signup-header-title">
          간편 회원가입
        </Typography>
        <Typography tag="p" type="Body2Regular" id="signup-header-description" className="text-gray-50">
          소셜 로그인으로 간편하게 로그인할 수 있습니다.
        </Typography>
      </div>
    </div>
  );
}

function SignupContent() {
  return (
    <div className="flex flex-col gap-12 items-center">
      <div className="flex flex-col gap-3">
        {SOCIAL_SIGNUP_BUTTONS.map((button) => (
          <button
            key={button.alt}
            className={clsx(
              "flex gap-[10px] items-center justify-center w-[335px] h-[56px] rounded-md",
              button.className,
            )}
            onClick={() => {
              window.location.href = `http://161.153.21.86:8080/v1/auth/login/${button.provider}`;
            }}
          >
            <Image src={button.src} alt={button.alt} width={24} height={24} />
            <Typography tag="p" type="Headline2Medium" className={button.color}>
              {button.text}
            </Typography>
          </button>
        ))}
      </div>
      <Link
        href="/signin"
        className="underline underline-offset-4 decoration-[#A5ADBB]"
      >
        <Typography tag="p" type="Body3Medium" id="signup-content-login" className="text-gray-50">
          PICKLAB 로그인
        </Typography>
      </Link>
    </div>
  );
}
