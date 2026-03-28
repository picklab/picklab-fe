import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../_lib/proxy';

export async function GET(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/search',
    method: 'GET',
    passSearchParams: true,
    optionalAuth: true,
    errorContext: '통합 검색 중 오류 발생',
  });
}
