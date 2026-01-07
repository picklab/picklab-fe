import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  // 알림 설정 토글
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'PATCH /v1/members/notifications endpoint' });
}

