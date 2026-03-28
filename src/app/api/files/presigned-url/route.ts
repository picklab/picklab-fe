import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

export async function POST(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/files/presigned-url',
    method: 'POST',
    includeJsonBody: true,
    errorContext: 'Presigned URL 발급 중 오류 발생',
  });
}
