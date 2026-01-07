import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 최근 검색어 조회
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'GET /v1/search/recent-keywords endpoint' });
}

