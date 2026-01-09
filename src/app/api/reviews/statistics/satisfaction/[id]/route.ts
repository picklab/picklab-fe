import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { activityId: string } }) {
  const activityId = params.activityId;
  // 활동별 만족도 평가 평균 점수 조회
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: `GET /v1/activities/${activityId}/reviews/statistics/satisfaction endpoint` });
}
