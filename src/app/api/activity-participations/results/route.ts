import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

/** GET /v1/activity-participations/results — 활동 결과 목록(리뷰 작성 대상 조회) */
export async function GET(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/activity-participations/results',
    method: 'GET',
    passSearchParams: true,
    errorContext: '활동 결과 목록 조회 중 오류 발생',
  });
}
