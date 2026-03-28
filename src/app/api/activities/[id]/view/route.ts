import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../../_lib/proxy';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  return proxyWithAuth({
    request,
    endpoint: `/v1/activities/${id}/view`,
    method: 'POST',
    optionalAuth: true,
    errorContext: `활동 조회 기록(${id}) 중 오류 발생`,
  });
}
