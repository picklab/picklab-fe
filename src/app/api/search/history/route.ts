import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 검색 기록 조회
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'GET /v1/search/history endpoint' });
}

export async function POST(request: Request) {
  // 검색 기록 생성
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'POST /v1/search/history endpoint' });
}

export async function DELETE(request: Request) {
  // 전체 검색 기록 삭제
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'DELETE /v1/search/history (Delete All) endpoint' });
}
