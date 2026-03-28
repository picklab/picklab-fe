import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

export async function GET(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/members/social-logins',
    method: 'GET',
    errorContext: '소셜 로그인 정보 조회 중 오류 발생',
  });
}
