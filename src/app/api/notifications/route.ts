import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../_lib/proxy';

export async function GET(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/notifications',
    method: 'GET',
    passSearchParams: true,
    errorContext: '알림 목록 조회 중 오류 발생',
  });
}

export async function DELETE(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/notifications',
    method: 'DELETE',
    errorContext: '모든 알림 삭제 중 오류 발생',
  });
}
