import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../../_lib/proxy';

// POST: 활동 지원 완료 표시 / DELETE: 지원 완료 표시 취소 (activityId만으로 토글)
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  return proxyWithAuth({
    request,
    endpoint: `/v1/activities/${id}/participations`,
    method: 'POST',
    errorContext: `활동 지원 완료 표시(${id}) 중 오류 발생`,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const { id } = await Promise.resolve(params);
  return proxyWithAuth({
    request,
    endpoint: `/v1/activities/${id}/participations`,
    method: 'DELETE',
    errorContext: `활동 지원 완료 표시 취소(${id}) 중 오류 발생`,
  });
}
