import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

export async function GET(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/activities/recently-viewed',
    method: 'GET',
    passSearchParams: true,
    optionalAuth: true,
    errorContext: '최근 본 활동 조회 중 오류 발생',
  });
}
