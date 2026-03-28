import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

export async function PUT(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/members/info',
    method: 'PUT',
    includeJsonBody: true,
    errorContext: '사용자 정보 수정 중 오류 발생',
  });
}
