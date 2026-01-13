import { NextResponse, NextRequest } from 'next/server';

export async function PATCH(request: NextRequest, { params }: { params: { notificationId: string } }) {
  const notificationId = params.notificationId;
  // 알림 읽음 처리
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: `PATCH /notifications/${notificationId}/read endpoint` });
}

