import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../../_lib/proxy';

export async function POST(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/members/signup/additional-info',
    method: 'POST',
    includeJsonBody: true,
    errorContext: '추가 정보 기입 중 오류 발생',
  });
}
