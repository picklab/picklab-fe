import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../../_lib/proxy';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  return proxyWithAuth({
    request,
    endpoint: `/notifications/${id}/read`,
    method: 'PATCH',
    errorContext: `알림 읽음 처리(${id}) 중 오류 발생`,
  });
}
