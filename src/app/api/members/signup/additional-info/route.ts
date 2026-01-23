import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 회원 추가 정보 기입
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'POST /v1/members/signup/additional-info endpoint' });
}

