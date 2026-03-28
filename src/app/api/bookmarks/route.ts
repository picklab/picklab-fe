import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../_lib/proxy';

export async function GET(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/bookmarks',
    method: 'GET',
    passSearchParams: true,
    errorContext: '북마크 목록 조회 중 오류 발생',
  });
}
