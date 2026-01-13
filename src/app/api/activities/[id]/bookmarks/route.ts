import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { activityId: string } }) {
  const activityId = params.activityId;
  // 활동 북마크 생성
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: `POST /v1/activities/${activityId}/bookmarks endpoint` });
}

export async function DELETE(request: NextRequest, { params }: { params: { activityId: string } }) {
  const activityId = params.activityId;
  // 활동 북마크 해제
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: `DELETE /v1/activities/${activityId}/bookmarks endpoint` });
}

