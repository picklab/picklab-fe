import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../../_lib/proxy';

/** POST /v1/reviews/{id}/helpful — 도움이 돼요 등록 (body 없음) */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const { id } = await Promise.resolve(params);
  return proxyWithAuth({
    request,
    endpoint: `/v1/reviews/${id}/helpful`,
    method: 'POST',
    errorContext: `리뷰 도움이 돼요 등록(${id}) 중 오류 발생`,
  });
}

/** DELETE /v1/reviews/{id}/helpful — 도움이 돼요 취소 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const { id } = await Promise.resolve(params);
  return proxyWithAuth({
    request,
    endpoint: `/v1/reviews/${id}/helpful`,
    method: 'DELETE',
    errorContext: `리뷰 도움이 돼요 취소(${id}) 중 오류 발생`,
  });
}
