import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // SSE 알림 구독
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'GET /notifications/subscribe endpoint' });
}

