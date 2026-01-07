import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 최근 n일 내 알림 조회
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'GET /notifications/recent endpoint' });
}

