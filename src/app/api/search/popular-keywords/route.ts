import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

export async function GET(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/search/popular-keywords',
    method: 'GET',
    optionalAuth: true,
    errorContext: '인기 검색어 조회 중 오류 발생',
  });
}
