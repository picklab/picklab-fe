import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 리뷰 등록
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'POST /v1/review endpoint' });
}

