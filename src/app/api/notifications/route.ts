import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 내 알림 목록 조회
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'GET /notifications endpoint' });
}

export async function DELETE(request: Request) {
  // 사용자의 모든 알림 삭제 처리
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'DELETE /notifications endpoint' });
}

