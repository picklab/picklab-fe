"use client";

import Typography from "@/components/common/Typography";
import Icon from "@/components/common/Icon/Icon";
import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SOCIAL_LOGIN_IMAGES = [
  {
    src: "/imgs/kakao_icon.svg",
    alt: "Kakao",
    provider: "KAKAO",
    text: "카카오톡으로 로그인",
    color: "text-gray-80",
    className: "bg-[#FFE812]",
  },
  {
    src: "/imgs/naver_icon.svg",
    alt: "Naver",
    provider: "NAVER",
    text: "네이버로 로그인",
    color: "text-gray-0",
    className: "bg-[#00C300]",
  },
  {
    src: "/imgs/google_icon.svg",
    alt: "Google",
    provider: "GOOGLE",
    text: "Google로 로그인",
    color: "text-gray-90",
    className: "border border-gray-40",
  },
  {
    src: "/imgs/github_icon.svg",
    alt: "Github",
    provider: "GITHUB",
    text: "Github로 로그인",
    color: "text-gray-90",
    className: "border border-gray-40",
  },
];

export default function AuthPage() {
  return (
    <div className="flex flex-col items-center gap-[72px]">
      <AuthHeader />
      <AuthContent />
      {/* 소셜 로그인 실패 시 오류 팝업 (PIC-61). 콜백이 /signin?error=... 로 리다이렉트 */}
      <Suspense fallback={null}>
        <LoginErrorModal />
      </Suspense>
    </div>
  );
}

// 소셜 로그인 실패 시 전체화면 오류 팝업 (figma 2810-34794). error 쿼리 파라미터가 있으면 노출.
function LoginErrorModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasError = searchParams.get("error") != null;

  if (!hasError) return null;

  // 닫으면 error 파라미터 제거 → 간편로그인 화면 복귀
  const handleClose = () => router.replace("/signin");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-error-title">
      {/* figma 2810-34794: 360x210 모달 카드 */}
      <div className="relative flex w-[360px] pt-[21px] pb-[28px] h-[210px] flex-col justify-center items-center gap-2 rounded-2xl bg-gray-0 px-8">
        <button
          type="button"
          onClick={handleClose}
          aria-label="닫기"
          className="absolute right-5 top-5 flex size-6 items-center justify-center">
          <Icon icon="xMark" size={24} className="text-gray-90" />
        </button>
        <Typography
          tag="h1"
          type="Heading1Semibold"
          id="login-error-title"
          className="text-gray-90">
          로그인 오류
        </Typography>
        <Typography
          tag="p"
          type="Body4Regular"
          className="whitespace-pre-line text-center text-gray-50">
          {"기존 방법으로 다시 시도해 보시거나\n새 계정을 만들어 주세요."}
        </Typography>
      </div>
    </div>
  );
}

function AuthHeader() {
  return (
    <div className="flex flex-col gap-4 items-center mobile:mt-[60px] pc:mt-[120px]">
      <Image
        src="/imgs/logo_mobile.png"
        alt="Auth Header"
        width={86}
        height={22}
      />
      <div className="flex flex-col gap-[10px] items-center">
        <Typography tag="h1" type="Title2Bold" id="auth-header-title">
          간편 로그인
        </Typography>
        <Typography
          tag="p"
          type="Body2Regular"
          id="auth-header-description"
          className="text-gray-50">
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
              "flex gap-[10px] items-center justify-center w-[335px] h-[56px] rounded-md",
              image.className,
            )}
            onClick={() => {
              window.location.href = `http://161.153.21.86:8080/v1/auth/login/${image.provider}`;
            }}>
            <Image src={image.src} alt={image.alt} width={24} height={24} />
            <Typography
              tag="p"
              type="Headline2Medium"
              id="auth-content-description"
              className={image.color}>
              {image.text}
            </Typography>
          </button>
        ))}
      </div>
      <Link
        href="/signup"
        className="underline underline-offset-4 decoration-[#A5ADBB]">
        <Typography
          tag="p"
          type="Body3Medium"
          id="auth-content-signup"
          className="text-gray-50">
          PICKLAB 회원가입
        </Typography>
      </Link>
    </div>
  );
}
