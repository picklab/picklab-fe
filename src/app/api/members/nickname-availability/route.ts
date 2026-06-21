import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

export async function GET(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/members/nickname-availability',
    method: 'GET',
    passSearchParams: true,
    optionalAuth: true,
    errorContext: '닉네임 중복 확인 중 오류 발생',
  });
}
