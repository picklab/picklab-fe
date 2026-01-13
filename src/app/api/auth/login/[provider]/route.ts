import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { provider: string } }) {
  const provider = params.provider;
  // 소셜 로그인 요청
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: `GET /v1/auth/login/${provider} endpoint` });
}

