import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 아카이브 정보 생성
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'POST /v1/archive endpoint' });
}

