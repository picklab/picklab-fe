import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../_lib/proxy';

export async function GET(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/reviews',
    method: 'GET',
    passSearchParams: true,
    errorContext: '내 리뷰 목록 조회 중 오류 발생',
  });
}
