import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  // 이메일 수신 동의 여부 수정
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'PATCH /v1/members/email-agreement endpoint' });
}

