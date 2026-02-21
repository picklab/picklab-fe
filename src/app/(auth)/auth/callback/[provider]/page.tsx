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
        .then((response) => {
          if (response.ok) {
            console.log("Code exchanged and tokens set successfully.");
            clientLogin();
            router.push("/"); // 성공하면 메인 페이지로 이동
          } else {
            console.error("Failed to exchange code for tokens.");
            router.push("/auth/signin?error=token_exchange_failed");
          }
        })
        .catch((error) => {
          console.error("Error during code exchange:", error);
          router.push("/auth/signin?error=network_error");
        });
    } else {
      // 코드가 없는 경우 에러 페이지로 리다이렉트
      router.push("/auth/signin?error=no_code_received");
    }
  }, [router, searchParams, params]); // 의존성 배열에 params 추가

  return (
    <div>
      <p>인증 처리 중...</p>
      <p>잠시만 기다려 주세요.</p>
    </div>
  );
}
