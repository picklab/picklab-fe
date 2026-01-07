import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 소셜 로그인 정보 조회
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'GET /v1/members/social-logins endpoint' });
}

