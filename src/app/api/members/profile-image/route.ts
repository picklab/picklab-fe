import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

export async function PUT(request: NextRequest) {
  return proxyWithAuth({
    request,
    endpoint: '/v1/members/profile-image',
    method: 'PUT',
    includeJsonBody: true,
    errorContext: '프로필 이미지 수정 중 오류 발생',
  });
}
