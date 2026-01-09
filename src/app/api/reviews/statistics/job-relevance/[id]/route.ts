import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { activityId: string } }) {
  const activityId = params.activityId;
  // 활동별 직무 연관성 점수 평균 조회
  // 비즈니스 로직 구현 예정
  return NextResponse.json({ message: `GET /v1/activities/${activityId}/reviews/statistics/job-relevance endpoint` });
}
