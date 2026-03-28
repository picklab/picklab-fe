import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../../_lib/proxy';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  return proxyWithAuth({
    request,
    endpoint: `/v1/activities/${id}/reviews`,
    method: 'GET',
    passSearchParams: true,
    optionalAuth: true,
    errorContext: `활동 리뷰 목록 조회(${id}) 중 오류 발생`,
  });
}
