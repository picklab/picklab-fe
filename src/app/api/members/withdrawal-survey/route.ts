import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

export async function POST(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/members/withdrawal-survey',
    method: 'POST',
    includeJsonBody: true,
    errorContext: '탈퇴 설문 제출 중 오류 발생',
  });
}
