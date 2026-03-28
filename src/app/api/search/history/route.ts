import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

export async function GET(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/search/history',
    method: 'GET',
    passSearchParams: true,
    errorContext: '검색 기록 조회 중 오류 발생',
  });
}

export async function POST(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/search/history',
    method: 'POST',
    includeJsonBody: true,
    errorContext: '검색 기록 생성 중 오류 발생',
  });
}

export async function DELETE(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/search/history',
    method: 'DELETE',
    errorContext: '전체 검색 기록 삭제 중 오류 발생',
  });
}
