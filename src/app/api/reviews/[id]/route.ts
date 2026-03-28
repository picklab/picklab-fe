import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  return proxyWithAuth({
    request,
    endpoint: `/v1/reviews/${id}`,
    method: 'GET',
    errorContext: `리뷰 상세 조회(${id}) 중 오류 발생`,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const { id } = await Promise.resolve(params);
  return proxyWithAuth({
    request,
    endpoint: `/v1/reviews/${id}`,
    method: 'PUT',
    includeJsonBody: true,
    errorContext: `리뷰 수정(${id}) 중 오류 발생`,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const { id } = await Promise.resolve(params);
  return proxyWithAuth({
    request,
    endpoint: `/v1/reviews/${id}`,
    method: 'DELETE',
    errorContext: `리뷰 삭제(${id}) 중 오류 발생`,
  });
}
