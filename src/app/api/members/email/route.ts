import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

export async function POST(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/members/email',
    method: 'POST',
    includeJsonBody: true,
    errorContext: '이메일 변경 중 오류 발생',
  });
}
