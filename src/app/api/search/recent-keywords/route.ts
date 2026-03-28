import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

export async function GET(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/search/history/recent-keywords',
    method: 'GET',
    passSearchParams: true,
    errorContext: '최근 검색어 조회 중 오류 발생',
  });
}
