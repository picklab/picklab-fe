import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 자동완성 검색
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'GET /v1/search/autocomplete endpoint' });
}

