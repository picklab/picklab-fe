import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  // 모든 알림 읽음 처리
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'PATCH /notifications/read-all endpoint' });
}

