import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../_lib/proxy';

/** DELETE /notifications/{notificationId} — 개별 알림 삭제 처리 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  return proxyWithAuth({
    request,
    endpoint: `/notifications/${id}`,
    method: 'DELETE',
    errorContext: `알림 삭제 처리(${id}) 중 오류 발생`,
  });
}
