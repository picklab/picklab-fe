import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../../../_lib/proxy';

export async function POST(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/members/email/code/send',
    method: 'POST',
    includeJsonBody: true,
    errorContext: '이메일 인증 코드 전송 중 오류 발생',
  });
}
