import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../../_lib/proxy';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  return proxyWithAuth({
    request,
    endpoint: `/v1/archive/${id}/status`,
    method: 'PATCH',
    includeJsonBody: true,
    errorContext: `아카이브 상태 수정(${id}) 중 오류 발생`,
  });
}
