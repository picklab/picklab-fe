import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../../_lib/proxy';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  return proxyWithAuth({
    request,
    endpoint: `/v1/activities/${id}/bookmarks`,
    method: 'POST',
    errorContext: `활동 북마크 생성(${id}) 중 오류 발생`,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const { id } = await Promise.resolve(params);
  return proxyWithAuth({
    request,
    endpoint: `/v1/activities/${id}/bookmarks`,
    method: 'DELETE',
    errorContext: `활동 북마크 해제(${id}) 중 오류 발생`,
  });
}
