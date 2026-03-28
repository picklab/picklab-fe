import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../_lib/proxy';

export async function GET(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/activities',
    method: 'GET',
    passSearchParams: true,
    optionalAuth: true,
    errorContext: '활동 목록 조회 중 오류 발생',
  });
}
