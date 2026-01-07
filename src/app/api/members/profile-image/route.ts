import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  // 사용자 프로필 이미지 수정
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: 'PUT /v1/members/profile-image endpoint' });
}
