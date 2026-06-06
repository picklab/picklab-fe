import { NextRequest } from 'next/server';
import { proxyWithAuth } from '../../../_lib/proxy';

/** PATCH /v1/activity-participations/{participationId}/progress-status — 수료 여부 변경 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ participationId: string }> | { participationId: string } }
) {
  const { participationId } = await Promise.resolve(params);
  return proxyWithAuth({
    request,
    endpoint: `/v1/activity-participations/${participationId}/progress-status`,
    method: 'PATCH',
    includeJsonBody: true,
    errorContext: `수료 여부 변경(${participationId}) 중 오류 발생`,
  });
}
