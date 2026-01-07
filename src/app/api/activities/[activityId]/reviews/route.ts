import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { activityId: string } }) {
  const activityId = params.activityId;
  // 특정 활동에 대한 리뷰 리스트 조회
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: `GET /v1/activities/${activityId}/reviews endpoint` });
}

