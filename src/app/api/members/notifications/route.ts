import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

export async function PATCH(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/members/notifications',
    method: 'PATCH',
    includeJsonBody: true,
    errorContext: '알림 설정 변경 중 오류 발생',
  });
}
