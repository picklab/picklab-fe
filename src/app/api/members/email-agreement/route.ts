import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

export async function PATCH(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/members/email-agreement',
    method: 'PATCH',
    includeJsonBody: true,
    errorContext: '이메일 수신 동의 변경 중 오류 발생',
  });
}
