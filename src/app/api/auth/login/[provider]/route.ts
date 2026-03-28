/** @format */

import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> | { provider: string } }
) {
  const resolvedParams = await Promise.resolve(context.params); // params를 await으로 해결
  const provider = resolvedParams.provider.toLowerCase();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const redirectUri = encodeURIComponent(`${baseUrl}/auth/callback`);

  let authorizeUrl = "";

  switch (provider) {
    case "kakao":
      const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID; // 반드시 설정 필요
      if (!kakaoClientId) {
        return NextResponse.redirect(new URL("/auth/signin?error=kakao_client_id_missing", request.url));
      }
      authorizeUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakaoClientId}&redirect_uri=${redirectUri}`;
      break;
    case "naver":
      const naverClientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID; // 반드시 설정 필요
      if (!naverClientId) {
        return NextResponse.redirect(new URL("/auth/signin?error=naver_client_id_missing", request.url));
      }

      const state = Math.random().toString(36).substring(2, 15); // 간단한 예시, 실제 구현에서는 세션에 저장해야 함
      authorizeUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverClientId}&redirect_uri=${redirectUri}&state=${state}`;
      break;

    case "google":
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID; // 반드시 설정 필요
      if (!googleClientId) {
        return NextResponse.redirect(new URL("/auth/signin?error=google_client_id_missing", request.url));
      }

      const googleScope = encodeURIComponent("email profile"); // 필요한 스코프 추가
      authorizeUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=${googleScope}&access_type=offline&prompt=consent`;
      break;
    case "github":
      const githubClientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID; // 반드시 설정 필요
      if (!githubClientId) {
        return NextResponse.redirect(new URL("/auth/signin?error=github_client_id_missing", request.url));
      }
      authorizeUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=user`; // 필요한 스코프 추가
      break;
    default:
      return NextResponse.redirect(new URL("/auth/signin?error=unsupported_provider", request.url));
  }

  return NextResponse.redirect(authorizeUrl);
}
