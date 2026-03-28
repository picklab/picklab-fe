import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

export async function PUT(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/members/job-categories',
    method: 'PUT',
    includeJsonBody: true,
    errorContext: '관심직무 수정 중 오류 발생',
  });
}
