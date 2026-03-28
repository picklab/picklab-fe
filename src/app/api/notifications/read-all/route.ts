import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

export async function PATCH(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/notifications/read-all',
    method: 'PATCH',
    errorContext: '모든 알림 읽음 처리 중 오류 발생',
  });
}
