import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

export async function GET(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/notifications/recent',
    method: 'GET',
    passSearchParams: true,
    errorContext: '최근 알림 조회 중 오류 발생',
  });
}
