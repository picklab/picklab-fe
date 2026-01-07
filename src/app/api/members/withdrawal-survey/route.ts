import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 회원 탈퇴 설문 제출
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'POST /v1/members/withdrawal-survey endpoint' });
}
