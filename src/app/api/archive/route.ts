import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../_lib/proxy';

export async function POST(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/archive',
    method: 'POST',
    includeJsonBody: true,
    errorContext: '아카이브 생성 중 오류 발생',
  });
}
