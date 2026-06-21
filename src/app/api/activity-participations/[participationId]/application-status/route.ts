import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../../_lib/proxy';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ participationId: string }> | { participationId: string } },
) {
  const { participationId } = await Promise.resolve(params);
  return proxyWithAuth({
    request,
    endpoint: `/v1/activity-participations/${participationId}/application-status`,
    method: 'PATCH',
    includeJsonBody: true,
    errorContext: '합격 여부 변경 중 오류 발생',
  });
}
