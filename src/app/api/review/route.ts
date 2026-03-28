import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../_lib/proxy';

export async function POST(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/review',
    method: 'POST',
    includeJsonBody: true,
    errorContext: '리뷰 등록 중 오류 발생',
  });
}
