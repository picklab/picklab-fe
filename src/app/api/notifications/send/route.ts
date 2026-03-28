import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

export async function POST(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/notifications/send',
    method: 'POST',
    includeJsonBody: true,
    errorContext: '알림 전송 중 오류 발생',
  });
}
