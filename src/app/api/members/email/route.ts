import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 이메일 주소를 변경
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'POST /v1/members/email endpoint' });
}

