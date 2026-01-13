import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { activityId: string } }) {
  const activityId = params.activityId;
  // 활동 조회 기록
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: `POST /v1/activities/${activityId}/view endpoint` });
}

