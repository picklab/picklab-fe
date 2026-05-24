import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../_lib/proxy';

export async function GET(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/archive',
    method: 'GET',
    passSearchParams: true,
    errorContext: '아카이브 목록 조회 중 오류 발생',
  });
}

export async function POST(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/archive',
    method: 'POST',
    includeJsonBody: true,
    errorContext: '아카이브 생성 중 오류 발생',
  });
}
