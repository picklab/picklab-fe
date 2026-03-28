import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../_lib/proxy';

export async function DELETE(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/members',
    method: 'DELETE',
    errorContext: '회원 탈퇴 처리 중 오류 발생',
  });
}
