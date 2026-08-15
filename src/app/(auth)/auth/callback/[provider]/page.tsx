/** @format */

"use client";

import { useAuthClient } from "@/contexts/AuthContext";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams(); // useParams 훅 사용
  const { clientLogin } = useAuthClient();

  useEffect(() => {
    const code = searchParams.get("code");
    const provider = params.provider; // URL에서 provider 추출

    if (code && provider) {
      // 1. Next.js API Route로 'code' 교환 요청을 보냅니다. (클라이언트 -> BFF)
      fetch("/api/auth/exchange-code", {
        method: "POST", // code 교환은 POST 요청으로 하는 것이 일반적
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, provider }), // provider도 함께 보냅니다.
      })
        .then(async (response) => {
          if (response.ok) {
            console.log("Code exchanged and tokens set successfully.");
            clientLogin();
            // PIC-74: 신규 유저(온보딩 미완료 = 닉네임 없음)면 회원가입 폼으로, 기존 유저면 홈으로
            try {
              const meRes = await fetch("/api/members/me", { credentials: "include" });
              const meJson = await meRes.json().catch(() => null);
              const nickname = meJson?.data?.nickname;
              const needsOnboarding =
                meRes.ok && (typeof nickname !== "string" || nickname.trim() === "");
              router.push(needsOnboarding ? "/signup/details" : "/");
            } catch {
              router.push("/"); // me 조회 실패 시 홈으로 폴백
            }
          } else {
            console.error("Failed to exchange code for tokens.");
            router.push("/signin?error=token_exchange_failed");
          }
        })
        .catch((error) => {
          console.error("Error during code exchange:", error);
          router.push("/signin?error=network_error");
        });
    } else {
      // 코드가 없는 경우 에러 페이지로 리다이렉트
      router.push("/signin?error=no_code_received");
    }
  }, [router, searchParams, params]); // 의존성 배열에 params 추가

  return (
    <div>
      <p>인증 처리 중...</p>
      <p>잠시만 기다려 주세요.</p>
    </div>
  );
}
