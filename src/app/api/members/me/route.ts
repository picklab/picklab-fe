import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

export async function GET(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/members/me',
    method: 'GET',
    errorContext: '내 정보 조회 중 오류 발생',
  });
}
