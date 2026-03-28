import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

export async function GET(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/search/autocomplete',
    method: 'GET',
    passSearchParams: true,
    optionalAuth: true,
    errorContext: '자동완성 검색 중 오류 발생',
  });
}
