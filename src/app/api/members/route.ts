import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  // 회원 탈퇴
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'DELETE /v1/members endpoint' });
}

