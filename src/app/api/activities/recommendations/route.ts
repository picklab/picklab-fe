import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 직무 추천 활동 조회
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'GET /v1/activities/recommendations endpoint' });
}

