import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

/** GET /v1/activity-participations/summary — 활동 결과 카운트(지원/합격/불합격/수료) */
export async function GET(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/activity-participations/summary',
    method: 'GET',
    errorContext: '활동 결과 카운트 조회 중 오류 발생',
  });
}
