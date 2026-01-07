import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { activityId: string } }) {
  const activityId = params.activityId;
  // 활동 페이지 상세 조회
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: `GET /v1/activities/${activityId} endpoint` });
}

