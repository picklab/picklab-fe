import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 알림 전송
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'POST /notifications/send endpoint' });
}

