import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 이메일 인증 코드 전송
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'POST /v1/members/email/code/send endpoint' });
}

