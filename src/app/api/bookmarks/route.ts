import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 북마크 목록 조회
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'GET /v1/bookmarks endpoint' });
}

