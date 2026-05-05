import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../_lib/proxy';

export async function GET(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/activity-groups',
    method: 'GET',
    optionalAuth: true,
    errorContext: '활동 그룹 목록 조회 중 오류 발생',
  });
}

export async function POST(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/activity-groups',
    method: 'POST',
    includeJsonBody: true,
    errorContext: '활동 그룹 생성 중 오류 발생',
  });
}
